import convert from 'xml-js';

class Feed {

  constructor( ) {
    this.items = [ ];
  }

  fetchItems( url ) {

    return new Promise(( resolve, reject ) => {

      let request = fetch(url, { 'Access-Control-Allow-Origin': '*' }).then(( response ) => {

        if ( response.ok ) {
          return response.text( );
        } else {
          reject( false );
        }

      }).then(( text ) => {

        let data = convert.xml2js(text, { compact: true })
        let items = this.parseItems( data );

        this.items = items;
        resolve( items );

      });
    })
  }

  parseItems( data ) {
    return data.rss.channel.item.reverse( ).map(( item ) => {
      return {
        title: item.title._cdata,
        description: this.splitDescription( item.description._cdata ),
        date: item.pubDate._text,
        image: item.enclosure._attributes.url,
        link: item.link._text
      }
    });
  }

  splitDescription( description ) {
    return description.match( /<p>(.*?)<\/p>/g ).map(value => value.replace( '<p>', '' ).replace( '</p>', '' ))
  }

  getNextItemForDate( date ) {
    return this.items.filter(( item ) => {
      if (Date.parse( item.date ) > Date.parse( date )) {
        return true;
      }
    })[ 0 ];
  }

};

export default Feed;
