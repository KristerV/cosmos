import React, { useState, useContext} from 'react';
import AppContext from "../AppContext";
import axios from 'axios';
import Image from 'next/image'


export default function SearchArea2 () {
  const value = useContext(AppContext);

  const [from, setFrom] = useState("")
  const [fromList, setFromList] = useState([])
  const [fromListDropdown, setFromListDropdown] = useState([])
  const [fromActive, setFromActive] = useState(false)

  const [to, setTo] = useState("")
  const [toList, setToList] = useState([])
  const [toListDropdown, setToListDropdown] = useState([])
  const [toActive, setToActive] = useState(false)


  const loading = (state) => {
    value.setLoading(state)
  }

  // Axios

  const getLocations = async () => {
    const res=await axios.get(`/api/locations`)
    .then(res => {
      return res.data
    })
    return res
  }

  const getRoute = async (from,to) => {
    const res=await axios.get(`/api/route`, { params: { from:from, to:to } })
    .then(res => {
      return res.data
    })
    return res
  }


  // From functions

  const fromValue = () => {
    return from.charAt(0).toUpperCase() + from.slice(1)
  }

  const fromOnFocus = () => {
    getLocations().then(res=>{
      setFromList(res)

      let list = res
      setFromListDropdown(list)

      setFromActive(true)
    })
  }

  const fromOnBlur = () => {
    setFromActive(false)
  }

  const fromOnChange = (e) => {
    setFrom(e.target.value)
    
    value.setFrom(e.target.value)

    var word = e.target.value.toLowerCase()
    var list=[]
    fromList.map((item)=>{
      if(item.includes(word)){
        list.push(item)
      }
    })
    setFromListDropdown(list)
  }

  const fromDropdownClick = (item) => {
    setFrom(item)
    value.setFrom(item)
  }

  const fromPlanetImage = () => {
    if(fromList.includes(from.toLowerCase())){
      return (<div className=" w-8 h-8">
        <Image
        src={"/planets/"+from.toLowerCase()+".png"}
        alt={from}
        width={30}
        height={30}
        />
        </div>
      )
    }else{
      return ""
    }
  }

  const fromOnKeyDown = (e) => {
    // On Tab
    if( e.which == 9 ) {
      // Select first one from list
      if(fromListDropdown.length>0){
        setFrom(fromListDropdown[0])
      }
    }
  }

  // To functions
  const toValue = () => {
    return to.charAt(0).toUpperCase() + to.slice(1)
  }

  const toOnFocus = () => {
    getLocations().then(res=>{
      setToList(res)

      let list = res
      setToListDropdown(list)

      setToListDropdown(res)
      setToActive(true)
    })
  }
  
  const toOnBlur = () => {
    setToActive(false)
  }

  const toOnChange = (e) => {
    setTo(e.target.value)
    value.setTo(e.target.value)
    var word = e.target.value.toLowerCase()
    var list=[]
    toList.map((item)=>{
      if(item.includes(word)){
        list.push(item)
      }
    })
    setToListDropdown(list)
  }

  const toDropdownClick = (item) => {
    setTo(item)
    value.setTo(item)
  }

  const toPlanetImage = () => {
    if(toListDropdown.includes(to.toLowerCase())){
      return (<div className=" w-8 h-8">
        <Image
        src={"/planets/"+to.toLowerCase()+".png"}
        alt={to}
        width={30}
        height={30}
        />
        </div>
      )

    }else{
      return ""
    }
  }

  const toOnKeyDown = (e) => {
    // On Tab
    if( e.which == 9 ) {
      // Select first one from list
      if(toListDropdown.length>0){
        setTo(toListDropdown[0])
      }
    }
  }
  

  // Get data if all values are correct
  const getData=()=>{
    let fromExists=false
    let toExists=false

    if(fromList.includes(from.toLowerCase())){
      fromExists=true
    }

    if(toList.includes(to.toLowerCase())){
      toExists=true
    }


    
    if(fromExists===true && toExists===true){
      loading(true)
      
      getRoute(from,to).then((res)=>{
        value.setRouteData(res)
        value.setRouteDataFiltered(res)
        value.setRouteDataLoaded(true)
        value.setCompanies(companiesList(res))
        value.setPage(1)
        loading(false)

        
      })
    }
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

      }
    }

    
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

    return (
        <div className="flex flex-row w-full">
            <div className="h-12 w-full bg-white rounded-l shadow-md shadow-white/30 px-3 py-0">

                <p className="text-sm font-extralight leading-4">Origin</p>
                <div className="flex flex-row gap-1">
                {fromPlanetImage()}
                <input 
                    className="focus:outline-none focus:none w-full text-xl leading-none" 
                    placeholder="Origin" 
                    value={fromValue()} 
                    onChange={(e)=>{fromOnChange(e)}}
                    onFocus={()=>{fromOnFocus()}}
                    onBlur={()=>{fromOnBlur()}}
                    onKeyDown={(e)=>{fromOnKeyDown(e)}}
                ></input>
                </div>
                {fromActive
                  ?<div className="absolute bg-white z-50 mt-3 p-2 rounded-md shadow-md" >
                    {fromListDropdown.map((item)=>(
                      <div 
                        key={item.toString()} 
                        className="flex flex-row gap-1 p-1 hover:bg-yellow-400 rounded-sm hover:text-black cursor-pointer"
                        onMouseDown={()=>{fromDropdownClick(item)}}
                      >
  
                          <Image
                          src={"/planets/"+item.toLowerCase()+".png"}
                          alt={item}
                          width={30}
                          height={30}
                          />

                        <p className="text text-lg">{item.charAt(0).toUpperCase() + item.slice(1)}</p>
                      </div>
                    ))}
                  </div>
                  :<></>
                }
            </div>
            <div className="h-12 w-1 bg-white/10"></div>
            <div className="h-12 w-full bg-white rounded-r shadow-md shadow-white/30 px-2 py-0">
                
                <p className="text-sm font-extralight leading-4">Destination</p>
                <div className="flex flex-row gap-1">
                {toPlanetImage()}
                <input 
                    className="focus:outline-none focus:none w-full text-xl leading-none"
                    placeholder="Destination"
                    value={toValue()}
                    onChange={(e)=>{toOnChange(e)}}
                    onFocus={()=>{toOnFocus()}}
                    onBlur={()=>{toOnBlur()}}
                    onKeyDown={(e)=>{toOnKeyDown(e)}}
                ></input>
                </div>
                {toActive
                  ?<div className="absolute bg-white z-20 mt-4 p-2 rounded-md shadow-md " >
                    {toListDropdown.map((item)=>(
                      <div 
                        key={item.toString()} 
                        className="flex flex-row gap-1 p-1 hover:bg-yellow-400 rounded-sm hover:text-black cursor-pointer"
                        onMouseDown={()=>{toDropdownClick(item)}}
                      >
                        <Image
                          src={"/planets/"+item.toLowerCase()+".png"}
                          alt={item}
                          width={30}
                          height={30}
                          />
                        <p className="text text-lg">{item.charAt(0).toUpperCase() + item.slice(1)}</p>
                      </div>
                    ))}
                  </div>
                  :<></>
                }
            </div>
            <button 
              className="bg-yellow-400 ml-1 py-2 px-5 sm:px-6 hover:bg-yellow-500 rounded-md text-md font-bold cursor-pointer"
              onClick={()=>{getData()}}
            >Search</button>
        </div>
    )
}