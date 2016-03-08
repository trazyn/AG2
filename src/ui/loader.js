
define( [], function() {

    var
    namespace = "$ui.loader",

    Loader = function( target ) {
        this.$node = target;
    };

    Loader.prototype = {

        start: function() {
            this.$node.addClass( "md-loader-show" );
            return this;
        },

        done: function() {
            this.$node.removeClass( "md-loader-show" );
            return this;
        }
    };

    $.fn.loader = function() {

        var instance = this.data( namespace );

        if ( !instance ) {
            instance = new Loader( this );
            this.data( namespace, instance );
        }
        return instance;
    };
} );
