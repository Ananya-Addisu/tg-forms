"use client"
import { database } from '@/utils/appwrite/Appwrite'
import Button from '@/components/Button'
import { useStore } from '@/zustand/store'
import { ID } from 'appwrite'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
type Props = {}

export default function CreateForm({ }: Props) {


    const router = useRouter()
    const { toast } = useToast()
    const { themeStore } = useStore(state => state)
    const [forms, setForms] = useState([
        {
            id: 1,
            title: 'Question',
            type: 'short-answer',
            answer: '',
            is_required: false,
            options: [
                {
                    id: 1,
                    title: 'Option 1',
                    ischecked: false
                }
            ]
        },
        {
            id: 2,
            title: 'Question',
            type: 'multiple-choice',
            answer: '',
            is_required: false,
            options: [
                {
                    id: 1,
                    title: 'Option 1',
                    ischecked: false
                }
            ]
        }
    ])

    const [surveyTitle, setSurveyTitle] = useState('Untitled Survey')
    const [surveyDescription, setSurveyDescription] = useState('Description')
    const { usersForms, setUsersForms } = useStore(state => state)
    // create a function taht will delete the attribute "id" key from the forms array 

    function extractTelegramId() {
        const unextracted = window.Telegram.WebApp.initData
        const extracted = decodeURIComponent(unextracted)
        // console.log(extracted)
        const telegram_id: number = JSON.parse(extracted.split('&')[0].split('=')[1]).id
        // console.log(telegram_id)
        return telegram_id.toString()
    }

    // console.log(removeID())
    const createSurvey = () => {
        const promise = database.createDocument(
            '66a0bb690022ca66f9c3',
            '66a0bb9e0034dbfdde6d',
            ID.unique(),
            {
                title: surveyTitle,
                description: surveyDescription,
                creator: extractTelegramId(),
                structure: JSON.stringify(forms)
            }
        )

        promise.then(function (response) {
            router.push('/')
            toast({
                title: 'Form Created',
                // description: 'No longer accepting responses'
            })
            setUsersForms([...usersForms, response])
            console.log(response);
        }, function (error) {
            console.log(error);
        });

    }

    function changeTypeOfForm(id: number, type: string) {
        setForms((prevForms) => {
            return prevForms.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        type
                    }
                }
                return form
            })
        })
    }

    function handleFormTitleChange(id: number, title: string) {
        setForms((prevForms) => {
            return prevForms.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        title
                    }
                }
                return form
            })
        })
    }

    function handleOptionTitleChange(optionId: number, formId: number, title: string) {
        setForms((prevForms) => {
            return prevForms.map((form) => {
                if (form.id === formId) {
                    return {
                        ...form,
                        options: form.options.map((option) => {
                            if (option.id === optionId) {
                                return {
                                    ...option,
                                    title
                                }
                            }
                            return option
                        })
                    }
                }
                return form
            })
        })
    }

    function addOption(id: number) {
        setForms((prevForms) => {
            return prevForms.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        options: [
                            ...form.options,
                            {
                                id: form.options.length + 1,
                                title: 'Option ' + (form.options.length + 1),
                                ischecked: false
                            }
                        ]
                    }
                }
                return form
            })
        })
    }

    function removeOption(optionId: number, formId: number) {
        setForms((prevForms) => {
            return prevForms.map((form) => {
                if (form.id === formId) {
                    return {
                        ...form,
                        options: form.options.filter((option) => option.id !== optionId)
                    }
                }
                return form
            })
        })
    }

    function updateIsRequired(id: number) {
        setForms((prevForms) => {
            return prevForms.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        is_required: !form.is_required
                    }
                }
                return form
            })
        })
    }

    function addForm() {
        setForms((prevForms) => {
            return [
                ...prevForms,
                {
                    id: prevForms.length + 1,
                    title: 'Question',
                    type: 'short-answer',
                    answer: '',
                    is_required: false,
                    options: [
                        {
                            id: 1,
                            title: 'Option 1',
                            ischecked: false
                        }
                    ]
                }
            ]
        })
    }

    function removeForm(id: number) {
        setForms((prevForms) => {
            return prevForms.filter((form) => form.id !== id)
        })
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

    if (window.Telegram === undefined) {
        return router.push('/')
    }

    return (
        <div style={{ background: window.Telegram.WebApp.themeParams.bg_color, color: window.Telegram.WebApp.themeParams.text_color }} className='py-2 min-h-screen px-2  flex flex-col'>
            <div className='mt-3'>
                <div>
                    <input type='text' placeholder='Survey Title' value={surveyTitle} onChange={(e) => setSurveyTitle(e.currentTarget.value)} className=' border-b text-2xl border-gray-300 outline-none bg-transparent  px-2 py-3 w-full' />
                </div>
                <div>
                    <textarea value={surveyDescription} onChange={(e) => setSurveyDescription(e.currentTarget.value)} className=' border-b outline-none border-gray-300 bg-transparent  px-2 py-3 w-full mt-3' placeholder='Description'></textarea>
                </div>
            </div>
            {forms.map((form) => (
                <div key={form.id} style={{ background: window.Telegram.WebApp.themeParams.secondary_bg_color }} className='mt-3  rounded-lg   px-4  py-3'>
                    <div className='flex justify-between'>
                        <input value={form.title} onChange={(e) => handleFormTitleChange(form.id, e.currentTarget.value)} type='text' className='border-b border-gray-300 outline-none  bg-transparent px-2 pb-2.5 py-1 w-full mt-2' placeholder='Question' />
                        {forms.length > 1 && <X size={16} onClick={() => removeForm(form.id)} className='opacity-50 ml-auto' />

                        }
                        {/* <X size={16} onClick={() => removeForm(form.id)} className='opacity-50 ml-auto' /> */}
                    </div>
                    {form.type === 'short-answer' &&
                        <div className='px-3'>
                            <input disabled type='text' className='border-b mt-3 mb-1 border-gray-300 outline-none bg-transparent px-2 py-1 w-full ' placeholder='Short Answer' />
                        </div>
                    }
                    {form.type === 'multiple-choice' &&
                        <div className='px-3 mt-3'>
                            {/* <input disabled type='text' className='border-b mt-3 mb-1 border-gray-300 outline-none bg-transparent rounded px-2 py-1 w-full ' placeholder='Multiple Choice' /> */}
                            <div>
                                {form.options.map((option, index) => (
                                    <div className='flex  mt-1 items-center ' key={index}>
                                        <div className='gap-1 flex'>
                                            <input type='checkbox' disabled className='border-b  border-gray-300 outline-none bg-transparent rounded px-2 py-1  ' placeholder='Option 1' />
                                            <input type='text' onChange={(e) => handleOptionTitleChange(option.id, form.id, e.currentTarget.value)} className=' outline-none bg-transparent rounded px-2 py-1  ' value={option.title} placeholder='Option 1' />
                                        </div>
                                        {form.options.length > 1 &&
                                            <button className='w-full ml-1'>
                                                <X size={19} onClick={() => removeOption(option.id, form.id)} className=' cursor-pointer ' />

                                            </button>
                                        }
                                        {/* <X size={16} onClick={() => removeOption(option.id, form.id)} className='opacity-50 ml-auto' /> */}
                                    </div>
                                ))}
                                <div className='flex gap-1 mt-1 items-center ' >
                                    <input type='checkbox' disabled className='outline-none bg-transparent rounded px-2 py-1  ' placeholder='Option 1' />
                                    <button onClick={() => addOption(form.id)} className='w-full text-start outline-none bg-transparent text-gray-400  rounded px-2 py-1  '>
                                        Add Option
                                    </button>
                                    {/* <X size={16} className='opacity-50 ml-auto' /> */}
                                </div>
                            </div>
                        </div>
                    }

                    <div>
                        <select title='Form Type' onChange={(e) => changeTypeOfForm(form.id, e.currentTarget.value)} value={form.type} style={{ background: themeStore.section_bg_color, }} className=' rounded px-2  py-3 w-full mt-3 mb-3'>
                            <option value='short-answer'>Short Answer</option>
                            <option value='multiple-choice'>Multiple Choice</option>
                            {/* <option value='number'>Number</option>
                            <option value='email'>Email</option>
                            <option value='date'>Date</option>
                            <option value='time'>Time</option>
                            <option value='tel'>Phone</option>
                            <option value='url'>URL</option> */}
                        </select>
                    </div>
                    <div className='flex items-center gap-3 justify-end'>
                        <p>Required</p>
                        <input size={33} checked={form.is_required} onChange={() => updateIsRequired(form.id)} type='checkbox' className='outline-none ' />
                    </div>
                </div>
            ))}

            <button onClick={addForm} style={{ background: window.Telegram.WebApp.themeParams.secondary_bg_color }} className='py-3 px-3 rounded-full mb-16 self-end mt-3'>
                <Plus size={24} />
            </button>
            {/* <button onClick={() => createSurvey()} className='py-3 bg-orange-500 px-3  border border-gray-300 text-white font-bold w-full  self-center  fixed bottom-0'>Create Survey</button> */}
            {/* <Button tw={''} title='Add Form' action={addForm} /> */}
            <Button primary center tw={'w-full rounded-xl'} title='Create Survey' action={createSurvey} />

        </div>
    )
}