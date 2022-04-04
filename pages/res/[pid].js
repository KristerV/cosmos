import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark,faSpaceShuttle, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router'
import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react';
import dateFormat from "dateformat"
import axios from 'axios';

import Image from 'next/image'
import TimeAndLocation from '../../components/TimeAndLocation';
import FlightDuration from '../../components/FlightDurtaion';

export default function Reservation() {
    const router = useRouter()
    const { pid } = router.query

    const [reservation, setReservation] = useState("");
    const [pricesList, setPricesList] = useState("");
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if(reservation===""){
            axios.get(`/api/reservation?id=`+pid)
            .then(response => {
                setReservation(response.data)
                if(response.data!==""){
                    setDataLoaded(true)
                }
                
            })
        }

    })

    const displayLegs = (item) => {
        let legs=item.legs
        let stops=item.stops
  
        const containsStop = (stopName,stops) => {
          let stopDuration=0
          let stopExists=false
          for(stop of stops){
            if(stopName===stop.stopName){
              stopDuration=stop.stopDuration
              stopExists=true
            }
          }
  
          if(stopExists===true){
            return(
              <div className="p-1 my-2 flex flex-row justify-center items-center gap-1 bg-gray-100  rounded-lg text-sm sm:text-md text-gray-500">
                <div className="flex flex-row gap-1">
                  <div >Waiting duration {calcDuration(0,stopDuration)}</div>
                  <div className="h-5 w-5">
                      <Image
                      src={"/planets/"+stopName.toLowerCase()+".png"}
                      alt={stopName}
                      width={30}
                      height={30}
                      />
                  </div>
                  <div className="">{stopName}</div>
                </div>
              </div>
            )
          }
          if(stopExists===false){
            return ""
          }
          
        }



  
        var out=legs.map((item,index)=>{
          return(
          <div key={index.toString()}  className="my-1">
            <div className="flex flex-row gap-1">
              <div className="flex flex-row w-full gap-1">
                <div className="flex items-center justify-start">
  
                  <Image
                    className="rounded-sm"
                    src={"/company/"+item.provider.company.name+".jpg"}
                    alt={item.provider.company.name}
                    // layout="responsive"
                    
                    width={80}
                    height={80}
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                    />
                </div>
                <div className="flex items-center w-full justify-evenly">
                  <TimeAndLocation type={"DEPARTURE"} time={item.provider.flightStart} locationName={item.routeInfo.from.name}/>
                  <div className="hidden sm:flex">
                    <FlightDuration startTime={item.provider.flightStart} endTime={item.provider.flightEnd}/>
                  </div>
                  <TimeAndLocation type={"ARRIVAL"} time={item.provider.flightEnd} locationName={item.routeInfo.to.name}/>
                </div>
              </div>
  
        
              
              <div className="flex flex-col items-center justify-center text-sm sm:text-md">
                <div className="flex text-gray-600 justify-center leading-none items-center">PRICE</div>
                <div className=" font-bold text-gray-500">{itemPrice(item.provider.price)}</div>
                {/* <SelectButton item={item}/> */}
              </div>
            </div>
            
            <div className="sm:hidden">
              <FlightDuration startTime={item.provider.flightStart} endTime={item.provider.flightEnd}/>
            </div>

            
            {containsStop(item.routeInfo.to.name,stops)}
  
          </div>
          )
        })
        return out
      
      }

    const displayDirection = (direction) => {

        return (
        <div className="flex text-lg text-gray-600 leading-none items-center">
          <div className="font-bold"></div>
          {direction.map((planet,index)=>(
            <div key={index.toString()} className="flex flex-row justify-center items-center  ">
              <div className="h-6 w-6">
                <Image
                    src={"/planets/"+planet.toLowerCase()+".png"}
                    alt={planet}
                    width={30}
                    height={30}
                    />
              </div>
              <div className="hidden sm:flex">{planet.charAt(0).toUpperCase()+planet.slice(1)}</div>
  
              {/* {index===direction.length-1 || index===0
              ? <div className="">{planet.charAt(0).toUpperCase()+planet.slice(1)}</div>
              : <div className="hidden sm:flex">{planet.charAt(0).toUpperCase()+planet.slice(1)}</div>
              } */}
              
              {index!==(direction.length-1)
              ? <div className="px-1"><FontAwesomeIcon className="w-5" icon={faArrowRightLong} /></div>
              : <></>
              }
          
            </div>
            
            
          ))}
        </div>
        )
      }


      const distanceInBillions = (distance) => {
        let distanceInBillions=distance/1000000000
        return (distanceInBillions.toFixed(3)+" billion km")
    }

      const itemPrice = (price) =>{

        var s = price.toString().split(".")

        let a1=s[1]
        // If value is undefined
        a1 = (typeof a1 === 'undefined') ? 0 : a1;
        a1 = String(a1)
        // If value has only 1 number
        a1 = (a1.length === 1) ? a1+"0" : a1;
 
        var e1 = s[0].slice(-3)
        var e2 = s[0].slice(-6,-3)
        var e3 = s[0].slice(-9,-6)
      
        return (<div className="">
          <span className="text-lg sm:text-xl pr-1 font-bold">{e3}</span>
          <span className="text-lg sm:text-xl pr-1 font-bold">{e2}</span>
          <span className="text-lg sm:text-xl font-bold">{e1}</span>
          <span className="text-xs sm:text-sm">.{a1}€</span>
        </div>)
      }

      const calcDuration = (start,end) =>{
        var start = new Date(start).getTime()
        var end = new Date(end).getTime()
        var seconds = (end-start)/1000
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? "d, " : "d, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
    
        return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "")
    }

    const displayRouteData = () => {

        return(
          // <div  className="flex flex-col bg-white shadow-sm shadow-black/50 mb-3 p-2 rounded-md cursor-default">
          <div  className="flex flex-col w-full mb-3 p-2 rounded-md cursor-default">
              
            {displayDirection(reservation.dealData.direction)}
            <div className="bg-gray-300 h-[2px] my-2"></div>
  
            {displayLegs(reservation.dealData)}
            
            <div className="bg-gray-300 h-[2px] my-2"></div>
            <div className="flex flex-row justify-around text-sm sm:text-sm ">
              <div className="flex flex-col">
                <div className="flex text-gray-600 justify-center leading-none items-center">DISTANCE</div>
                <div className="flex justify-center items-center text-gray-900 font-bold">{distanceInBillions(reservation.dealData.totalQuotedDistance)}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-gray-600 justify-center leading-none">TRAVELTIME</div>
                <div className="flex justify-center items-center text-gray-900 font-bold">{calcDuration(0,reservation.dealData.totalQuotedTraveltime)}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-gray-600 justify-center leading-none items-center">TOTAL PRICE</div>
                <div className="flex justify-center items-center text-lg sm:text-xl font-bold">{itemPrice(reservation.dealData.totalQuotedPrice)}</div>
              </div>
              
            </div>
  
  
          </div>
        )
  
      }

    const Reservation = () =>{
        return(
            <div className="">
          {/* <div className="overflow-y-auto overflow-x-auto fixed z-50 bg-black/50 flex justify-center items-center h-full inset-0"> */}
          
        <div className="flex flex-col overflow-hidden overflow-y-auto bg-white rounded-md m-2 p-2">
          {/* <div className="bg-white w-full sm:w-4/5 md:w-2/3 rounded-md flex flex-col p-1 m-1 shadow-sm shadow-black/50"> */}
            <div className="flex justify-between">
                <div className="text-xl">Flight reservation: <span className="font-bold">{reservation.reservationDetail.reservationId}</span></div>
            </div>
            <div>
                {reservation!==""
                ?<div className=" flex flex-col items-center">
                    {displayRouteData()}

                    <div className="text-xl w-full">Reservation details</div>
                    <div className="flex flex-row gap-1 p-1 w-full sm:w-5/6 justify-center">
                        <div className="flex flex-col w-1/2 ">
                            <div>First name:</div>
                            <div
                                className="flex px-2 bg-white h-11 items-center border-2 border-gray-300 rounded w-full text-xl text-gray-700"
                            >
                                {reservation.reservationDetail.firstName}
                            </div>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <div>Last name:</div>
                            <div
                                  className="flex px-2 bg-white h-11 items-center border-2 border-gray-300 rounded w-full text-xl text-gray-700"
                                >
                                    {reservation.reservationDetail.lastName}
                                </div>
                        </div>
                    </div>


                </div>
                :<div></div>
                }

            </div>
        </div>
        </div>
        )
    }

    return (
    <div className="bg-gray-200 min-h-screen pb-2">
        <Head>
            <title>cosmos odyssey | Admin</title>
            <meta name="description" content="cosmos odyssey | Admin" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="bg-gray-900 flex items-center p-2 mb-1">
            <div className=" flex flex-row justify-start items-end w-screen">
                <div>
                    <Link href="/" passHref>
                        <p className="text-xl font-bold text-white cursor-default">cosmos odyssey</p>
                    </Link>
                </div>
                
                
            </div>
        </div>
        <div className="container mx-auto z-10">          
            {dataLoaded === true
                ?<>
                    <Reservation/>
                </>
                :<>
                No Reservation
                </>
            }
        </div>
    </div>
    )
}