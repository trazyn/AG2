
import Joi from "joi";
import Config from "../config/constants";
import postsDAO from "../dao/posts";
import moment from "moment";

const pageSize = 5;

export default ( server ) => {

    server.route( {

        method: "GET",
        path: "/api/posts/{index}",
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

                postsDAO.find( index, pageSize, data.title,
                              ( err, data ) => {

                                  if ( err ) { throw err; }

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
                              } );
            }
        }
    } );

    server.route( {

        method: "GET",
        path: "/api/posts/detail/{id}",
        config: {

            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },

            handler: ( request, reply ) => {

                postsDAO.findById( request.params.id, ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( {

                        data: rows[0][0],
                        hasnext: rows[1][0].hasnext,
                        hasprev: rows[2][0].hasprev
                    } );
                } );
            }
        }
    } );

    server.route( {

        method: "GET",
        path: "/api/posts/newest",
        config: {

            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },

            handler: ( request, reply ) => {

                postsDAO.findNewest( ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( rows );
                } );
            }
        }
    } );

    server.route( {

        method: "GET",
        path: "/api/posts/next/{id}",
        config: {

            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },

            handler: ( request, reply ) => {

                postsDAO.findNext( request.params.id, ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( {

                        data: rows[0][0],
                        hasnext: rows[1][0].hasnext,
                        hasprev: rows[2][0].hasprev
                    } );
                } );
            }
        }
    } );

    server.route( {

        method: "GET",
        path: "/api/posts/prev/{id}",
        config: {

            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },

            handler: ( request, reply ) => {

                postsDAO.findPrev( request.params.id, ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( {

                        data: rows[0][0],
                        hasnext: rows[1][0].hasnext,
                        hasprev: rows[2][0].hasprev
                    } );
                } );
            }
        }
    } );

    server.route( {
        method: "POST",
        path: "/api/posts",
        config: {
            validate: {
                payload: {
                    id: Joi.string().required(),
                    title: Joi.string().required(),
                    teaser: Joi.string().required(),
                    content: Joi.string().required()
                }
            },

            handler: ( request, reply ) => {

                var data = request.payload;

                postsDAO.update( data.id, data.title, data.teaser, data.content,
                                ( err, rows ) => {

                                    if ( err ) throw err;
                                    return reply( rows );
                                } );
            }
        }
    } );

    server.route( {

        method: "DELETE",
        path: "/api/posts/{id}",

        config: {
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },

            handler: ( request, reply ) => {

                postsDAO.remove( request.params.id, ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( { rows } );
                } );
            }
        }
    } );

    server.route( {

        method: "PUT",
        path: "/api/posts",
        config: {

            validate: {
                payload: {
                    title: Joi.string().required(),
                    content: Joi.string().required(),
                    teaser: Joi.string().required()
                }
            },

            handler: ( request, reply ) => {

                var data = request.payload;

                postsDAO.add( data.title, data.teaser, data.content,
                             ( err, rows ) => {

                                 if ( err ) throw err;
                                 return reply( rows );
                             } );
            }
        }
    } );
};
