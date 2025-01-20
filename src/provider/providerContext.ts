"use client";
import { Match, UserProfile } from "@/type/types";
import { Address } from "@starknet-io/types-js";
import { create } from "zustand";

interface FrontEndProviderState {
    currentFrontendProviderIndex: number,
    setCurrentFrontendProviderIndex: (currentFrontendProviderIndex: number) => void,
}

export const useFrontendProvider = create<FrontEndProviderState>()(set => ({
    currentFrontendProviderIndex: 2,
    setCurrentFrontendProviderIndex: (currentFrontendProviderIndex: number) => { set(_state => ({ currentFrontendProviderIndex })) }
}));

// User Profile Store

interface UserProfileState {
  userProfileData: UserProfile | null;
  setUserProfileData: (profile: UserProfile) => void;
  allUsersAddress: Address[];
  setAllUsersAddress: (allUsersData: Address[]) => void;
  isPremiumUser : boolean
  setIsPremiumUser : (isPremiumUser : boolean) => void
  allUsersData: UserProfile[];
  setAllUsersData: (allUsersData: UserProfile[]) => void;
  balance: Number;
  setBalance: (balance: Number) => void;
  currentMatches: Match[];
  setCurrentMatches: (currentMatches: Match[]) => void;
  newMatches: Match[];
  setNewMatches: (newMatches: Match[]) => void;
}

export const useUserProfile = create<UserProfileState>()((set) => ({
  userProfileData: null,
  setUserProfileData: (userProfileData: UserProfile) => {
    set((_state) => ({ userProfileData }));
  },
  balance: 0,
  setBalance: (balance: Number) => {
    set((_state) => ({ balance }));
  },
  currentMatches: [],
  setCurrentMatches: (currentMatches: Match[]) => {
    set((_state) => ({ currentMatches }));
  },
  newMatches: [],
  setNewMatches: (newMatches: Match[]) => {
    set((_state) => ({ newMatches }));
  },
  allUsersAddress: [],
  setAllUsersAddress: (allUsersAddress: Address[]) => {
    set((_state) => ({ allUsersAddress }));
  },
  allUsersData: [],
  setAllUsersData: (allUsersData: UserProfile[]) => {
    set((_state) => ({ allUsersData }));
  },
  isPremiumUser: false,
  setIsPremiumUser: (isPremiumUser: boolean) => {
    set((_state) => ({ isPremiumUser }));
  },
}));