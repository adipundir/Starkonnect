'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUsersData } from '../../utils/getUsersData'
import { Address } from '@starknet-io/types-js'
import ConnectWallet from '@/components/ConnectWallet/ConnectWallet'
import { useStoreWallet } from '@/components/ConnectWallet/walletContext'
import { GradientButton } from '../gradient-button'
import { useUserProfile } from '@/provider/providerContext'
import { Match, UserProfile } from '@/type/types'
import { useContractInteractions } from '@/hooks/useContractInteractions'
import { connect } from '@starknet-io/get-starknet';
import { getUserMatches } from '@/utils/GetUserMatches'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const routes = [
    { path: '/', label: 'Home', value: 'home' },
    { path: '/people', label: 'People', value: 'people' },
    { path: '/analAIse', label: '✨ analAIse', value: 'analAIse' },
    { path: '/privacy', label: 'Privacy', value: 'privacy' },
]

export function Navbar() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const isConnected = useStoreWallet(state => state.isConnected);
    const addressAccount = useStoreWallet(state => state.address);
    const [ showBalanceModal, setShowBalanceModal ] = useState<boolean>(false);

    const { userProfileData, setUserProfileData, setIsPremiumUser, allUsersAddress, balance, setBalance, setAllUsersAddress, setAllUsersData, setCurrentMatches } = useUserProfile();

    const { getAllUsers, isPremiumUser, getBalance, withdrawBalance } = useContractInteractions();

    // console.log(connect({ modalMode: "canAsk" }));


    const initialiseWebpage = async () => {

        const _isPremiumUser: boolean = await isPremiumUser(addressAccount)
        console.log("Is premium User", _isPremiumUser)
        setIsPremiumUser(_isPremiumUser);

        const _balance: Number = (await getBalance(addressAccount))
        console.log("got User Balance", _balance)
        setBalance(_balance)

        const _userData: UserProfile = (await getUsersData([addressAccount]))[0];
        console.log("got Current User Data", _userData)
        setUserProfileData(_userData)

        const _userMatches: Match[] = (await getUserMatches(addressAccount));
        console.log("got Current User matches", _userMatches)
        setCurrentMatches(_userMatches)

        const _usersAddress = await getAllUsers();
        console.log("Got All Users Address:", _usersAddress);
        setAllUsersAddress(_usersAddress as Address[]);

        const _usersData: UserProfile[] = await getUsersData(_usersAddress ?? []);
        console.log("got All Users Data", _usersData)
        setAllUsersData(_usersData)
    }

    useEffect(() => {
        if (isConnected && addressAccount)
            initialiseWebpage()
    }, [isConnected, addressAccount])

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
    };

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const currentTab = routes.find(route => route.path === pathname)?.value || 'home'

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold">
                            ✨StarKonnect
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Tabs value={currentTab}>
                            <TabsList>
                                {routes.map((route) => (
                                    <Link key={route.value} href={route.path} passHref>
                                        <TabsTrigger value={route.value} asChild>
                                            <span>{route.label}</span>
                                        </TabsTrigger>
                                    </Link>
                                ))}
                            </TabsList>
                        </Tabs>
                        <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        {!isConnected ? <ConnectWallet /> :(
                            <div className='flex gap-4 items-center justify-center'>
                                <AlertDialog open={showBalanceModal} onOpenChange={setShowBalanceModal}>
                                    <AlertDialogTrigger asChild>
                                        <GradientButton onClick={() => {
                                            setShowBalanceModal(true);
                                        }}>
                                            Check Balance
                                        </GradientButton>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Your Current Balance : {balance as number} STRK </AlertDialogTitle>
                                            {/* <AlertDialogDescription>
                                                Your Current balance is 
                                            </AlertDialogDescription> */}
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={withdrawBalance}>Withdraw</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <GradientButton onClick={() => {
                                    useStoreWallet.setState({ isConnected: false });
                                }}
                                >
                                    {formatAddress(addressAccount)}
                                </GradientButton>
                            </div>
                        )
                        }

                        {isConnected && (userProfileData ? (
                            <Link href={`/profile/${addressAccount}`}>
                                <Avatar>
                                    <AvatarImage src={`https://github.com/${userProfileData?.githubUsername}.png`} alt={userProfileData?.name} />
                                </Avatar>
                            </Link>
                        ) : (
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${addressAccount}`} alt={addressAccount} />
                                </Avatar>
                        ))
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

