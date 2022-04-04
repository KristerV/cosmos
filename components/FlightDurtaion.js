import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons';

export default function FlightDuration ({startTime,endTime}) {

    const calcDuration = (start,end) =>{
        var start = new Date(start).getTime()
        var end = new Date(end).getTime()
        var seconds = (end-start)/1000
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? "d, " : "d, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
    
        return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "")
    }

    return(
        <div className="flex flex-row items-center gap-1 w-full justify-center">
          <div className="w-5 md:w-20 h-[2px] bg-gray-300 m-1"></div>
          <div className="flex flex-row text-sm text-gray-600 gap-1 items-center">
            <div className="flex justify-center ">Flight duration {calcDuration(startTime,endTime)}</div>
            <div className="text-md sm:text-lg font-bold text-yellow-400">
              <FontAwesomeIcon className="w-5" icon={faSpaceShuttle} />
            </div>
          </div>
          <div className="w-5 md:w-20 h-[2px] bg-gray-300 m-1"></div>
        </div>
      )
}
