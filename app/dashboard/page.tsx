import { redirect } from 'next/navigation'; import { getSession } from '@/lib/auth'; import Dashboard from './view';
export default async function DashboardPage(){const user=await getSession();if(!user)redirect('/login');return <Dashboard user={user}/>;}
