import { Address } from "@starknet-io/types-js";

export type LinkedInProfile = {
  fullName: string;
  about: string;
  headline: string;
  location: string;
  profile_photo: string;
  followers: string;
  connections: string;
  certification: {
    company_image: string;
    certification: string;
    company_url: string;
    company_name: string;
    issue_date: string;
    credential_id: string;
  }[];
  education: {
    college_url: string;
    college_name: string;
    college_image: string;
    college_degree: string;
    college_degree_field: string | null;
    college_duration: string;
    college_activity: string;
  }[];
  experience: {
    position: string;
    company_url: string;
    company_image: string;
    company_name: string;
    location: string | null;
    summary: string;
    starts_at: string;
    ends_at: string;
    duration: string;
  }[];
  description: {
    description1: string;
    description1_link: string;
    description2: string;
    description2_link: string;
    description3: string;
    description3_link: string;
  };
  public_identifier: string;
  background_cover_image_url: string;
};

export type UserProfile = {
  address: Address;
  linkedinUsername: string;
  githubUsername: string;
  name: string;
  email: string;
  linkedinProfile: LinkedInProfile | null;
  githubProfile: {
    username: string;
    topLanguages: {
      [language: string]: number; // Key-value pair for language and percentage
    };
    activity: {
      totalCommits: number;
      totalPRs: number;
      contributedTo: number;
    };
  };
  devScore: number;
};

export type Match = {
  name: String;
  userAddress: string;
  bio: string;
  devScore: string;
  compatibilityScore: string;
  remark: string;
};
