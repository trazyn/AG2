
define( [ "modules/dashboard/service",
        "modules/dashboard/gallery",
        "modules/dashboard/video",
        "modules/dashboard/changePassword",
        "modules/dashboard/pricing",
        "modules/dashboard/blog",
        "modules/dashboard/updateAbout",
        "util/storage",
        "ui/pagination",
        "ui/validation",
        "ui/ripple",
        "ui/toast",
        "ui/modal",
        "ui/message",
        "ui/dropdown" ],
function( service, gallery, video, changePassword, pricing, blog, updateAbout, storage ) {

    "use strict";

    return function( container ) {

        container
        .delegate( ".md-form-group .md-field", "focus focusout", function( e ) {

            var self = $( this ).parent();

            if ( e.type === "focusout" ) {
                self[ (this.value = this.value.replace( /^\s+|\s+$/g, "" ))
                        ? "addClass"
                        : "removeClass" ]
                        ( "hasvalue" ).removeClass( "focused" );
            } else {
                self.addClass( "focused" );
            }
        } )

        .delegate( ".slide-menu li[data-index]", "click", function() {

            container.find( "section.active[data-index], li.active[data-index]" ).removeClass( "active" );
            container.find( "section[data-index='" + this.getAttribute( "data-index" ) + "']" ).addClass( "active" );
            this.classList.add( "active" );
        } );

        service.getVideo()

        .done( function( data ) {

            var section = container.find( "section[data-index='videoFilm']" );

            [ "wedding", "prewedding", "commercial", "movie", "others" ].forEach( function( key, index ) {

                var
                item = data[index] || {},
                tab = section.find( ".tab[data-index='" + key + "']" );

                tab.find( "input[name='cover']" ).val( item.cover ).trigger( "focusout" );
                tab.find( "input[name='source']" ).val( item.source ).trigger( "focusout" );
                tab.find( "input[name='id']" ).val( item.id );
            } );

            section.removeClass( "md-loading-show" );
        } );

        service.getAbout()

        .done( function( data ) {
            container.find( "textarea[name=desc]" ).val( unescape( data.about ) ).trigger( "focusout" );
        } );

        new Clipboard( ".icon-content-copy", {
            text: function( trigger ) {
                var src = $( trigger ).parents( "li" ).find( "img" ).attr( "src" );

                if ( !/http(s)?/i.test( src ) ) {
                    return window.location.origin + "/" + src;
                }

                return src;
            }
        } )

        .on( "success", function( e ) {
            $.toast.success( "'" + e.text + "' has copied :)" );
        } );

        service.getCurrentUser()

        .done( function( data ) {
            storage.set( "user", data );
        } );

        gallery( container.find( "section[data-index='photography']" ), container );
        video( container.find( "section[data-index='videoFilm']" ), container );
        changePassword( container.find( "section[data-index='changePassword']" ), container );
        pricing( container.find( "section[data-index='pricing']" ), container );
        blog( container.find( "section[data-index='blog']" ), container );
        updateAbout( container.find( "section[data-index='updateAbout']" ), container );
    };
} );
