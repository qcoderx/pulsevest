import { v2 as cloudinary } from "cloudinary";
import { type NextRequest, NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload a buffer to Cloudinary
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

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Check content length before processing
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100MB." },
        { status: 413 }
      );
    }
    
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

    // --- THIS IS THE FIX ---
    // We now use "auto" for the resource_type to let Cloudinary correctly
    // identify whether the media file is an image, video, or audio file.
    const [mediaUploadResult, imageUploadResult] = await Promise.all([
      uploadStream(mediaBuffer, {
        resource_type: "auto",
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
