import dateFormat from "dateformat"
import Image from 'next/image'

export default function TimeAndLocation ({type,time,locationName}) {

    return(
        <div className="flex items-center">
          <div>
            <div className="flex text-sm sm:text-md text-gray-600 justify-center leading-none ">{type}</div>
            <div className="flex text-sm text-gray-500 justify-center leading-none">{dateFormat(new Date(time), "UTC:dd.mm.yyyy'Z'")}</div>
            <div>
              <div className="flex text-2xl justify-center leading-none">{dateFormat(new Date(time), "UTC:HH:MM'Z'")}</div>
            </div>
            <div className="flex flex-row gap-1 leading-none">
              <div className="h-5 w-5">
                <Image
                src={"/planets/"+locationName.toLowerCase()+".png"}
                alt={locationName}
                width={30}
                height={30}
                />
              </div>
              <div className="flex text-lg text-gray-500 leading-none items-center">{locationName.charAt(0).toUpperCase() + locationName.slice(1)}</div>
            </div>
          </div>
        </div>
    )
}