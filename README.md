# Jeeves
Bot for serving news from NOS.
Currently deployed on [Heroku](https://jeevesjeeves.herokuapp.com/)

## Install
Make sure you have JSPM installed: `npm i -g jspm`.
Run `npm i`. Probably best to use Node 8.0 or higher.

## Development
Install Serve `npm i -g serve`.
Install Parallelshell `npm i -g parallelshell`.
Install Node-sass `npm i -g node-sass`.

Run `npm run dev`. This starts a proxy server for http://feeds.nos.nl/nosnieuwsalgemeen?format=xml on `localhost:5000` and serves the app on `localhost:5001/src/`.

## Production
Run `npm run build`. Builds files into the `dist` folder.
