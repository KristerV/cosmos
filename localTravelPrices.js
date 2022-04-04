const fs = require('fs')
const axios = require('axios')
const chalk = require('chalk')
const path = require('path')
const express = require('express')
const { nanoid } = require('nanoid')


const directoryExists=(directory)=>{
    try {
        if (fs.existsSync(directory)) {
          console.log("Directory exists: "+directory)
        } else {
          console.log("Directory does not exist: "+directory)
          fs.mkdirSync(directory)
        }
      } catch(e) {
        console.log("An error occurred: "+directory)
    }
}

const dataDirectory = path.join(process.cwd(), 'data')
const travelPricesFolder=dataDirectory+"/travelPricesFiles"
const reservationsFolder=dataDirectory+"/reservations"

directoryExists(dataDirectory)
directoryExists(travelPricesFolder)
directoryExists(reservationsFolder)




// Values
const sourceURL = "https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices"
const listBackupFile=dataDirectory+"/listBackupFile.json"
const reservationsBackupFile=dataDirectory+"/reservationsBackupFile.json"
const planetsOrder=['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']
const maxListSize=15

// Retries to get data from source until Cancel trying
var retriesMax=5;
var retriesCount=0

var list=[]
var travelPrices
var reservations=[]

// Load initial data from backup
const loadInitialDataFromBackup = async () => {
    if (fs.existsSync(listBackupFile)) {

        // Load past List from backup file
        list=await JSON.parse(fs.readFileSync(listBackupFile,{encoding:'utf8', flag:'r'}))
        var id=list[list.length-1].id
        travelPrices = await JSON.parse(fs.readFileSync(travelPricesFolder+"/"+id+".json",{encoding:'utf8', flag:'r'}))
    }


    if (fs.existsSync(reservationsBackupFile)) {
        reservations=await JSON.parse(fs.readFileSync(reservationsBackupFile,{encoding:'utf8', flag:'r'}))
    }
}

// Get TravelPrices data from source URL
const getDataFromSource = async () => {
    console.log(chalk.cyan("Getting data from source"))
    const data=await axios.get(sourceURL)
    .then(response => {
        return response
    })
    .catch(error => {
        
        console.log(error);
    });
    return data
}

// Save list to backup file
const backupList = (file,data) => {
    console.log(chalk.magenta("Making list backup"))
    var data = JSON.stringify(data);
    fs.writeFileSync(file,data,{encoding:'utf8',flag:'w'})

}

// Save list to backup file
const backupReservations = (file,data) => {
    console.log(chalk.magenta("Making reservation backup"))
    var data = JSON.stringify(data);
    fs.writeFileSync(file,data,{encoding:'utf8',flag:'w'})

}

// Update list with item
const updateList = (result) => {

    const item={
        "id":result.data.id,
        "validUntil":result.data.validUntil,
    }

    console.log(chalk.cyan("Updating list"))

    if(list.length>0){
        console.log(chalk.cyan("Checking if item exist allready in list"))
        var itemExists=false
        var newItemId=item.id
        list.forEach(element => {
            if(element.id===newItemId){
                itemExists=true
                console.log(chalk.red("New list item exist!"))
            }
        });
        if(itemExists===false){
            console.log(chalk.green("Item does not exist allready. Adding new one"))
            list.push(item)
            travelPrices=result.data
            backupList(listBackupFile,list)
            saveSourceResultIntoFile(result)
            cleanFolder()
        }
    }else{
        console.log(chalk.green("Adding first item to list"))
        list.push(item)
        travelPrices=result.data
        backupList(listBackupFile,list)
        saveSourceResultIntoFile(result)
        cleanFolder()
    }
}

// Check source
const checkSourceForUpdate = async () => {
    console.log(chalk.cyan("Checking for update"))
    if(retriesCount<retriesMax){
    await getDataFromSource().then(result=>{
        if(result===undefined){
            console.log(chalk.red("There was failure. Trying again!"))
            retriesCount++
            console.log("Retries count: "+ retriesCount)

            tryAgain()
        }else{
            updateList(result)
            retriesCount=0
        }
    })
    }else{
        console.log(chalk.red("RETRIES CANCELD! Max retries count " + retriesCount + " exceeded"))
    }
}

// Try to load data from source again if there is a failure.
const tryAgain = () => {
    setTimeout(()=>{
        checkSourceForUpdate()
    },5000)
}


// list last element "validUntil" timestamp
const lastListitemValidUntil = () => {
    if(list.length>0){
        return new Date(list[list.length-1].validUntil).getTime()
    }
}

// time left until checking for update from source
const timeLeftUntilUpdate = () => {
    const currentTime=new Date().getTime()
    const updateTime=lastListitemValidUntil()
    var timeLeft=parseInt((updateTime-currentTime)/1000)//time left in seconds
    //console.log(currentTime + " - " + updateTime + " = " + timeLeft)

    if (isNaN(timeLeft)) {
        timeLeft=-10
      }
    //console.log(timeLeft)
    return timeLeft
}

// Saving result from source into file
const saveSourceResultIntoFile = (data) => {
    console.log(chalk.cyan("Saving source result info file"))
    const file=travelPricesFolder+"/"+data.data.id+".json"
    //console.log(data.data)
    var data = JSON.stringify(data.data);
    fs.writeFileSync(file,data,{encoding:'utf8',flag:'w'})
}

const cleanReservations = () => {
    //console.log(list)
    //console.log(reservations)
    let keepList=[]
    for(let reservation of reservations){
        console.log(reservation.travelPricesId + " " + reservation.reservationID)
        for(let item of list){
            if(reservation.travelPricesId===item.id){
                keepList.push(reservation)
                break
            }
        }
    }
    //console.log(keepList)
    fs.readdir(reservationsFolder, (err, files) => {
        files.forEach(file => {
            //console.log(file)
            var fileName=file.split('.')
            fileName=String(fileName[0])
            var exists=false

            for (var item of keepList) {
                if(fileName===String(item.reservationID)){
                    console.log(chalk.green(file + " Keep reservation!"))
                    exists=true
                    break
                }
            }

            if(exists===false){
                console.log(chalk.red(file + " Delete reservation!"))
                fs.unlinkSync(reservationsFolder+"/"+file);
            }
        })
    })

    reservations=JSON.parse(JSON.stringify(keepList))
    backupReservations(reservationsBackupFile,reservations)

}


// Clean 
const cleanFolder = () =>{

    // If list is over maximum allowed then delete first item from the list. Deletes more than one if there are
    if(list.length>=maxListSize){
        var i = list.length-maxListSize
        while(i>0){
            list.shift()
            i--
        }
    }
    //Search files that are not in the list and delete them
    fs.readdir(travelPricesFolder, (err, files) => {
        files.forEach(file => {
            var fileName=file.split('.')
            fileName=String(fileName[0])
            var exists=false
            for (var listItem of list) {
                if(fileName===String(listItem.id)){
                    console.log(chalk.green(file + " Keep!"))
                    exists=true
                    break
                }
            }

            if(exists===false){
                console.log(chalk.red(file + " Delete!"))
                fs.unlinkSync(travelPricesFolder+"/"+file);
            }
        })
    })

    cleanReservations()


}

// Sort array by order
const sortPlanetsByOrder = (fromArray,orderArray) => {
    var sortedArray=fromArray.sort((a, b) =>{  
        return orderArray.indexOf(a) - orderArray.indexOf(b);
    });
    return sortedArray
}


// Program starting point
const run = () => {
    loadInitialDataFromBackup()
    setInterval(()=>{
        console.log("---------------------------------------------")
        const time=new Date()
        console.log("Time left until checking for "+chalk.yellow("Travel Prices")+" update: " + chalk.yellow(timeLeftUntilUpdate()) + " seconds")
        // If time is over last "validUntil" check for new TravelPrices update
        if(timeLeftUntilUpdate()<0){
            checkSourceForUpdate()
        }
        console.log(chalk.yellow("Items in list:"+list.length))

    },5000) // 5sec windows
}

// Start program
run()



const app = express()
app.disable('etag');

const port = 3001;


app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    let allowedOrigins = ["http://cosmos-odyssey.traks.world","http://localhost:3002"]
    let origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    return next();
});

app.get('/api/', (req, res) => {
    res.status(200)
    .json(travelPrices)
})

app.get('/api/legs', (req, res) => {
    res.status(200)
    .json(travelPrices.legs)
})

app.get('/api/from', (req, res) => {
    var legs = travelPrices.legs
    var fromArray = []
    for(const leg of legs){
        var name = leg.routeInfo.from.name
        if(fromArray.includes(name)===false){
            fromArray.push(name)
        }
    }
    var sortedArray=sortPlanetsByOrder(fromArray,planetsOrder)
    var out=[]
    sortedArray.map((item)=>{out.push(item.toLowerCase())})
    console.log(out)
    res.status(200)
    .json(out)
})


app.get('/api/to', (req, res) => {
    if (typeof req.query.from !== 'undefined') {
        var fromReq=req.query.from
        //console.log(fromReq)
        var legs = travelPrices.legs
        var toList=[]
        for(const leg of legs){
            var from=leg.routeInfo.from.name.toLowerCase()
            var to=leg.routeInfo.to.name.toLowerCase()
            var id=leg.id

            if(fromReq===from){
                //console.log(from + " => " + to)
                toList.push({"to":to,"id":id})
                //console.log(leg)
            }
        }
        // console.log(toList)

        res.status(200)
        .json(toList)
    }else{
        res.status(200)
        .json([''])
    }
})

app.get('/api/locations', (req, res) => {
    var legs = travelPrices.legs
    var locationsArray = []
    for(const leg of legs){
        var name = leg.routeInfo.from.name
        if(locationsArray.includes(name)===false){
            locationsArray.push(name)
        }
    }
    var sortedArray=sortPlanetsByOrder(locationsArray,planetsOrder)
    var out=[]
    sortedArray.map((item)=>{out.push(item.toLowerCase())})
    //console.log(chalk.magenta("Locations:"))
    //console.log(out)
    res.status(200)
    .json(out)
})

const nextHops = (fromReq) => {
    let legs = travelPrices.legs
    let out = []
    for(const leg of legs){
        var from=leg.routeInfo.from.name.toLowerCase()
        var to=leg.routeInfo.to.name.toLowerCase()
        if(fromReq===from){
            //console.log(from + " => " + to)
            out.push(to)
        }
    }
    return out
}

const getLeg = (fromReq,toReq) => {
    let legs = travelPrices.legs
    let out = []
    for(const leg of legs){
        var from=leg.routeInfo.from.name.toLowerCase()
        var to=leg.routeInfo.to.name.toLowerCase()
        if(fromReq===from && toReq===to){
            out.push(leg)
        }
    }
    return out
}

const formatTime=(datetime)=>{
    let a=datetime.split("T")
    let a1=a[0].split("-")
    let date=a1[2]+"."+a1[1]+"."+a1[0]

    let b=a[1].split(".")
    let b1=b[0].split(":")
    let time=b1[0]+":"+b1[1]

    return  (date+" "+time)
}

app.get('/api/route', (req, res) => {
    if (typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined') {
        let fromReq=req.query.from.toLowerCase()
        let toReq=req.query.to.toLowerCase()
        console.log("From: " +  chalk.green(fromReq) +  " " + "To: " + chalk.green(toReq))

        let startTime=new Date().getTime()

        
        // Find possible routes with exact origin and destination.
        let routes = [
            {
                routeIsLoop:false,
                destinationFound:false,
                route:[fromReq]
            }
        ]
        let searchingRoute=true
        let searchLaylersCount=1
        while(searchingRoute){
            //console.log(chalk.magenta("Loop: "+a))
            let routesCopy=JSON.parse(JSON.stringify(routes))
            //console.log(routesCopy)

            let searchingRoutefinished=true
            for(let i=0; i<routes.length; i++){
                
                if(routes[i].routeIsLoop!==true && routes[i].destinationFound!==true){
                    
                    //console.log(chalk.red("Route: "+i))
                    searchingRoutefinished=false

                    let route=routes[i].route
                    let lastHop=route[route.length-1]
                    let next=nextHops(lastHop)

                    // Loop through nextHops
                    for(let j=0;j<next.length;j++){
                        // Add next hop to original route.
                        if(j===0){
                        
                            if(route.includes(next[j])){
                                // If route found out that is going into loop
                                routesCopy[i].route.push(next[j])
                                routesCopy[i].routeIsLoop=true
                                //console.log(chalk.red("Route: "+i + " is loop!"))

                            }else if(next[j]===toReq){
                                // If route found destination
                                routesCopy[i].route.push(next[j])
                                routesCopy[i].destinationFound=true
                                //console.log(chalk.green("Route: "+i + " found destination!"))

                            }else{
                                //Nor loop or destination. Search on!
                                routesCopy[i].route.push(next[j])
                                //console.log(chalk.yellow("Route: "+i + " searching goes on!"))

                            }
                            //console.log("Route: "+routesCopy[i].route.join(' => '))
                            
                            
                        }
                        
                        // Make copy of original route and create new direction
                        if(j>0){
                            // console.log(chalk.cyan(next[j]))
                            
                            //console.log(chalk.yellow("Adding new direction!"))
                            let routeCopy=JSON.parse(JSON.stringify(routes[i]))

                            if(routeCopy.route.includes(next[j])){
                                // If route found out that is going into loop
                                routeCopy.route.push(next[j])
                                routeCopy.routeIsLoop=true
                                //console.log(chalk.red("Route: "+routesCopy.length + " is loop!"))

                            }else if(next[j]===toReq){
                                // If route found destination
                                routeCopy.route.push(next[j])
                                routeCopy.destinationFound=true
                                //console.log(chalk.green("Route: "+routesCopy.length + " found destination!"))
                                
                            }else{
                                //Nor loop or destination. Search on!
                                routeCopy.route.push(next[j])
                                //console.log(chalk.yellow("Route: "+routesCopy.length + " searching goes on!"))
                            }

                            // If route is not loop. Add
                            if(routeCopy.routeIsLoop!==true){
                                routesCopy[routesCopy.length]=routeCopy
                            }
                        
                            //console.log("Route: "+routeCopy.route.join(' => '))

                        }
                    }
                }else{
                    
                    //console.log(chalk.green("Route: "+i))
                }
            }
            routes=JSON.parse(JSON.stringify(routesCopy))

            if(searchingRoutefinished===true){
                searchingRoute=false
                console.log(chalk.green("Searching route finished: ")+searchingRoutefinished)
            }

            // Max depth that search goes.
            if(searchLaylersCount===30){
                searchingRoute=false
            }
            searchLaylersCount++
        }

        // Get routes with destinationFound true
        let directions=[]
        for(let route of routes){
            //console.log(route.destinationFound)
            if(route.destinationFound===true){
                directions.push(route.route)
            }
        }
        console.log(chalk.yellow("Directions: "))
        console.log(directions)

        //let leg=getLeg(from,to)


        let routesWithProviders=[]
        for(let a=0; a<directions.length;a++){

            let sampleRoute={
                direction:directions[a],
                providersFound:false,
                routeDoesntSuit:false,
                legs:[]  
            }
            routesWithProviders.push(sampleRoute)
        }



        let searchingProviders=true
        let searchLoop=1
        let searchLoopMax=10

        let routesWithProvidersFound=[]

        
        while(searchingProviders){
            let newRoutes=[]
            let routesWithProvidersCopy=JSON.parse(JSON.stringify(routesWithProviders))
            let searchingProvidersFinished=true
            
            for(let a=0; a<routesWithProvidersCopy.length; a++){
                let route=routesWithProvidersCopy[a]

                if(route.providersFound!==true && route.routeDoesntSuit !== true){
                    searchingProvidersFinished=false

                    let directionLegCount=route.direction.length-1
                    let legCount=route.legs.length


                    if(directionLegCount!==legCount){

                        let from=route.direction[legCount]
                        let to=route.direction[legCount+1]
                        let leg=getLeg(from,to)

                        for(let b=0; b<leg[0].providers.length; b++){

                            let provider=leg[0].providers[b]

                            let sampleLeg={
                                id:leg[0].id,
                                routeInfo:leg[0].routeInfo,
                                provider:provider
                            }
                            if(b===0){
                                route.legs.push(sampleLeg)

                                if(legCount>0){

                                    let lastFlightEnd=route.legs[legCount-1].provider.flightEnd
                                    let currentFlightStart=sampleLeg.provider.flightStart
                                    let lastFlightEndTimestamp=new Date(lastFlightEnd).getTime()
                                    let currentFlightStartTimestamp=new Date(currentFlightStart).getTime()

                                    if(lastFlightEndTimestamp>currentFlightStartTimestamp){
                                        route.routeDoesntSuit=true                    
                                    }
                                }
                            }

                            if(b>1){
                                let routeCopy=JSON.parse(JSON.stringify(routesWithProviders[a]))
                                routeCopy.legs.push(sampleLeg)
                                if(legCount>0){
                                    let lastFlightEnd=route.legs[legCount-1].provider.flightEnd
                                    let currentFlightStart=sampleLeg.provider.flightStart
                                    let lastFlightEndTimestamp=new Date(lastFlightEnd).getTime()
                                    let currentFlightStartTimestamp=new Date(currentFlightStart).getTime()
                                    
                                    if(lastFlightEndTimestamp>currentFlightStartTimestamp){
                                        routeCopy.routeDoesntSuit=true

                                    }
                                }
                                if(routeCopy.routeDoesntSuit!==true){
                                    newRoutes.push(routeCopy)
                                }
                                
                            }
                        }
                    }
                    if(directionLegCount===legCount){
                        route.providersFound=true
                        routesWithProvidersFound.push(route)
                        //console.log(chalk.magenta("route.providersFound:") + route.providersFound)
                    }
                }else{

                }              
            }

            let routesWithRoutes=JSON.parse(JSON.stringify(routesWithProvidersCopy)).concat(newRoutes)
            routesWithProviders=JSON.parse(JSON.stringify(routesWithRoutes))
            //console.log(chalk.green("routesWithProviders len: ")+routesWithProviders.length)

            if(searchingProvidersFinished===true){
                searchingProviders=false
            }
            if(searchLoop===searchLoopMax){
                searchingProviders=false
            }
            searchLoop++
        }
        console.log(chalk.yellow("Routes:"+routesWithProviders.length))


        console.log(chalk.yellow("Usable routes:"+routesWithProvidersFound.length))

        let finalOutput=[]
        for(let i=0; i<routesWithProvidersFound.length;i++){
            let route=routesWithProvidersFound[i]
            let TGT=0
            let TGP=0
            let TGD=0
            let stops=[]
            if(route.legs.length===1){
                let flightEnd=new Date(route.legs[0].provider.flightEnd).getTime()
                let flightStart=new Date(route.legs[0].provider.flightStart).getTime()
                TGT=flightEnd-flightStart
                TGP=route.legs[0].provider.price
                TGD=route.legs[0].routeInfo.distance
            }else{                
                for(let a=0; a<route.legs.length; a++){
                    let leg=route.legs[a]
                    if(a<route.legs.length-1){
                        let flightEnd=new Date(route.legs[a].provider.flightEnd).getTime()
                        let flightStart=new Date(route.legs[a+1].provider.flightStart).getTime()
                        let stopDuration=flightStart-flightEnd
                        let stopName=route.legs[a].routeInfo.to.name
                        stops.push({stopName,stopDuration})
                    }
                    TGP+=parseFloat(leg.provider.price)
                    TGD+=parseFloat(leg.routeInfo.distance) 
                }

                let flightEnd=new Date(route.legs[route.legs.length-1].provider.flightEnd).getTime()
                let flightStart=new Date(route.legs[0].provider.flightStart).getTime()
                TGT=flightEnd-flightStart
            }

            let out={
                travelPricesId:travelPrices.id,
                travelPricesValidUntil:travelPrices.validUntil,
                direction:route.direction,
                legs:route.legs,
                stops:stops,
                totalQuotedTraveltime:TGT,
                totalQuotedPrice:TGP.toFixed(2),
                totalQuotedDistance:TGD,
            }

            finalOutput.push(out)
        }

        console.log("\n")
        console.log(chalk.yellow("Routes: ")+finalOutput.length)

        let finishTime=new Date().getTime()
        let searchDuration=finishTime-startTime
        //console.log(searchDuration)
        console.log(chalk.yellow("Search duration: ")+chalk.red(searchDuration))
        
        res.status(200)
        .json(finalOutput)

    }else{
        res.status(200)
        .json([''])
    }
})

app.get('/api/leg', (req, res) => {
    if (typeof req.query.id !== 'undefined') {
        var idReq=req.query.id
        console.log(idReq)
        var legs = travelPrices.legs
        var legData=""
        for(const leg of legs){
            if(idReq===leg.id){
                legData=leg
            }
        }
        //console.log(legData)

        res.status(200)
        .json(legData)
    }else{
        res.status(200)
        .json([''])
    }
})



app.get('/api/validUntil', (req, res) => {
    res.status(200)
    .json({"validUntil":travelPrices.validUntil})
    //.json({"validUntil":"2022-03-03T14:18:53.2592409Z"})
})

const saveReservation = (file,data) => {
    console.log(chalk.magenta("Save reservation"))
    var data = JSON.stringify(data);
    fs.writeFileSync(file,data,{encoding:'utf8',flag:'w'})

}

app.post('/api/makereservation', (req, res) => {
    const data=req.body
    
    let reservationValidUntil = data.dealData.travelPricesValidUntil
    let ValidUntil=travelPrices.validUntil
    if(reservationValidUntil===ValidUntil){
        console.log("Make reservation")
        //Create reservation ID
        let newID=""
        let creatingID=true
        while(creatingID){
            newID=nanoid(5)
            let IDSuits=true
            for(let reservation of reservations){
                if(reservation.reservationID===newID){
                    IDSuits=false
                }
            }

            if(IDSuits===true){
                creatingID=false
            }
        }

        // Save reservation 
        let reservationData={
            reservationID:newID,
            firstName:data.reservationDetail.firstName,
            lastName:data.reservationDetail.lastName,
            date:data.reservationDetail.date,
            travelPricesId:data.dealData.travelPricesId,
            travelPricesValidUntil:data.dealData.travelPricesValidUntil,

        }
        reservations.push(reservationData)
        data.reservationDetail.reservationId=newID
        const file=reservationsFolder+"/"+newID+".json"
        saveReservation(file,data)
        backupReservations(reservationsBackupFile,reservations)

        res.status(200)
        .json({
            message:"success",
            reservationData
        })
    }else{
        console.log("Expired!")
        res.status(200)
        .json({
            message:"expired"
        })
    }



})


app.get('/api/getReservations',async (req, res) => {

    res.status(200)
    .json({
        reservations,
        list
    })
})



app.get('/api/clean',async (req, res) => {
    cleanFolder()
    res.status(200)
    .json({
        "message":"Clean!"
    })
})


// Creating random reservation
const getRandomName=async()=>{
    const data=await axios.get("https://randomuser.me/api")
    .then(response => {
        return response
    })
    .catch(error => {
        
        console.log(error);
    });
    
    out={
        first:data.data.results[0].name.first,
        last:data.data.results[0].name.last,
    }
    //console.log(out)
    return out
}

const randomIntFromInterval=(min, max)=> { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const getRandomRoute = async() => {

    
    const rndInt1 = randomIntFromInterval(1, 8)
    const rndInt2 = randomIntFromInterval(1, 7)
    let planets=JSON.parse(JSON.stringify(planetsOrder))
    let from=planets[rndInt1-1]
    
    planets.splice(planets.indexOf(from), 1)
    let to=planets[rndInt2-1]
    let out={from,to}
    return out
}

const getRoute = async (from,to) => {
    const res=await axios.get(`http://localhost:3001/api/route`, { params: { from:from, to:to } })
    .then(res => {
      return res.data
    })
    return res
}

const makeReservation = async (randomName,randRoute) =>{
    // console.log(chalk.red("Random route:"))
    // console.log(randRoute)
    let data={
        dealData:randRoute,
        reservationDetail:{
          firstName:randomName.first,
          lastName:randomName.last,
          date:new Date().toISOString()
        }
    }

    let reservation=await axios.post('http://localhost:3001/api/makereservation', data)
    .then(function (response) {
      return response
    })
    .catch(function (error) {
      console.log(error)
    })
    //console.log(reservation)
    return reservation.data
}

const addRandomUser = async () =>{
    console.log("Add random user")
    let randomName=await getRandomName()
    let randomFromAndTo=await getRandomRoute()
    let route=await getRoute(randomFromAndTo.from,randomFromAndTo.to)
    if(route.length>0){
        let randRouteID=(randomIntFromInterval(1, route.length))-1
        let randRoute=route[randRouteID]
        console.log("Route length:"+route.length)
        console.log("Rand route:"+randRouteID)
        let reservation = await makeReservation(randomName,randRoute)
        // console.log(reservation)
        return({
            reservation:reservation
        })
    }else{
        return({
            message:"No usable routes"
        })
    }
}

app.get('/api/addRandom',async (req, res) => {
    let respond = await addRandomUser().then((res)=>{return res})
    res.status(200)
    .json(respond)
    

})


app.get('/api/reservation', async (req, res) => {
    if (typeof req.query.id !== 'undefined') {
        var resID=req.query.id
        let reservationExist=false
        let reservationData=""
        let i=0
        for(let reservation of reservations){
            if(reservation.reservationID===resID){
                reservationExist=true
                break
            }
        }

        if(reservationExist===true){
            let file=reservationsFolder+"/"+resID+".json"
            reservationData=await JSON.parse(fs.readFileSync(file,{encoding:'utf8', flag:'r'}))
        }
        res.status(200)
        .json(reservationData)
    }else{
        res.status(200)
        .json([''])
    }
})



app.get('/api/travelprices', async (req, res) => {
    if (typeof req.query.id !== 'undefined') {
        var travelPriceID=req.query.id
        let travelPricesExist=false
        let travelPricesData=""
        for(let item of list){

            if(item.id===travelPriceID){
                travelPricesExist=true
                break
            }
        }

        if(travelPricesExist===true){
            let file=travelPricesFolder+"/"+travelPriceID+".json"
            travelPricesData=await JSON.parse(fs.readFileSync(file,{encoding:'utf8', flag:'r'}))
        }
        res.status(200)
        .json(travelPricesData)
    }else{
        res.status(200)
        .json(list)
    }
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})