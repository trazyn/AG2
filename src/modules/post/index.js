
define( [ "modules/post/service" ],
function( service ) {

    "use strict";

    return function( container ) {

        var
        currentId = Path.where().params.id,
        index = 1;

        function postDetail( id, dataProvider ) {

            var nav = container.find( "nav" );
            container.addClass( "md-loading-show" );
            dataProvider = dataProvider || service.getPostDetail;

            dataProvider( id )
            .done( function( data ) {

                if ( data.hasnext ) {
                    nav.addClass( "hasnext" );
                } else {
                    nav.removeClass( "hasnext" );
                }

                nav[data.hasprev ? "addClass" : "removeClass"]( "hasprev" );

                data = data.data;

                if ( !data ) {
                    return Path.where( "/#/home" );
                }

                currentId = data.id;
                Path.where( "/#/post/" + currentId );

                container.find( ".create-dete" ).text( dateutil( data.create_date ).format( "%B %A, %Y" ) );
                container.find( "h1" ).text( data.title );
                container.find( ".blog-bg" ).attr( "src", data.teaser );
                container.find( ".post-content-wrapper" ).html( "<h2>" + data.title + "</h2>" + markdown.toHTML( data.content ) );
                container.removeClass( "md-loading-show" );
            } );
        }

        function loadPosts( index ) {

            var
            html = "",
            title = container.find( ".search input" ).val(),
            $list = container.find( ".post-list ul" );

            return service.getPosts( index, title )

            .done( function( data ) {

                data = data.rows;

                for ( var i = 0, length = data.length; i < length; ++i ) {

                    var item = data[i];

                    html += '<li data-id="' + item.id + '">' +
                                '<h4>' + item.title + '</h4>' +
                                '<span class="create-date">' + dateutil( item.create_date ).format( "%B %d, %Y" ) + '</span>' +
                            '</li>';
                }

                if ( index === 1 ) {
                    $list.html( html );
                } else {
                    $list.append( html );
                }
            } );
        }

        container
        .delegate( ".show-more, .hide-more", "click", function( e ) {

            e.stopPropagation();
            e.preventDefault();
            container.toggleClass( "show-search" );
        } )

        .delegate( ".load-more", "click", function() {

            var
            self = $( this ).addClass( "loading" ).attr( "disabled", true );
            loadPosts( ++index )

            .done( function() {

                self
                .removeAttr( "disabled" )
                .removeClass( "loading" );
            } );
        } )

        .delegate( ".search input", "keyup", function( e ) {

            if ( e.keyCode === 13 ) {
                loadPosts( index = 1 );
            }
        } )

        .delegate( "li[data-id]", "click", function() {
            postDetail( this.getAttribute( "data-id" ) );
        } )

        .delegate( ".next", "click", function() {
            postDetail( currentId, service.getNext );
        } )

        .delegate( ".prev", "click", function() {
            postDetail( currentId, service.getPrev );
        } );

        postDetail( currentId );
        loadPosts( index );

        var router = Path.where();

        $.extend( router, {
            enter: function() {

                var
                router = Path.where(),
                id = router.params.id;

                if ( id !== currentId ) {
                    postDetail( router.params.id );
                }

                return false;
            },
            exit: function() {
                router.enter = null;
            }
        } );
    };
} );
