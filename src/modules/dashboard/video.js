
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
        };

        ele
        .delegate( "button[name='preview']", "click", function() {

            var
            self = $( this ),
            ripple = self.ripple( { random: true } ).show(),
            form = self.parents( ".md-validation" ).validation( validationOptions );

            if ( form.validate().state() === "rejected" ) { return; }

            $.modal( {

                showTitle: false,
                class4modal: "modal-videoPreview",
                animation: "scale",
                closeByDocument: true,

                render: function( ready, close ) {

                    var self = this;
                    this.html( form.$node.find( "input[name='source']" ).val() );
                }
            } );
        } )

        .delegate( "button[name='submit']", "click", function() {

            var
            self = $( this ),
            ripple = self.ripple( { random: true, speed: 800 } ).show(),
            form = self.parents( ".md-validation" ).validation( validationOptions );

            if ( form.validate().state() === "resolved" ) {

                service.updateVideo( form.series() )

                .done( function( data ) {
                    $.toast.success( "Update success :)" );
                } )

                .fail( function() {
                    $.toast.error( "Operation failed, Please retry :(" );
                } )

                .always( function() { ripple.hide(); } );
            }
        } )

        .delegate( "nav > div[data-index]", "click", function() {

            var
            self = $( this ),
            index = this.getAttribute( "data-index" ),
            section;

            if ( self.hasClass( "active" ) ) { return; }

            section = self.parents( "section" );

            section.find( ".active" ).removeClass( "active" );
            section.find( "[data-index='" + index + "']" ).addClass( "active" );
        } );
    };
} );
