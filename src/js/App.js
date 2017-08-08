import $ from 'jquery';
import mustache from 'mustache';
import Feed from './Feed.js';
import cookie from 'js-cookie';

let messageDelay = 2000;
let optionsDelay = 500;

let optionsTimeout;

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

    this.addMessage( 'Yo! 🎉. Hier is het laatste nieuws.', 'bot' );

    setTimeout( function ( ) {
      this.fetchItems( );
    }.bind( this ), messageDelay)

  },

  fetchItems: function ( ) {

    this.feed.fetchItems( 'http://localhost:3000' ).then( function ( items ) {

      if (!cookie.get( 'latest' )) {
        cookie.set( 'latest', this.feed.items[0].date );
      }

      this.getItem( );

    }.bind( this ), function ( error ) {
      console.log( error );
    }.bind( this ));

  },

  bindDomHandlers: function ( ) {

    this.$buttonNext.click( function ( ) {
      this.hideOptions( );
      this.renderMessage( this.$buttonNext.html( ), 'me' );
      this.$buttonRead.removeClass( 'hidden' );

      setTimeout( function ( ) {
        this.getItem( );
      }.bind( this ), 500)

    }.bind( this ));

    this.$buttonRead.click( function ( ) {
      this.hideOptions( );
      this.renderMessage( this.$buttonRead.html( ), 'me' );
      this.$buttonRead.addClass( 'hidden' );

      setTimeout( function ( ) {
        this.getItemDescription( this.item );
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
      this.addMessage( item.title, 'bot' );
      cookie.set( 'latest', item.date );
    } else {
      this.addMessage( 'Dat was \'m voor nu! 🙌. Kom later terug.', 'bot' );
    }

  },

  getItemDescription: function ( item ) {

    let index = 0;
    for ( var value of item.description ) {
      setTimeout(( function ( index ) {
        return function ( ) {
          this.addMessage( item.description[index], 'bot' )
        }.bind( this )
      }.bind( this ))( index ), index * ( messageDelay + optionsDelay ));
      index++;
    }

  },

  addMessage: function ( data, sender ) {

    this.startTypingIndicator( );
    this.hideOptions( );
    this.scrollToBottom( );

    setTimeout( function ( ) {
      this.renderMessage( data, sender )
      this.stopTypingIndicator( );
      this.showOptions( );
    }.bind( this ), messageDelay)

  },

  renderMessage: function ( data, sender ) {

    $.get( 'templates/item.html', function ( template ) {
      var rendered = mustache.render(template, {
        data: data,
        sender: sender
      });

      $( '.items' ).append( rendered );
      this.scrollToBottom( );

    }.bind( this ));

  },

  startTypingIndicator: function ( ) {
    this.$isTyping.removeClass( 'hidden' );
    this.scrollToBottom( );
  },

  stopTypingIndicator: function ( ) {
    this.$isTyping.addClass( 'hidden' );
    this.scrollToBottom( );
  },

  hideOptions: function ( ) {
    clearTimeout( optionsTimeout );
    this.$options.addClass( 'hidden' );
  },
  showOptions: function ( ) {
    optionsTimeout = setTimeout( function ( ) {
      this.$options.removeClass( 'hidden' );
    }.bind( this ), optionsDelay)
  },

  scrollToBottom: function ( ) {
    window.scrollTo( 0, document.body.scrollHeight );
  }

}

let app = new App( );
app.init( );
