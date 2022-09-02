# TP Aplicaciones Distribuidas

**Requirements**

- Node.js > 14.3 including npm

## DB Setup

To connect to the db use [MongoDB Compass](https://www.mongodb.com/try/download/compass), you can connect with the following connection string:

```
mongodb://morfando-server:Bo5jew8oib12pqQg7b6reiC7IJrmVcaZo5m6khcCpmcB2lq7nL5ACA55lpQPwuCaiWty1TotfVv5n7dS4Ek9Lw==@morfando-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@morfando-server@
```

## Backend

The backend API is based on NodeJS and [Express](http://expressjs.com/). The source code for the backend resides in the subdirectory `backend`. To run the development server, you have to install the dependencies first.

- Install dependencies

```
$ cd backend
$ npm i
```

- Start Server

```
$ npm start
```

The API is exposed on http://localhost:8000/docs

