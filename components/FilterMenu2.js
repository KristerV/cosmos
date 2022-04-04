import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortNumericDown,faSortNumericDownAlt} from '@fortawesome/free-solid-svg-icons'
import React, {useContext} from 'react';
import AppContext from "../AppContext";


export default function FilterMenu2 () {
    const value = useContext(AppContext);

    const loading = (state) => {
        value.setLoading(state)
    }

    const companiesList = () => {
        return(
            value.companies.map((item)=>
            <div key={item.id} className="flex flex-row items-center gap-1 p-1">
                <input 
                    className="w-6 h-6 text-yellow-400 focus:ring-yellow-400 focus:ring-opacity-50 border border-gray-300 rounded"
                    type="checkbox" 
                    checked={item.checked}
                    onChange={()=>{companiesOnCheck(item.id)}}
                />
                <div>{item.name}</div>
            </div>
    )
    )}


    const companiesOnCheck = (id) => {
        loading(true)
        let companies = value.companies
        for(let i=0; i<companies.length; i++){
            if(companies[i].id===id){
                companies[i].checked=!value.companies[i].checked
            }
        }
        value.setCompanies([...companies])

        //Add new or change existing filter properties
        let filterProperties=value.filterProperties

        for(let i=0; i<companies.length; i++){
            let filterCompanyExists=false
            for(let filterCompany of filterProperties.selectedCompanies){
                if(companies[i].name===filterCompany.name){

                    //Company exists copy checked properti
                    filterCompany.checked=companies[i].checked
                    filterCompanyExists=true
                }
            }
            // Add new company to filter properties
            if(filterCompanyExists===false){
                filterProperties.selectedCompanies.push(companies[i])
            }
        }
        value.setFilterProperties({...filterProperties})



        // Filter unchecked out of list
        let providersFilterd = []
        for(let route of value.routeData){
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


        value.setRouteDataFiltered([...providersFilterd])
        loading(false)

    }

    const priceSort = (sortType) => {
        let routeDataFiltered=value.routeDataFiltered
        let filterProperties=value.filterProperties

        if(sortType==="ASC"){
            routeDataFiltered=routeDataFiltered.sort((a,b)=>{
                filterProperties.priceSort="ASC"
                return a.totalQuotedPrice - b.totalQuotedPrice
            })
        }else if(sortType==="DESC"){
            routeDataFiltered=routeDataFiltered.sort((a,b)=>{
                filterProperties.priceSort="DESC"
                return b.totalQuotedPrice-a.totalQuotedPrice
            })
        }else{

        }
        filterProperties.traveltimeSort=""
        filterProperties.distanceSort=""
        value.setLegDataFiltered([...routeDataFiltered])
        value.setFilterProperties({...filterProperties})

    }

    const distanceSort = (sortType) => {
        let routeDataFiltered=value.routeDataFiltered

        let filterProperties=value.filterProperties

        if(sortType==="ASC"){
            routeDataFiltered=routeDataFiltered.sort((a,b)=>{
                filterProperties.distanceSort="ASC"
                return a.totalQuotedDistance - b.totalQuotedDistance
            })
        }else if(sortType==="DESC"){
            routeDataFiltered=routeDataFiltered.sort((a,b)=>{
                filterProperties.distanceSort="DESC"
                return b.totalQuotedDistance-a.totalQuotedDistance
            })
        }else{

        }
        filterProperties.priceSort=""
        filterProperties.traveltimeSort=""
        value.setLegDataFiltered([...routeDataFiltered])
        value.setFilterProperties({...filterProperties})
    }

    const traveltimeSort = (sortType) => {
        let routeDataFiltered=value.routeDataFiltered

        let filterProperties=value.filterProperties

        if(sortType==="ASC"){
            routeDataFiltered=routeDataFiltered.sort((a,b)=>{
                filterProperties.traveltimeSort="ASC"
                return a.totalQuotedTraveltime - b.totalQuotedTraveltime
            })
        }else if(sortType==="DESC"){
            routeDataFiltered=routeDataFiltered.sort((a,b)=>{
                filterProperties.traveltimeSort="DESC"
                return b.totalQuotedTraveltime-a.totalQuotedTraveltime
            })
        }else{

        }
        
        filterProperties.priceSort=""
        filterProperties.distanceSort=""
        value.setLegDataFiltered([...routeDataFiltered])
        value.setFilterProperties({...filterProperties})
    }
    
    return(
    <div className="bg-white mb-2 mx-1 shadow shadow-sm shadow-black/50 p-2 rounded-md flex flex-row gap-2">
        <div className="flex flex-col sm:w-auto" >
            <div className="text-gray-900 text-normal font-bold">Company:</div>
            {value.companies.length>0
            ?<>{companiesList()}</>
            :<></>
            }
        </div>

        <div className="flex flex-col sm:w-auto">

            {/* Price */}
            <div className="text-gray-900 text-normal font-bold">Price:</div>
            <div className="flex flex-row gap-1">
                {value.filterProperties.priceSort==="ASC"
                ?<div 
                    className="bg-yellow-400 border-2 border-gray-50 ring-2 ring-yellow-400 ring-opacity-50 text-white h-7 p-1 hover:bg-yellow-500 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{priceSort("ASC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDown} /> Ascending
                </div>
                :<div 
                    className="bg-yellow-400  p-1 hover:bg-yellow-500 text-white h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{priceSort("ASC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDown} /> Ascending
                </div>
                }

                {value.filterProperties.priceSort==="DESC"
                ?<div 
                    className="bg-yellow-400 border-2 border-gray-50 ring-2 ring-yellow-400 ring-opacity-50 text-white p-1 hover:bg-yellow-500 h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{priceSort("DESC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDownAlt} /> Descending
                </div>
                :<div 
                className="bg-yellow-400 p-1 hover:bg-yellow-500 text-white h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                onClick={()=>{priceSort("DESC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDownAlt} /> Descending
                </div>
                }          
            </div>
            {/* Distance */}
            <div className="text-gray-900 text-normal font-bold">Distance:</div>
            <div className="flex flex-row gap-1">
                {value.filterProperties.distanceSort==="ASC"
                ?<div 
                    className="bg-yellow-400 border-2 border-gray-50 ring-2 ring-yellow-400 ring-opacity-50 text-white h-7 p-1 hover:bg-yellow-500 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{distanceSort("ASC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDown} /> Ascending
                </div>
                :<div 
                    className="bg-yellow-400  p-1 hover:bg-yellow-500 text-white h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{distanceSort("ASC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDown} /> Ascending
                </div>
                }

                {value.filterProperties.distanceSort==="DESC"
                ?<div 
                    className="bg-yellow-400 border-2 border-gray-50 ring-2 ring-yellow-400 ring-opacity-50 text-white p-1 hover:bg-yellow-500 h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{distanceSort("DESC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDownAlt} /> Descending
                </div>
                :<div 
                className="bg-yellow-400 p-1 hover:bg-yellow-500 text-white h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                onClick={()=>{distanceSort("DESC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDownAlt} /> Descending
                </div>
                }          
            </div>
            {/* Travel time */}
            <div className="text-gray-900 text-normal font-bold">Travel time:</div>
            <div className="flex flex-row gap-1">
                {value.filterProperties.traveltimeSort==="ASC"
                ?<div 
                    className="bg-yellow-400 border-2 border-gray-50 ring-2 ring-yellow-400 ring-opacity-50 text-white h-7 p-1 hover:bg-yellow-500 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{traveltimeSort("ASC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDown} />Ascending
                </div>
                :<div 
                    className="bg-yellow-400  p-1 hover:bg-yellow-500 text-white h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{traveltimeSort("ASC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDown} />Ascending
                </div>
                }

                {value.filterProperties.traveltimeSort==="DESC"
                ?<div 
                    className="bg-yellow-400 border-2 border-gray-50 ring-2 ring-yellow-400 ring-opacity-50 text-white p-1 hover:bg-yellow-500 h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                    onClick={()=>{traveltimeSort("DESC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDownAlt} /> Descending
                </div>
                :<div 
                className="bg-yellow-400 p-1 hover:bg-yellow-500 text-white h-7 rounded-md text-sm font-bold cursor-pointer flex justify-center items-center gap-1"
                onClick={()=>{traveltimeSort("DESC")}}
                >
                    <FontAwesomeIcon className="w-5" icon={faSortNumericDownAlt} /> Descending
                </div>
                }          
            </div>
        </div>
        

      </div>
    )
}