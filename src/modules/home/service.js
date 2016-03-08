
define( [], function() {

    return {

        getVideo: function() {

            return $.ajax( {
                url: "/api/video",
                type: "GET"
            } );
        },

        getNewest: function() {

            return $.ajax( {
                url: "/api/gallery/newest",
                type: "GET"
            } );
        },

        getNewestPost: function() {

            return $.ajax( {
                url: "/api/posts/newest",
                type: "GET"
            } );
        },

        getAbout: function() {

            return $.ajax( {
                url: "/api/user/about",
                type: "GET"
            } );
        }
    };
} );
