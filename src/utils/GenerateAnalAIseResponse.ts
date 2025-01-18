import { UserProfile } from "@/type/types";
import axios from "axios";

export const GenerateAnalAIseResponse = async (context: UserProfile[], prompt : string) => {
  console.log("context and prompt in middle AnalAise fxn", context, prompt)
  try {
    const res = await axios.post("/api/generateanalAiResponse", { context , prompt});
    console.log("response in GenerateAnalAiseResponse fxn", res.data);
    return res.data.aiResponse;
  } catch (error) {
    console.error("Error Generating Response:", error);
    throw error;
  }
};
