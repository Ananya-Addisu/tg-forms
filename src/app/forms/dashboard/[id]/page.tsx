"use client"

import MainContainer from '@/components/MainContainer'
import Text from '@/components/Text'
import { database } from '@/utils/appwrite/Appwrite'
import { useStore } from '@/zustand/store'
import { Query } from 'appwrite'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'



export default function Page(context: any) {
    const id = context.params.id
    const [rawResponses, setRawResponses] = React.useState<any[]>([])
    const { themeStore, usersForms } = useStore(state => state)
    const [laoding, setLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const [listViewMode, setListViewMode] = useState(false)
    const router = useRouter()

    // fetch the responses of the form with the id
    function getResponses() {
        // check if userData is empty 
        if (usersForms.length == 0) {
        database.listDocuments('66a0bb690022ca66f9c3',
            '66a0bb9e0034dbfdde6d',
            [
                Query.equal('$id', id)
            ]
        ).then((res) => {
            setRawResponses(res.documents[0].response)
            setLoading(false)
            // console.log(res)
        }).catch((e) => {
            setLoading(false)
            console.log(e)
        })
        } else {
            // console.log(usersForms)
            setRawResponses(usersForms.filter((form: any) => form.$id == id)[0].response)
            setLoading(false)
        }

    }

    function organizeData() {
        // organize the data in a way that can be displayed
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
    useEffect(() => {
        getResponses()
    }, [])

    if (laoding) {
        return (
            <MainContainer>
                <div className='h-screen justify-center items-center flex'>
                    <Text content='Loading...' tw='' />
                </div>
            </MainContainer>
        )
    }

    if (rawResponses.length == 0) {
        return (
            <MainContainer>
                <div className='h-screen justify-center items-center flex'>
                    <Text content='No responses yet' tw='' />
                </div>
            </MainContainer>
        )
    }

    return (
        <div style={{ background: window.Telegram.WebApp.themeParams.bg_color, color: window.Telegram.WebApp.themeParams.text_color }} className='py-2 min-h-screen px-2 flex flex-col pb-20'>

            <div className='px-3 mb-10'>
                {/* <Text content='Response' tw='' /> */}
                {/* {rawResponses.map((response) => (
                    <div className='rounded-xl flex justify-between px-2 py-2'>
                        <Text content={response.profiles.name} tw='' />
                        <ChevronRight color={themeStore.hint_color} />
                    </div>
                ))} */}

                {JSON.parse(rawResponses[index].structure).map((form: any, index: number) => (
                    <div key={index} style={{ background: window.Telegram.WebApp.themeParams.secondary_bg_color }} className='mt-1.5  rounded-lg   px-4  py-3'>
                        <p className='text-lg'>{form.title}</p>
                        {form.type === 'short-answer' &&
                            <div className='px-3'>
                                {/* <input type='text' value={form.answer} disabled className='border-b mt-3 mb-1 border-gray-300 outline-none bg-transparent px-2 py-1 w-full ' placeholder='Short Answer' /> */}

                                {typeof form.answer == 'undefined' || form.answer == '' 
                                    ? <p className='px-2 py-1 mt-2 w-full mb-1 text-center text-red-200'>No Response </p>
                                    : <p className='px-2 py-1 mt-2 w-full mb-1'>{form.answer} </p>
                                }
                            </div>
                        }
                        {form.type === 'multiple-choice' &&
                            <div className='px-3 mt-3'>
                                {/* <input disabled type='text' className='border-b mt-3 mb-1 border-gray-300 outline-none bg-transparent rounded px-2 py-1 w-full ' placeholder='Multiple Choice' /> */}
                                <div>
                                    {form.options.map((option: any, index: any) => (
                                        <div className='flex  mt-1 items-center ' key={index}>
                                            <div className='gap-1 flex'>
                                                <input checked={option.ischecked} type='checkbox' className='border-b  border-gray-300 outline-none bg-transparent rounded px-2 py-1' />
                                                <p className='outline-none  rounded px-2 py-1' >{option.title}</p>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        }
                        {/* <div className='flex items-center mt-1   justify-end'>
                    {rawResponses[index].is_required &&
                        <p className=' text-xs '>Required</p>
                    }
                </div> */}
                    </div>
                ))
                }


                {/* <div className='rounded-xl px-2 py-2'>
                    <input style={{ background: themeStore.section_bg_color }} className='w-full rounded-xl px-2 py-2' type="text" placeholder='Search' />
                </div> */}
                <div>

                </div>



            </div>
            <div style={{ background: themeStore.secondary_bg_color, minWidth: '69%' }} className='px-3 py-3 mx-2 rounded-lg flex fixed bottom-3 justify-around shadow-lg self-center items-center'>

                <div>
                    {index == 0 ? <button className='px-3 py-3' ><ChevronLeft size={23} color={themeStore.hint_color} /></button> : <button className='px-3 py-3' onClick={() => setIndex(index - 1)} ><ChevronLeft size={23} color={themeStore.hint_color} /></button>}
                </div>
                <div className='flex flex-col items-center w-full justify-center'>
                    <Image src='/profile.webp' alt="Vercel Logo" className='rounded-full' width={33} height={33} />
                    <p className='text-center mt-1'>{rawResponses[index].profiles.name}</p>
                </div>
                <div>
                    <div>
                        {index == rawResponses.length - 1 ? <button className='px-3 py-3' ><ChevronRight size={23} color={themeStore.hint_color} /></button> : <button onClick={() => setIndex(index + 1)} className='px-3 py-3'><ChevronRight size={23} color={themeStore.hint_color} /></button>}
                    </div>
                </div>
            </div>
        </div>
    )
}