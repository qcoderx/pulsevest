import { v2 as cloudinary } from "cloudinary";
import { type NextRequest, NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// --- THIS IS THE FIX ---
// We are increasing the maximum file size the server will accept for this route.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb", // Set a 100MB limit, adjust if needed
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error:
            "Cloudinary configuration is missing. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const mediaFile = formData.get("mediaFile") as File;
    const coverImage = formData.get("coverImage") as File;

    if (!mediaFile || !coverImage) {
      return NextResponse.json(
        { error: "Both mediaFile and coverImage are required" },
        { status: 400 }
      );
    }

    const mediaBuffer = Buffer.from(await mediaFile.arrayBuffer());
    const imageBuffer = Buffer.from(await coverImage.arrayBuffer());

    const mediaBase64 = `data:${mediaFile.type};base64,${mediaBuffer.toString(
      "base64"
    )}`;
    const imageBase64 = `data:${coverImage.type};base64,${imageBuffer.toString(
      "base64"
    )}`;

    const mediaUploadResult = await cloudinary.uploader.upload(mediaBase64, {
      resource_type: mediaFile.type.startsWith("video") ? "video" : "auto",
      folder: "pulsevest/media",
      public_id: `media_${Date.now()}`,
    });

    const imageUploadResult = await cloudinary.uploader.upload(imageBase64, {
      resource_type: "image",
      folder: "pulsevest/covers",
      public_id: `cover_${Date.now()}`,
    });

    return NextResponse.json({
      mediaUrl: mediaUploadResult.secure_url,
      imageUrl: imageUploadResult.secure_url,
      success: true,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";
    // Send a proper JSON error response
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
