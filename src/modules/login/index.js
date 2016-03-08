
define( [ "modules/login/service",
        "util/storage",
        "ui/validation",
        "ui/ripple",
        "ui/toast" ],
function( service, storage ) {

    "use strict";

    return function( container ) {

        if ( (storage.get( "user" ) || {}).user ) { window.location.href = "/"; }

        container
        .delegate( ".md-form-group input.md-field", "focus focusout", function( e ) {

            var self = $( this ).parent();

            if ( e.type === "focusout" ) {

                self[ this.value ? "addClass" : "removeClass" ]( "hasvalue" ).removeClass( "focused" );
            } else {
                self.addClass( "focused" );
            }
        } )

        .delegate( "button", "click", function() {

            var
            self = $( this ),
            ripple = self.ripple( { random: true, speed: 900 } ),
            form = self.parents( ".sign-in" ).validation( {
                class4error: "error",
                showMessage: false,
                parseElement: function( ele ) {
                    return $( ele ).parents( ".md-form-group" );
                }
            } );

            if ( form.validate().state() === "resolved" ) {

                ripple.show();

                service.login( form.series() )

                .done( function( data ) {

                    if ( data.err ) {
                        return $.toast.error( data.err );
                    }

                    window.location.hash = "#/dashboard";
                } )

                .always( function() { ripple.hide(); } );
            }
        } )

        .delegate( "input", "keydown", function( e ) {

            if ( e.which === 13 ) {
                $( this ).parents( ".sign-in" ).find( "button" ).trigger( "click" );
            }
        } );
    };
} );
