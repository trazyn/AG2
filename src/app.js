
require.config( {

	baseUrl: "./src",

	paths: {
        ui: "../src/ui",
		util: "../src/util",
		modules: "../src/modules"
	}
} );

/**
 * All dependences put here for easy build
 * */
require( [ "util/storage",
        "ui/toast",
        "ui/dropdown",
        "ui/modal",
        "ui/pagination",
        "ui/ripple",
        "ui/slide",
        "ui/validation",
        "ui/message",
        "util/validators",
        "util/storage",
        "modules/dashboard/service",
        "modules/dashboard/blog",
        "modules/dashboard/changePassword",
        "modules/dashboard/gallery",
        "modules/dashboard/pricing",
        "modules/dashboard/video",
        "modules/dashboard/index",
        "modules/home/service",
        "modules/home/index",
        "modules/photography/service",
        "modules/photography/index",
        "modules/login/service",
        "modules/login/index",
        "modules/post/service",
        "modules/post/index"
], function( storage ) {

    "use strict";

    var
    container = $( "#container" );

    Path

    .config( {

        /** Ajax page container */
        container: container,

        after: function() {

            var scripts;

            container
            .find( "script[type='amd']" )
            .each( function() {

                var
                module = this.src,
                $body = $( document.body );

                $body.addClass( "md-loading-show" );

                module = module.substr( module.indexOf( "src/modules" ) ).substr(4).replace( /\.js$/i, "" );

                require( [ module ], function( module ) {
                    module( container.children() );
                    $body.removeClass( "md-loading-show" );
                } );
            } );
        }
    } )

    .when( "#/home", {
        view: "src/modules/home/index.html"
    } )

    .when( "#/photography/:type?", {
        view: "src/modules/photography/index.html"
    } )

    .when( "#/login", {
        view: "src/modules/login/index.html"
    } )

    .when( "#/dashboard", {
        view: "src/modules/dashboard/index.html"
    } )

    .when( "#/post/:id", {
        view: "src/modules/post/index.html"
    } )

    .otherwise( "#/home" )
    .listen();

    var timer;

    $.ajaxSetup( {
        complete: function( xhr ) {

            if ( xhr.status === 401 ) {

                $.toast.error( "Please login!" );
                storage.remove( "user" );
                clearTimeout( timer );
                timer = setTimeout( function() {
                    location.href = "/#/login";
                }, 100 );
            } else if ( xhr.status === 413 ) {
                $.toast.error( "Please check your network or upload file is too large :(" );
            }
        }
    } );
} );

