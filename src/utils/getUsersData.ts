import axios from "axios";
import { Address } from "@starknet-io/types-js";
import { UserProfile } from "@/type/types";

export const getUsersData = async (
  usersAddressArray: Address[]
): Promise<UserProfile[]> => {
  const usersData: UserProfile[] = await Promise.all(
    usersAddressArray?.map(async (userAddress) => {
      try {
        const { data } = await axios.get(
            `https://starkonnect.exadrivecdn.com/userData/walletAddress/${userAddress}/data.json`
        );
        return data;
      } catch (error) {
        console.log(error)
      }
    })
  );
  return usersData;
};
