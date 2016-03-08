
define( [ "modules/dashboard/service" ],
function( service ) {

    "use strict";

    return function( ele, container ) {

        var
        validationOptions = {

            class4error: "error",
            selector: "[validators]",
            showMessage: false,
            parseElement: function( ele ) {
                return $( ele ).parents( ".md-form-group" );
            }
        };

        ele
        .delegate( "button[name='updateAbout']", "click", function() {

            var
            self = $( this ),
            ripple = self.ripple( { random: true, speed: 800 } ),
            form = self.parents( ".md-validation" ).validation( validationOptions );

            if ( form.validate().state() === "resolved" ) {

                ripple.show();

                service.updateAbout( form.series() )

                .done( function( data ) {

                    if ( data.err ) {
                        return $.toast.error( data.err.message );
                    }

                    $.toast.success( "Update success！" );
                } )

                .fail( function() {
                    $.toast.error( "Failed to update about，Please retry：（" );
                } )

                .always( function() { ripple.hide(); } );
            }
        } );
    };
} );
