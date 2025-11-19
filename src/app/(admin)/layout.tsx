import Menu from "@/components/Menu"; 
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="h-[133.3vh] flex">
        {/* 왼쪽 메뉴바 화면 */}
        <div className="w-[16%] bg-red-700 p-4 flex flex-col">
        <Link
         href="/" 
         className="flex items-center justify-center lg:justify-center gap-2"
         >
        <Image className="mt-3" src="/logo.png" alt="훌라후프 레드 로고" width={180} height={180}/>
        </Link>
        <Menu/>
        </div>
        {/* 오른쪽 화면 */}
        <div className="w-[84%] bg-[#F7F8FA] overflow-scroll overflow-x-hidden">
          <Navbar/>
          {children}
        </div>
      </div>    
  );
}
