"use server"
import axios from "axios";
import extractProcessedLinkedInData from "./ExtractProcessedLinkedInData";

const api_key = process.env.LINKEDIN_API_KEY!;
const url = "https://api.scrapingdog.com/linkedin";

export default function fetchLinkedin(profile_id: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        api_key: api_key,
        type: "profile",
        linkId: profile_id,
        private: "false",
      };

      const response = await axios.get(url, { params });
      
      if (response.status !== 200) {
        reject(new Error(`Request failed with status code: ${response.status}`));
        return;
      }

      const FinalData = extractProcessedLinkedInData(response.data[0]);
      console.log("structured Data", FinalData);
      
      resolve(FinalData);
    } catch (error) {
      reject(error);
    }
  });
}