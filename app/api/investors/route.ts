// pulsevest/app/api/investors/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export const revalidate = 0;

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("pulsevest");

    const investors = await db
      .collection("users")
      .find({
        role: "investor",
        // --- THIS IS THE FIX ---
        // Ensures that only investors with completed profiles are shown.
        investmentInterests: { $exists: true, $ne: "" },
      })
      .project({ name: 1, contactInfo: 1, investmentInterests: 1 })
      .toArray();

    return NextResponse.json({ investors });
  } catch (error) {
    console.error("Failed to fetch investors:", error);
    return NextResponse.json(
      { error: "Failed to fetch investors" },
      { status: 500 }
    );
  }
}
