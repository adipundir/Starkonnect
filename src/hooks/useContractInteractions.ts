import { useEffect, useState } from "react";
import {
  cairo,
  CallData,
  Contract,
  InvokeFunctionResponse,
} from "starknet";
import { StarKonnectABI } from "../constants/StarKonnectABI";
import { toast } from "sonner";
import { useStoreWallet } from "@/components/ConnectWallet/walletContext";
import { Match } from "@/type/types";
import { strkTokenAddress } from "@/constants/constants";
import { Address } from "@starknet-io/types-js";
// import { Address } from "@starknet-io/types-js";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export const useContractInteractions = () => {
  // wallet context
  const walletAccountFromContext = useStoreWallet(
    (state) => state.myWalletAccount
  );
  // Trx State
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [starKonnectContract, setStarKonnectContract] = useState<Contract>(
    new Contract(StarKonnectABI, contractAddress, walletAccountFromContext)
  );

  useEffect(() => {
    const fetchTransactionResult = async () => {
      if (transactionHash) {
        try {
          toast.info("Waiting for transaction confirmation...");
          const result = await walletAccountFromContext?.waitForTransaction(
            transactionHash
          );
          console.log("Transaction Result:", result);

          // Show success toast
          toast.success("Transaction successful!");
        } catch (e: any) {
          console.error("Error in transaction confirmation:", e);
          toast.error("Transaction failed.");
        }
      }
    };

    fetchTransactionResult();
  }, [transactionHash]); 


  const createProfile = async () => {
    console.log("Create Profile Function =", starKonnectContract.functions);
    const myCall = starKonnectContract.populate("create_profile", []);
    console.log("Call=", myCall);
    walletAccountFromContext
      ?.execute(myCall)
      .then(async (resp: InvokeFunctionResponse) => {
        console.log("createprofile txH : ", resp.transaction_hash);
        setTransactionHash(resp.transaction_hash);
      })
      .catch((e: any) => {
        toast.error("Error in Creating Profile : ", e);
      });
  };

  const payPremium = async () => {
    const premium_fee = await starKonnectContract.get_premium_price();
    console.log("premium_fee", premium_fee);
    walletAccountFromContext
      ?.execute([
        {
          contractAddress: strkTokenAddress,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: starKonnectContract.address,
            amount: cairo.uint256(premium_fee),
          }),
        },
        {
          contractAddress: starKonnectContract.address,
          entrypoint: "buy_premium",
          calldata: CallData.compile({}),
        },
      ])
      .then(async (resp: InvokeFunctionResponse) => {
        console.log("Pay Premium txH : ", resp.transaction_hash);
        setTransactionHash(resp.transaction_hash);
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
      })
      .catch((e: any) => {
        toast.error("Error in withdrawing balance : ", e);
      });
  };

  const getBalance = async (address: Address): Promise<number> => {
    try {
      const resp: bigint = await starKonnectContract.get_balance(address);
      console.log("balance response:", resp);
      const balance = Number(resp) / 10 ** 18; 
      return balance;
    } catch (e: any) {
      console.error("error get_balance =", e);
      console.log("Sending Default Balance");
      return 0; 
    }
  };

  const isPremiumUser = async (address : Address): Promise<boolean> => {
    try {
      console.log("Address ", address)
      console.log("type of Address", typeof address)
      let _isPremiumUser: boolean = await starKonnectContract.is_premium_user(
        address
      );
      console.log("isPremiumUser", _isPremiumUser);
      return _isPremiumUser;
    } catch (e: any) {
      console.error("Error in isPremiumUser:", e);
      return false; 
    }
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

  return {
    getBalance,
    getAllUsers,
    createProfile,
    withdrawBalance,
    payPremium,
    isPremiumUser,
  };
};
