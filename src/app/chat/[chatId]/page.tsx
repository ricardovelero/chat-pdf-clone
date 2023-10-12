import ChatSideBar from "@/components/chat-sidebar"
import PDFViewer from "@/components/pdf-viewer"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { checkSubscription } from "@/lib/subscription"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import React from "react"

type ChatPageProps = {
  params: {
    chatId: string
  }
}

export default async function ChatPage({ params: { chatId } }: ChatPageProps) {
  const { userId } = auth()
  if (!userId) {
    return redirect("/sign-in")
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
  if (!_chats) {
    return redirect("/")
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/")
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId))
  const isPro = await checkSubscription()

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
        </div>
        {/* pdf viewer */}
        <div>
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div>{/* <ChaComponent /> */}</div>
      </div>
    </div>
  )
}
