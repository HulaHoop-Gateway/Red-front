'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/lib/menuData";

const Menu = () => {
  const pathname = usePathname();

  const mainSection = menuItems.find(i => i.title === "메뉴");
  const otherSection = menuItems.find(i => i.title === "OTHER");

  return (
    <div className="flex flex-col justify-between flex-grow mt-8">
      {/* Main Menu Section */}
      <div>
        {mainSection && (
          <>
            <span className="hidden lg:block text-red-200 font-light my-4 uppercase text-sm">
              {mainSection.title}
            </span>
            <div className="flex flex-col gap-2">
              {mainSection.items.map(item => {
                const isActive = pathname.startsWith(item.href);
                const IconComponent = item.icon; 

                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`
                      flex items-center justify-start gap-4 p-3 rounded-lg transition-colors duration-200
                      ${isActive ? "bg-white font-medium" : "text-white hover:bg-red-800"}
                    `}
                  >
                    <IconComponent 
                      size={25} 
                      className={isActive ? 'text-red-700' : 'text-white'} 
                    />
                    <span className={`block ${isActive ? 'text-red-700' : 'text-white'}`}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Other Menu Section */}
      <div>
        {otherSection && (
          <>
            <span className="hidden lg:block text-red-200 font-light my-4 uppercase text-sm">
              {otherSection.title}
            </span>
            <div className="flex flex-col gap-2">
              {otherSection.items.map(item => {
                const isActive = pathname.startsWith(item.href);
                const IconComponent = item.icon; 

                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`
                      flex items-center justify-start gap-4 p-3 rounded-lg transition-colors duration-200
                      ${isActive ? "bg-white font-medium" : "text-white hover:bg-red-800"}
                    `}
                  >
                    <IconComponent 
                      size={25} 
                      className={isActive ? 'text-red-700' : 'text-white'} 
                    />
                    <span className={`block ${isActive ? 'text-red-700' : 'text-white'}`}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;