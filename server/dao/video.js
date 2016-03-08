
import db from "../middleware/db";

export default {

    findAll: ( callback ) => {

        var
        sql = "select * from video";

        db( { sql, callback } );
    },

    updateById: ( id, cover, source, callback ) => {

        var
        sql = `update video
                set cover = ?, source = ?
                where id = ?`,
        values = [ cover, source, id ];

        db( {
            sql,
            values,
            callback
        } );
    }
};
