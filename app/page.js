import { redirect } from 'next/navigation';
import Page from './(auth)/sign-in/[[...sign-in]]/page';
// import DashboardBox from './dashboard/_components/DashboardBox';


export default function Home() {
  // This will redirect users to the dashboard page
  Page();
        // <DashboardBox />
  redirect('/dashboard');

}
