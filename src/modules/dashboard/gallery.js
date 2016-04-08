
define( [ "modules/dashboard/service" ],
function( service ) {

    "use strict";

    return function( ele, container ) {

        var
        validationOptions = {

            class4error: "error",
            selector: "input, radio",
            showMessage: false,
            parseElement: function( ele ) {
                return $( ele ).parents( ".md-form-group" );
            }
        },

        index = 1,

        pagination = ele.find( ".md-pagination" ).pagination( {
            total: 1,
            index: index,

            onPageChange: function( current ) {
                index = current;
                loadGallery();
            }
        } ),

        dropdown = ele
        .find( ".md-dropdown" )
        .dropdown( {
            data: [ {
                text: "Wedding",
                value: "1"
            }, {
                text: "Pre-Wedding",
                value: "2"
            }, {
                text: "Portrait",
                value: "3"
            }, {
                text: "Children",
                value: "4"
            }, {
                text: "Fashion",
                value: "5"
            }, {
                text: "Other",
                value: "6"
            } ],
            nothing: "Choice photography type"
        } );

        function loadGallery() {

            var
            gallery = ele.find( ".gallery" ),
            keyword = ele.find( "#search" ).val(),
            type = dropdown.val()[0],

            category = [ "Wedding", "Pre-Wedding", "Portrait", "Children", "Fashion", "Other" ],

            html = "";

            service.getGallery( index, keyword, type )

            .done( function( data ) {

                var rows = data.rows;

                for ( var i = 0, length = rows.length; i < length; ++i ) {

                    var item = rows[i];

                    html += '<li class="item">' +
                                '<img src="' + item.teaser + '">' +
                                '<div class="desc">' +
                                    '<span class="photo-name">' + item.title + '</span>' +
                                    '<span class="photo-category ">' +
                                        '<i class="icon-turned-in"></i>' + category[item.type] +
                                    '</span>' +
                                    '<i class="icon-content-copy" title="Copy photo link to clipboard"></i>' +
                                    '<i class="icon-delete" title="Remove this photo" data-id="' + item.id + '"></i>' +
                                '</div>' +
                            '</li>';
                }

                gallery.html( html );
                pagination.val( data.index, data.pageTotal );
            } )

            .fail( function() {
                $.toast.error( "Failed to fetch gallery :)" );
            } );
        }

        ele
        .delegate( "button[name='search']", "click", function() {

            index = 1;
            loadGallery();
        } )

        .delegate( "button[name=addPhoto]", "click", function() {

            $.modal( {
                title: "Add Photo",
                class4modal: "modal-addPhoto",
                animation: "scale",
                render: function( ready, close ) {

                    var self = this;

                    this.html( container.find( "modal[name='add-photo']" ).html() );

                    ready.resolve();

                    setTimeout( function() {

                        self
                        .delegate( "button[name=cancel]", "click", close )

                        .delegate( "button[name=submit]", "click", function() {

                            var
                            ripple = $( this ).ripple( { random: true, speed: 800 } ),
                            form = self.find( ".form-horizontal" ).validation( validationOptions ),
                            params = form.series();

                            if ( form.validate().state() === "resolved" ) {

                                if ( !params.img ) {
                                    return $.toast.error( "Please upload photo" );
                                }

                                ripple.show();
                                service.addPhoto( form.series() )

                                .done( function() {
                                    close();
                                    index = 1;
                                    loadGallery();
                                    $.toast.success( "Add photo success :)" );
                                } )

                                .fail( function() {
                                    $.toast.error( "Failed to add photo, Please retry :(" );
                                } )

                                .always( function() { ripple.hide(); } );
                            }
                        } )

                        .delegate( ".md-form-group input.md-field", "focus focusout", function( e ) {

                            var self = $( this ).parent();

                            if ( e.type === "focusout" ) {

                                self[ this.value ? "addClass" : "removeClass" ]( "hasvalue" ).removeClass( "focused" );
                            } else {
                                self.addClass( "focused" );
                            }
                        } )

                        .find( "input[type=file]" )
                        .attr( "id", +new Date() )
                        .uploadify( {
                            auto: true,
                            buttonClass: "icon-create",
                            buttonText: "",
                            method: "PUT",
                            multi: false,
                            queueSizeLimit: 1,
                            queueID: "fileQueue",
                            swf: "../../../bower_components/uploadify/uploadify.swf",
                            uploader: "/api/gallery",
                            fileTypeExts: "*.jpg;*.bmp;*.gif;*.png",
                            height: 48,
                            width: 48,
                            onUploadSuccess: function( file, data ) {

                                var filename;

                                data = eval( "(" + data + ")" );

                                filename = data.filename;
                                self.find( "input[name=img]" ).val( filename );
                                self.find( "img" ).attr( "src", filename ).addClass( "hasvalue" );
                            },
                            onUploadError: function() {
                                $.toast.error( "Upload pricing failed, Please retry :(" );
                            }
                        } );
                    } );
                }
            } );
        } )

        .delegate( ".icon-delete[data-id]", "click", function() {

            var
            self = $( this ),
            id = self.attr( "data-id" ),
            title = self.parents( "li" ).find( ".photo-name" ).text();

            $.message.confirm( {
                title: "Please confirm",
                message: "Do you want to remove the photo '" + title + "'?",
                onOk: function() {

                    service.removePhoto( id )

                    .done( function() {

                        index = 1;
                        loadGallery();
                        $.toast.success( "Remove photo success :)" );
                    } )

                    .fail( function() {
                        $.toast.error( "Failed to remove photo, Please try again :)" );
                    } );
                }
            } );
        } );

        loadGallery();
    };
} );
