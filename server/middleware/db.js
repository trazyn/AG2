
import mysql from "mysql";
import Config from "../config/constants";

var
options = Object.assign( { multipleStatements: true }, Config.database ),
pool = mysql.createPool( options );

function connect( connectHandler ) {

    pool.getConnection( ( err, connection ) => {

        if ( err ) return connectHandler( err );
        return connectHandler( null, connection );
    } );
}

export default ( params ) => {

    var
    sql = params.sql,
    values = params.values,
    queryHandler = params.callback;

    connect( ( err, connection ) => {

        if ( err ) return queryHandler( err );

        var query = connection.query( sql, values, ( err, rows, fields ) => {

            console.log( query.sql );

            queryHandler( err, rows );
            connection.release();
        } );
    } );
};
