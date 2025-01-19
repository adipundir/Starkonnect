"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getUsersData } from "@/utils/getUsersData";
import axios from "axios";
import { getNewUsers } from "@/utils/getNewUsers";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { PlusIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Address } from "@starknet-io/types-js";
import { useContractInteractions } from "@/hooks/useContractInteractions";
import { useUserProfile } from "@/provider/providerContext";
import { useStoreWallet } from "@/components/ConnectWallet/walletContext";
import { MatchesContainer } from "@/components/MatchesContainer";
import { MultiStepLoader } from "@/components/multi-step-loader";

// Simulated function to get matches 
const getMatchesFromAPI = async () => {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return [
        {
            "id": "1",
            "name": "Kartik Mittal",
            "bio": "Full-stack developer with a passion for AI",
            "aiReview": "Excellent problem-solving skills and strong coding abilities.",
            "compatibilityScore": 95,
            "devScore": 92
        },
        {
            "id": "2",
            "name": "Rahul Sharma",
            "bio": "Frontend specialist focusing on React and Vue",
            "aiReview": "Creative designer with a keen eye for user experience.",
            "compatibilityScore": 88,
            "devScore": 85
        },
        {
            "id": "3",
            "name": "Tejas Bansal",
            "bio": "Backend guru with expertise in Node.js and Python",
            "aiReview": "Excellent at optimizing database queries and API performance.",
            "compatibilityScore": 92,
            "devScore": 94
        },
        {
            "id": "4",
            "name": "Ananya Gupta",
            "bio": "Machine learning engineer passionate about NLP",
            "aiReview": "Innovative thinker with a strong grasp of advanced algorithms.",
            "compatibilityScore": 91,
            "devScore": 90
        },
        {
            "id": "5",
            "name": "Vikram Singh",
            "bio": "Cloud architect with AWS and Azure expertise",
            "aiReview": "Highly skilled in scalable system design and infrastructure optimization.",
            "compatibilityScore": 89,
            "devScore": 87
        },
        {
            "id": "6",
            "name": "Sanya Kapoor",
            "bio": "DevOps specialist with a knack for automation",
            "aiReview": "Great at implementing CI/CD pipelines and ensuring smooth deployments.",
            "compatibilityScore": 87,
            "devScore": 86
        },
        {
            "id": "7",
            "name": "Arjun Mehta",
            "bio": "Game developer with Unity and Unreal Engine expertise",
            "aiReview": "Impressive creativity and excellent debugging skills.",
            "compatibilityScore": 85,
            "devScore": 83
        },
        {
            "id": "8",
            "name": "Priya Sethi",
            "bio": "Blockchain developer experienced with Solidity and Rust",
            "aiReview": "Exceptional at designing secure and efficient smart contracts.",
            "compatibilityScore": 93,
            "devScore": 91
        },
        {
            "id": "9",
            "name": "Rohan Verma",
            "bio": "Mobile developer proficient in Flutter and React Native",
            "aiReview": "Strong focus on delivering intuitive user experiences.",
            "compatibilityScore": 90,
            "devScore": 89
        },
        {
            "id": "10",
            "name": "Meera Joshi",
            "bio": "Data analyst skilled in Tableau and Power BI",
            "aiReview": "Expert in deriving actionable insights from complex datasets.",
            "compatibilityScore": 86,
            "devScore": 84
        }
    ]
};
const loadingStates = [
    {
        text: "Scanning personas...",
    },
    {
        text: "Calculating compatibility scores...",
    },
    {
        text: "Finding perfect matches!",
    },
];


export default function Home() {

    const [isLoading, setIsLoading] = useState(false);
    const { userProfileData, newMatches, currentMatches, setNewMatches, setCurrentMatches, allUsersAddress, setAllUsersData } = useUserProfile()
    const isConnected = useStoreWallet(state => state.isConnected);
    const addressAccount = useStoreWallet(state => state.address);

    const { addMatchesToContract } = useContractInteractions()

    const handleGenerateMatches = async (): Promise<void> => {
        try {
            console.log("generate responses run")
            console.log("All users address", allUsersAddress)
            console.log("userprofile", userProfileData)
            
            setIsLoading(true)
            if (allUsersAddress && userProfileData) {
                // Get new users based on conditions
                const newUsers = getNewUsers(addressAccount as Address, allUsersAddress, currentMatches, 5);
                console.log("new users raw Data", newUsers)

                if (newUsers.length === 0){
                    toast.warning("We Couldn't find you any Suitable Matches")
                    return
                }

                // Fetch data for new users
                const newUsersData = await getUsersData(newUsers);
                console.log("other New User's Data", newUsersData)

                const res = await axios.post("/api/generateMatches", {
                    newUsersData,
                    userProfileData,
                });

                // const serialisedMatches = await serializeMatches(res)

                console.log("User's Matches:", res.data.matches.trim("`"));
                setNewMatches(JSON.parse(res.data.matches.trim("```")))
            }
        } catch (error) {
            console.error("Error in handleGenerateHatches:", error);
        }
        finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        console.log("new matches", newMatches)
    }, [newMatches])


    const handleAddMatchesToContract = async () => {
        try {
            await addMatchesToContract(newMatches)
        } catch (error) {
            toast.error("Error Uploading Matches to Contract");
        }
    };

    return (
        <div className="pt-24 container min-h-[100vh] mx-auto py-8 flex flex-col gap-8">
            {newMatches?.length > 0 && <div>
                <div className="text-4xl flex justify-between items-center sm:text-5xl md:text-6xl font-bold mb-8 text-black dark:text-white">
                    <p>New Matches ✨</p>
                    <div className="flex gap-4 w-fit">
                        {newMatches?.length > 0 && <Button onClick={handleAddMatchesToContract} disabled={isLoading} className="font-bold">
                            {!isLoading && < PlusIcon />} {isLoading ? "Loading..." : `Add ${newMatches?.length} matches to Contract`}
                        </Button>}

                        {(currentMatches?.length > 0 || newMatches?.length > 0) && <Button onClick={handleGenerateMatches} disabled={isLoading} className="font-bold">
                            {!isLoading && < Sparkles />} {isLoading ? "Loading..." : "Get New Matches"}
                        </Button>}
                    </div>
                </div>
                <MatchesContainer matches={newMatches} />
            </div>}

            <div>
                {currentMatches?.length > 0  &&<div className="text-4xl flex justify-between items-center sm:text-5xl md:text-6xl font-bold mb-8 text-black dark:text-white">
                    <p>My Matches ⚡️</p>
                    <div className="flex gap-4">
                        {(currentMatches?.length > 0 && newMatches?.length === 0) && <Button onClick={handleGenerateMatches} disabled={isLoading} className="font-bold">
                            {!isLoading && < Sparkles />} {isLoading ? "Loading..." : "Get New Matches"}
                        </Button>}
                    </div>
                </div>}
                {currentMatches?.length === 0 && newMatches?.length === 0 && (
                    <div className="text-center">
                        <p className="text-xl mb-4">No matches to show</p>
                        <Button onClick={handleGenerateMatches} disabled={isLoading} className="font-bold">
                            {!isLoading && <Sparkles />} {isLoading ? "Loading..." : "Get Matches"}
                        </Button>
                    </div>
                )}

                {currentMatches && <MatchesContainer matches={currentMatches} />}
            </div>
            <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={2000} />
            {isLoading && <button
                className="fixed top-2 right-4 text-black dark:text-white z-[12000]"
                onClick={() => setIsLoading(false)}
                disabled={isLoading}
            >
                <IconSquareRoundedX className="h-10 w-10" />
            </button>}
        </div>
    );
}

