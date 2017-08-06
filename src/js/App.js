import Feed from './Feed.js';

function App( ) {};

App.prototype = {

  init: function ( ) {

    let feed = new Feed( );

    feed.fetchItems( 'http://localhost:3000' ).then( function ( items ) {
      console.log( items );
    }, function ( error ) {
      console.log( error );
    });

  }

}

let app = new App( );
app.init( );
