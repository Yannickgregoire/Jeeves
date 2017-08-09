# Jeeves
Bot for serving news from NOS.

## Install
Make sure you have JSPM installed: `npm i -g jspm`.
Run `npm i`, then `jspm i`. Probably best to use Node 8.0 or higher.

## Development
Install Serve `npm i -g serve`.
Install Parallelshell `npm i -g parallelshell`.
Install Node-sass `npm i -g node-sass`.

Run `npm run:dev`. This starts a proxy server for http://feeds.nos.nl/nosnieuwsalgemeen?format=xml on `localhost:3000` and runs the app on `localhost:5000/src/`.

## Production
Run `npm run:build`. Builds files into the `dist` folder.
