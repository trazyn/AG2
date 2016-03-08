
import db from "../middleware/db";

export default {

    find: ( index, size, keyword = "", type = "", callback ) => {

        var
        sql,
        values,

        start = (index - 1) * size;

        if ( keyword && type ) {

            sql = `select sql_calc_found_rows * from gallery
                    where ifnull(title, '') like ? and type= ?
                    and type is not null
                    order by id desc
                    limit ?, ?;

                    select found_rows() as count`,
            values = [ "%" + keyword + "%", type, start, size ];
        } else if ( keyword ) {

            sql = `select sql_calc_found_rows * from gallery
                    where ifnull(title, '') like ?
                    and type is not null
                    order by id desc
                    limit ?, ?;

                    select found_rows() as count`,
            values = [ "%" + keyword + "%", start, size ];
        } else if ( type ) {

            sql = `select sql_calc_found_rows * from gallery
                    where type = ?
                    and type is not null
                    order by id desc
                    limit ?, ?;

                    select found_rows() as count`,
            values = [ type, start, size ];
        } else {

            sql = `select sql_calc_found_rows * from gallery
                    where type is not null
                    order by id desc
                    limit ?, ?;

                    select found_rows() as count`,
            values = [ start, size ];
        }

        db( {
            sql,
            values,
            callback
        } );
    },

    add: ( type, teaser, hidpi, title, callback ) => {

        var
        sql = "insert into gallery (type, teaser, hidpi, title) values ( ?, ?, ?, ? )",
        values = [ type, teaser, teaser, title ];

        db( {
            sql,
            values,
            callback
        } );
    },

    remove: ( id, callback ) => {

        var
        sql = `delete from gallery
                where id = ?`,
        values = [ id ];

        db( {
            sql,
            values,
            callback
        } );
    },

    findNewest: ( callback ) => {

        var
        sql = "select * from gallery order by create_date desc limit 0,9";

        db( { sql, callback } );
    }
};
