
import Joi from "joi";
import Config from "../config/constants";
import galleryDAO from "../dao/gallery";
import moment from "moment";
import fs from "fs";
import path from "path";
import mkdir from "mkdirp";
import uuid from "node-uuid";

const pageSize = 12;

export default ( server ) => {

    server.route( {
        method: "GET",
        path: "/api/gallery/{index}",
        config: {

            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },
            validate: {
                params: {
                    index: Joi.number().required()
                }
            },

            handler: ( request, reply ) => {

                var
                data = request.query,
                index = request.params.index;

                galleryDAO.find( index, pageSize, data.keyword, data.type,
                                ( err, data ) => {

                                    if ( err ) throw err;

                                    var
                                    count = data[1][0][ "count" ],
                                    pageTotal = Math.ceil( count / pageSize );

                                    return reply( {
                                        count,
                                        pageSize,
                                        pageTotal,
                                        index,
                                        rows: data[0]
                                    } );
                                } ) ;
            }
        }
    } );

    server.route( {
        method: "GET",
        path: "/api/gallery/newest",
        config: {

            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },
            handler: ( request, reply ) => {

                galleryDAO.findNewest( ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( rows );
                } );
            }
        }
    } );

    server.route( {
        method: "PUT",
        path: "/api/gallery",
        handler: ( request, reply ) => {

            var data = request.payload;

            galleryDAO.add( data.photoType, data.img, data.img, data.name, ( err, rows ) => {

                if ( err ) throw err;
                return reply( { rows } );
            } );
        }
    } );

    server.route( {
        method: "POST",
        path: "/api/gallery",
        config: {
            payload: {
                maxBytes: Config.application.uploadSize,
                output: "stream",
                parse: true
            },

            handler: ( request, reply ) => {

                var data = request.payload;

                if ( data.Filedata ) {

                    var
                    name = data.Filename,
                    filename = "uploads/" + moment().format( "YYYY-MM" ) + "/" + escape( name ),
                    upstream = data.Filedata,
                    file;

                    console.log( "Will write '%s'", filename );

                    mkdir( path.dirname( filename ), ( err ) => {

                        if ( err ) throw err;
                        file = fs.createWriteStream( filename );

                        file.on( "error", ( err ) => { throw err; } );

                        console.log( "Write '%s'", filename );

                        upstream
                        .pipe( file )
                        .on( "finish", ( err ) => {

                            var ret = {
                                filename: filename,
                                headers: upstream.hapi.headers
                            };

                            if ( err ) throw err;

                            console.log( "Write '%s' success", filename );

                            return reply( JSON.stringify( ret ) );
                        } );
                    } );
                }
            }
        }
    } );

    server.route( {
        method: "DELETE",
        path: "/api/gallery/{id}",

        config: {
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },

            handler: ( request, reply ) => {

                galleryDAO.remove( request.params.id, ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( { rows } );
                } );
            }
        }
    } );
};
