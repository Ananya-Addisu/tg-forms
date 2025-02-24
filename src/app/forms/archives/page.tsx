"use client"

import Button from '@/components/Button'
import MainContainer from '@/components/MainContainer'
import Text from '@/components/Text'
import { database } from '@/utils/appwrite/Appwrite'
import { useStore } from '@/zustand/store'
import { Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {}

export default function Archive({ }: Props) {

    const { usersForms, setUsersForms, themeStore } = useStore(state => state)
    const router = useRouter()

    async function unarchiveSurvey(id: string) {
        setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isArchived = false
            }
            return form
        }))
        const resp = await database.updateDocument('66a0bb690022ca66f9c3', '66a0bb9e0034dbfdde6d', id, { isArchived: false })
        // if it fails roll back the update 
        if (!resp) setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isArchived = false
            }
            return form
        }))
    }

    useEffect(() => {
        const tg = window.Telegram.WebApp;

        // Show the back button
        tg.BackButton.show();

        // Handle the back button click
        tg.BackButton.onClick(() => {
            // Perform the action you want when the back button is clicked
            // For example, navigate to the previous page or close the app
            router.push('/')
            console.log('Back button clicked');
        });

        // Cleanup function to hide the back button when the component unmounts
        return () => {
            tg.BackButton.hide();
        };
    }, []);

    if (usersForms.filter((form: any) => form.isArchived == true).length == 0) {
        return (
            <MainContainer>
                <div className='h-screen flex items-center justify-center'>
                    <Text content='No archived forms' tw='text-xl text-center mt-4' />
                </div>
            </MainContainer>
        )
    }
    return (
        <MainContainer>
            <div className='px-2'>
                {usersForms.filter((form: any) => form.isArchived == true).map((survey: any, index: number) => {
                    return (
                        <div key={index} style={{ background: window.Telegram.WebApp.themeParams.secondary_bg_color }} className='flex flex-col rounded-lg px-3 py-2 mt-3 shadow-md'>
                            <div className='flex justify-between '>
                                <div>
                                    <Text content={survey.title} tw='text-xl ' />
                                </div>
                                <Link href={`/forms/edit/${survey.$id}`}>
                                    <Edit className='mt-1' size={19} color={themeStore.hint_color} />
                                </Link>
                            </div>
                            <div className='flex justify-between py-3'>
                                <div className='flex'>
                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full' width={33} height={33} />
                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} />
                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} />
                                </div>
                                <Text tw=' flex gap-1 items-center text-opacity-30' content={"23 responses"} />
                            </div>

                            {/* <Button center={false} primary tw='w-full rounded-lg mb-1' title='Open Survey' action={() => openSurvey(survey.$id)} /> */}
                            <Button center={false} primary tw='w-full mb-1 rounded-lg ' title='Unarchive Survey' action={() => unarchiveSurvey(survey.$id)} />
                            {/* <Button center={false} primary={false} tw='w-full rounded-lg ' title='Delete Survey Data' action={() => { }} /> */}
                        </div>
                    )
                }
                )}
            </div>
        </MainContainer>

    )
}