"use client"
import { useStore } from '@/zustand/store'
import React from 'react'
import Text from './Text'
import Link from 'next/link'
import Button from './Button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Box, ChevronRight, ChevronsLeftRight, Copy, Edit, Edit2, Edit2Icon, Edit3, NotebookPen } from 'lucide-react'
import { database } from '@/utils/appwrite/Appwrite'
import { useToast } from './ui/use-toast'

type Props = {}

export default function FormsList({}: Props) {

    const router = useRouter()
    const { toast } = useToast()
    const { scriptLoaded, usersForms, setUsersForms, themeStore } = useStore(state => state)
    // console.log(scriptLoaded)
    const handleCopyLink = (id: any) => {
        const surveyLink = `https://t.me/Formfortelegrambot/TelegramForms?startapp=${id}`;
        navigator.clipboard.writeText(surveyLink)
            .then(() => {
                toast({
                    title: 'Copied',
                    description: 'Share it accross Telegram'
                })
                // Optionally, show a success message or toast notification here
            })
            .catch((error) => {
                console.error('Failed to copy survey link:', error);
                // Optionally, show an error message here
            });
    };
    async function closeSurvey(id: string) {
        setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isClosed = true
            }
            return form
        }))
        toast({
            title: 'Survey Closed',
            description: 'No longer accepting responses'
        })
        const resp = await database.updateDocument('66a0bb690022ca66f9c3', '66a0bb9e0034dbfdde6d', id, { isClosed: true })
        // if it fails roll back the update 
        // console.log(resp)
        if (!resp) setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isClosed = false
            }
            return form
        }))

        // update the usersForms

    }

    async function archiveSurvey(id: string) {
        setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isArchived = true
            }
            return form
        }))
        toast({
            title: 'Survey saved to archives',
            // description: 'No longer accepting responses'
        })
        const resp = await database.updateDocument('66a0bb690022ca66f9c3', '66a0bb9e0034dbfdde6d', id, { isArchived: true })
        // if it fails roll back the update 
        if (!resp) setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isArchived = true
            }
            return form
        }))
    }


    async function openSurvey(id: string) {
        setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isClosed = false
            }
            return form
        }))
        toast({
            title: 'Survey Opened',
            description: 'Accepting responses'
        })
        const resp = await database.updateDocument('66a0bb690022ca66f9c3', '66a0bb9e0034dbfdde6d', id, { isClosed: false })
        // if it fails roll back the update 
        if (!resp) setUsersForms(usersForms.map((form: any) => {
            if (form.$id === id) {
                form.isClosed = true
            }
            return form
        }))
    }

    if(!scriptLoaded){
        return (
            <div className='h-screen bg-transparent flex items-center justify-center'>
                <Text content='...loading' tw='text-xl text-center mt-4' />
            </div>
        )
    }



    if(typeof window.Telegram === 'undefined') return (
        <div className=''>
            Not using telegram
        </div>
    )
    // console.log(usersForms)
    // if (typeof usersForms == 'undefined') {
    //     return (
    //         <div className='h-screen flex items-center justify-center'>
    //             <Text content='loading' tw='text-xl text-center mt-4' />
    //         </div>
    //     )
    // }
    if (usersForms.filter((form: any) => form.isArchived == false).length == 0) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <Text content='No forms created' tw='text-xl text-center mt-4' />
            </div>
        )
    }
  return (
      <div className='px-3 '>
          {usersForms.filter((form: any) => form.isArchived == false).map((survey: any, index: number) => {
                return (
                    <div key={index} style={{ background: window.Telegram.WebApp.themeParams.secondary_bg_color }} className='flex flex-col rounded-lg px-3 py-2 mt-3 shadow-md'>
                        <Link className=' cursor-pointer' href={`/forms/dashboard/${survey.$id}`}> 
                        <div className='flex justify-between '>
                            <div>
                                    <Text content={survey.title} tw='text-lg' />
                            </div>
                            <Link href={`/forms/edit/${survey.$id}`}>
                                <Edit className='mt-1' size={19} color={themeStore.hint_color} />
                            </Link>
                        </div>
                        <div className='flex justify-between py-3'>
                                {survey.response == null
                                    ? <div className='flex w-full items-center justify-end'>
                                        {/* <NotebookPen size={23} color={themeStore.hint_color} /> */}
                                        <Text content='No responses yet' tw='self-end text-opacity-30' />

                                    </div>
                                    : <div className='flex justify-between w-full'>
                                        <div className='flex'>
                                            {survey.response.length > 3 &&
                                                <div className='flex'>
                                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full' width={33} height={33} />
                                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} />
                                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} />
                                                </div>
                                            }
                                            {survey.response.length == 2 &&
                                                <div className='flex'>
                                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full' width={33} height={33} />
                                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} />
                                                    {/* <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} /> */}
                                                </div>
                                            }

                                            {survey.response.length == 1 &&
                                                <div className='flex'>
                                                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full' width={33} height={33} />
                                                    {/* <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} /> */}
                                                    {/* <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full -ml-4' width={33} height={33} /> */}
                                                </div>
                                            }
                                            {/* {survey.response.slice(0, 3).map((resp: any, index: number) => (
                                                <div key={index}>
                                                    {resp?.profiles?.profile_pic == null
                                                    ? <Image src='/profile.webp' alt="Default Profile Picture" className={`rounded-full`} width={33} height={33} />
                                                    : <Image src={resp.profiles.profile_pic} alt="Profile Picture" className='rounded-full' width={33} height={33} />
                                                }
                                            </div>
                                        ))} */}

                                        </div>
                                        <Text tw=' flex gap-1 items-center self-end text-opacity-30' content={`${survey.response.length} responses`} />
                                    </div>
                                }
                            </div>
                        </Link>
                        {survey.isClosed ?
                            <div>
                                <Button center={false} primary tw='w-full rounded-lg mb-1' title='Reopen Survey' action={() => openSurvey(survey.$id)} />
                                <Button center={false} primary={false} tw='w-full  rounded-lg ' title='Archive Survey' action={() => archiveSurvey(survey.$id)} />
                            </div>
                            :
                            <div className='flex w-full justify-between'>
                                <button className='rounded-lg px-3 py-1.5 gap-2 flex items-center justify-end ' onClick={() => handleCopyLink(survey.$id)} ><Text content='Copy Link' tw='text-base' /> <Copy size={20} color={themeStore.text_color} /></button>

                                <Button center={false} primary tw='w-full rounded-lg mt-auto mb-1' title='Close Survey' action={() => closeSurvey(survey.$id)} />
                            </div>
                        }
                    </div>
                )
            }
            )}
    </div>
  )

}