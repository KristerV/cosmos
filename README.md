# Cosmos Odyssey
Cosmos Odyssey is a Node.JS web application for customers to find best solar system travel deals. App works on UTC±00:00 time zone. App is also mobile friendly.  
Working example runs at <a href="https://cosmos-odyssey.traks.world/">https://cosmos-odyssey.traks.world/</a>  
## Customer side  
Customer can choose between 8 different planets and make search request. App automatically finds all possible routes from origin to destination. App shows customer total traveltime, distance and total price. Customer can also see waiting time on different planets that are on found route.   
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/1.png?raw=true" width="400">
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/2.png?raw=true" width="400">  
Customer can also filter search results. Filter is also automatically saved. Customer can make another search with different origin and destination and app automatically filters results based on selected filter options.  
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/9.png?raw=true" width="400">  
App also shows current time and deals expiration time on zero time. When time runs out app automatically fetches new search results based on selected origin, destination and filter options.  
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/10.png?raw=true" width="300"><img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/11.png?raw=true" width="400">  
When customer finds deal that suits, customer can select and make reservation. When reservation is made app gives reservation id and address for cutomers to see his reservation again if there is a need.  
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/3.png?raw=true" width="400">
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/4.png?raw=true" width="400">
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/5.png?raw=true" width="400">


## Company side  
Company side can be found at `/admin` for example <a href="https://cosmos-odyssey.traks.world/admin">https://cosmos-odyssey.traks.world/admin</a>  
App stores 15 last travelprices list and shows all results based on that.  
Company can view made reservations and also see reservation details.  
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/6.png?raw=true" width="400">  
Company can view all their last 15 travelprices list can see detailed view of each travelprice list.  
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/7.png?raw=true" width="400">
<img src="https://github.com/a-traks/cosmos/blob/main/README-IMAGES/8.png?raw=true" width="400">  

## Running app  

### Running locally  
To run code you need to have working <a href="https://nodejs.org">Node.JS</a> on your computer.  
Also you need to open 2 terminal windows.  
At first windows run following commands.
Open linux terminal and run following commands.  
`git clone https://github.com/a-traks/cosmos.git`  
`cd cosmos/`  
`npm i`  
`npm run build`  
Now run backend side.  
`node localTravelPrices.js`  
Then open open second terminal windows at with same directory and run front end side.  
`npm run start`  
  
Now if there are no errors app should be ready.  
Open <a href="http://localhost:3002/">http://localhost:3002/</a> at web browser

### Running at cloud.  
Current example app runs at <a href="https://www.digitalocean.com/">digitalocean.com</a> cloud server.  
If you need help with running at cloud contact with me.  
Contact details can be found at <a href="https://traks.world/">www.traks.world</a>  
I can send you detailed instructions how to do it.  