
var

/** Plugin list */
rename = require( "gulp-rename" ),
concat = require( "gulp-concat" ),
uglify = require( "gulp-uglify" ),
jshint = require( "gulp-jshint" ),
debug = require( "gulp-debug" ),
browserSync = require( "browser-sync" ),
compress = require( "compression" ),
replace = require( "gulp-replace" ),
imgop = require( "gulp-image-optimization" ),
rev = require( "gulp-rev" ),
revReplace = require( "gulp-rev-replace" ),
useref = require( "gulp-useref"),
gulpif = require( "gulp-if" ),
less = require( "gulp-less" ),
cleancss = new (require( "less-plugin-clean-css" ))( { advanced: true, compatibility: "ie8" } ),
autoprefix = new (require( "less-plugin-autoprefix" ))( { browsers: [ "last 4 versions" ] } ),
minifyCSS = require( "gulp-minify-css" ),
httpProxy = require( "http-proxy-middleware" ),
connect = require( "connect" ),
serveStatic = require( "serve-static" ),
amd = require( "gulp-amd-optimizer" ),

fs = require( "fs" ),

/** Task definitions */
bs, gulp = require( "gulp" )

	.task( "www", function() {

	    var
	    app = connect(),
	    proxy = httpProxy( [ "/api/**" ], {
            target: "http://127.0.0.1:8080",
            changeOrigin: true,
            logLevel: "debug"
        });

        app.use( proxy );
        app.use( compress() );
        app.use( serveStatic( "./dist" ) );
        app.listen( 3000 );
	} )

	.task( "www:dev", function() {

	    var proxy = httpProxy( [ "/api/**" ], {
            target: "http://127.0.0.1:8080",
            changeOrigin: true,
            logLevel: "debug"
        });

		bs = browserSync( {
            server: {
				baseDir: "./",
				index: "index-dev.html",
				files: [ "dist/**/*.css", "js/**/*.js", "src/style/**/*.less" ],
                middleware: [ proxy ]
            }
		} );
	} )

	.task( "dist:assets", [ "amd" ], function() {

		var assets = useref.assets();

        gulp.src( [ "src/**/*", "!src/**/*.less", "images/**/*.webp", "!src/**/*.css" ], { base: "." } )
            .pipe( gulpif( "*.js", uglify() ) )
            .pipe( gulp.dest( "dist" ) );

        gulp.src( [ "uploads/**/*.{jpg,png,jepg,gif}", "images/**/*.{jpg,png,jepg,jpeg,gif}" ], { base: "." } )
            .pipe( imgop( {
                optimizationLevel: 5,
                progressive: true,
                interlaced: true
            } ) )
            .pipe( gulp.dest( "dist" ) );

        gulp.src( [ "fonts/icomoon/fonts/**/*.ttf",
                "fonts/icomoon/fonts/**/*.svg",
                "fonts/icomoon/fonts/**/*.eot",
                "fonts/icomoon/fonts/**/*.woff" ], { base: "fonts/icomoon/fonts" } )
            .pipe( gulp.dest( "dist/fonts" ) );

        gulp.src( [ "fonts/*.ttf",
                "fonts/*.svg",
                "fonts/*.eot",
                "fonts/*.woff" ] )
            .pipe( gulp.dest( "dist/fonts" ) );

        gulp.src( [ "bower_components/uploadify/uploadify.swf" ], { base: "bower_components" } )
            .pipe( gulp.dest( "dist/images" ) );

        gulp.src( "index.html" )
            .pipe( assets )
            .pipe( gulpif( "*.js", uglify() ) )
            .pipe( gulpif( "*.css", minifyCSS() ) )
            .pipe( rev() )
            .pipe( assets.restore() )
            .pipe( useref() )
            .pipe( revReplace() )
            .pipe( gulp.dest( "dist" ) );
	} )

	.task( "dist:replace", function() {

        return gulp.src( [ "dist/**/*.css", "dist/**/*.js", "dist/**/*.html" ] )
            .pipe( debug() )
            .pipe( replace( "../../images/", "images/" ) )
            .pipe( replace( "../../uploads/", "images/" ) )
            .pipe( replace( "../../fonts/", "fonts/" ) )
            .pipe(replace("../../../bower_components/uploadify/uploadify.swf", "images/uploadify/uploadify.swf"))
            .pipe( gulp.dest( "dist" ) );
	} )

    .task( "css", function() {

        gulp.src( [ "src/style/style.less" ] )
            .pipe( debug() )
			.pipe( less( { plugins: [ autoprefix, cleancss ] } ) )
			.pipe( concat( "style.css" ) )
			.pipe( gulp.dest( "src/style" ) );
    } )

    .task( "amd", function() {

        var amdConfig = {
            baseUrl: "src",

            paths: {
                ui: "../src/ui",
                util: "../src/util",
                modules: "../src/modules"
            }
        };

        gulp.src( [ "src/app.js" ] )
            .pipe( amd( amdConfig ) )
            .pipe( debug() )
            .pipe( uglify() )
            .pipe( concat( "app.min.js" ) )
			.pipe( gulp.dest( "src" ) );
    } )

    /** Auto compile */
	.task( "watch", function() {
		gulp.watch( "src/style/**/*.less", [ "css" ] );
	} )

	.task( "default", [ "watch", "www:dev" ] )

    .task( "dist", [ "css", "dist:assets" ] );
