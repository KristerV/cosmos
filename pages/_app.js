import '../styles/globals.css'
import AppContext from "../AppContext";
import { useState } from "react";
import axios from 'axios';
MyApp.getInitialProps = async (ctx) => {
  const res = await axios.get(`http://localhost:3001/api`)
    .then(response => {
        return response
    })
    .catch(error => {
        
        console.log(error);
    });
    // console.log(res.data)
    return { data: res.data }
  }


function MyApp({ Component, pageProps,data}) {
  const [travelPrices, setTravelPrices] = useState(data);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const [legData, setLegData] = useState("");
  const [legDataFiltered, setLegDataFiltered] = useState("");
  const [legDataLoaded, setLegDataLoaded] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [validUntil, setValidUntil] = useState(data.validUntil);
  const [companies, setCompanies] = useState([]);
  const [filterProperties, setFilterProperties] = useState({
    selectedCompanies:[],
    priceSort:"",
    distanceSort:"",
    traveltimeSort:"",
  });
  const [reservationActive, setReservationActive] = useState(false);
  const [reservationData, setReservationData] = useState("");
  const [reservationDetailsFirstName, setReservationDetailsFirstName] = useState("");
  const [reservationDetailsLastName, setReservationDetailsLastName] = useState("");

  const [routeData, setRouteData] = useState("");
  const [routeDataFiltered, setRouteDataFiltered] = useState("");
  const [routeDataLoaded, setRouteDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [routesPerPage, setRoutesPerPage] = useState(5);

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuItems, setMenuItems] = useState([
    {name:"Home",href:"/"},
    {name:"Admin",href:"/admin"},
    {name:"Travelprices",href:"/admin/travelprices"},
    {name:"Reservations",href:"/admin/reservations"},
    
])
  

  return (
    <AppContext.Provider
    
      value={{
          travelPrices:travelPrices,setTravelPrices:setTravelPrices,
          isDataUpdated:isDataUpdated,setIsDataUpdated:setIsDataUpdated,
          legData:legData,setLegData:setLegData,
          legDataLoaded:legDataLoaded,setLegDataLoaded:setLegDataLoaded,
          validUntil:validUntil,setValidUntil:setValidUntil,
          isFilterOpen:isFilterOpen,setIsFilterOpen:setIsFilterOpen,
          legDataFiltered:legDataFiltered,setLegDataFiltered:setLegDataFiltered,
          companies:companies,setCompanies:setCompanies,
          filterProperties:filterProperties,setFilterProperties:setFilterProperties,
          reservationActive:reservationActive,setReservationActive:setReservationActive,
          reservationData:reservationData,setReservationData:setReservationData,
          routeData:routeData,setRouteData:setRouteData,
          routeDataFiltered:routeDataFiltered,setRouteDataFiltered:setRouteDataFiltered,
          routeDataLoaded:routeDataLoaded,setRouteDataLoaded:setRouteDataLoaded,
          reservationDetailsFirstName:reservationDetailsFirstName,setReservationDetailsFirstName:setReservationDetailsFirstName,
          reservationDetailsLastName:reservationDetailsLastName,setReservationDetailsLastName:setReservationDetailsLastName,

          loading:loading,setLoading:setLoading,
          page:page,setPage:setPage,
          routesPerPage:routesPerPage,setRoutesPerPage:setRoutesPerPage,
          from:from,setFrom:setFrom,
          to:to,setTo:setTo,
          menuOpen:menuOpen,setMenuOpen:setMenuOpen,
          menuItems:menuItems,setMenuItems:setMenuItems
      }}
    >
      {/* <ValidUntilExpired/> */}
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

export default MyApp
