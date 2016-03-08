
define( [], function() {

    return {

        getCurrentUser: function() {
            return $.ajax( {
                url: "/api/user",
                type: "GET",
            } );
        },

        changePassword: function( params ) {

            params.password = md5( params.password );
            params.newPassword = md5( params.newPassword );

            delete params.confirmPassword;

            return $.ajax( {
                url: "/api/user/changePassword",
                type: "POST",
                data: params
            } );
        },

        getVideo: function() {

            return $.ajax( {
                url: "/api/video",
                type: "GET"
            } );
        },

        updateVideo: function( params ) {

            return $.ajax( {
                url: "/api/video",
                type: "POST",
                data: params
            } );
        },

        updateAbout: function( params ) {

            params.desc = escape( params.desc );

            return $.ajax( {
                url: "/api/user/about",
                type: "POST",
                data: params
            } );
        },

        getAbout: function() {

            return $.ajax( {
                url: "/api/user/about",
                type: "GET"
            } );
        },

        addPhoto: function( params ) {

            return $.ajax( {
                url: "/api/gallery",
                type: "PUT",
                data: params
            } );
        },

        removePhoto: function( id ) {

            return $.ajax( {
                url: "/api/gallery/" + id,
                type: "DELETE",
            } );
        },

        getGallery: function( index, keyword, type ) {

            return $.ajax( {
                url: "/api/gallery/" + index,
                type: "GET",
                data: {
                    keyword: keyword,
                    type: type
                }
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

        publishPost: function( params ) {

            return $.ajax( {
                url: "/api/posts",
                type: "PUT",
                data: params
            } );
        },

        updatePost: function( params ) {

            return $.ajax( {
                url: "/api/posts",
                type: "POST",
                data: params
            } );
        },

        getPostDetail: function( id ) {

            return $.ajax( {
                url: "/api/posts/detail/" + id,
                type: "GET"
            } );
        },

        removePost: function( id ) {

            return $.ajax( {
                url: "/api/posts/" + id,
                type: "DELETE"
            } );
        }
    };
} );

