import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Sale } from "@/models/sale";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const range = searchParams.get("range") || "all";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.max(Number(searchParams.get("limit")) || 10, 1);
    const skip = (page - 1) * limit;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const filter: any = {};

    if (range === "7d") {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      filter.createdAt = { $gte: d };
    } else if (range === "30d") {
      const d = new Date(now);
      d.setDate(d.getDate() - 29);
      filter.createdAt = { $gte: d };
    } else if (range === "90d") {
      const d = new Date(now);
      d.setDate(d.getDate() - 89);
      filter.createdAt = { $gte: d };
    }

    const sales = await Sale.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const count = await Sale.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        data: sales,
        page,
        limit,
        count,
        totalPages: Math.ceil(count / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
