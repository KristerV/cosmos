import { useContext } from "react";
import AppContext from "../AppContext";

export default function SelectPage () {
    const value = useContext(AppContext);
    let page=value.page
    let routeCount=value.routeDataFiltered.length
    let routesPerPage=value.routesPerPage
    
    let pagesCount=parseInt(routeCount/routesPerPage)
    let pagesLeft = routeCount%routesPerPage
    if(pagesLeft!==0){
        pagesCount++
    }

    const selectButton=(page)=>{
        if(value.page===page){
            return(
                <div 
                    className="h-9 w-9 bg-yellow-400 text-lg font-bold flex justify-center items-center rounded-md cursor-pointer"
                    onClick={()=>{onSelect(page)}}
                >{page}</div>
            )
        }else{
            return(
                <div 
                    className="h-7 w-7 hover:h-9 hover:w-9 bg-white text-md hover:font-bold flex justify-center items-center rounded-md cursor-pointer"
                    onClick={()=>{onSelect(page)}}
                >{page}</div>
            )
        }
        
    }

    const displayButtons = (pages) => {
        let out=[]

        const pushButton = (int) => {
            out.push(<div key={int.toString()} className="w-10 h-10 flex justify-center items-center">{selectButton(int)}</div>)
        }
        for(let i=1; i<=pages;i++){
            if(i<8 && page<4 || i>page-4 && i<page+4 || i>pages-7 && page>pages-3){
                pushButton(i)
            }
            
           
        }
        return out
    }

    const onSelect=(page)=>{
        value.setPage(page)
    }

    const perPage = () => {
        let routesPerPage=value.routesPerPage
        let perPageAmounts = [5,10,20,50]
        let out=[]
        for(let amount of perPageAmounts){
            
            if(routesPerPage===amount){
                out.push(
                    <div key={amount.toString()} className="w-10 h-10 flex justify-center items-center">
                        <div className="h-9 w-9 bg-yellow-400 text-lg font-bold flex justify-center items-center rounded-md cursor-pointer">
                            {amount}
                        </div>
                    </div>
                    
                )
            }else{
                out.push(
                    <div key={amount.toString()} className="w-10 h-10 flex justify-center items-center">
                        <div 
                            className="h-7 w-7 hover:h-9 hover:w-9 bg-white text-md hover:font-bold flex justify-center items-center rounded-md cursor-pointer"
                            onClick={()=>{
                                value.setRoutesPerPage(amount)
                                value.setPage(1)
                            }}
                        >
                            {amount}
                        </div>
                    </div>
                )
            }
            
        }

        return (out)
    }

    const displayResults = () => {
        if(page===pagesCount){
            return (<div className="flex h-10 justify-center items-center text-gray-500 text-md gap-1"><span>Search results</span><span className="font-bold">{((page*routesPerPage)-routesPerPage+1)}-{value.routeDataFiltered.length}/{value.routeDataFiltered.length}</span></div>)
        }else{
            return (<div className="flex h-10 justify-center items-center text-gray-500 text-md gap-1"><span>Search results</span><span className="font-bold">{((page*routesPerPage)-routesPerPage+1)}-{(page*routesPerPage)}/{value.routeDataFiltered.length}</span></div>)
        }
        
    }
    return (
        <div>
            {value.routeDataLoaded
            ? <div>
                {value.routeDataFiltered.length===0
                ? <div className="flex flex-row items-center justify-between mb-1">
                    <div className=""></div>
                    <div className=""></div>
                    <div className="flex h-10 justify-center items-center text-gray-500 text-md gap-1"><span>Search results</span><span className="font-bold">{value.routeDataFiltered.length}</span></div>
                </div>
                :
                <div>
                    <div className="flex flex-row items-center justify-between mb-1 hidden sm:flex">
                        <div className="flex flex-row h-10 justify-center items-center">{perPage()}</div>
                        <div className="flex flex-row h-10 justify-center items-center">{displayButtons(pagesCount)}</div>
                        <div className="flex h-10 justify-center items-center text-gray-500 text-md gap-1">{displayResults()}</div>
                    </div>
                    <div className="sm:hidden">
                        <div className="flex flex-row items-center justify-between mb-1">
                            <div className="flex flex-row h-10 justify-center items-center">{perPage()}</div>
                            <div className="flex h-10 justify-center items-center text-gray-500 text-md gap-1">{displayResults()}</div>
                            

                        </div>
                        <div className="flex flex-row items-center justify-center mb-1">
                            <div className="flex flex-row h-10 justify-center items-center">{displayButtons(pagesCount)}</div>
                        </div>
                    </div>
                </div>
                
                }
            </div>
            : <>
            </>
            }
        </div>

        
    )
}