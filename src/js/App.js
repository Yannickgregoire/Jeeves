import $ from 'jquery';
import mustache from 'mustache';
import Feed from './Feed.js';
import cookie from 'js-cookie';

let delay = 2000;

function App( ) {
  this.feed;
  this.item;

  this.$buttonRead = $( '.button-read' );
  this.$buttonNext = $( '.button-next' );
  this.$buttonRefresh = $( '.button-refresh' );
  this.$isTyping = $( '.is-typing' );
  this.$options = $( '.options' );
};

App.prototype = {

  init: function ( ) {

    this.feed = new Feed( );

    this.bindDomHandlers( );

    this.renderMessage( 'Yo! 🎉. Hier is het laatste nieuws.', 'bot' );

    setTimeout( function ( ) {
      this.fetchItems( );
    }.bind( this ), delay)

  },

  fetchItems: function ( ) {

    this.feed.fetchItems( 'http://localhost:3000' ).then( function ( items ) {

      if (!cookie.get( 'latest' )) {
        cookie.set( 'latest', this.feed.items[0].pubDate._text );
      }

      this.getItem( );

    }.bind( this ), function ( error ) {
      console.log( error );
    }.bind( this ));

  },

  bindDomHandlers: function ( ) {

    this.$buttonNext.click( function ( ) {
      this.renderMessage( this.$buttonNext.html( ), 'me' );
      this.$buttonRead.removeClass( 'hidden' );

      setTimeout( function ( ) {
        this.getItem( );
      }.bind( this ), 500)

    }.bind( this ));

    this.$buttonRead.click( function ( ) {
      this.renderMessage( this.$buttonRead.html( ), 'me' );
      this.$buttonRead.addClass( 'hidden' );

      setTimeout( function ( ) {
        this.getItemDescription( );
      }.bind( this ), 500)

    }.bind( this ));

    this.$buttonRefresh.click( function ( ) {
      this.fetchItems( );
    }.bind( this ));

  },

  getItem( ) {

    let item = this.feed.getNextItemForDate(cookie.get( 'latest' ));
    this.item = item;

    if ( item ) {
      this.renderMessage( item.title._cdata, 'bot' );
      cookie.set( 'latest', item.pubDate._text );
    } else {
      this.renderMessage( 'Dat was \'m voor nu! 🙌. Kom later terug.', 'bot' );
    }

  },

  getItemDescription: function ( ) {
    this.renderMessage( this.item.description._cdata, 'bot' );
  },

  renderMessage: function ( data, sender ) {

    let timeout = 0;
    if ( sender === 'bot' ) {
      timeout = delay;
      this.$isTyping.removeClass( 'hidden' );
    } else {
      this.$isTyping.addClass( 'hidden' );
    }

    this.scrollToTop( );

    setTimeout( function ( ) {
      $.get( 'templates/item.html', function ( template ) {
        var rendered = mustache.render(template, {
          data: data,
          sender: sender
        });

        this.$isTyping.addClass( 'hidden' );
        $( '.items' ).append( rendered );
        this.scrollToTop( );

      }.bind( this ));
    }.bind( this ), timeout)

  },

  scrollToTop: function ( ) {
    window.scrollTo( 0, document.body.scrollHeight );
  }

}

let app = new App( );
app.init( );
