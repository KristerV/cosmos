import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect, useContext } from 'react';
import dateFormat from "dateformat"
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import AdminNav from '../../components/AdminNav';

export default function Reservations() {
    const [reservationsData, setReservationsData] = useState("");
    const [pricesList, setPricesList] = useState("");
    const [dataLoaded, setDataLoaded] = useState(false);

    const getReservations=()=>{
        axios.get(`/api/getReservations`)
        .then(response => {
            setReservationsData(response.data.reservations)

            let list=response.data.list
            list=list.sort((a,b)=>{
                let aTime=new Date(a.validUntil).getTime()
                let bTime=new Date(b.validUntil).getTime()
                return bTime-aTime
            })

            setPricesList(list)
            setDataLoaded(true)
            
        })
    }

    const addRandom = () => {
        axios.get(`/api/addRandom`)
        .then(response => {
            getReservations()
        })
    }

    useEffect(() => {
        if(reservationsData===""){
            getReservations()
        }

    })

    const DisplayPrices = () =>{

        return (
            <div className="flex flex-col gap-y-2">
                {pricesList.map((item,index)=>(
                    <div key={index.toString()} className="rounded-md border border-black/20 cursor-default">
           
                        <div className="flex flex-row gap-1 p-1">
                            <div className="font-bold">Pricelist ID:</div>
                            <div>{item.id}</div>
                        </div>
                        <div className="flex flex-row gap-1 p-1"> 
                            <div className="font-bold">Valid until:</div>
                            <div>{dateFormat(item.validUntil,"UTC:dd.mm.yyyy HH:MM:ss'Z'")}{}</div>
                        </div>
                        <DisplayReservations id={item.id}/>
                
                        
                    </div>
                ))}
            </div>
        )
    }

    const DisplayReservations = ({id}) => {
        let list=[]
        for(let reservation of reservationsData){
            if(id===reservation.travelPricesId){
                list.push(reservation)
            }
        }
        //console.log(list)
        list=list.sort((a,b)=>{
            let aTime=new Date(a.date).getTime()
            let bTime=new Date(b.date).getTime()
            return bTime-aTime
        })

        const ColIsOdd=({index,children})=>{
            const isOdd = (num) => { return num % 2}
            if(isOdd(index)===0){
                return <div className="bg-yellow-100 hover:bg-yellow-300">{children}</div>
            }else{
                return <div className="bg-yellow-200 hover:bg-yellow-300">{children}</div>
            }
        }
        
        return(
            <div className="overflow-hidden">
                {list.length === 0
                    ?<>
                        <div className="p-1 font-bold text-red-500">No reservations</div>
                    </>
                    :<>
                        <div className="grid grid-cols-4 font-bold gap-1 bg-yellow-400">
                            <div className=" flex justify-center">Reservation ID</div>
                            <div className=" flex justify-center">Date</div>
                            <div className=" flex justify-center">First name</div>
                            <div className=" flex justify-center">Last name</div>                         
                        </div>
                        {list.map((item,index)=>(
                            <ColIsOdd key={index.toString()} index={index}>
                                <a className=" cursor-pointer" href={"/res/"+item.reservationID}>
                                <div className="grid grid-cols-4 gap-1">
                                    <div className="flex justify-center">
        
                                    {item.reservationID}
                                    
                                    </div>
                                    <div className="flex justify-center">{dateFormat(item.date,"UTC:dd.mm.yyyy HH:MM:ss'Z'")}</div>
                                    <div className="flex justify-center">{item.firstName}</div>
                                    <div className="flex justify-center">{item.lastName}</div>
                                </div>
                                </a>
                            </ColIsOdd>
        
                        ))}
                    </>
                }
            </div>
        )
    }

    return (
        <AdminLayout>
            <div className="text-lg font-bold">Reservations</div>
            <button className="cursor-pointer bg-yellow-300 hover:bg-yellow-400 rounded font-bold m-1 p-1" onClick={()=>{addRandom()}}>Add random reservation</button>
                
                {dataLoaded === true
                    ?<>
                        <DisplayPrices/>
                    </>
                    :<></>
                }
        </AdminLayout>

    )
}