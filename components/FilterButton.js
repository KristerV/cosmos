import React, {useContext} from 'react';
import AppContext from "../AppContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleUp, faAngleDown, faFilter} from '@fortawesome/free-solid-svg-icons'

export default function FilterButton () {
    const value = useContext(AppContext);
    return (
        <div className="mt-2 flex absolute">
        {value.isFilterOpen
        ?
            <div className="flex flex-row bg-white shadow shadow-sm shadow-black/50  h-8 rounded-md overflow-hidden text-gray-900 text-normal font-bold gap-2 cursor-pointer hover:bg-gray-200" onClick={()=>{value.setIsFilterOpen(false)}}>
                <div className="bg-yellow-400 rounded-br-2xl w-8 flex justify-center items-center text-base"><FontAwesomeIcon className="w-5" icon={faFilter}/></div>
                <div className="flex justify-center items-center ">Filter</div>
                <p className ="flex justify-center items-center text-2xl font-thin mr-2" ><FontAwesomeIcon className="w-5" icon={faAngleUp} /></p>
            </div>
        :
            <div className="flex flex-row bg-white shadow shadow-sm shadow-black/50  h-8 rounded-md overflow-hidden text-gray-900 text-normal font-bold gap-2 cursor-pointer hover:bg-gray-200" onClick={()=>{value.setIsFilterOpen(true)}}>
                <div className="bg-yellow-400 rounded-br-2xl w-8 flex justify-center items-center text-base"><FontAwesomeIcon className="w-5" icon={faFilter} /></div>
                <div className="flex justify-center items-center ">Filter</div>
                <p className ="flex justify-center items-center text-2xl font-thin mr-2 " ><FontAwesomeIcon className="w-5" icon={faAngleDown} /></p>
            </div>
        }
        </div>
    )
}