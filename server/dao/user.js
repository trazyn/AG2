
import db from "../middleware/db";

export default {

    find: ( username, password, callback ) => {

        var
        sql = "select id from user where username = ? and password = ?",
        values = [ username, password ];

        db( {
            sql,
            values,
            callback
        } );
    },

    updateById: ( id, password, newPassword, callback ) => {

        var
        sql = `update user
                set password = ?
                where id = ?
                and password = ?`,
        values = [ newPassword, id, password ];

        db( {
            sql,
            values,
            callback
        } );
    },

    findAbout: ( callback ) => {

        db( {
            sql: "select about from user where username = 'aresguo'",
            callback
        } );
    },

    updateAbout: ( desc, callback ) => {

        var
        sql = `update user
                set about = ?
                where username = 'aresguo'`,
        values = [ desc ];

        db( {
            sql,
            values,
            callback
        } );
    }
};
