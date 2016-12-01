# Data ingestion server

The purpose of this server is to be able to ingest data and store it in a database, retrieve data from the database and alert based on threshold regarding the data.

## Note regarding thresholds

There are two branches, master and sms. Sms shows a way of going about implementing text alerts based on thresholds being reached. On the master branch there is a function that checks whether a threshold is met, and can be extended with functions to decide how the alert is carried out.

The sms branch takes that further and uses Twilio to send a text message when a PUT request is made to the server carrying a 'value' in the body that is above or below the relevant threshold.

## Database choice

I chose RethinkDB as my method of storing data. This was due to a few factors, firstly I came to the conclusion based on some research that a NoSQL database would work better over a SQL database with this particular task as its generally faster at handling data in exchange for some tradeoffs, secondly in my experience they've been quicker to get running so given the short time frame I took that into consideration, and lastly I have used RethinkDB on a project in the past.

## Set Up

In order to use up this project you will need to have installed Node.js, if that is the case simply clone the repo (clone from sms branch if you wish to use Twilio sms functionality) and run ```npm install``` to install the dependencies and then to start the server ```npm start```.

You will need to install rethinkdb (https://www.rethinkdb.com/) and then run ```rethinkdb```, as long as its locally hosted and listening for client driver connections on port 28015 you're good to go, if either of those variables differ then they can be changed in the config.js file accordingly.

Lastly if you want to use the sms branch you must sign up at (https://www.twilio.com/). Then create a .env file (dotenv should already be installed via npm install) and add your Twilio Account SID, Auth Token and Twilio phone number. Finally input the number
