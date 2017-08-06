import $ from 'jquery';
import mustache from 'mustache';
import Feed from './Feed.js';
import cookie from 'js-cookie';

function App( ) {
  this.feed;
};

App.prototype = {

  init: function ( ) {

    this.feed = new Feed( );

    this.feed.fetchItems( 'http://localhost:3000' ).then( function ( items ) {

      if (!cookie.get( 'latest' )) {
        cookie.set( 'latest', this.feed.items[0].pubDate._text )
      }

      this.getItem( );

    }.bind( this ), function ( error ) {
      console.log( error );
    }.bind( this ));

  },

  getItem( ) {

    let item = this.feed.getNextItemForDate(cookie.get( 'latest' ));

    if (item) {
      this.renderItem( item )
    } else {
      $( '.items' ).append( 'You\'re all caught up' );
    }

  },

  renderItem: function ( item ) {

    $.get( 'templates/item.html', function ( template ) {
      var rendered = mustache.render(template, {
        title: item.title._cdata,
        description: item.description._cdata
      });
      $( '.items' ).append( rendered );
    });

  }

}

let app = new App( );
app.init( );
