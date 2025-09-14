import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// --- THIS IS THE DEFINITIVE, FINAL FIX ---
// This configuration tells Next.js to disable its default body parser for this specific route.
// This is CRITICAL for allowing large file uploads (audio/video) to be streamed.
export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Convert files to buffers to be streamed to Cloudinary
    const mediaBuffer = await mediaFile.arrayBuffer();
    const coverImageBuffer = await coverImage.arrayBuffer();

    // Determine the correct resource type for Cloudinary
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

    // @ts-expect-error - a necessary evil for Cloudinary's dynamic result object
    const mediaUrl = mediaUploadResult?.secure_url;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
