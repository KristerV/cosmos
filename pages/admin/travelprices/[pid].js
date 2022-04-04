import { useRouter } from 'next/router'
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';



export default function Reservation() {
    const router = useRouter()
    const { pid } = router.query

    const [travelprices, setTravelprices] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(travelprices===""){
            axios.get(`/api/travelprices?id=`+pid)
            .then(response => {
                setTravelprices(response.data)
                if(response.data!==""){
                    setLoaded(true)
                }
                
            })
        }

    })
    const Company = ({data})=>{
      return(
        <div className="flex flex-col">
          <div className="flex flex-row gap-1 bg-cyan-400 p-1">
            <div className="font-bold">Company</div>
          </div>
          <div className="flex flex-row gap-1 bg-cyan-300 p-1">
            <div className="font-bold">id:</div>
            <div>{data.id}</div>
          </div>
          <div className="flex flex-row gap-1 bg-cyan-200 p-1">
            <div className="font-bold">name:</div>
            <div>{data.name}</div>
          </div>
        </div>
      )
    }
    const Provider=({data})=>{
      return(
        <div className="flex flex-col sm:rounded-md sm:overflow-hidden">
          <Company data={data.company}></Company>
          <div className="flex flex-row gap-1 bg-teal-400 p-1">
            <div className="font-bold">id</div>
            <div>{data.id}</div>
          </div>
          <div className="flex flex-row gap-1 bg-teal-300 p-1">
            <div className="font-bold">price:</div>
            <div>{data.price}</div>
          </div>
          <div className="flex flex-row gap-1 bg-teal-200 p-1">
            <div className="font-bold">flightStart:</div>
            <div>{data.flightStart}</div>
          </div>
          <div className="flex flex-row gap-1 bg-teal-100 p-1">
            <div className="font-bold">flightEnd:</div>
            <div>{data.flightEnd}</div>
          </div>
        </div>
      )
    }

    const Providers = ({data}) => {
      //console.log(data)
      return (
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-1 bg-emerald-400 p-1 mb-1">
            <div className="font-bold">Providers</div>
          </div>
          <div className="sm:grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"> 
            {data.map((item,index)=>(
              <Provider key={index.toString()} data={item}></Provider>
            ))}
          </div>
        </div>
      )
    }

    const To = ({data}) => {
      return (
        <div className="flex flex-col">
          <div className="flex flex-row gap-1 bg-green-400 p-1">
            <div className="font-bold">To</div>
          </div>
          <div className="flex flex-row gap-1 bg-green-300 p-1">
            <div className="font-bold">id:</div>
            <div>{data.id}</div>
          </div>
          <div className="flex flex-row gap-1 bg-green-200 p-1">
            <div className="font-bold">name:</div>
            <div>{data.name}</div>
          </div>
        </div>
      )
    }

    const From = ({data}) => {
      return (
        <div className="flex flex-col">
          <div className="flex flex-row gap-1 bg-lime-400 p-1">
            <div className="font-bold">From</div>
          </div>
          <div className="flex flex-row gap-1 bg-lime-300 p-1">
            <div className="font-bold">id:</div>
            <div>{data.id}</div>
          </div>
          <div className="flex flex-row gap-1 bg-lime-200 p-1">
            <div className="font-bold">name:</div>
            <div>{data.name}</div>
          </div>
        </div>
      )
    }

    const RouteInfo = ({data}) => {
      return (
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row gap-1 bg-yellow-400 p-1">
            <div className="font-bold">Route info</div>
          </div>
          <div className="flex flex-row gap-1 bg-yellow-300 p-1">
              <div className="font-bold">id:</div>
              <div>{data.id}</div>
            </div>
            <div className="flex flex-row gap-1 bg-yellow-200 p-1">
              <div className="font-bold">distance:</div>
              <div>{data.distance}</div>
            </div>
            <From data={data.from}></From>
            <To data={data.to}></To>
        </div>
      )
    }

    const Leg = ({data}) =>{
      return(
        <div>
          <div className="flex flex-col sm:my-2 sm:rounded-md sm:overflow-hidden justify-center w-full">
            <div className="flex flex-row gap-1 bg-orange-400 p-1">
              <div className="font-bold">Leg</div>
            </div>
            <div className="flex flex-row gap-1 bg-orange-300 p-1">
              <div className="font-bold">id:</div>
              <div>{data.id}</div>
            </div>
            <RouteInfo data={data.routeInfo}></RouteInfo>
          </div>
          <div className="flex flex-col md:flex-row sm:my-2 sm:rounded-md sm:overflow-hidden justify-center w-full">
            <Providers data={data.providers}></Providers>
          </div>
        </div>
      )
    }

    const DisplayPricelist=({data})=>{
      return(
        <div className="rounded-md overflow-hidden bg-white cursor-default text-sm">
          <div className="flex flex-row gap-1 bg-red-500 p-1">
            <div className="font-bold">Travelprices</div>
          </div>
          <div className="flex flex-row gap-1 bg-red-400 p-1">
            <div className="font-bold">id:</div>
            <div>{data.id}</div>
          </div>
          <div className="flex flex-row gap-1 bg-red-300 p-1">
            <div className="font-bold">validUntil:</div>
            <div>{data.validUntil}</div>
          </div>
          {data.legs.map((item,index)=>(
            <Leg key={index.toString()} data={item}></Leg>
          ))}
        </div>
      )

    }

    return (
      <AdminLayout>
        {loaded === true
                ?<DisplayPricelist data={travelprices}/>
                :<></>
        }
      </AdminLayout>
    )
}