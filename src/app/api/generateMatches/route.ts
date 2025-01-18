import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { newUsersData, userProfileData } = await request.json();
  console.log(
    " newUsersData and userProfileData in api route",
    newUsersData,
    userProfileData
  );

  try {
    // Ensure API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { message: "API Key Not Found" },
        { status: 500 }
      );
    }

    // Validate the input user profile
    if (!newUsersData || !userProfileData) {
      return NextResponse.json(
        { message: "Invalid Data Provided" },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the prompt
    const prompt = `
    I am providing you with two inputs:

    1. An array of user profiles on a platform.
    start ${JSON.stringify(newUsersData)} end
    2. The profile data of the current user.
    start ${JSON.stringify(userProfileData)} end

    Analyze and compare the current user's profile to the other user profiles to identify potential matches. Matches should indicate users who are highly compatible with the current user for collaboration in contexts such as hackathons or startup ventures.

    ### Compatibility Evaluation Criteria:
    - Expertise
    - DevScore
    - Depth of knowledge
    - Number and quality of projects
    - Activity and engagement on the platform
    - Overall personality and potential as collaborators

    ### Instructions:
    For each match:
    1. Assign a compatibility score out of 1000 (higher is better) that reflects how well the user aligns with the current user.
    2. Provide a short and concise remark explaining the reason for the match.

    ### Expected Output:
    Strictly return an **array of objects** where each object represents a match. The structure of the objects must match the following TypeScript type:


    type Match = {
    name: string // The full name of the matched user
    userAddress: string; // The address of the matched user
    bio : string // A very short generated bio of matched user based on data provided, example : React Native Developer specialising in UI/UX
    devScore : string //The devScore of the matched user from the provided data
    compatibilityScore: string; // The compatibility score (out of 1000) as a string
    remark: string; // A brief reason for the match.
    };

    Don't provide code for this problem rather solve it and give output in expected format.
    Just provide me with the array of objects WITHOUT the backticks.
    `;

    // Generate content using the model
    const response = await model.generateContent(prompt);
    const matches = response.response.text();

    console.log("Matches in api route", matches);

    // Ensure the response is valid
    if (!matches ) {
      throw new Error("Invalid response from the generative AI model.");
    }

    // Send the result as a response
    return NextResponse.json({
      message: "Generation Successful",
      matches: matches.trim(),
    });
  } catch (error: any) {
    console.error("Error Generating Developer Score:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
