"use client"

import { database } from '@/utils/appwrite/Appwrite'
import Button from '@/components/Button'
import { ID, Query } from 'appwrite'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useStore } from '@/zustand/store'
import Text from '@/components/Text'
import { useToast } from '@/components/ui/use-toast'

export default function Fill(context: any) {
    const { id } = context.params
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState([])
    const [doesntExist, setDoesntExist] = useState(false)
    const [survey, setSurvey] = useState({
        title: 'Loading...',
        description: 'Loading...'
    })
    const [response, setResponse] = useState<any>({})
    const [formAlreadyFilled, setFormAlreadyFilled] = useState(false)
    const [formIsClosed, setFormIsClosed] = useState(false)
    const [modifyResponse, setModifyResponse] = useState(false)

    const { scriptLoaded } = useStore(state => state)

    const router = useRouter()

    function extractTelegramId() {
        const unextracted = window.Telegram.WebApp.initData
        const extracted = decodeURIComponent(unextracted)
        // console.log(extracted)
        const telegram_id: number = JSON.parse(extracted.split('&')[0].split('=')[1]).id
        // console.log(telegram_id)
        return telegram_id.toString()
    }

    function updateShortAnswer(answer: string, id: any) {
        // @ts-ignore
        setForm(form.map((question: any) => {
            if (question.id === id) {
                // incase answer doesn't exist creat it 
                const newQ = { ...question, answer: answer }
                return newQ
            }
            return question
        }))
    }

    function updateMultipleChoice(id: any, option_id: any) {
        // @ts-ignore
        setForm(form.map((question: any) => {
            if (question.id === id) {
                // incase answer doesn't exist creat it 
                const options = question.options.map((option: any) => {
                    if (option.id == option_id) {
                        const newOp = { ...option, ischecked: !option.ischecked }
                        return newOp
                    }
                    return option
                })
                const qwithOp = { ...question, options }
                return qwithOp
            }
            return question
        }))

    }

    const updateResponse = () => {
        database.updateDocument(
            '66a0bb690022ca66f9c3',
            "66a0c535000c3f4e13ae",
            response.$id,
            {
                structure: JSON.stringify(form)
            }
        ).then(() => {
            toast({
                title: 'Response Updated',
            })
            setModifyResponse(false)
        }).catch((e) => {
            console.log(e)
        })
    }

    const submitForm = () => {
        database.createDocument(
            '66a0bb690022ca66f9c3',
            "66a0c535000c3f4e13ae",
            ID.unique(),
            {
                'form': id,
                'structure': JSON.stringify(form),
                'profiles': extractTelegramId(),

            }
        ).then((response) => {
            setFormAlreadyFilled(true)
            // console.log(response)
            toast({
                title: 'Response Sumbitted',
            })
            setForm(JSON.parse(response.structure))
        })
    }

    const getAlltheForms = async () => {

        // check if user has already filled the form
        // try to fetch the response 
        database.listDocuments(
            '66a0bb690022ca66f9c3',
            '66a0c535000c3f4e13ae',
            [
                Query.equal('profiles', extractTelegramId()),
                Query.equal('form', id),
            ]
        ).then((response) => {
            // console.log(response)
            if (response.total == 1) {
                // user has already submitted a response
                setFormAlreadyFilled(true)
                if (response.documents[0].form.isClosed) {
                    setFormIsClosed(true)
                    setLoading(false)
                    return
                }
                setForm(JSON.parse(response.documents[0].structure))
                setSurvey(response.documents[0].form)
                setResponse(response.documents[0])
                setLoading(false)
            } else {
                database.getDocument(
                    '66a0bb690022ca66f9c3',
                    '66a0bb9e0034dbfdde6d',
                    id,
                ).then((response: any) => {
                    // console.log(response)
                    setForm(JSON.parse(response.structure))
                    setSurvey(response)
                    setLoading(false)
                }
                )
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    // console.log(window.Telegram.WebApp.initDataUnsafe)

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
        getAlltheForms()
    }, [])

    // funciton that makes sure all required fields are filled


    if (doesntExist) {
        return (
            <div style={{ background: window.Telegram.WebApp.themeParams.bg_color, color: window.Telegram.WebApp.themeParams.text_color }} className='py-2 min-h-screen px-2 flex flex-col'>
                <div>Something went wrong</div>
            </div>
        )
    }

    if (!scriptLoaded) {
        return (
            <div className='h-screen flex bg-transparent items-center justify-center'>
                <Text content='...loading' tw='text-xl text-center mt-4' />
            </div>
        )
    }
    if (loading) {
        return (<div style={{ background: window.Telegram.WebApp.themeParams.bg_color, color: window.Telegram.WebApp.themeParams.text_color }} className='h-screen flex bg-transparent items-center justify-center'>
            <Text content='...fetching' tw='text-xl text-center mt-4' />
        </div>)
    }
    // if (formIsClosed) {
    //     return (
    //         <div style={{ background: window.Telegram.WebApp.themeParams.bg_color, color: window.Telegram.WebApp.themeParams.text_color }} className='py-2 min-h-screen px-2 justify-center items-center flex flex-col pb-16'>
    //             <Text content='This Form is no longer accepting responses' tw='' />
    //             {/* <Button tw='rounded-lg mt-3' center={false} primary title='Modify Response' action={() => { }} /> */}
    //         </div>
    //     )
    // }
    if (formAlreadyFilled && !modifyResponse) {
        return (
            <div style={{ background: window.Telegram.WebApp.themeParams.bg_color, color: window.Telegram.WebApp.themeParams.text_color }} className='py-2 min-h-screen px-2 justify-center items-center flex flex-col pb-16'>
                <Text content='Your response has been recorded' tw='' />
                {formIsClosed
                    ? <Text content='This Form is no longer accepting responses' tw='' />
                    : <Button tw='rounded-lg mt-3' center={false} primary title='Modify Response' action={() => setModifyResponse(true)} />
                }

            </div>
        )
    }

    return (
        <div style={{ background: window.Telegram.WebApp.themeParams.bg_color, color: window.Telegram.WebApp.themeParams.text_color }} className='py-2 min-h-screen px-2 flex flex-col '>
            <p className='text-2xl mb-1'>{survey.title}</p>
            <p className='text-sm opacity-55 mb-4'>{survey.description}</p>
            {form.map((form: any, index) => (
                <div key={index} style={{ background: window.Telegram.WebApp.themeParams.secondary_bg_color }} className='mt-3  rounded-lg px-4  py-3'>
                    <p className='text-lg'>{form.title}</p>
                    {form.type === 'short-answer' &&
                        <div className='px-3'>
                            <input type='text' value={form.answer} onChange={(e) => updateShortAnswer(e.currentTarget.value, form.id)} className='border-b mt-3 mb-1 border-gray-300 outline-none bg-transparent px-2 py-1 w-full ' placeholder='Short Answer' />
                        </div>
                    }
                    {form.type === 'multiple-choice' &&
                        <div className='px-3 mt-3'>
                            {/* <input disabled type='text' className='border-b mt-3 mb-1 border-gray-300 outline-none bg-transparent rounded px-2 py-1 w-full ' placeholder='Multiple Choice' /> */}
                            <div>
                                {form.options.map((option: any, index: any) => (
                                    <div className='flex  mt-1 items-center ' key={index}>
                                        <div className='gap-1 flex items-center cursor-pointer' onClick={() => updateMultipleChoice(form.id, option.id)}>
                                            <input checked={option.ischecked} type='checkbox' className='border-b  border-gray-300 outline-none bg-transparent rounded px-2 py-1' />
                                            <p className='outline-none  rounded px-2 py-1' >{option.title}</p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    }
                    <div className='flex items-center mt-1   justify-end'>
                        {form.is_required &&
                            <p className=' text-xs '>Required</p>
                        }
                        {/* <input size={33} checked={form.is_required} onChange={() => updateIsRequired(form.id)} type='checkbox' className='outline-none ' /> */}
                    </div>
                </div>
            ))}
            {modifyResponse
                ? <Button center primary title='Update' tw='w-full mt-16 rounded-lg' action={() => updateResponse()} />
                : <Button center primary title='Submit' tw='w-full mt-16  rounded-lg' action={() => submitForm()} />
            }
        </div>
    )
}