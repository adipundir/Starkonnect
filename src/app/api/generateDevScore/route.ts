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
  
      Based on their contributions, projects, activity, and skills, assign a developer score out of 1000 that reflects:
      - Their expertise
      - Depth of knowledge
      - Number of projects
      - Overall personality as a builder.
  
      Only return the numeric score as the output.
    `;

    // Generate content using the model
    const response = await model.generateContent(prompt);
    const finalScore = response.response.text();

    console.log("raw data", finalScore);

    console.log("Generated Developer Score in API route:", parseInt(finalScore.trim()));

    // Ensure the response is valid
    if (!finalScore || isNaN(parseInt(finalScore.trim()))) {
      throw new Error("Invalid response from the generative AI model.");
    }

    // Send the result as a response
    return NextResponse.json({
      message: "Generation Successful",
      score : parseInt(finalScore.trim())
    });
  } catch (error: any) {
    console.error("Error Generating Developer Score:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
