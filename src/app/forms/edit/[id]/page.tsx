"use client"




import React, { useEffect } from 'react'
import { database } from '@/utils/appwrite/Appwrite'
import { Query } from 'appwrite'
import Button from '@/components/Button'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/zustand/store'
import { useToast } from '@/components/ui/use-toast'

type Props = {}

export default function EditForm(context: any) {
    const { id } = context.params
    const [form, setForm] = React.useState<any>([])
    const [structure, setStructure] = React.useState([])
    const router = useRouter()
    const { toast } = useToast()
    const { usersForms, setUsersForms, themeStore } = useStore(state => state)
    // console.log(id)

    async function dedleteForm() {

    }

    function updateForm() {
        database.updateDocument(
            '66a0bb690022ca66f9c3',
            '66a0bb9e0034dbfdde6d',
            id,
            {
                'structure': JSON.stringify(structure),
                'title': form.title,
                'description': form.description
            }
        ).then((response) => {
            // console.log(response)
            if (response) {
                setUsersForms(usersForms.map((form: any) => {
                    if (form.$id == id) {
                        return response
                    }
                    return form
                }))
                toast({
                    title: 'Form Updated',
                    // description: 'No longer accepting responses'
                })
                router.push('/')
            } else {
                console.log('error updating the form')
            }
        })
    }

    function handleFormTitleChange(id: number, title: string) {
        setStructure((prevForms: any) => {
            return prevForms.map((form: any) => {
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

    function changeTypeOfForm(id: number, type: string) {
        setStructure((prevForms: any) => {
            return prevForms.map((form: any) => {
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

    function handleOptionTitleChange(optionId: number, formId: number, title: string) {
        setStructure((prevForms: any) => {
            return prevForms.map((form: any) => {
                if (form.id === formId) {
                    return {
                        ...form,
                        options: form.options.map((option: any) => {
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
        setStructure((prevForms: any) => {
            return prevForms.map((form: any) => {
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
        setStructure((prevForms: any) => {
            return prevForms.map((form: any) => {
                if (form.id === formId) {
                    return {
                        ...form,
                        options: form.options.filter((option: any) => option.id !== optionId)
                    }
                }
                return form
            })
        })
    }

    function updateIsRequired(id: number) {
        setStructure((prevForms: any) => {
            return prevForms.map((form: any) => {
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
        // @ts-ignore
        setStructure((prevForms) => {
            return [
                ...prevForms,
                {
                    id: prevForms.length + 1,
                    title: 'Question',
                    type: 'short-answer',
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
        setStructure((prevForms: any) => {
            return prevForms.filter((form: any) => form.id !== id)
        })
    }

    function extractTelegramId() {
        const unextracted = window.Telegram.WebApp.initData
        const extracted = decodeURIComponent(unextracted)
        // console.log(extracted)
        const telegram_id: number = JSON.parse(extracted.split('&')[0].split('=')[1]).id
        // console.log(telegram_id)
        return telegram_id.toString()
    }

    function getForm() {
        database.listDocuments(
            '66a0bb690022ca66f9c3',
            '66a0bb9e0034dbfdde6d',
            // id.toString(),
            [
                Query.equal('$id', id),
                Query.equal('creator', extractTelegramId())
            ]
        ).then((response: any) => {
            console.log(response)
            setForm(response.documents[0])
            setStructure(JSON.parse(response.documents[0].structure))
        }
        )
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
        if (usersForms.length == 0) {
            getForm()
        } else {
            // get the form from the usersForms by the $id 
            const form = usersForms.find((form: any) => form.$id == id)
            setForm(form)
            setStructure(JSON.parse(form.structure))
        }

    }, [])

    return (
        <div style={{ background: themeStore.bg_color, color: themeStore.text_color }} className='py-2 min-h-screen px-2 flex flex-col pb-16'>
            <div className='mt-3'>
                <div>
                    <input type='text' placeholder='Survey Title' value={form.title} onChange={(e) => setForm({ ...form, title: e.currentTarget.value })} className=' border-b text-2xl border-gray-300 outline-none bg-transparent  px-2 py-3 w-full' />
                </div>
                <div>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.currentTarget.value })} className=' border-b outline-none border-gray-300 bg-transparent  px-2 py-3 w-full mt-3' placeholder='Description'></textarea>
                </div>
            </div>

            {structure.map((form: any, index) => (
                <div key={index} style={{ background: themeStore.secondary_bg_color }} className='mt-3  rounded-lg   px-4  py-3'>
                    {/* <p className='text-lg'>{form.title}</p> */}
                    <div className='flex justify-between'>
                        <input value={form.title} onChange={(e) => handleFormTitleChange(form.id, e.currentTarget.value)} type='text' className='border-b border-gray-300 outline-none  bg-transparent px-2 pb-2.5 py-1 w-full mt-2' placeholder='Question' />
                        {structure.length > 1 &&
                            <X size={26} onClick={() => removeForm(form.id)} className='opacity-80 -mt-2 right-3 absolute ' />
                        }
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
                                {form.options.map((option: any, index: any) => (
                                    <div className='flex  mt-1 items-center ' key={index}>
                                        <div className='gap-1 flex'>
                                            <input type='checkbox' className='border-b  border-gray-300 outline-none bg-transparent rounded px-2 py-1  ' />
                                            <input type='text' onChange={(e) => handleOptionTitleChange(option.id, form.id, e.currentTarget.value)} className=' outline-none bg-transparent rounded px-2 py-1  ' value={option.title} placeholder='Option 1' />
                                        </div>
                                        {form.options.length > 1 &&
                                            <button className='w-full ml-1'>
                                                <X size={19} onClick={() => removeOption(option.id, form.id)} className=' cursor-pointer ' />

                                            </button>
                                        }
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
                        <select color='red' title='Form Type' onChange={(e) => changeTypeOfForm(form.id, e.currentTarget.value)} value={form.type} style={{ background: themeStore.section_bg_color, }} className=' rounded px-2 outline-none  py-3 w-full mt-3 mb-3'>
                            <option style={{ background: themeStore.section_bg_color, }} value='short-answer'>Short Answer</option>
                            <option style={{ background: themeStore.section_bg_color, }} value='multiple-choice'>Multiple Choice</option>
                            {/* <option value='number'>Number</option>
                            <option value='email'>Email</option>
                            <option value='date'>Date</option>
                            <option value='time'>Time</option>
                            <option value='tel'>Phone</option>
                            <option value='url'>URL</option> */}
                        </select>
                    </div>

                    <div className='flex items-center mt-1  gap-3 justify-end'>
                        <p>Required</p>
                        <input size={33} checked={form.is_required} onChange={() => updateIsRequired(form.id)} type='checkbox' className='outline-none ' />
                        {/* <input size={33} checked={form.is_required} onChange={() => updateIsRequired(form.id)} type='checkbox' className='outline-none ' /> */}
                    </div>
                </div>
            ))}
            <button onClick={addForm} style={{ background: themeStore.secondary_bg_color }} className='py-3 px-3 rounded-full mb-16 self-end mt-3'>
                <Plus size={24} />
            </button>
            <Button center primary title='Update' tw='w-full bottom-0' action={() => updateForm()} />
            {/* <Button title='Delete' tw='w-full fixed bottom-10 ' action={() => updateForm()} /> */}
        </div>
    )
}