
define( [ "modules/dashboard/service" ],
function( service ) {

    "use strict";

    return function( ele, container ) {

        ele
        .find( "input[type=file]" )
        .attr( "id", +new Date() )
        .uploadify( {
            auto: true,
            buttonClass: "icon-create",
            buttonText: "",
            multi: false,
            queueSizeLimit: 1,
            queueID: "fileQueue",
            swf: "../../../bower_components/uploadify/uploadify.swf",
            uploader: "api/pricing",
            fileTypeExts: "*.jpg;*.bmp;*.gif;*.png",
            height: 48,
            width: 48,
            onUploadSuccess: function( file, data ) {

                data = eval( "(" + data + ")" );

                this.button.parents( ".wrapper" ).find( "img" ).attr( "src", data.filename + "?" + +new Date() );
                $.toast.success( "Change pricing success :)" );
            },
            onUploadError: function() {
                $.toast.error( "Upload pricing failed, Please retry :(" );
            }
        } );
    };
} );
