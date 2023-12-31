"use client"

import React, { useState } from "react"
import { uploadToS3 } from "@/lib/s3"
import { useMutation } from "@tanstack/react-query"
import { Inbox, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"

export default function FileUpload() {
  const { toast } = useToast()
  const router = useRouter()
  const [uploading, setUpLoading] = useState(false)
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string
      file_name: string
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      })
      return response.data
    },
  })
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10MB
        toast({
          variant: "destructive",
          title: "Server error",
          description: "Please, upload a file no bigger than 10 mb.",
        })
      }
      try {
        const data = await uploadToS3(file)
        if (!data?.file_key || !data.file_name) {
          toast({
            variant: "destructive",
            title: "Server error",
            description: "Something went wrong",
          })
          return
        }
        mutate(data, {
          onSuccess: ({ chatId }) => {
            toast({
              variant: "default",
              title: "Success",
              description: "Chat created!",
            })
            router.push(`/chat/${chatId}`)
          },
          onError: (err) => {
            toast({
              variant: "destructive",
              title: "Uh no!",
              description: "Error creating chat",
            })
            console.error(err)
          },
        })
        console.log("Data", data)
      } catch (error) {
        console.log(error)
      } finally {
        setUpLoading(false)
      }
    },
  })
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  )
}
