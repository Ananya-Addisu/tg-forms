"use client"
import { functions } from '@/utils/appwrite/Appwrite'
import { ExtractTelegramId } from '@/utils/functions/ExtractTelegramId'
import { getUserData } from '@/utils/functions/getUserData'
import { checkHashValidity } from '@/utils/functions/VerifyHash'
import { useStore } from '@/zustand/store'
import Script from 'next/script'
import React from 'react'

type Props = {
    children: React.ReactNode
}

export default function TelegramScript({ children }: Props) {
    const {setIsTelegramMiniApp, setScriptLoaded, setTelegramId, setUserData, setInitData, setThemeStore,setUsersForms} = useStore(state=>state)
    const [loaded, setLoaded] = React.useState(false)

    
    return (
        <main>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy='afterInteractive'
                onLoad={ async () => {
                    setLoaded(true)
                    // console.log(window.Telegram.WebApp.themeParams)
                    if(window.Telegram?.WebApp?.platform == 'unknown') {
                        setIsTelegramMiniApp(false)
                    }else{
                        setThemeStore(window.Telegram?.WebApp?.themeParams)

                        const validTgPlatform =  checkHashValidity(window.Telegram?.WebApp?.initData)
                        if(!validTgPlatform) return
                        setIsTelegramMiniApp(true)
                        // login the user and get the users forms
                        const userForms = await getUserData(ExtractTelegramId(window.Telegram?.WebApp?.initData).toString()) 
                        setUsersForms(userForms)
                        setUserData(window.Telegram?.WebApp?.initDataUnsafe?.user)
                        setTelegramId(ExtractTelegramId(window.Telegram?.WebApp?.initData))
                        setInitData(window.Telegram?.WebApp?.initData)
                        // console.log(window.Telegram?.WebApp?.platform)
                        // console.log('Telegram loaded')
                        // console.log(window.Telegram?.WebApp?.initDataUnsafe?.user)
                    }
                    setScriptLoaded(true)
                }}
            />
            {loaded && children}
        </main>

  )
}