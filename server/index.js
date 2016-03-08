
import Hapi from "hapi";
import Config from "./config/constants";
import gallery from "./routes/gallery";
import pricing from "./routes/pricing";
import user from "./routes/user";
import video from "./routes/video";
import posts from "./routes/posts";

let server = new Hapi.Server();

server.connection( {
    host: Config.application.host,
    port: Config.application.port
} );

server.register( require( "hapi-auth-cookie" ), ( err ) => {

    if ( err ) throw err;

    /** Session expires after 1 day */
    const cache = server.app.cache = server.cache( { segment: "session", expiresIn: 24 * 60 * 60 * 1000 } );

    server.auth.strategy( "session", "cookie", true, {
        password: "secret",
        cookie: Config.application.authKey,
        ttl: 24 * 60 * 60 * 1000,
        isSecure: false,
        keepAlive: true,
        validateFunc: ( request, session, callback ) => {

            cache.get( session.sid, ( err, cached ) => {

                if ( err ) return callback( err, false );

                if ( !cached ) {
                    return callback( null, false );
                }

                return callback( null, true, cached.user );
            } );
        }
    } );
} );

/** Regist submodule */
(( ...modules ) => {
    modules.some( ( module ) => { module( server ); } );
})(
    gallery,
    pricing,
    video,
    user,
    posts
  );

server.start( (err) => {

    if ( err ) {
        throw err;
    }

    console.log( "Server running at: ", server.info.uri );
} );
