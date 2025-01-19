import { useState } from "react";
import {
  Contract,
  InvokeFunctionResponse,
  type GetTransactionReceiptResponse,
} from "starknet";
import { StarKonnectABI } from "../constants/StarKonnectABI";
import { toast } from "sonner";
import { useStoreWallet } from "@/components/ConnectWallet/walletContext";
import { Match } from "@/type/types";
import { Address } from "@starknet-io/types-js";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export const useContractInteractions = () => {
  // wallet context
  const walletAccountFromContext = useStoreWallet(
    (state) => state.myWalletAccount
  );
  // Trx State
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [_transactionResult, setTransactionResult] = useState<
    GetTransactionReceiptResponse | undefined
  >(undefined);

  const [starKonnectContract, setStarKonnectContract] = useState<Contract>(
    new Contract(StarKonnectABI, contractAddress, walletAccountFromContext)
  );

  //   useEffect(() => {
  //     if (isConfirmed) {
  //       toast.success(`Transaction confirmed successfully! ${hash}`);
  //     } else if (error) {
  //       console.log("error", error);
  //       toast.error(`Error: ${error.message} ${hash}`);
  //     } else if (isConfirming) {
  //       toast.info(`Transaction is confirming... ${hash}`);
  //     }
  //   }, [isConfirming, isConfirmed, error, hash]);

  const createProfile = async () => {
    console.log("Create Profile Function =", starKonnectContract.functions);
    const myCall = starKonnectContract.populate("create_profile", []);
    console.log("Call=", myCall);
    walletAccountFromContext
      ?.execute(myCall)
      .then(async (resp: InvokeFunctionResponse) => {
        console.log("createprofile txH : ", resp.transaction_hash);
        setTransactionHash(resp.transaction_hash);
        setTransactionResult(
          await walletAccountFromContext.waitForTransaction(
            resp.transaction_hash
          )
        );
      })
      .catch((e: any) => {
        toast.error("Error in Creating Profile : ", e);
      });
  };

  const addMatchesToContract = async (newMatches: Match[]) => {
    console.log("new matches", newMatches);
    console.log("Add matches Function =", starKonnectContract.functions);
    const myCall = starKonnectContract.populate("add_matches", {
      matches: newMatches,
    });
    console.log("Call=", myCall);
    console.log("DONE")
    const resp = await walletAccountFromContext?.execute(myCall)
      .then(async (resp: InvokeFunctionResponse) => {
        console.log("createprofile txH : ", resp.transaction_hash);
        setTransactionHash(resp.transaction_hash);
        setTransactionResult(
          await walletAccountFromContext.waitForTransaction(
            resp.transaction_hash
          )
        );
      })
      .catch((e: any) => {
        console.log("Error in Contract Interation Add matches",e)
        toast.error("Error in Adding Matches : ", e);
      });
  };

  const payPremium = async () => {
    console.log("Pay Premium");
    const myCall = starKonnectContract.populate("buy_premium", []);
    console.log("Call=", myCall);
    walletAccountFromContext
      ?.execute(myCall)
      .then(async (resp: InvokeFunctionResponse) => {
        console.log("Pay Premium txH : ", resp.transaction_hash);
        setTransactionHash(resp.transaction_hash);
        setTransactionResult(
          await walletAccountFromContext.waitForTransaction(
            resp.transaction_hash
          )
        );
      })
      .catch((e: any) => {
        toast.error("Error in paying premium : ", e);
      });
  };

  const withdrawBalance = async () => {
    console.log("Withdraw Balance");
    const myCall = starKonnectContract.populate("withdraw_balance", []);
    console.log("Call=", myCall);
    walletAccountFromContext
      ?.execute(myCall)
      .then(async (resp: InvokeFunctionResponse) => {
        console.log("Withdraw Balance txH : ", resp.transaction_hash);
        setTransactionHash(resp.transaction_hash);
        setTransactionResult(
          await walletAccountFromContext.waitForTransaction(
            resp.transaction_hash
          )
        );
      })
      .catch((e: any) => {
        toast.error("Error in withdrawing balance : ", e);
      });
  };

  const getBalance = () => {
    starKonnectContract
      .get_balance()
      .then((resp: bigint) => {
        console.log("balance response :", resp);
        return Number(resp);
      })
      .catch((e: any) => {
        console.log("error get_balance =", e);
      });
  };

  const getAllUsers = async (): Promise<string[] | undefined> => {
    try {
      let resp: bigint[] = await starKonnectContract.get_all_users();

      // Convert each bigint address to hex, padded to 64 chars, prefixed with 0x
      const formattedAddresses = resp.map(
        (address: bigint) => "0x" + address.toString(16).padStart(64, "0")
      );

      console.log(
        "All Users Address in contract interaction:",
        formattedAddresses
      );
      return formattedAddresses;
    } catch (e: any) {
      console.error("Error in getAllUsers:", e);
      return undefined; // Optional: Return undefined if there’s an error
    }
  };



  const getUserMatches = () => {
    starKonnectContract.get_user_matches()
      .then((resp: Match[]) => {
        console.log("Current matches :", resp);
        return resp;
      })
      .catch((e: any) => {
        console.log("error getting Current matches ", e);
      });
  };

  return {
    getBalance,
    getAllUsers,
    getUserMatches,
    createProfile,
    addMatchesToContract,
    withdrawBalance,
    payPremium,
  };
};
