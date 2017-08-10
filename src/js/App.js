import $ from 'jquery';
import mustache from 'mustache';
import Feed from './Feed.js';
import cookie from 'js-cookie';

let messageDelay = 2000;
let optionsDelay = 500;

let optionsTimeout;

class App {

  constructor( ) {

    this.feed;
    this.item;

    this.$buttonRead = $( '.button-read' );
    this.$buttonNext = $( '.button-next' );
    this.$buttonRefresh = $( '.button-refresh' );
    this.$isTyping = $( '.is-typing' );
    this.$options = $( '.options' );

    this.init( );

  }

  init( ) {

    this.feed = new Feed( );

    this.bindDomHandlers( );

    this.addMessage( 'Yo! 🎉. Hier is het laatste nieuws.', 'bot' );

    setTimeout( ( ) => {
      this.fetchItems( );
    }.bind( this ), messageDelay )

  }

  fetchItems( ) {

    this.feed.fetchItems( location.protocol + '//' + location.hostname + ':3000' ).then( function ( items ) {

      if (!cookie.get( 'latest' )) {
        cookie.set( 'latest', this.feed.items[0].date );
      }

      this.addItem( );

    }.bind( this ), function ( error ) {
      console.log( error );
    }.bind( this ));

  }

  bindDomHandlers( ) {

    this.$buttonNext.click(( ) => {
      this.hideOptions( );
      this.renderMessage( this.$buttonNext.html( ), 'me' );
      this.$buttonRead.removeClass( 'hidden' );

      setTimeout( ( ) => {
        this.addItem( );
      }, 500 )

    });

    this.$buttonRead.click(( ) => {
      this.hideOptions( );
      this.renderMessage( this.$buttonRead.html( ), 'me' );
      this.$buttonRead.addClass( 'hidden' );

      setTimeout( ( ) => {
        this.addItemDescription( this.item );
      }, 500 )

    });

    this.$buttonRefresh.click(( ) => {
      this.fetchItems( );
    });

  }

  addItem( ) {

    let item = this.feed.getNextItemForDate(cookie.get( 'latest' ));
    this.item = item;

    if ( item ) {
      this.addMessage( item.title, 'bot' );
      cookie.set( 'latest', item.date );
    } else {
      this.addMessage( 'Dat was \'m voor nu! 🙌. Kom later terug.', 'bot' );
    }

  }

  addItemDescription( item ) {
    
    let index = 0;
    for ( var value of item.description ) {
      setTimeout((( index ) => {
        return ( ) => {
          this.addMessage( item.description[index], 'bot' )
        }
      })( index ), index * ( messageDelay + optionsDelay ));
      index++;
    }

  }

  addMessage( data, sender ) {

    this.startTypingIndicator( );
    this.hideOptions( );
    this.scrollToBottom( );

    setTimeout( ( ) => {
      this.renderMessage( data, sender )
      this.showOptions( );
    }, messageDelay )

  }

  renderMessage( data, sender ) {

    $.get('templates/item.html', ( template ) => {
      var rendered = mustache.render(template, {
        data: data,
        sender: sender
      });

      $( '.items' ).append( rendered );
      this.stopTypingIndicator( );
      this.scrollToBottom( );

    });

  }

  startTypingIndicator( ) {
    this.$isTyping.removeClass( 'hidden' );
  }

  stopTypingIndicator( ) {
    this.$isTyping.addClass( 'hidden' );
  }

  hideOptions( ) {
    clearTimeout( optionsTimeout );
    this.$options.addClass( 'hidden' );
  }

  showOptions( ) {
    optionsTimeout = setTimeout( ( ) => {
      this.$options.removeClass( 'hidden' );
    }, optionsDelay )
  }

  scrollToBottom( ) {
    $( 'html, body' ).animate({
      scrollTop: document.body.scrollHeight - window.innerHeight
    });
  }

};

let app = new App( );
