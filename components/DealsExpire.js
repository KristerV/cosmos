import React, { useState, useEffect, useContext } from 'react';
import dateFormat from "dateformat"
import axios from 'axios';
import AppContext from "../AppContext";


const Timeleft = ({validUntil}) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        const dateNow=new Date().getTime()
        const until=new Date(validUntil).getTime()
        if(until-dateNow>0){
            setTimeLeft(until-dateNow)
        }else{
            setTimeLeft(0)
        }
      }, 1000)
      return () => clearInterval(interval)
    })

    return (<span className="text-red-500 text-lg sm:text-xl md:text-2xl">{dateFormat(timeLeft,"MM:ss")}</span>)
  }


export default function DealsExpire () {
    const value = useContext(AppContext);
    const [validUntil, setValidUntil] = useState(value.validUntil);

    useEffect(() => {
        const interval = setInterval(() => {
            if(validUntil!==""){
                const current = new Date().getTime()
                const until = new Date(validUntil).getTime()
                if(current>until){
                    axios.get(`/api/validUntil`)
                    .then(res => {
                        setValidUntil(res.data.validUntil)
                    })
                }

            }
            if(validUntil===""){
                 axios.get(`/api/validUntil`)
                .then(res => {
                    setValidUntil(res.data.validUntil)
                })
            }

        }, 5000)
        return () => clearInterval(interval)
    });

    return (
        <div className="flex flex-col justify-center items-center ">  
                {validUntil !== ""
                    ?<>
                    <div className="text-yellow-500 text-xl sm:text-2xl md:text-2xl ">Get your deal now! </div>
                    <div>
                    <span className="text-yellow-500 text-md sm:text-xl md:text-2xl">Deals expire <span className="text-red-500 text-lg sm:text-xl md:text-2xl">{dateFormat(validUntil,"UTC:HH:MM:ss'Z'")}</span>. </span>
                    <span className="text-yellow-500 text-md sm:text-xl md:text-2xl">Time left <Timeleft validUntil={validUntil}/>. </span>
                    </div>
                    </>
                    :<></>
                }
        </div>
    );

}