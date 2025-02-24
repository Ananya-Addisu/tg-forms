
import ArchivedComp from "@/components/ArchivedComp";
import FormsList from "@/components/FormsList";
import MainContainer from "@/components/MainContainer";

import { redirect } from "next/navigation";
export default function Home(context: any) {
  console.log(context)

  const tgWebAppStart = context.searchParams.tgWebAppStartParam
  console.log(tgWebAppStart)
  if (tgWebAppStart) {
    const form_link = '/forms/fill/' + tgWebAppStart
    console.log(form_link)
    redirect(form_link)
    // router.push(form_link)
  }
// console.log(window.Telegram.WebApp.initDataUnsafe.user)
  return (
    <MainContainer>
      <div className="mb-28">
        {/* <h1 className="text-3xl font-bold text-center">Telegram Forms</h1> */}
        {/* <Text tw="px-3" content="Welcome to telegram forms a place where we"/> */}
        <FormsList/>
      </div>
    <ArchivedComp/>
    </MainContainer>
  );
}
