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

The API is exposed on http://localhost:8000/api/v1

Currently, the only available resource is `users`:

`GET http://localhost:8000/api/v1/users`

This is a list of user objects like this:

`{"id":"1", "avatar": "https://i.pravatar.cc/150?img=1", "name": "Morgan James"}`.

To change the list of users, modify the `users.json` in the `./db` directory.

## App

You will find the source code for the React Native application in the subdirectory `app`.
The application has been setup using [Expo](https://expo.io/).
To setup your development environment you have to install Expo globally and install the npm dependencies.

1. Install Expo globally using npm

```
$ cd app
$ npm i -g expo
```

2. Install dependencies

```
$ npm i
```

### The app is dependent on the backend API, so you should make sure to start the backend API server first.

To run the app in development mode execute

```
$ npm start
```

Open your browser on http://localhost:19002/ to see the Metro Bundler. From there you can check the app in the browser, or in the iOS or Android simulators.

### Test

The app uses Jest for unit tests. To run the tests execute

```
$ npm test
```
