
define( [], function() {

    "use strict";

    var
    namespace = "$ui.slide",

    Slide = function( target, settings ) {

        var
        self = this,

        loop = function() {
            clearInterval( loop.timer );
            loop.timer = setInterval( function() {
                self.next();
            }, settings.duration );
        },

        index = target.find( "." + settings.class4active + "[data-index]:first" ).attr( "data-index" );

        if ( index ) {
            target
            .find( settings.selector4item + ", " + settings.selector4dot )
            .removeClass( settings.class4active )
            .filter( "[data-index=" + index + "]" )
            .addClass( settings.class4active );
        } else {
            self.change( target.find( settings.selector4item ).attr( "data-index" ) );
        }

        target
        .delegate( settings.selector4dot, "click", function() {
            self.change( this.getAttribute( "data-index" ) );
        } )
        .delegate( settings.selector4prev, "click", this.previous.bind( this ) )
        .delegate( settings.selector4next, "click", this.next.bind( this ) );

        this.$node = target;
        this.settings = settings;
        this.index = index;

        target
        .on( "mouseenter", function() {
            clearInterval( loop.timer );
        } )
        .on( "mouseleave", loop );

        loop();
    };

    Slide.prototype = {

        change: function( index ) {

            var
            $node = this.$node,
            settings = this.settings,

            slides = $node.find( settings.selector4item ),
            dots = $node.find( settings.selector4dot ),

            slide = slides.filter( "[data-index=" + this.index + "]" );

            if ( index === -1 ) {

                slide = slide.prev( settings.selector4item );

                if ( !slide.length ) {
                    slide = slides.last();
                }
            } else if ( undefined === index ) {

                slide = slide.next( settings.selector4item );

                if ( !slide.length ) {
                    slide = slides.first();
                }
            } else {
                slide = slides.filter( "[data-index=" + index + "]" );
            }

            index = slide.attr( "data-index" );

            if ( this.index !== index ) {
                slides
                .add( dots )
                .removeClass( settings.class4active )
                .filter( "[data-index=" + index + "]" )
                .addClass( settings.class4active );
                this.index = index;
            }
        },

        previous: function() {
            this.change( -1 );
        },

        next: function() {
            this.change();
        }
    };

    $.fn.slide = function( options ) {

        var instance = this.data( namespace );

        if ( !instance ) {
            instance = new Slide( this, $.extend( {}, $.fn.slide.defaults, options ) );
            this.data( namespace, instance );
        }

        return instance;
    };

    $.fn.slide.defaults = {
        selector4item   : ".slide-item",
        selector4dot    : ".slide-dots span",
        selector4prev   : ".slide-prev",
        selector4next   : ".slide-next",
        class4active    : "slide-active",
        duration        : 6000
    };
} );
