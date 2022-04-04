import Link from 'next/link'
export default function MenuItems() {
    const list=[
        {name:"Home",href:"/"},
        {name:"Admin",href:"/admin"},
        {name:"Travelprices",href:"/admin/travelprices"},
        {name:"Reservations",href:"/admin/reservations"},
    ]
    const DisplayList = () => {
        return(
            <div className="flex text-white gap-1 h-10 items-center font-bold">
                {list.map((item,index)=>(
                    <div key={index.toString()} className="p-1 hover:text-yellow-400 cursor-pointer">
                        <a href={item.href}>{item.name}</a>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <DisplayList/>
    )
}
