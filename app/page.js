// import { redirect } from 'next/navigation';
// import Page from './(auth)/sign-in/[[...sign-in]]/page';
// // import DashboardBox from './dashboard/_components/DashboardBox';


// export default function Home() {
//   // This will redirect users to the dashboard page
//   Page();
//         // <DashboardBox />
//   redirect('/dashboard');

// }

// app/page.js
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  // Not logged in → go to sign-in (public page)
  if (!userId) {
    redirect("/sign-in");
  }

  // Logged in → go to dashboard
  redirect("/dashboard");
 
}
