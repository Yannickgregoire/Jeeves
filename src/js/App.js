import $ from 'jquery';
import mustache from 'mustache';
import Feed from './Feed.js';
import cookie from 'js-cookie';

function App( ) {
  this.feed;
  this.item;
};

App.prototype = {

  init: function ( ) {

    this.feed = new Feed( );

    this.feed.fetchItems( 'http://localhost:3000' ).then( function ( items ) {

      if (!cookie.get( 'latest' )) {
        cookie.set( 'latest', this.feed.items[0].pubDate._text );
      }

      this.getItem( );

    }.bind( this ), function ( error ) {
      console.log( error );
    }.bind( this ));

    this.bindDomHandlers( )

  },

  bindDomHandlers: function ( ) {
    $( '.button-next' ).click( function ( ) {
      this.getItem( );
    }.bind( this ))
    $( '.button-read' ).click( function ( ) {
      this.getItemDescription( );
    }.bind( this ))
  },

  getItem( ) {

    let item = this.feed.getNextItemForDate(cookie.get( 'latest' ));
    this.item = item;

    if ( item ) {
      this.renderMessage( item.title._cdata );
      cookie.set( 'latest', item.pubDate._text );
    } else {
      this.renderMessage( 'You\'re all caught up 🎉. Check back later.' );
    }

  },

  getItemDescription: function ( ) {
    this.renderMessage( this.item.description._cdata );
  },

  renderMessage: function ( data ) {

    $.get( 'templates/item.html', function ( template ) {
      var rendered = mustache.render(template, { data: data });
      $( '.items' ).append( rendered );
      window.scrollTo(0,document.body.scrollHeight);
    });

  }

}

let app = new App( );
app.init( );
