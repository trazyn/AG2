
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
        .delegate( "button[name='changePassword']", "click", function() {

            var
            self = $( this ),
            ripple = self.ripple( { random: true, speed: 800 } ),
            form = self.parents( ".md-validation" ).validation( validationOptions );

            if ( form.validate().state() === "resolved" ) {

                ripple.show();

                service.changePassword( form.series() )

                .done( function( data ) {

                    if ( data.err ) {
                        return $.toast.error( data.err.message );
                    }

                    form.clean();
                    $.toast.success( "修改密码成功！" );
                } )

                .fail( function() {
                    $.toast.error( "修改密码失败，请重试：（" );
                } )

                .always( function() { ripple.hide(); } );
            }
        } );
    };
} );
