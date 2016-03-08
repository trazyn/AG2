
import videoDAO from "../dao/video";
import Joi from "joi";

export default ( server ) => {

    server.route( {
        method: "GET",
        path: "/api/video",
        config: {
            auth: { mode: "try" },
            plugins: { "hapi-auth-cookie": { redirectTo: false } },
            handler: ( request, reply ) => {

                videoDAO.findAll( ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( rows );
                } );
            }
        }
    } );

    server.route( {
        method: "POST",
        path: "/api/video",
        config: {

            validate: {
                payload: {
                    id: Joi.string().required(),
                    cover: Joi.string(),
                    source: Joi.string().required()
                }
            },
            handler: ( request, reply ) => {

                var data = request.payload;

                videoDAO.updateById( data.id, data.cover, data.source, ( err, rows ) => {

                    if ( err ) throw err;
                    return reply( rows );
                } );
            }
        }
    } );
};
