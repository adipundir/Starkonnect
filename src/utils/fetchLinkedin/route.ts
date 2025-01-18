import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const api_key = process.env.LINKEDIN_API_KEY!;
const url = "https://api.scrapingdog.com/linkedin";

const fetchLinkedin = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { profile_id } = req.query;

  if (!profile_id || typeof profile_id !== "string") {
    return res.status(400).json({ error: "Missing or invalid profile_id" });
  }

  try {
    const params = {
      api_key,
      type: "profile",
      linkId: profile_id,
      private: "false",
    };

    const response = await axios.get(url, { params });

    if (response.status === 200) {
      return res.status(200).json(response.data);
    } else {
      return res
        .status(response.status)
        .json({ error: `Request failed with status code: ${response.status}` });
    }
  } catch (error: any) {
    console.error("Error making the request:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default fetchLinkedin;
