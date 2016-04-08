
define( [ "modules/home/service",
       "modules/photography/index",
       "ui/slide",
       "ui/toast",
       "ui/validation" ],
function( service, photography ) {

    "use strict";

    return function( container, loader ) {

        var
        menus = container.find( ".menus li[data-index]" ),
        ticker = function() {

            ticker.ticking = true;

            setTimeout( function() {

                var
                index = current.attr( "data-index" ),
                item = menus.filter( "[data-index='" + index + "']" );

                if ( item.length ) {
                    menus.find( ".md-link" ).removeClass( "active" );
                    item.find( ".md-link" ).addClass( "active" );
                }

                ticker.ticking = false;
            }, 500 );
        },

        current = container.find( "section[data-index]:first" );

        container.on( "mousewheel", function( e ) {

            var section;

            if ( ticker.ticking ) {
                return;
            }

            /** Up scroll */
            if ( e.originalEvent.wheelDelta / 120 > 0 ) {

                section = current.prev( "section.background" );
                if ( section.length ) {
                    ticker();

                    current.removeClass( "active" );
                    current = section.removeClass( "down-scroll" ).addClass( "up-scroll" );
                }
            } else {
                /** Down scroll */
                section = current.next( "section.background" );
                if ( section.length ) {
                    ticker();
                    current.removeClass( "up-scroll active" ).addClass( "down-scroll" );
                    current = section;
                }
            }

            current.addClass( "active" );
        } )

        .delegate( ".menus li[data-index]", "click", function() {

            var
            self = $( this ),
            index = self.attr( "data-index" ),
            slide;

            self
            .parents( "ul" )
            .find( ".md-link" )
            .removeClass( "active" );

            if ( current !== index ) {

                current.removeClass( "active" );
                current = container.find( "section.background[data-index='" + index + "']" ).addClass( "active" );
                container.find( "section.background[data-index]" ).removeClass( "up-scroll down-scroll" );
                current.prevAll( "section.background[data-index]" ).removeClass( "up-scroll" ).addClass( "down-scroll" );

                self.find( ".md-link" ).addClass( "active" );
            }
        } )

        .delegate( "form button[name=send]", "click", function( e ) {

            var form = $( this ).parents( "form" ).validation();

            e.preventDefault();
            e.stopPropagation();

            if ( form.validate().state() === "resolved" ) {
                loader.start();

                $.ajax( {
                    type: "POST",
                    url: "service/sendFeedback",
                    data: form.series()
                } )

                .fail( function() {
                    $.toast.top( "Failed to send the feedback, please try again :(" ).left();
                } )

                .done( function() {
                    form.clean();
                    $.toast.top( "Thank you for your feedback!", "md-toast-lightGray" ).left();
                } )

                .always( function() { loader.done(); } );
            }
        } )

        .delegate( "section[data-index='photography'] a[data-type]", "click", function( e ) {

            e.preventDefault();
            e.stopPropagation();

            photography( container.find( ".modal-photography" ), this.getAttribute( "data-type" ) );
        } )

        .delegate( "section[data-index='video-film'] a[data-type]", "click", function( e ) {

            var
            self = $( this ),
            type = self.attr( "data-type" ),
            videoes = self.parents( ".row" ).find( ".video[data-type]" );

            e.preventDefault();
            e.stopPropagation();

            if ( self.hasClass( "active" ) ) { return; }

            self.addClass( "active" ).parents( "ul" ).find( ".active" ).not( self ).removeClass( "active" );

            videoes.filter( ".show" ).stop().fadeOut( 400, function() {

                $( this ).removeClass( "show" );
                videoes.filter( "[data-type='" + type + "']" ).stop().fadeIn( 200, function() { $( this ).addClass( "show" ); } );
            } );
        } )

        .delegate( ".showcase img", "click", function() {

            var self = $( this );

            $.modal( {

                showTitle: false,
                class4modal: "modal-showcase",
                animation: "scale",
                closeByDocument: true,

                render: function( ready, close ) { this.html( self.clone() ); }
            } );
        } )

        .find( ".slide:first" ).slide();

        service.getVideo()

        .done( function( data ) {

            var section = container.find( "section[data-index='video-film']" );

            [ "pre-wedding", "wedding", "movie", "commercial", "other" ].forEach( function( key, i ) {

                var item = data[i] || {};
                section.find( ".video[data-type='" + key + "']" ).html( item.source );
            } );
        } );

        service.getNewest()

        .done( function( data ) {

            var html = "";

            for (  var i = 0, length = data.length; i < length; ++i ) {

                if ( i === 0 || i % 3 === 0 ) {
                    html += '<div class="row">';
                }

                html += '<div class="col-md-4">' +
                            '<img src="' + data[i].teaser + '" class="md-loading md-loading-show" onload="this.classList.remove(\'md-loading-show\')">' +
                        '</div>';

                if ( (i + 1) % 3 === 0 ) {
                    html += '</div>';
                }
            }

            container.find( ".showcase" ).html( html );
        } );

        service.getNewestPost()

        .done( function( data ) {

            var
            html = "",
            clam = function( string, length ) {

                if ( string.length > length ) {
                    return string.substr( 0, length ) + "...";
                }

                return string;
            };

            for ( var i = 0, length = data.length; i < length; ++i ) {

                var item = data[i];

                html += '<div class="row post">' +
                            '<div class="col-md-4">' +
                                '<div class="post-cover image-zoom">' +
                                    '<img src="' + item.teaser + '" alt="">' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-8">' +
                                '<div class="post-title">' +
                                    '<a class="md-link" href="/#/post/' + item.id + '">' +
                                        item.title +
                                    '</a>' +
                                '</div>' +
                                '<div class="post-content">' +
                                    clam( item.content, 200 ) +
                                '</div>' +
                                '<div class="post-date">' +
                                    dateutil( item.create_date ).format( "%d %A %Y" ) +
                                '</div>' +
                            '</div>' +
                        '</div>';
            }

            container.find( ".post-list" ).append( html );
        } );

        service.getAbout()

        .done( function( data ) {
            container.find( ".about-content" ).html( unescape( data.about ) );
        } );
    };
} );
