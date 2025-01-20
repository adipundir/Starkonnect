"use client"
import { useChat } from "ai/react"
import { Chat } from "@/components/ui/chat"
import { getUsersData } from "@/utils/getUsersData"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUserProfile } from "@/provider/providerContext"
import React from "react"
import { GradientButton } from "@/components/gradient-button"
import { useContractInteractions } from "@/hooks/useContractInteractions"

export default function AnalAIse() {
    const { userProfileData, allUsersData: context, isPremiumUser } = useUserProfile()
    const { payPremium } = useContractInteractions()

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        stop,
        append
    } = useChat({
        api: "/api/generateanalAiResponse",
        body: context,
        streamProtocol: "text",
        onError: (error: Error) => {
            console.log("Error", error)
            toast.error("There Was a problem Generating a Response")
        }
    })
    if (!isPremiumUser)
        return (
           <div className="flex flex-col gap-4 h-[100vh] w-full items-center justify-center">
                <div className="text-xl font-extralight">This is a Premium Feature 🤩</div>
                <GradientButton onClick={payPremium}>
                    Pay 10 STRK
                </GradientButton>
           </div>
        )

    return (
        <div className="flex pt-32 pb-16 min-h-screen max-h-screen w-full px-48 text-xl">
            <Chat
                className="grow"
                messages={messages}
                handleSubmit={handleSubmit}
                input={input}
                handleInputChange={handleInputChange}
                isGenerating={isLoading}
                stop={stop}
                append={append}
                suggestions={[
                    "Which Tech Stack is most popular in India amoung age group 20-25?",
                    "Is this the right time to launch a NextJS course for Indian audience?",
                    "Which city in India should we hire skilled React Native Developers from?"
                ]}
            />
        </div>
    )
}