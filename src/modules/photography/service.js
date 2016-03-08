
define( [], function() {

    return {

        getGallery: function( index, type ) {

            return $.ajax( {

                url: "/api/gallery/" + index,
                type: "GET",
                data: {
                    type: type,
                    index: index
                }
            } );
        }
    };
} );
