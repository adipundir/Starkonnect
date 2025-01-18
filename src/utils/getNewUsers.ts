import { Match } from "@/type/types";
import { Address } from "@starknet-io/types-js";


export const getNewUsers = (
  userAddress : Address,
  allUsersAddress: Address[],
  myMatches: Match[],
  maxUsers: number
): Address[] => {
  
  // Create a Set of user addresses from myMatches for quick lookup
  const myMatchesAddresses = new Set(
    myMatches.map((match) => match.userAddress)
  );

  myMatchesAddresses.add(userAddress);

  // Filter out users from allUsers who are not in myMatches
  const newUsers = allUsersAddress.filter(
    (userAddress) => !myMatchesAddresses.has(userAddress)
  );

  // Return only the first x users from the filtered list
  return newUsers.slice(0, Math.min(maxUsers, newUsers.length));
};
