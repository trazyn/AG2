
define( [ "modules/photography/service",
        "ui/toast" ],
function( service ) {

    "use strict";

    return function( container, type ) {

        var
        gallery = container.find( "ul.gallery" ),
        lightbox = container.find( ".lightbox" ),
        pagination = container.find( ".pagination" ),

        index = 1,
        totalPage = 1;

        type = {
            "portrait": 1,
            "pre-wedding": 2,
            "wedding": 3,
            "others": 4
        }[ type ];

        function loadData() {

            gallery.addClass( "loading" );

            service.getGallery( index, type )

            .done( function( data ) {

                var html = "";

                data.rows.forEach( function( shot ) {

                    html += "<li class='item loading' data-full='" + shot.hidpi + "'>" +
                                "<img src='" + shot.teaser + "' onload='this.parentNode.classList.remove(\"loading\")'>" +
                            "</li>";
                } );

                updatePagination( data.index, data.pageTotal );
                gallery.html( html ).removeClass( "loading" );
            } );
        }

        function updatePagination( current, total ) {
            pagination.find( ".current" ).text( index = current );
            pagination.find( ".total" ).text( totalPage = total );
        }

        function toggleGallery( url ) {

            if ( lightbox.hasClass( "open" ) || "string" !== typeof url ) {
                return lightbox.removeClass( "open" ).fadeOut( 300 );
            }

            lightbox
            .find( "figure" )
            .css( "background-image", "url(" + url + ")" )
            .end()
            .addClass( "open" ).fadeIn( 300 );
        }

        container
        .off( "click" )
        .on( "click", toggleGallery )

        .undelegate( ".item", "click" )
        .delegate( ".item", "click", function( e ) {

            e.stopPropagation();
            e.preventDefault();

            toggleGallery( this.getAttribute( "data-full" ) );
        } )

        .undelegate( ".icon-close", "click" )
        .delegate( ".icon-close", "click", function() {

            index = 1;
            container.removeClass( "show" );
            gallery.addClass( "loading" );
            updatePagination( index, totalPage );
        } )

        .undelegate( ".next-page", "click" )
        .delegate( ".next-page", "click", function() {

            if ( index < totalPage ) {
                loadData( ++index );
            } else {
                $.toast.error( "This is the last page :)" );
            }
        } )

        .undelegate( ".prev-page", "click" )
        .delegate( ".prev-page", "click", function() {

            if ( index > 1 ) {
                loadData( --index );
            } else {
                $.toast.error( "This is the first page :)" );
            }
        } );

        container.addClass( "show" );
        loadData();
    };
} );
