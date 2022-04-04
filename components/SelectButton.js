import React, { useContext} from 'react';
import AppContext from "../AppContext";

export default function SelectButton ({item}) {
    const value = useContext(AppContext);
    const select = () => {
        
        value.setReservationData(item)
        value.setReservationActive(true)
    }
    return(
        <button 
            className="bg-yellow-400 py-2 px-6 w-full sm:w-46 hover:bg-yellow-500 rounded-md text-md font-bold cursor-pointer"
            onClick={()=>{select()}}
        >Select</button>
    )
}