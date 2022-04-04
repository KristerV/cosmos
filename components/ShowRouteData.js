import React, { useState, useContext } from 'react';
import AppContext from "../AppContext";
import dateFormat from 'dateformat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSpaceShuttle,faArrowRightLong} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import SelectButton from './SelectButton';

export default function ShowRouteData () {
    const value = useContext(AppContext);

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
    
        return (dDisplay + hDisplay + mDisplay).replace(/,\s*$/, "")
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
          <span className="pr-1">{e3}</span>
          <span className="pr-1">{e2}</span>
          <span className="">{e1}</span>
          <span className="text-xs sm:text-sm font-normal">.{a1}€</span>
        </div>)
      }
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
                  
                  width={80}
                  height={80}
                  />
              </div>
              <div className="flex items-center w-full justify-evenly">
                <div className="flex items-center">
                  <div>
                    <div className="flex text-sm sm:text-md text-gray-600 justify-center leading-none ">DEPARTURE</div>
                    <div className="flex text-sm text-gray-500 justify-center leading-none">{dateFormat(new Date(item.provider.flightStart), "UTC:dd.mm.yyyy'Z'")}</div>
                    <div>
                      <div className="flex text-2xl justify-center leading-none">{dateFormat(new Date(item.provider.flightStart), "UTC:HH:MM'Z'")}</div>
                    </div>
                    <div className="flex flex-row gap-1 leading-none">
                      <div className="h-5 w-5">
                        <Image
                        src={"/planets/"+item.routeInfo.from.name.toLowerCase()+".png"}
                        alt={item.routeInfo.from.name}
                        width={30}
                        height={30}
                        />
                      </div>
                      <div className="flex text-lg text-gray-500 leading-none items-center">{item.routeInfo.from.name.charAt(0).toUpperCase() + item.routeInfo.from.name.slice(1)}</div>
                    </div>
                  </div>
                </div>

                <div className="sm:flex flex-row items-center gap-1 hidden">
                  <div className="w-5 md:w-20 h-[2px] bg-gray-300 m-1"></div>
                  <div className="flex flex-row text-sm text-gray-600 gap-1 items-center">
                    <div className="flex justify-center ">Flight duration {calcDuration(item.provider.flightStart,item.provider.flightEnd)}</div>
                    <div className="text-md sm:text-lg font-bold text-yellow-400">
                      <FontAwesomeIcon className="w-5" icon={faSpaceShuttle} />
                    </div>
                  </div>
                  <div className="w-5 md:w-20 h-[2px] bg-gray-300 m-1"></div>
                </div>
          
                <div className="flex items-center">
                  <div>
                    <div className="flex text-sm sm:text-md text-gray-600 justify-center leading-none">ARRIVAL</div>
                    <div className="flex text-sm text-gray-500 justify-center leading-none">{dateFormat(new Date(item.provider.flightEnd), "UTC:dd.mm.yyyy'Z'")}</div>
                    <div>
                      <div className="flex text-2xl justify-center leading-none">{dateFormat(new Date(item.provider.flightEnd), "UTC:HH:MM'Z'")}</div>
                    </div>
                    <div className="flex flex-row gap-1">
                      <div className="h-5 w-5">
                        <Image
                        src={"/planets/"+item.routeInfo.to.name.toLowerCase()+".png"}
                        alt={item.routeInfo.to.name}
                        width={30}
                        height={30}
                        />
                      </div>
                      <div className="flex text-lg text-gray-500 leading-none items-center">{item.routeInfo.to.name.charAt(0).toUpperCase() + item.routeInfo.to.name.slice(1)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

      
            
            <div className="flex flex-col items-center justify-center text-sm sm:text-md">
              <div className="flex text-gray-600 justify-center leading-none items-center">PRICE</div>
              <div className=" font-bold text-gray-500">{itemPrice(item.provider.price)}</div>
            </div>
          </div>

          <div className="flex flex-row items-center sm:hidden justify-center">
            <div className="w-10 h-[2px] bg-gray-300 m-1"></div>
            <div className="flex flex-row text-sm text-gray-500 gap-1 items-center justify-center ">
              <div className="">Flight duration {calcDuration(item.provider.flightStart,item.provider.flightEnd)}</div>
              <div className="text-md font-bold text-yellow-400">
                <FontAwesomeIcon className="w-5" icon={faSpaceShuttle} />
              </div>
            </div>
            <div className="w-10 h-[2px] bg-gray-300 m-1"></div>
          </div>
          
          {containsStop(item.routeInfo.to.name,stops)}

        </div>
        )
      })
      return out
    
    }

    const distanceInBillions = (distance) => {
      
      let distanceInBillions=distance/1000000000

      return (distanceInBillions.toFixed(3)+" billion km")
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
            
            {index!==(direction.length-1)
            ? <div className="px-1"><FontAwesomeIcon className="w-5" icon={faArrowRightLong} /></div>
            : <></>
            }
        
          </div>
          
          
        ))}
      </div>
      )
    }
    const displayRouteData = () => {

        let out=[]
        
        const pushItem=(item,index)=>{
          out.push(<div key={index.toString()} className="flex flex-col bg-white shadow-sm shadow-black/50 mb-3 p-2 rounded-md cursor-default">
                
          {displayDirection(item.direction)}
          <div className="bg-gray-300 h-[2px] my-2"></div>
          {displayLegs(item)}
          <div className="bg-gray-300 h-[2px] my-2"></div>
          <div className="flex flex-row justify-around text-sm sm:text-sm ">
            <div className="flex flex-col">
              <div className="flex text-gray-600 justify-center leading-none items-center">DISTANCE</div>
              <div className="flex justify-center items-center text-gray-900 font-bold">{distanceInBillions(item.totalQuotedDistance)}</div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-gray-600 justify-center leading-none">TRAVELTIME</div>
              <div className="flex justify-center items-center text-gray-900 font-bold">{calcDuration(0,item.totalQuotedTraveltime)}</div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-gray-600 justify-center leading-none items-center">TOTAL PRICE</div>
              <div className="flex justify-center items-center text-lg sm:text-xl font-bold">{itemPrice(item.totalQuotedPrice)}</div>
            </div>
            
          </div>
          <div className="sm:grid hidden w-full justify-items-end">
              <div className="w-64">
                <SelectButton item={item}/>
              </div>
          </div>
          <div className="flex flex-row items-center gap-1 sm:hidden">
            <SelectButton item={item}/>
          </div>

        </div>)
        }
        let page=value.page
        let perPage=value.routesPerPage

        for(let i=0;i<value.routeDataFiltered.length;i++){
          let item=value.routeDataFiltered[i]
          let index=i
          if(i<(page*perPage) && i>=((page*perPage)-perPage))
            pushItem(item,index)
        
    
        }

        return out
      }
      
    return (
        <div>
            {value.routeDataLoaded
            ? <div className="flex justify-center flex-col">
              
                
                {displayRouteData()}
                
            </div>
            : <>
            </>
            }
        </div>
    )
}