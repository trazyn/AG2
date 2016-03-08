
define( [], function() {

    return {

        login: function( params ) {

            params.password = md5( params.password );

            return $.ajax( {

                url: "/api/user/login",
                type: "POST",
                data: params
            } );
        }
    };
} );
