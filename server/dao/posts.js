
import db from "../middleware/db";

let dao = {

    find: ( index, size, title = "", callback ) => {

        var
        sql,
        values,

        start = (index - 1) * size;

        if ( title ) {

            sql = `select sql_calc_found_rows id, title, create_date from posts
                    where ifnull(title, '') like ?
                    order by create_date desc
                    limit ?, ?;

                    select found_rows() as count`,

            values = [ "%" + title + "%", start, size ];
        } else {

            sql = `select sql_calc_found_rows * from posts
                    order by create_date desc
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

    findById: ( id, callback ) => {

        var
        sql = `select * from posts where id = ?;
                select count(id) as hasnext from posts where id > ? order by id limit 1;
                select count(id) as hasprev from posts where id < ? order by id limit 1`,
        values = [ id, id, id ];

        db( {
            sql,
            values,
            callback
        } );
    },

    findNext: ( id, callback ) => {

        var
        sql = `select id from posts
                where id > ?
                order by id asc limit 1`,
        values = [ id ];

        db( {
            sql,
            values,
            callback: ( err, rows ) => {

                if ( err ) throw err;
                dao.findById( (rows[0] || {}).id || id, callback );
            }
        } );
    },

    findPrev: ( id, callback ) => {

        var
        sql = `select * from posts
                where id < ?
                order by id desc limit 1`,
        values = [ id ];

        db( {
            sql,
            values,
            callback: ( err, rows ) => {

                if ( err ) throw err;
                dao.findById( (rows[0] || {}).id || id, callback );
            }
        } );
    },

    findNewest: ( callback ) => {

        var sql = "select * from posts order by create_date desc limit 2";

        db( { sql, callback } );
    },

    update: ( id, title, teaser, content, callback ) => {

        var
        sql = `update posts
                set title = ?, teaser = ?, content = ?, create_date = current_timestamp
                where id = ?`,
        values = [ title, teaser, content, id ];

        db( {
            sql,
            values,
            callback
        } );
    },

    add: ( title, teaser, content, callback ) => {

        var
        sql = "insert into posts (title, teaser, content) values ( ?, ?, ? )",
        values = [ title, teaser, content ];

        db( {
            sql,
            values,
            callback
        } );
    },

    remove: ( id, callback ) => {

        var
        sql = `delete from posts
                where id = ?`,
        values = [ id ];

        db( {
            sql,
            values,
            callback
        } );
    }
};

export default dao;
