
define( [], function() {

    "use strict";

    return {

        getPostDetail: function( id ) {

            return $.ajax( {
                url: "/api/posts/detail/" + id,
                type: "GET"
            } );
        },

        getPosts: function( index, title ) {

            return $.ajax( {

                url: "/api/posts/" + index,
                type: "GET",
                data: {
                    title: title
                }
            } );
        },

        getNext: function( id ) {

            return $.ajax( {
                url: "/api/posts/next/" + id,
                type: "GET"
            } );
        },

        getPrev: function( id ) {

            return $.ajax( {
                url: "/api/posts/prev/" + id,
                type: "GET"
            } );
        }
    };
} );
