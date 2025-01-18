import { NextRequest, NextResponse } from "next/server";
import { ExaDrive } from "exadrive-sdk";

const exaDrive = new ExaDrive(process.env.EXADRIVE_APP_ID!, process.env.EXADRIVE_API_KEY!);

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as File;
  const virtualDirectoryPath = data.get("virtualDirectoryPath") as string;

  try {
    if (!file || !virtualDirectoryPath) {
      return NextResponse.json({ message: "No file or directory path provided" }, { status: 400 });
    }
    console.log("file", file)

    // Convert the file to a buffer
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

    // Extract additional details for upload
    const originalFileName = file.name;
    const mimeType = file.type;
    console.log("exadrive upload function will run now")
    // Upload the file using ExaDrive
    const uploadResponse = await exaDrive.uploadFileWithBuffer(
      fileBuffer,
      originalFileName,
      mimeType,
      virtualDirectoryPath,
    );

    console.log("exadrive upload function run complete");
    const trx_data = uploadResponse.data
    console.log("uploadResponse", trx_data);

    return NextResponse.json({ message: "File uploaded successfully", trx_data });
  } catch (error : any) {
    console.error("Error uploading file to ExaDrive:", error);

    // Simplify the error response
    return NextResponse.json({ error: "Failed to upload file to ExaDrive", details: error.message }, { status: 500 });
  }
}
