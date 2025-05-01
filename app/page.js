import { redirect } from 'next/navigation';
import Page from './(auth)/sign-in/[[...sign-in]]/page';


export default function Home() {
  // This will redirect users to the dashboard page
  Page();
  redirect('/dashboard');
}
