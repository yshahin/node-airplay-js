var util = require( 'util' );
var url = require( 'url' );

var browser = require('../airplay').createBrowser();

browser.on( 'deviceOn', function( device ) {
    console.log( 'device online: ' + device.id );


    var hls = require( '../airplay' ).createHLS();
    hls.on( 'start', function () {
        console.info( '[HLS] start: %s', hls.getURI() );
    });
    hls.on( 'stop', function () {
        console.info( '[HLS] stop: %s', hls.getURI() );
    });
    hls.on( 'request', function ( req ) {
        // var uri = url.parse( req.url, true );
        console.info( '[HLS] request: %s', req.url );
    });
    hls.on( 'process', function ( d ) {
        console.info( '[HLS] segment process: %s, %s, %s', d.index, d.file, d.out.toString() );
    });
    hls.on( 'segment', function ( d ) {
        console.info( '[HLS] segment created: %s, %s, %s', d.index, d.file, d.out );
    });
    hls.on( 'open', function ( d ) {
        console.info( '[HLS] opend: %s, %s', d.file, util.inspect( d.info ) );
    });
    hls.on( 'error', function ( err ) {
        console.info( '[HLS] segment error: ', util.inspect( err ) );
    });
    hls.start( 7001 );


    hls.open( '/Users/carlos/Desktop/a.mp4', function ( info ) {

        device.simpleplay( hls.getURI(), '0.000000', function ( res ) {
            console.info( '开始播放啦: ', res );

            setTimeout(function(){
                device.status( function ( info ) {
                    console.info( 'AppleTV 状态:', info ? info : '未播放' );
                    if ( info ) {
                        console.log(info)
                    }
                });
            }, 4000);
        });

    });

    // device.status( function ( info ) {
    //     console.info( 'AppleTV 状态:', info ? info : '未播放' );
    // });
});

browser.on( 'deviceOff', function( device ) {
  console.log( 'device offline: ' + device.id );
});

browser.start();

// setTimeout(
//     function(){
//         console.info( browser.getDevices( true ) );
//     },
//     2000
// );
