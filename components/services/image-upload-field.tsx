"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { uploadToImgBB } from "@/lib/api/services"

interface Props {
  value?: string
  onChange: (url: string) => void
}

export function ImageUploadField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith("image/"))
      return toast.error("Choose an image file")
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be under 5 MB")

    try {
      setUploading(true)
      const url = await uploadToImgBB(file)
      console.log(url) // remove once it works
      onChange(url)
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative aspect-16/6 w-full overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Service banner preview"
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => onChange("")}
            aria-label="Remove banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-16/6 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading banner…
            </>
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              Upload a banner image (max 5 MB)
            </>
          )}
        </button>
      )}
    </div>
  )
}
