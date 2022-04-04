import Image from 'next/image'
import Head from 'next/head'
import React, { useState} from 'react';

import solarSystem from '../public/solar_system.jpg'
import DealsExpire from '../components/DealsExpire';
import FilterButton from '../components/FilterButton';

import SearchArea2 from '../components/SearchArea2';
import ShowRouteData from '../components/ShowRouteData';
import FilterMenu2 from '../components/FilterMenu2';

import { useContext } from "react";
import AppContext from "../AppContext";
import Loading from '../components/Loading';
import Reservation from '../components/Reservation';
import SelectPage from '../components/SelectPage';
import ZDateTime from '../components/ZDateTime';

export default function Home() {
  const value = useContext(AppContext);

  

  return (
    <div className="bg-gray-200 min-h-screen">
        <Head>
        <title>cosmos odyssey</title>
        <meta name="description" content="cosmos odyssey" />
      </Head>
      <ZDateTime/>
      <Loading/>
      <Reservation/>
      
      
      <div className="bg-gray-900 flex items-center p-2">
        <div className=" flex flex-row gap-1 items-center justify-between w-full">
          <p className="text-xl font-bold text-white">cosmos odyssey</p>
        </div>
      </div>

      <div className="bg-gray-900 pb-6">
        <div className="flex justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mx-5">
          <div className="h-30 sm:h-40 flex flex-col items-center justify-center">
            <p className="text-2xl sm:text-4xl font-bold text-yellow-400">Solar System Travel Deals</p>
            <DealsExpire/>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="mx-1">
            <SearchArea2/> 
            {value.routeDataLoaded ?<FilterButton/>:<></>}
          </div>
          

          
          
        </div>
      </div>
      <div className="container mx-auto z-10">
        
        {/* Content */}
        <div className="h-6"></div>
          {value.isFilterOpen ? <FilterMenu2/>:<></>}
        <div className="flex justify-center flex-col mx-1">
          
          <SelectPage/>
          <ShowRouteData/>
          
          
          {value.routeDataLoaded ? <></>
          :<div>
            <Image
              className="rounded-md"
              src={solarSystem}
              alt="Solar System"
              layout="responsive"
              
              // width={500} automatically provided
              // height={500} automatically provided
              // blurDataURL="data:..." automatically provided
              placeholder="blur" // Optional blur-up while loading
            /> 
          </div>
          }
        </div>
      </div>
    </div>
  )
}