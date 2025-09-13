import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary with environment variables for security
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const mediaFile = formData.get("mediaFile") as File | null;
    const coverImage = formData.get("coverImage") as File | null;

    if (!mediaFile || !coverImage) {
      return NextResponse.json(
        { error: "Media file or cover image is missing." },
        { status: 400 }
      );
    }

    // Convert files to buffers
    const mediaBuffer = await mediaFile.arrayBuffer();
    const coverImageBuffer = await coverImage.arrayBuffer();

    // Determine resource type for Cloudinary
    const resourceType = mediaFile.type.startsWith("video") ? "video" : "raw";

    // Upload files in parallel for maximum speed
    const [mediaUploadResult, imageUploadResult] = await Promise.all([
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(Buffer.from(mediaBuffer)).pipe(uploadStream);
      }),
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(Buffer.from(coverImageBuffer)).pipe(uploadStream);
      }),
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mediaUrl = mediaUploadResult?.secure_url;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const imageUrl = imageUploadResult?.secure_url;

    if (!mediaUrl || !imageUrl) {
      throw new Error("Cloudinary upload failed for one or more files.");
    }

    return NextResponse.json({ mediaUrl, imageUrl });
  } catch (error: unknown) {
    console.error("Upload API failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
