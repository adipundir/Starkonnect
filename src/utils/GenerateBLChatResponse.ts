import axios from "axios";
import { UserProfile } from "./types";

export const GenerateBLChatResponse = async (context: UserProfile[], prompt : string) => {
  console.log("context and prompt in middle blchat fxn", context, prompt)
  try {
    const res = await axios.post("/api/generateBLChatResponse", { context , prompt});
    console.log("response in GenerateBLChatResponse fxn", res.data);
    return res.data.aiResponse;
  } catch (error) {
    console.error("Error Generating Response:", error);
    throw error;
  }
};
