import convert from 'xml-js';

function Feed( ) {
  this.items = [ ];
};

Feed.prototype = {

  init: function ( ) {},

  fetchItems: function ( url ) {

    return new Promise( function ( resolve, reject ) {

      let request = fetch(url, { 'Access-Control-Allow-Origin': '*' }).then( function ( response ) {

        if ( response.ok ) {
          return response.text( );
        } else {
          reject( false );
        }

      }).then( function ( text ) {

        let data = convert.xml2js(text, { compact: true })
        let items = this.parseItems( data );

        this.items = items;

        console.log( items );
        resolve( items );

      }.bind( this ));

    }.bind( this ))
  },

  parseItems: function ( data ) {
    return data.rss.channel.item.reverse( ).map( function ( item ) {
      return { title: item.title._cdata, description: this.splitDescription(item.description._cdata), date: item.pubDate._text, image: item.enclosure._attributes.url, link: item.link._text }
    }.bind(this));
  },

  splitDescription: function ( description ) {
    return description.match( /<p>(.*?)<\/p>/g ).map(function( value){
      return value.replace('<p>', '').replace('</p>', '');
    })
  },

  getNextItemForDate: function ( date ) {

    return this.items.filter( function ( item ) {
      if (Date.parse( item.date ) > Date.parse( date )) {
        return true;
      }
    })[ 0 ];

  }

}

export default Feed;
