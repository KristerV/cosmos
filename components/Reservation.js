
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useContext} from 'react';
import AppContext from "../AppContext";
import Image from 'next/image'
import dateFormat from 'dateformat';
import {faSpaceShuttle, faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

export default function Reservation () {
    const value = useContext(AppContext);
    const [response, setResponse] = useState(false);
    const [responseData, setResponseData] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

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
    const distanceInBillions = (distance) => {
        let distanceInBillions=distance/1000000000
        return (distanceInBillions.toFixed(3)+" billion km")
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

      return(
        <div  className="flex flex-col w-full mb-3 p-2 rounded-md cursor-default">
            
          {displayDirection(value.reservationData.direction)}
          <div className="bg-gray-300 h-[2px] my-2"></div>

          {displayLegs(value.reservationData)}
          
          <div className="bg-gray-300 h-[2px] my-2"></div>
          <div className="flex flex-row justify-around text-sm sm:text-sm ">
            <div className="flex flex-col">
              <div className="flex text-gray-600 justify-center leading-none items-center">DISTANCE</div>
              <div className="flex justify-center items-center text-gray-900 font-bold">{distanceInBillions(value.reservationData.totalQuotedDistance)}</div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-gray-600 justify-center leading-none">TRAVELTIME</div>
              <div className="flex justify-center items-center text-gray-900 font-bold">{calcDuration(0,value.reservationData.totalQuotedTraveltime)}</div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-gray-600 justify-center leading-none items-center">TOTAL PRICE</div>
              <div className="flex justify-center items-center text-lg sm:text-xl font-bold">{itemPrice(value.reservationData.totalQuotedPrice)}</div>
            </div>
            
          </div>


        </div>
      )

    }

    const makeReservation=()=>{
      let firstName=value.reservationDetailsFirstName
      let lastName=value.reservationDetailsLastName
      if(firstName!=="" && lastName!==""){
        let data={
          dealData:value.reservationData,
          reservationDetail:{
            firstName,
            lastName,
            date:new Date().toISOString()
          }
        }

        axios.post('/api/makereservation', data)
        .then(function (response) {
          
          // console.log(response)
          setResponseMessage(response.data.message)
          setResponseData(response.data)
          setResponse(true)
        })
        .catch(function (error) {
          setResponse(true)
          console.log(error);
        });


        value.setReservationDetailsFirstName("")
        value.setReservationDetailsLastName("")
        
      }
    }

    return(
        <div className="">
        {value.reservationActive
        ?<div className="flex inline-flex fixed h-full w-full z-50 bg-black/50 justify-center">
          
            <div className="flex flex-col overflow-hidden overflow-y-auto bg-white rounded-md m-2 p-2 container mx-auto">
            <div className="flex justify-between">
              <div className="text-xl">Flight reservation</div>
              <div 
                  className="h-7 w-7 rounded-md text-red-500 text-2xl hover:text-red-500 hover:text-3xl font-bold cursor-pointer flex items-center justify-center"
                  onClick={()=>{
                      value.setReservationActive(false),
                      setResponse(false)
                  }}
                  ><FontAwesomeIcon className="w-5" icon={faXmark} /></div>
              </div>
            <div>
                {value.reservationData!==""
                ?<div className=" flex flex-col items-center">
                    {displayRouteData()}

                    <div className="text-xl w-full">Reservation details</div>
              
                    {response
                      ?<>
                        {responseMessage==="success"
                        ?<>
                        <div className="text-green-500 text-xl">You successfully reserved your flight!</div>
                        <div className="flex flex-row gap-1 py-1 w-full sm:w-5/6 justify-center">
                          
                          <div className="flex flex-col w-1/2 ">
                              <div>First name:</div>
                              <div
                                  className="flex px-2 bg-white h-11 items-center border-2 border-gray-300 rounded w-full text-xl text-gray-700"
                              >
                                  {responseData.reservationData.firstName}
                              </div>
                          </div>
                          <div className="flex flex-col w-1/2">
                              <div>Last name:</div>
                              <div className="flex px-2 bg-white h-11 items-center border-2 border-gray-300 rounded w-full text-xl text-gray-700">
                                {responseData.reservationData.lastName}
                              </div>
                          </div>
                          </div>
                          <div className=" w-full sm:w-5/6 flex flex-col">
                            <div className="flex flex-col w-1/2">
                              <div>Reservation ID:</div>
                              <div className="flex px-2 bg-white h-11 items-center border-2 border-gray-300 rounded w-full text-xl text-gray-700">
                                {responseData.reservationData.reservationID}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div>Reservation aadress:</div>
                              <div className="flex px-2 bg-white h-11 items-center border-2 border-gray-300 rounded w-full text-base sm:text-xl text-gray-700">
                                <a className="hover:text-yellow-400 cursor-pointer" href={"/res/"+responseData.reservationData.reservationID}>{window.location.hostname}/res/{responseData.reservationData.reservationID}</a>                           
                              </div>
                            </div>
                          </div>
                        </>
                        :<></>}

                        {responseMessage==="expired"
                        ?<>
                          <div className="text-red-400 text-xl">Sorry! Deal expired!</div>
                        </>
                        :<></>}
                        


                      </>
                      :<>
                      <div className="flex flex-row gap-1 py-1 w-full sm:w-5/6 justify-center">
                        <div className="flex flex-col w-1/2 ">
                            <div>First name:</div>
                            <div className="h-5">
                                <input 
                                  type="text" 
                                  className="bg-white appearance-none border-2 border-gray-300 rounded w-full text-xl text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                                  placeholder="First name"
                                  value={value.reservationDetailsFirstName}
                                  onChange={(e)=>{
                                    value.setReservationDetailsFirstName(e.target.value)
                                  }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <div>Last name:</div>
                            <input 
                              type="text" 
                              className="bg-white appearance-none border-2 border-gray-300 rounded w-full text-xl text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                              placeholder="Last name"
                              value={value.reservationDetailsLastName}
                              onChange={(e)=>{
                                value.setReservationDetailsLastName(e.target.value)
                              }}
                            />
                        </div>
                    </div>
                      <button 
                        className="bg-yellow-400 w-full sm:w-5/6 py-2 px-6 hover:bg-yellow-500 rounded-md text-md font-bold cursor-pointer"
                        onClick={()=>{makeReservation()}}
                    >Make reservation</button>
                      </>}
                    


                </div>
                :<div></div>
                }

            </div>
        </div>
           
        
        </div>
        :<></>
        }
        </div>
    )
}

