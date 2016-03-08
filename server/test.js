
import ajax from "najax";

ajax( {

    url: "https://api.dribbble.com/v1/shots?sort=comments&access_token=b5501bcf1ef8eca0ef89aa3982ca742556d65b1832e077019397bbe0960df317",
    type: "GET",
    dataType: "json",

    success: function( data ) {

        console.log( data );

        for ( var i = 0, length = data.length; i < length; ++i ) {

            var
            item = data[i],
            type = Math.ceil( Math.random() * 4 );

            console.log( `mysql -u \${DB_DEV_USER} -p\${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('${type}', '${item.images.teaser}', '${item.images.hidpi || item.images.normal}', '${item.title}') "` );
        }
    }
} );

