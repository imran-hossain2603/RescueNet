import type { Metadata } from 'next'; import './globals.css';
export const metadata:Metadata={title:'FloodResponse | Rescue Coordination',description:'Flood emergency rescue request and resource coordination platform.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
