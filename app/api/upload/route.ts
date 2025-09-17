import { v2 as cloudinary } from "cloudinary"
import { type NextRequest, NextResponse } from "next/server"

// Configure Cloudinary with your secret credentials from your environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is properly configured
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error:
            "Cloudinary configuration is missing. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const mediaFile = formData.get("mediaFile") as File
    const coverImage = formData.get("coverImage") as File

    if (!mediaFile || !coverImage) {
      return NextResponse.json({ error: "Both mediaFile and coverImage are required" }, { status: 400 })
    }

    // Convert files to base64 for Cloudinary upload
    const mediaBuffer = Buffer.from(await mediaFile.arrayBuffer())
    const imageBuffer = Buffer.from(await coverImage.arrayBuffer())

    const mediaBase64 = `data:${mediaFile.type};base64,${mediaBuffer.toString("base64")}`
    const imageBase64 = `data:${coverImage.type};base64,${imageBuffer.toString("base64")}`

    // Upload media file to Cloudinary
    const mediaUploadResult = await cloudinary.uploader.upload(mediaBase64, {
      resource_type: mediaFile.type.startsWith("video") ? "video" : "auto",
      folder: "pulsevest/media",
      public_id: `media_${Date.now()}`,
    })

    // Upload cover image to Cloudinary
    const imageUploadResult = await cloudinary.uploader.upload(imageBase64, {
      resource_type: "image",
      folder: "pulsevest/covers",
      public_id: `cover_${Date.now()}`,
    })

    return NextResponse.json({
      mediaUrl: mediaUploadResult.secure_url,
      imageUrl: imageUploadResult.secure_url,
      success: true,
    })
  } catch (error) {
    console.error("Upload failed:", error)
    const errorMessage = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
