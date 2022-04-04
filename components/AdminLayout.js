import Head from 'next/head'
import AdminNav from './AdminNav'
import AppContext from "../AppContext";
import React, {useContext } from 'react';



export default function AdminLayout({ children }) {
    const value = useContext(AppContext);

    const MenuItems = () => {
        return(
            <div className="flex flex-col text-white gap-1 h-10 items-center font-bold w-full">
                {value.menuItems.map((item,index)=>(
                    <a 
                        key={index.toString()}
                        className="p-2 hover:text-yellow-400 hover:bg-white/10 w-full cursor-pointer" 
                        href={item.href}
                    >
                        {item.name}
                    </a>
                ))}
            </div>
        )
    }

    return (
        <div className="bg-gray-200 min-h-screen ">
            <Head>
                <title>cosmos odyssey</title>
                <meta name="description" content="cosmos odyssey | Admin" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg-gray-900 flex fixed z-10 w-full h-10 p-2 items-center justify-between">
                <p className="text-xl font-bold text-white cursor-default">cosmos odyssey</p>
                <AdminNav/>           
            </div>
                <div className="h-10"></div>
                {value.menuOpen
                ?<div className="fixed z-50 sm:hidden bg-gray-900/95 h-full w-full flex justify-center text-lg overflow-y-auto overscroll-none">
                    <MenuItems/>
                </div>
                :<></>
                }

            <div className="container mx-auto z-0 p-1 bg-white">
                <div className="">
                    {children}
                </div>
            </div>
        </div>
    )
  }
  