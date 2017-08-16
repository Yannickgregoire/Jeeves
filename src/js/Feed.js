import convert from 'xml-js';
import 'whatwg-fetch';

class Feed {

  constructor( ) {
    this.items = [ ];
  }

  async fetchItems( url ) {

      const response = await fetch(url, { 'Access-Control-Allow-Origin': '*' })
      const text = await response.text()

      const data = convert.xml2js(text, { compact: true })
      const items = this.parseItems( data );
      this.items = items;
      return items;

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
    return description.match( /<p>(.*?)<\/p>/g ).map(value => value.replace( '<p>', '' ).replace( '</p>', '' )).slice( 0, 3 );
  }

  getNextItemForDate( date ) {
    return this.items.filter(( item ) => {
      if (Date.parse( item.date ) >  date ) {
        return true;
      }
    })[ 0 ];
  }

};

export default Feed;
