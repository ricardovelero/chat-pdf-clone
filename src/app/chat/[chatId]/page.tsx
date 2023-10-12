import ChatSideBar from "@/components/chat-sidebar"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
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

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={true} />
        </div>
        {/* pdf viewer */}
        <div>{/* <PDFViewer /> */}</div>
        {/* chat component */}
        <div>{/* <ChaComponent /> */}</div>
      </div>
    </div>
  )
}
