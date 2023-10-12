import { NextResponse } from "next/server"
import { OpenAIApi, Configuration } from "openai-edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

/**
 * Retrieves embeddings for a given text using the OpenAI API.
 * @param text - The text for which embeddings need to be generated.
 * @returns An array of numbers representing the embeddings generated for the input text.
 */
export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    // Check if the OpenAI API key is configured
    if (!config.apiKey) {
      throw new Error("Open AI Key not configured")
    }

    // Replace newline characters in the text with spaces
    const processedText = text.replace(/\n/g, " ")

    // Call the OpenAI API to create embeddings for the text using the "text-embedding-ada-002" model
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: processedText,
    })

    // Parse the response and extract the embedding data
    const result = await response.json()
    const embedding =
      result.data && result.data.length > 0
        ? (result.data[0].embedding as number[])
        : []

    return embedding
  } catch (error) {
    console.log("Error calling OpenAI embeddings API:", error)
    throw error
  }
}
