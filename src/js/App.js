import $ from 'jquery';
import mustache from 'mustache';
import Feed from './Feed.js';
import cookie from 'js-cookie';

const messageDelay = 2000;
const optionsDelay = 500;
const scrollMargin = 400;

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

    document.addEventListener( 'touchstart', ( ) => {}, true );

    this.feed = new Feed( );

    this.bindDomHandlers( );

    this.addMessage( 'Yo! 🙌. Hier is het laatste nieuws.', 'bot' );

    setTimeout( ( ) => {
      this.fetchItems( );
    }.bind( this ), messageDelay )

  }

  fetchItems( ) {

    this.feed.fetchItems( location.protocol + '//' + location.hostname + ':' + 5000 + '/feed/' ).then(items => {

      if (!cookie.get( 'latest' )) {
        cookie.set('latest', Date.parse( this.feed.items[0].date ));
      }

      cookie.set('fetched', Date.now( ));
      this.feed.preloadImages( items ).then(( ) => {
        this.addItem( );
      })

    }, error => {
      this.addMessage('Lame, we kunnen de feed van NOS Nieuws blijkbaar niet bereiken. Probeer het zo nog eens, hopelijk lukt het dan wel.', 'bot', [ 'refresh' ]);
    });

  }

  bindDomHandlers( ) {

    this.$buttonNext.on('click touch', ( ) => {

      this.hideOptions( );
      this.renderMessage( this.$buttonNext.html( ), 'me' );

      setTimeout( ( ) => {

        if ( Date.now( ) - cookie.get( 'fetched' ) > 2 * 1000 * 60 * 60 ) {
          this.fetchItems( );
        } else {
          this.addItem( );
        }

      }, optionsDelay )

    });

    this.$buttonRead.on('click touch', ( ) => {

      this.hideOptions( );
      this.renderMessage( this.$buttonRead.html( ), 'me' );

      setTimeout( ( ) => {
        this.addItemDescription( this.item );
      }, optionsDelay )

    });

    this.$buttonRefresh.on('click touch', ( ) => {

      this.hideOptions( );
      this.renderMessage( this.$buttonRefresh.html( ), 'me' );

      setTimeout( ( ) => {
        this.fetchItems( );
      }, optionsDelay )

    });

  }

  addItem( ) {

    const item = this.feed.getNextItemForDate(cookie.get( 'latest' ));
    this.item = item;

    if ( item ) {
      this.addMessage(item.title, 'bot', [ 'read', 'next' ]);
      cookie.set('latest', Date.parse( item.date ));
    } else {
      this.addMessage('Dat was \'m voor nu! 🤘. Kom later terug.', 'bot', [ 'refresh' ]);
    }

  }

  addItemDescription( item ) {

    const imageDelay = messageDelay + optionsDelay + optionsDelay;

    setTimeout(( ) => {
      this.addMessage( '<img src="' + item.image + '" />', 'bot-image' )
    }, ( optionsDelay ));

    let index = 0;
    for ( const paragraph of item.description ) {
      setTimeout((index => {
        return ( ) => {
          this.addMessage(item.description[index], 'bot', [ 'next' ])
        }
      })( index ), index * ( messageDelay + optionsDelay ) + imageDelay);
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

    $.get('templates/item.html', template => {
      const rendered = mustache.render(template, {
        data: data,
        sender: sender
      });

      $( '.items' ).append( rendered ).ready(( ) => $( '.items .item:last-child' ).removeClass( 'hidden' ));

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
      for ( const option of options ) {

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
    if ( $( window ).scrollTop( ) + $( window ).height( ) > $( document ).height( ) - scrollMargin ) {
      $( 'html, body' ).animate({
        scrollTop: $( document ).height( ) - $( window ).height( )
      });
    }
  }

};

const app = new App( );
