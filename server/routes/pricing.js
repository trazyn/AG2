
import fs from "fs";

export default ( server ) => {

    server.route( {
        method: "POST",
        path: "/api/pricing",
        config: {
            payload: {
                maxBytes: 209715200,
                output: "stream",
                parse: true
            },

            handler: ( request, reply ) => {

                var data = request.payload;

                if ( data.Filedata ) {

                    var name = data.Filename;
                    var path = "uploads/pricing.png";
                    var file = fs.createWriteStream( path );
                    var upstream = data.Filedata;

                    file.on( "error", ( err ) => { throw err; } );

                    upstream
                    .pipe( file )
                    .on( "finish", ( err ) => {

                        var ret = {
                            filename: path,
                            headers: upstream.hapi.headers
                        };

                        if ( err ) throw err;

                        return reply( JSON.stringify( ret ) );
                    } );
                }
            }
        }
    } );
};
