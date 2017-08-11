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

      setTimeout( ( ) => {
        this.addItem( );
      }, optionsDelay )

    });

    this.$buttonRead.click(( ) => {

      this.hideOptions( );
      this.renderMessage( this.$buttonRead.html( ), 'me' );

      setTimeout( ( ) => {
        this.addItemDescription( this.item );
      }, optionsDelay )

    });

    this.$buttonRefresh.click(( ) => {

      this.hideOptions( );
      this.renderMessage( this.$buttonRefresh.html( ), 'me' );

      setTimeout( ( ) => {
        this.fetchItems( );
      }, optionsDelay )

    });

  }

  addItem( ) {

    let item = this.feed.getNextItemForDate(cookie.get( 'latest' ));
    this.item = item;

    if ( item ) {
      this.addMessage(item.title, 'bot', [ 'read', 'next' ]);
      cookie.set( 'latest', item.date );
    } else {
      this.addMessage('Dat was \'m voor nu! 🙌. Kom later terug.', 'bot', [ 'refresh' ]);
    }

  }

  addItemDescription( item ) {

    let index = 0;
    for ( var value of item.description ) {
      setTimeout((( index ) => {
        return ( ) => {
          this.addMessage(item.description[index], 'bot', [ 'next' ])
        }
      })( index ), index * ( messageDelay + optionsDelay ));
      index++;
    }

  }

  addMessage( data, sender, options ) {

    this.startTypingIndicator( );
    this.hideOptions( );
    this.scrollToBottom( );

    setTimeout( ( ) => {
      this.renderMessage( data, sender )
      this.showOptions( options );
    }, messageDelay )

  }

  renderMessage( data, sender ) {

    $.get('templates/item.html', ( template ) => {
      var rendered = mustache.render(template, {
        data: data,
        sender: sender
      });

      $( '.items' ).append( rendered ).ready(  ( ) =>
        $( '.items .item:last-child' ).removeClass( 'hidden' )
      );

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

  showOptions( options ) {

    this.$buttonRead.addClass( 'hidden' );
    this.$buttonNext.addClass( 'hidden' );
    this.$buttonRefresh.addClass( 'hidden' );

    if ( options ) {
      for ( let option of options ) {

        switch ( option ) {
          case 'read':
            this.$buttonRead.removeClass( 'hidden' );
            break;
          case 'next':
            this.$buttonNext.removeClass( 'hidden' );
            break;
          case 'refresh':
            this.$buttonRefresh.removeClass( 'hidden' );
            break;
        }
      }
    }

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
