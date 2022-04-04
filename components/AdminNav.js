
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX} from '@fortawesome/free-solid-svg-icons';
import AppContext from "../AppContext";


export default function AdminNav() {
    const value = useContext(AppContext);
    const Hamburger = () => {
        return (
            <div className="w-5 h-5 text-white sm:hidden">
                {value.menuOpen
                ?<>
                    <FontAwesomeIcon icon={faX} onClick={()=>{value.setMenuOpen(!value.menuOpen)}}/>
                </>
                :<>
                    <FontAwesomeIcon icon={faBars} onClick={()=>{value.setMenuOpen(!value.menuOpen)}}/>
                </>
                }
            </div>
        )
    }

    const MenuItems = () => {
        return(
            <div className="flex text-white gap-1 h-10 items-center font-bold">
                {value.menuItems.map((item,index)=>(
                    <div key={index.toString()} className="p-1 hover:text-yellow-400 cursor-pointer">
                        <a href={item.href}>{item.name}</a>
                    </div>
                ))}
            </div>
        )
    }

    return(
        <div className="">
            <div className="hidden sm:flex">
                <MenuItems/>
            </div>
            <Hamburger/>
        </div>
    )
}