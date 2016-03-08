
import Joi from "joi";
import Config from "../config/constants";
import uuid from "node-uuid";
import userDAO from "../dao/user";

export default ( server ) => {

    server.route( {
        method: "POST",
        path: "/api/user/login",
        config: {
            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },
            validate: {
                payload: {
                    username: Joi.string().required(),
                    password: Joi.string().required()
                }
            },

            handler: ( request, reply ) => {

                var data = request.payload;

                userDAO.find( data.username, data.password, ( err, rows ) => {

                    var res;

                    if ( err ) throw err;

                    if ( !rows.length ) {
                        return reply( {
                            err: "Username or password is incorrect"
                        } );
                    }

                    var
                    sid = uuid.v4(),
                    user = rows[0];

                    request.server.app.cache.set( sid, { user }, 0, ( err ) => {

                        if ( err ) throw err;

                        console.log( "Login success: '%s:%s'", user.id, sid );

                        request.cookieAuth.set( { sid: sid } );

                        return reply( {
                            uid: user.id
                        } );
                    } );
                } );
            }
        }
    } );

    server.route( {
        method: "GET",
        path: "/api/user",
        handler: ( request, reply ) => {

            var sid = request.state[ Config.application.authKey ]["sid"];

            request.server.app.cache.get( sid, ( err, cached ) => {

                if ( err ) throw err;
                return reply( cached );
            } );
        }
    } );

    server.route( {
        method: "GET",
        path: "/api/user/about",
        config: {

            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },

            handler: ( request, reply ) => {

                userDAO.findAbout( ( err, rows ) => {

                    if ( err ) throw err;

                    return reply( rows[0] );
                } );
            }
        }
    } );

    server.route( {
        method: "POST",
        path: "/api/user/about",
        config: {

            validate: {
                payload: {
                    desc: Joi.string().required()
                }
            },

            handler: ( request, reply ) => {

                var data = request.payload;

                userDAO.updateAbout( data.desc, ( err, rows ) => {

                    var res = {};

                    if ( err ) throw err;

                    if ( !rows.changedRows ) {

                        res = {
                            err: "Nothing has been changed"
                        };
                    }

                    return reply( res );
                } );
            }
        }
    } );

    server.route( {

        method: "POST",
        path: "/api/user/changePassword",
        config: {

            validate: {
                payload: {
                    password: Joi.string().required(),
                    newPassword: Joi.string().required()
                }
            },

            handler: ( request, reply ) => {

                var data = request.payload;

                userDAO.updateById( "1", data.password, data.newPassword, ( err, rows ) => {

                    var res = {};

                    if ( err ) throw err;

                    if ( !rows.changedRows ) {

                        res = {
                            err: "The old password is incorrect"
                        };
                    }

                    return reply( res );
                } );
            }
        }
    } );

    server.route( {
        method: "GET",
        path: "/api/user/logout",
        handler: ( request, reply ) => {

        }
    } );
};
