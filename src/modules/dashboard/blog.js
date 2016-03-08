
define( [ "modules/dashboard/service" ],
function( service ) {

    "use strict";

    return function( ele, container ) {

        var
        validationOptions = {

            class4error: "error",
            selector: "input, textarea",
            showMessage: false,
            parseElement: function( ele ) {
                return $( ele ).parents( ".md-form-group" );
            }
        },

        index = 1,
        loading = ele.find( ".md-loading" ),

        pagination = ele.find( ".md-pagination" ).pagination( {
            total: 1,
            index: index,

            onPageChange: function( current ) {
                index = current;
                loadPosts();
            }
        } );

        function loadPosts() {

            var
            posts = ele.find( ".posts" ),
            title = ele.find( "#title" ).val(),

            html = "";

            loading.addClass( "md-loading-show" );

            service.getPosts( index, title )

            .done( function( data ) {

                var rows = data.rows;

                for ( var i = 0, length = rows.length; i < length; ++i ) {

                    var item = rows[i];

                    html += '<li>' +
                                '<h4 data-id="' + item.id + '">' + item.title + '</h4>' +
                                '<span class="date">' + dateutil( item.create_date ).format( "%B %A, %Y" ) + '</span>' +
                                '<span class="delete" data-id="' + item.id + '">DELETE</span>' +
                            '</li>';
                }

                posts.html( html );
                pagination.val( data.index, data.pageTotal );
                loading.removeClass( "md-loading-show" );
            } )

            .fail( function() {
                $.toast.error( "Failed to fetch posts :)" );
            } );
        }

        function createUpdate( id ) {

            var

            create = function( params, close ) {

                return service.publishPost( params )

                .done( function( data ) {

                    close();
                    index = 1;
                    loadPosts();
                    $.toast.success( "Publish post success :)" );
                } )

                .fail( function() {
                    $.toast.error( "Failed to publish post, Please retry :(" );
                } );
            },

            update = function( params, close ) {

                params.id = id;

                return service.updatePost( params )

                .done( function( data ) {

                    close();
                    index = 1;
                    loadPosts();
                    $.toast.success( "Update post success :)" );
                } )

                .fail( function() {
                    $.toast.error( "Failed to update post, Please retry :(" );
                } );
            };

            $.modal( {
                class4modal: "modal-blog",
                showTitle: false,
                render: function( ready, close ) {

                    var self = this.addClass( "md-loading" );

                    this
                    .html( container.find( "modal[name='blog']" ).html() )

                    .delegate( "button[name=cancel]", "click", close )

                    .delegate( "button[name=submit]", "click", function() {

                        var
                        ripple = $( this ).ripple( { random: true, speed: 800 } ),
                        form = self.find( ".form-horizontal" ).validation( validationOptions ),
                        params = form.series();

                        if ( form.validate().state() === "resolved" ) {

                            ripple.show();

                            (id ? update : create)( params, close )
                            .always( function() { ripple.hide(); } );
                        }
                    } );

                    if ( id ) {

                        service.getPostDetail( id )

                        .done( function( data ) {

                            data = data.data;

                            [ "title", "teaser", "content" ].some( function( key ) {
                                self.find( "[name='" + key + "']" ).val( data[key] ).trigger( "focusout" );
                            } );
                            self.removeClass( "md-loading-show" );
                        } );
                    } else {
                        self.removeClass( "md-loading-show" );
                    }

                    ready.resolve();
                }
            } )

            .$node
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
            } );
        }

        ele
        .delegate( "button[name='search']", "click", function() {

            index = 1;
            loadPosts();
        } )

        .delegate( "button[name=addPost]", "click", function() {
            createUpdate();
        } )

        .delegate( "h4[data-id]", "click", function() {
            createUpdate( this.getAttribute( "data-id" ) );
        } )

        .delegate( ".delete[data-id]", "click", function() {

            var id = this.getAttribute( "data-id" );

            $.message.confirm( {
                title: "Please confirm",
                message: "Do you want to remove this post?",
                onOk: function() {

                    service.removePost( id )

                    .done( function() {

                        index = 1;
                        loadPosts();
                        $.toast.success( "Remove post success :)" );
                    } )

                    .fail( function() {
                        $.toast.error( "Failed to remove post, Please try again :)" );
                    } );
                }
            } );
        } );

        loadPosts();
    };
} );
