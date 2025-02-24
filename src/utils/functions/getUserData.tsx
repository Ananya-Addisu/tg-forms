import { Query } from "appwrite";
import { account, database, functions } from "../appwrite/Appwrite"
import { setStorageItem } from "./setStorageItem"
import { getStorageItem } from "./getStorageItem";



export async function getUserData(telegram_id: string) { 
    // if session already exists just fetch the forms direcrly
    try {
        const user = await account.get();
        if (user) {
            // console.log('session detected so getting forms')
            const forms = await database.listDocuments(
                "66a0bb690022ca66f9c3",
                '66a0bb9e0034dbfdde6d',                // Collection ID
                [
                    Query.equal("creator", telegram_id)
                ]          // Document ID
            );
            // console.log(forms)
            return forms.documents
        }
    } catch (e) {
        console.log(e)
        // check if a secret exists in telegram cloud 
        // let secret: any
        // await getStorageItem("secret").then((sec: any) => {
        //     secret = sec
        //     console.log('secret', secret)
        // }).catch((err) => {
        //     console.log(err)
        //     secret = null
        // })
        // if the secret exisrts create a session 
        // if (secret) {
        //     console.log('creating session with secret from cloud storage')
        //     const session = await account.createSession(
        //         telegram_id.toString(),
        //         secret,
        //     ).then((res) => {
        //         console.log(res)
        //         // if the token is invald delete the secret and create a new session

        //         setStorageItem('secret', null)

        //     });
        //     const forms = await database.listDocuments(
        //         "66a0bb690022ca66f9c3",
        //         '66a0bb9e0034dbfdde6d',                // Collection ID
        //         [
        //             Query.equal("creator", telegram_id)
        //         ]          // Document ID
        //     );
        //     return forms.documents
        // }
        // else {
        console.log('getting session and forms')

        // just for now 
        const userData = {
            telegram_id: telegram_id,
            name: window.Telegram.WebApp.initDataUnsafe.user?.first_name + ' ' + window.Telegram.WebApp.initDataUnsafe.user?.last_name,
            username: window.Telegram.WebApp.initDataUnsafe.user?.username,
            profile_pic: window.Telegram.WebApp.initDataUnsafe.user?.photo_url,
        }

        const promise = await functions.createExecution(
            '66a4ab4e0026fb046d0c',
            JSON.stringify(userData),
        )
        // console.log(promise)
        const resp = JSON.parse(promise.responseBody)
        // console.log(resp)
        if (resp.status === 'success') {
            const secret = resp.secret
            setStorageItem('secret', secret)
            const session = await account.createSession(
                telegram_id.toString(),
                secret,
            ).then((res) => {
                // console.log(res)
            })

                return resp.data.forms
        }
    }
}
