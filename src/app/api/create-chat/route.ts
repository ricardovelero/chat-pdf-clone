import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { loadS3IntoPinecone } from "@/lib/pinecone"
import { getS3Url } from "@/lib/s3"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth()
    // Validate user's authentication
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const body = await req.json()
    const { file_key, file_name } = body
    console.log(file_key, file_name)
    await loadS3IntoPinecone(file_key)
    const chatId = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        insertedId: chats.id,
      })
    return NextResponse.json({ chatId: chatId[0].insertedId }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
