import { v2 as cloudinary } from "cloudinary";
import { type NextRequest, NextResponse } from "next/server";
import { Writable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload a stream to Cloudinary
const uploadStream = (fileBuffer: Buffer, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const mediaFile = formData.get("mediaFile") as File | null;
    const coverImage = formData.get("coverImage") as File | null;

    if (!mediaFile || !coverImage) {
      return NextResponse.json(
        { error: "Both mediaFile and coverImage are required" },
        { status: 400 }
      );
    }

    // Convert files to buffers
    const mediaBuffer = Buffer.from(await mediaFile.arrayBuffer());
    const imageBuffer = Buffer.from(await coverImage.arrayBuffer());

    // Upload both files in parallel
    const [mediaUploadResult, imageUploadResult] = await Promise.all([
      uploadStream(mediaBuffer, {
        resource_type: mediaFile.type.startsWith("video") ? "video" : "image", // Videos are also 'auto' but this is more explicit
        folder: "pulsevest/media",
      }),
      uploadStream(imageBuffer, {
        resource_type: "image",
        folder: "pulsevest/covers",
      }),
    ]);

    return NextResponse.json({
      mediaUrl: mediaUploadResult.secure_url,
      imageUrl: imageUploadResult.secure_url,
      success: true,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during upload.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
