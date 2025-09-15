import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// --- THE BLACK BOX RECORDER ---
// This will print to your Vercel logs and tell us if the keys are missing.
console.log("--- VERCEL DEPLOYMENT CHECK ---");
console.log(
  "Cloudinary Cloud Name:",
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "Loaded" : "FATAL: MISSING!"
);
console.log(
  "Cloudinary API Key:",
  process.env.CLOUDINARY_API_KEY ? "Loaded" : "FATAL: MISSING!"
);
console.log(
  "Cloudinary API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "Loaded" : "FATAL: MISSING!"
);
console.log("---------------------------------");

// Configure Cloudinary with the correct environment variables for Next.js
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

    const mediaBuffer = await mediaFile.arrayBuffer();
    const coverImageBuffer = await coverImage.arrayBuffer();

    const resourceType = mediaFile.type.startsWith("video") ? "video" : "raw";

    const [mediaUploadResult, imageUploadResult] = await Promise.all([
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: resourceType }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(Buffer.from(mediaBuffer));
      }),
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(Buffer.from(coverImageBuffer));
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
