
define( [ "util/validators" ], function( validators ) {

    var

    namespace = "$ui.validation",

    Validation = function( container, settings ) {

        var self = this;

        settings.validators = $.extend( {}, validators, settings.validators );

        this.$node = container;
        this.settings = settings;

        container
        .delegate( ":reset", "click", function() {
            self.clean();
        } );

        if ( settings.autoValidate ) {

            container
            .delegate( settings.selector, "focusout", function( e ) {
                self.validate( [ $( this ) ] );
            } );
        }
    };

    function mouseenter( e ) {

        var
        self = $( this ),
        container = e.data.container,
        message = e.data.message,
        tooltipOffset = e.data.tooltipOffset,
        offset = self.offset(),
        containerOffset = container.offset(),
        tooltip;

        if ( self.hasClass( "md-validation-tooltiped" ) ) { return; }

        tooltip = $( "<div class='md-validation-message'><p>" + message + "</p></div>" )
            .css( {
                "position": "absolute",
                "top": offset.top - 30 - containerOffset.top + (tooltipOffset.top || 0),
                "left": offset.left - containerOffset.left + (tooltipOffset.left || 0)
            } )
            .appendTo( container );

        self.addClass( "md-validation-tooltiped" ).data( "tooltip", tooltip );
        self.off( "mouseleave", mouseleave ).on( "mouseleave", { target: self, tooltip: tooltip }, mouseleave );
        setTimeout( function() { tooltip.addClass( "md-error-show" ); } );
    }

    function mouseleave( e ) {

        var tooltip = e.data.tooltip;

        tooltip.removeClass( "md-error-show" );
        setTimeout( function() { tooltip.remove(); }, 300 );
        e.data.target.removeClass( "md-validation-tooltiped" );
    }

    function clean( target, settings ) {

        target
        /** Remove all events and classes */
        .removeClass( settings.class4error )
        .off( "mouseenter", mouseenter )
        .off( "mouseleave", mouseleave )
        .removeClass( "md-validation-tooltiped" )
        .removeData( "tooltip" );
    }

    function change( e ) {

        var
        instance = e.data.args.instance,
        settings = instance.settings,
        target = e.data.args.target,
        parameter = e.data.args.parameter,
        validator = e.data.args.validator;

        $.when( validator.call( settings.validators, target.val(), parameter, target, instance ) )
            .done( function() {
                var tooltip = target.data( "tooltip" );

                clean( target, settings );

                tooltip && tooltip.remove();
            } );
    }

    Validation.prototype = {
        validate: function( eles ) {

            var
            self = this,
            settings = this.settings,
            deferreds = [],
            eles = eles || this.$node.find( settings.selector );

            function getMessage( target ) {

                var
                messages = target.attr( "messages" ),
                matched = (messages || "").match( /(\w+\s*:\s*'[^']+')+/g ) || [];

                messages = {};

                while ( matched.length ) {
                    var expr = matched.pop().split( ":" );
                    messages[ expr[0].trim() ] = expr[1].replace( /^\s*'|'\s*/g, "" );
                }

                return messages;
            }

            function handle( target, validator, messages ) {

                var
                deferred,
                result,
                parameter,
                message;

                if ( "string" === typeof validator ) {
                    message = messages[ validator ];
                    validator = settings.validators[ validator ];
                } else {

                    var
                    /** Use the first validator, ignore others */
                    key = Object.keys( validator )[0],
                    parameter = validator[ key ],
                    validator = settings.validators[ key ],
                    message = messages[ key ];

                    if ( !validator && parameter instanceof Function ) {
                        validator = parameter;
                        parameter = void 0;
                    }
                }

                message = message || settings.message;

                result = validator.call( settings.validators, target.val(), parameter, target, self );

                if ( result === false ) {
                    deferred = $.Deferred();
                    deferred.reject();
                } else {
                    deferred = result;
                }

                target = settings.parseElement( target, settings );

                $.when( deferred )
                    .fail( function() {
                        target
                        .addClass( settings.class4error )
                        .off( "mouseenter", mouseenter );

                        if ( settings.showMessage ) {

                            target
                            .on( "mouseenter", {
                                message: message,
                                container: self.$node,
                                tooltipOffset: settings.tooltipOffset || {}
                            }, mouseenter );
                        }
                    } )
                    .done( function() {
                        target
                        .removeClass( settings.class4error )
                        .off( "mouseenter", mouseenter )
                        .off( "mouseleave", mouseleave );
                    } );

                deferreds.push( deferred );

                target.off( "change", change ).on( "change"
                        , { args: { target: target, validator: validator, parameter: parameter, instance: self } }
                        , change );

                return result;
            }

            for ( var i = eles.length; --i >= 0; ) {

                var
                ele = $( eles[i] ),
                messages = getMessage( ele ),
                validators = ele.attr( "validators" ) || [];

                try {
                    validators = eval( validators );
                } catch( ex ) {
                    validators = [];
                }

                for ( var m = 0, length = validators.length; m < length; ++m ) {

                    if ( !handle( ele, validators[ m ], messages ) && settings.breakOnError ) {
                        break;
                    }
                }
            }

            return $.when.apply( $, deferreds );
        },

        series: function() {

            var params = {};

            this
            .$node
            .find( this.settings.selector )
            .each( function() {

                var
                self = $( this ),
                name = self.attr( "name" );

                if ( name ) {

                    if ( self.is( "[type=radio]" ) ) {
                        if ( self.is( ":checked" ) ) {
                            params[ name ] = self.val();
                        }
                        return;
                    }

                    if ( self.is( "[type=checkbox]" ) ) {

                        params[ name ] = params[ name ] || [];

                        if ( self.is( ":checked" ) ) {
                            params[ name ].push( self.val() );
                        }
                        return;
                    }

                    params[ name ] = self.val();
                }
            } );

            return params;
        },

        clean: function() {

            var settings = this.settings;

            this
            .$node
            .find( settings.selector )
            .each( function() {
                clean( settings.parseElement( $( this ).val( "" ) ), settings );
            } );

            return this;
        }
    };

    $.fn.validation = function( options ) {

        var
        instance = this.data( namespace );

        if ( !instance ) {
            instance = new Validation( this, $.extend( true, {}, $.fn.validation.defaults, options ) );
            this.data( namespace, instance );
        }

        return instance;
    };


    $.fn.validation.defaults = {

        class4error     : "md-error",
        selector        : ":input[validators]:visible:not(button)",

        message         : "Invalid input",
        breakOnError    : true,
        showMessage     : true,
        autoValidate    : false,

        /** TODO: bootstrap form-control */
        parseElement    : function( target ) {

            var parent = target.parent();

            if ( target.is( "select, :checkbox, :radio" ) && parent.is( ".md-select, .md-switch, .md-radio" ) ) {

                if ( target.is( ":radio" ) && parent.parent().is( ".ui.radioes" ) ) {
                    return parent.parent();
                }

                return parent;
            } else if ( target.is( ":checkbox" ) && (parent = target.parents( ".ui.checkboxes:first" ), parent.length) ) {
                return parent;
            }

            return target;
        },

        validators      : {}
    };
} );
