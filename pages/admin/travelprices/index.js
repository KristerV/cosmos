import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect, useContext } from 'react';
import dateFormat from "dateformat"
import axios from 'axios';

import AdminNav from '../../../components/AdminNav';
import AdminLayout from '../../../components/AdminLayout';

export default function Travelprices() {
    const [travelprices, setTravelprices] = useState("");
    const [pricesList, setPricesList] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(travelprices===""){
            axios.get(`/api/travelprices`)
            .then(response => {
                let list=response.data
                list=list.sort((a,b)=>{
                    let aTime=new Date(a.validUntil).getTime()
                    let bTime=new Date(b.validUntil).getTime()
                    return bTime-aTime
                })
                setTravelprices(list)
                setLoaded(true)                
            })
        }

    })



    const DisplayTravelprices = ({data}) =>{
        return (
            <div className="rounded-md overflow-hidden cursor-default border border-black/20">
                <div className="flex flex-row font-bold p-1 bg-yellow-400">
                    <div className="flex justify-center w-10">Index</div>
                    <div className="flex justify-center w-96">ID</div>
                    <div className="flex justify-center w-64">Valid Until</div>
                </div>
                
                {data.map((item,index)=>(

                    <ColIsOdd key={index.toString()} index={index}>
                        <DisplayTravelpricesItem index={index} id={item.id} validUntil={item.validUntil}/>
                    </ColIsOdd>
                    
                ))}
            </div>
        )
    }

    const ColIsOdd=({index,children})=>{
        const isOdd = (num) => { return num % 2}
        if(isOdd(index)===0){
            return <div className="bg-yellow-100">{children}</div>
        }else{
            return <div className="bg-yellow-200">{children}</div>
        }
    }




    const DisplayTravelpricesItem = ({index,id,validUntil})=>{
        return (
            <a  href={"/admin/travelprices/"+id} className="flex flex-row gap-1 cursor-pointer p-1 hover:font-bold hover:bg-yellow-300">
                <div className="flex justify-center w-10 items-center">{index+1}</div>
                <div className="flex justify-center w-96">{id}</div>
                <div className="flex justify-center w-64">{dateFormat(validUntil,"UTC:dd.mm.yyyy HH:MM:ss'Z'")}</div>
            </a>
        )
    }

    return (
        <AdminLayout>
            <div className="text-lg font-bold">Travelprices</div>
            {loaded === true
                ?<div className="">
                    <DisplayTravelprices data={travelprices}/>
                </div>
                :<></>
            }
        </AdminLayout>
    )
}