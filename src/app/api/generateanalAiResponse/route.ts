import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const reqObject = await request.json();

  let { messages, ...otherEntries } = reqObject;
  otherEntries = otherEntries
  // Create context array
  const context = Object.values(otherEntries);

  // Extract prompt
  const userPrompt = messages.at(-1)?.content;
  messages = messages.pop()
  console.log(messages)

  console.log("context and prompt in api route", context, userPrompt);

  try {
    // Ensure API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "API Key Not Found" }, { status: 500 });
    }

    // Validate the input user profile
    if (!context ) {
      return NextResponse.json(
        { message: "Invalid Inputs Provided" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the prompt

    const prompt = `
    user prompt - ${JSON.stringify(userPrompt)}

    ${messages.length > 0 ? `take a look at our previous messages as well - ${JSON.stringify(userPrompt)}` : ""}

    just straightaway answer the question above after analysing the following data of all the users on our platform : 
    ${JSON.stringify(context)}
    Make sure to provide a CONCISE and accurate response with references to profiles.
    **DONt'T** sound like you have analysided the data provided in the prompt **OR** there is lack of data, sound like a human is speaking from his knowledge.
    **ALWAYS** sound like you're 100% sure.
    `;

    // Generate content using the model
    const response = await model.generateContent(prompt);
    const finalResponse = response.response.text();

    console.log("raw data in GenerateBLChat Api route", finalResponse);

    // Ensure the response is valid
    if (!finalResponse) {
      throw new Error("No response from the generative AI model.");
    }

    // Send the result as a response
    return new Response(finalResponse.trim());
    //@typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error Generating AI Response:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
