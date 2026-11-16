import { NextResponse } from 'next/server'; import { cookies } from 'next/headers';
export async function POST(){(await cookies()).delete('flood_session');return NextResponse.json({ok:true});}
