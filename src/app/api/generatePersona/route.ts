import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const userProfile = await request.json();
  console.log("userProfile in api route", userProfile)

  try {
    // Ensure API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "API Key Not Found" }, { status: 500 });
    }

    // Validate the input user profile
    if (!userProfile || typeof userProfile !== "object") {
      return NextResponse.json(
        { message: "Invalid UserProfile Provided" },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the prompt
    const prompt = `
      Analyze the following developer's data:
      ${JSON.stringify(userProfile)}
  
      Based on their skills, strengthand weekness generate a developer persona in under 60 words that reflects:
      - Their expertise
      - Depth of knowledge
      - Number and type of projects
      - Overall personality as a builder.
    `;

    // Generate content using the model
    const response = await model.generateContent(prompt);
    const finalScore = response.response.text();

    console.log("raw data in generatepersona Api route", finalScore);

    // Ensure the response is valid
    if (!finalScore) {
      throw new Error("No response from the generative AI model.");
    }

    // Send the result as a response
    return NextResponse.json({
      message: "Generation Successful",
      persona : finalScore.trim()
    });
  } catch (error: any) {
    console.error("Error Generating Persona:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
