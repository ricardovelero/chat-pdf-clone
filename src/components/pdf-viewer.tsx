import React from "react"

type PDFViewerProps = {
  pdf_url: string
}

export default function PDFViewer({ pdf_url }: PDFViewerProps) {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
      className="w-full h-full"
    ></iframe>
  )
}
