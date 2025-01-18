import axios from "axios";

export const GenerateDevScore = async (jsonObject: any) => {
  try {
    const res = await axios.post("/api/generateDevScore", jsonObject)
    console.log("dev Score in GenerateDevScoreFxn", res.data)
    return res.data.score
  } catch (error) {
    console.error("Error Generating Developer Score:", error);
    throw error;
  }
};
