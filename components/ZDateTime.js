import React, { useState, useEffect, useContext } from 'react';
import dateFormat from 'dateformat';
import AppContext from "../AppContext";
import axios from 'axios';

export default function ZDateTime () {
    const value = useContext(AppContext);
    const [validUntil, setValidUntil] = useState("");
    const [dateTime, setDateTime] = useState(new Date().toISOString());

    const loading = (state) => {
        value.setLoading(state)
    }

    const getRoute = async (from,to) => {
        const res=await axios.get(`/api/route`, { params: { from:from, to:to } })
        .then(res => {
          return res.data
        })
        return res
    }

    const companiesList=(res)=>{
        const companies=[]
        for(let route of res){
          for(let leg of route.legs){
            
            if(companies.length===0){
              // Add first company
              leg.provider.company.checked=true
    
                //Check filter properties if company selected is false to not show it 
              for(let filterCompany of value.filterProperties.selectedCompanies){
                if(filterCompany.name===leg.provider.company.name && filterCompany.checked===false){
                  leg.provider.company.checked=false
                }
              }
    
              companies.push(leg.provider.company)
            }else{
              // Check if company exists allready
              let companyExists=false
              for( let company of companies){
                if(company.id===leg.provider.company.id){
                  // Company exists! Dont do anything
                  companyExists=true
                }
              }
              //If company doesn't exist add new one!
              if(companyExists===false){
                  leg.provider.company.checked=true
    
                  //Check filter properties if company selected is false to not show it
                  for(let filterCompany of value.filterProperties.selectedCompanies){
                    if(filterCompany.name===leg.provider.company.name && filterCompany.checked===false){
                      leg.provider.company.checked=false                   
                    }
                  }
                  companies.push(leg.provider.company)
              }
            }
            // console.log(leg.provider.company)
          }
        }
        //console.log(companies)
        
        companies = companies.sort((a, b)=>{
          return a.name.localeCompare(b.name)
        })
    
        // Pre filter output if filter exists
    
        //Filter unchecked out of list
        let providersFilterd = []
        for(let route of res){
            let routeContainsUnChecked=false
            for(let leg of route.legs){
                for(const company of companies){
                    if(leg.provider.company.id===company.id && company.checked===false){
                        if(routeContainsUnChecked===false){
                            routeContainsUnChecked=true
                        }
                    }
                }
                if(routeContainsUnChecked===true){
                    //console.log("Break loop")
                    break
                }
            }
            if(routeContainsUnChecked===false){
                providersFilterd.push(route)
            }
        }
    
        // If filter properties contain priceSort
        if(value.filterProperties.priceSort==="ASC"){
          providersFilterd=providersFilterd.sort((a,b)=>{
            return a.totalQuotedPrice - b.totalQuotedPrice
          })
        }
        if(value.filterProperties.priceSort==="DESC"){
          providersFilterd=providersFilterd.sort((a,b)=>{
            return b.totalQuotedPrice-a.totalQuotedPrice
          })
        }
    
        // If filter properties contain distanceSort
        if(value.filterProperties.distanceSort==="ASC"){
          providersFilterd=providersFilterd.sort((a,b)=>{
            return a.totalQuotedDistance - b.totalQuotedDistance
          })
        }
        if(value.filterProperties.distanceSort==="DESC"){
          providersFilterd=providersFilterd.sort((a,b)=>{
            return b.totalQuotedDistance-a.totalQuotedDistance
          })
        }
    
        // If filter properties contain traveltimeSort
        if(value.filterProperties.traveltimeSort==="ASC"){
          providersFilterd=providersFilterd.sort((a,b)=>{
            return a.totalQuotedTraveltime - b.totalQuotedTraveltime
          })
        }
        if(value.filterProperties.traveltimeSort==="DESC"){
          providersFilterd=providersFilterd.sort((a,b)=>{
            return b.totalQuotedTraveltime-a.totalQuotedTraveltime
          })
        }
        
        value.setRouteDataFiltered([...providersFilterd])
    
        return companies
      }
    

    useEffect(() => {
        const interval = setInterval(() => {
    
        // console.log(dateTime)
        // console.log(new Date().toISOString())
        setDateTime(new Date().toISOString())
        // If validUntil
        if(validUntil!==""){
            const current = new Date().getTime()
            const until = new Date(validUntil).getTime()
            // console.log(until-current)
            // If current time is greater than valid untile. Update validuntil.
            if(current>until){
                
                axios.get(`/api/validUntil`)
                .then(res => {
                    setValidUntil(res.data.validUntil)
                    // loading(false)
                })

                //console.log("From: " + value.from + " To: " + value.to)
                if(value.from!=="" && value.to!==""){
                    //console.log("From: " + from + " To: " + to)
                    loading(true)
                    getRoute(value.from,value.to).then((res)=>{
                        
                      //console.log(res)
                      value.setRouteData(res)
                      value.setRouteDataFiltered(res)
                      value.setRouteDataLoaded(true)
                      value.setCompanies(companiesList(res))
                      value.setPage(1)
                      loading(false)
                      
              
                      
                    })
                }
   
                
            }

        }

        // If validUntil is empty get it
        if(validUntil===""){
             axios.get(`/api/validUntil`)
            .then(res => {
                setValidUntil(res.data.validUntil)
                //console.log("SET VALIDUNTIL - "+res.data.validUntil)
            })
        }

      }, 1000)
      return () => clearInterval(interval)
    })
    return (
        <div className="fixed z-20 w-full flex justify-end sm:justify-center ">
             {/* <button className="bg-white w-5 h-5 hover:bg-yellow-500 rounded-full cursor-pointer" onClick={()=>{console.log("To: "+value.to + " - From: "+value.from)}}></button> */}
            <div className="flex justify-center items-end bg-gray-900/90 p-1 m-1 rounded-md flex-row gap-1 text-xl  shadow-sm shadow-black/50">
                <div className="text-sm sm:text-base text-yellow-600 leading-none hidden sm:flex">
                    {dateFormat(dateTime, "UTC:dd.mm.yyyy")}
                </div>
                <div className="text-base sm:text-xl flex flex-row items-end">
                <div className="text-sm sm:text-base text-yellow-600 leading-none">T</div>
                    <div className="text-base sm:text-xl font-bold text-yellow-400 leading-none">
                        {dateFormat(dateTime, "UTC:HH:MM:ss")}
                    </div>
                    <div className="text-sm sm:text-base text-yellow-600 leading-none">Z</div>
                    
                </div>


                <div className="text-base sm:text-xl flex flex-row items-end">
                    <div className="text-sm sm:text-base text-red-600 leading-none">E</div>
                    <div className="text-base sm:text-xl font-bold text-red-500 leading-none">
                        {dateFormat(validUntil, "UTC:HH:MM:ss")}
                    </div>
                    <div className="text-sm sm:text-base text-red-600 leading-none">Z</div>
                </div>

                
            </div>
            
            
        </div>
    )
}