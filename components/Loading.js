import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {useContext} from 'react';
import AppContext from "../AppContext";
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

export default function Loading () {
    const value = useContext(AppContext);
    return(
        <>
        {value.loading
        ?<div className="overflow-y-auto overflow-x-hidden fixed z-50 bg-gray-900/20 flex justify-center items-center h-full inset-0">
            <div className="flex flex-row items-center gap-1 text-gray-900 text-xl bg-white/90 rounded-md p-2">
                <FontAwesomeIcon className="animate-spin w-5"  icon={faSpinner} onClick={()=>{value.setLoading(!value.loading)}}/>
                <div className="">Loading...</div>
            </div>
        
            
            
        </div>
        :<></>
        }
        </>
    )
}