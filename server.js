const express = require( 'express' )
const http = require( 'http' )
const app = express( )

app.use( function ( req, res, next ) {
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  next( );
});

app.get( '/', function ( req, res ) {

  http.get( 'http://feeds.nos.nl/nosnieuwsalgemeen?format=xml' ).on( 'response', function ( response ) {
    var body = '';
    var i = 0;
    response.on( 'data', function ( chunk ) {
      i++;
      body += chunk;
      console.log( 'BODY Part: ' + i );
    });
    response.on( 'end', function ( ) {

      console.log( body );
      console.log( 'Finished' );

      res.send( body );

    });
  });

})

app.listen( 3000, function ( ) {
  console.log( 'Example app listening on port 3000!' )
})
