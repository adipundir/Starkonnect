import axios from "axios";
import { Address } from "@starknet-io/types-js";
import { Match, UserProfile } from "@/type/types";

export const getUserMatches = async (
  userAddress: Address
): Promise<Match[]> => {
      try {
        const { data } = await axios.get(
          `https://star-konnect.exadrivecdn.com/userData/walletAddress/${userAddress}/matches.json`
        );
        console.log(data);
        return data.userMatches;
    } catch (error) {
        console.log("GetUserMatches Catch Block",error);
    }
    console.log("sending Empty matches Array")
    return []
};
