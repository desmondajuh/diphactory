import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch";

type EasySendResponse = {
  link: string;
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const formData = new FormData();
    formData.append("file", buffer, file.name);

    const response = await fetch("https://api.easysend.co/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as EasySendResponse;

    return NextResponse.json({
      success: true,
      link: data.link,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}
