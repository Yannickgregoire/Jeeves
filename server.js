const express = require( 'express' )
const http = require( 'http' )
const app = express( )

app.set('port', ( process.env.PORT || 5000 ));

app.use(( req, res, next ) => {
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  next( );
});

app.use(express.static( 'dist' ))

app.get('/feed/', ( req, res ) => {

  http.get( 'http://feeds.nos.nl/nosnieuwsalgemeen?format=xml' ).on('response', ( response ) => {
    var body = '';
    var i = 0;
    response.on('data', ( chunk ) => {
      i++;
      body += chunk;
    });
    response.on('end', ( ) => res.send( body ));
  });

})

app.listen(app.get( 'port' ), ( ) => {
  console.log('Node app is running on port', app.get( 'port' ));
});
