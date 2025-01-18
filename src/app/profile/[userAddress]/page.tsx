"use client"

import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import GitHubCalendar from 'react-github-calendar'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { getUsersData } from "@/utils/getUsersData"
import { GeneratePersona } from "@/utils/GeneratePersona"
import { ShineBorder } from "@/components/shine-border"
import { HyperText } from "@/components/hyper-text"
import { UserProfile } from "@/type/types"

const userData = {
    githubUsername: "adipundir",
    name: "Aditya Pundir",
    email: "pundir.aditya@outlook.com",
    headline: "CEHv9 Certified | NextJS l Solidity | Aptos Move",
    location: "Noida, Uttar Pradesh, India",
    experience: [
        {
            position: "React Developer Intern",
            company_name: "Simplifii Labs Private Limited",
            summary: "Develop complex websites in React using Typescript, Focusing on implementing clean and practical UI",
            starts_at: "Nov 2023",
            ends_at: "Nov 2024",
            duration: "1 year 1 month"
        }
    ],
    education: [
        {
            college_name: "ABES Engineering College",
            college_degree: "Bachelor of Technology - BTech",
            college_degree_field: "Computer Science",
            college_duration: "2022 - 2026",
        }
    ],
    certification: [
        {
            certification: "Certified Ethical Hacker (CEH)",
            company_name: "EC-Council",
            issue_date: "Issued Aug 2016 - Expires Aug 2019",
            credential_id: "Credential ID ECC28723000719"
        }
    ],
    githubProfile: {
        topLanguages: {
            TypeScript: 69.64,
            JavaScript: 16.28,
            Python: 12.2,
            CSS: 1.87
        },
        activity: {
            totalCommits: 219,
            totalPRs: 6,
            contributedTo: 9
        }
    },
    devScore: 725
}


export default function ProfilePage({params} : any) {
    const [userData, setUserData] = useState<UserProfile | null>(null)
    const [persona, setPersona] = useState<string | null>(null);

    // const {userAddress} = React.use<any>(params)
    // console.log("Address from params", userAddress)

    const initialisePage = async () => {
        console.log("userAddress", params.userAddress)
        console.log("initialise run")
        const _userData: UserProfile = (await getUsersData([params.userAddress]))[0];
        console.log("got user Data", _userData)
        setUserData(_userData)
        console.log("generate persona about to be called")
        const userPersona = await GeneratePersona(_userData)
        console.log(userPersona)
        setPersona(userPersona)
    }

    useEffect(() => {
        if(params.userAddress)
        initialisePage()
    }, [params]);

    if(!userData)
        return

    return (
        <div className="pt-20 min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
                    <div className="flex w-full justify-between items-center space-x-4 mb-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={`https://github.com/${userData.githubUsername}.png`} alt={userData.name} />
                                <AvatarFallback>{userData?.name?.split(' ')?.map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                {/* <h1 className="text-2xl font-bold">{userData.name}</h1> */}
                                <HyperText
                                    className="text-2xl font-bold text-black dark:text-white"
                                    text={userData.name}
                                    duration={0}
                                />
                                <p className="text-muted-foreground">{userData?.linkedinProfile?.headline}</p>
                                <p className="text-sm text-muted-foreground mt-1">{userData?.linkedinProfile?.location}</p>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end sm:mt-0">
                            <a href={`https://linkedin.com/in/${userData.linkedinUsername}`} className="text-gray-400 hover:text-gray-500 mx-2">
                                <FaLinkedin size={24} />
                            </a>
                            <a href={`https://github.com/${userData.githubUsername}`} className="text-gray-400 hover:text-gray-500 mx-2">
                                <FaGithub size={24} />
                            </a>
                            <a href={`mailto:${userData.email}`} className="text-gray-400 hover:text-gray-500 mx-2">
                                <MdEmail size={24} />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <ShineBorder className="relative flex min-h-[250px] w-full flex-col items-center justify-start text-left overflow-hidden rounded-lg border bg-background md:shadow-xl"
                                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                                    <CardHeader className="w-full">
                                        <CardTitle>AI-Generated Persona</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {persona ? (
                                            <p>{persona}</p>
                                        ) : (
                                            <div className="animate-pulse flex space-x-4">
                                                <div className="flex-1 space-y-4 py-1">
                                                    <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-500 rounded"></div>
                                                    <div className="h-4 bg-gray-500 rounded w-5/6"></div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                            </ShineBorder>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Experience</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userData?.linkedinProfile?.experience?.map((exp, index) => (
                                        <div key={index} className="mb-4">
                                            <h3 className="font-semibold">{exp.position}</h3>
                                            <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                                            <p className="text-xs text-muted-foreground">{exp.starts_at} - {exp.ends_at} · {exp.duration}</p>
                                            <p className="mt-2 text-sm">{exp.summary}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Education</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userData?.linkedinProfile?.education?.map((edu, index) => (
                                        <div key={index} className="mb-4">
                                            <h3 className="font-semibold">{edu.college_name}</h3>
                                            <p className="text-sm text-muted-foreground">{edu.college_degree}{edu.college_degree_field ? `, ${edu.college_degree_field}` : ''}</p>
                                            <p className="text-xs text-muted-foreground">{edu.college_duration}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>GitHub Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <p className="text-2xl font-bold">{userData.githubProfile.activity.totalCommits}</p>
                                            <p className="text-sm text-muted-foreground">Total Commits</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{userData.githubProfile.activity.totalPRs}</p>
                                            <p className="text-sm text-muted-foreground">Total PRs</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{userData.githubProfile.activity.contributedTo}</p>
                                            <p className="text-sm text-muted-foreground">Contributed To</p>
                                        </div>
                                    </div>
                                    <GitHubCalendar username={userData.githubUsername} />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skills</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(userData?.githubProfile?.topLanguages)?.map(([lang, percentage]) => (
                                            <Badge key={lang} variant="secondary">
                                                {lang} {percentage.toFixed(1)}%
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Certifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userData?.linkedinProfile?.certification?.map((cert, index) => (
                                        <div key={index} className="mb-4">
                                            <h3 className="font-semibold">{cert.certification}</h3>
                                            <p className="text-sm text-muted-foreground">{cert.company_name}</p>
                                            <p className="text-xs text-muted-foreground">{cert.issue_date}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">{cert.credential_id}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Dev Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-primary">{userData.devScore}</p>
                                        <p className="text-sm text-muted-foreground mt-2">Based on GitHub activity and contributions</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

