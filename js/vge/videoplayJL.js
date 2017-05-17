/**
 * Created by Administrator on 2017-5-16.
 */
function videoplay() {
    // viewer.scene.globe.enableLighting = true;
    //viewer.entities.removeAll();
    var scene = viewer.scene;
    var globe = scene.globe;

    var camera = viewer.scene.camera;
    var mousePosition;
    var ellipsoid = scene.globe.ellipsoid;



    var videoElement = document.getElementById('trailer');

    /*var sphere = viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(-79, 39, 1000),
        ellipsoid: {
            radii : new Cesium.Cartesian3(1000, 1000, 1000),
            material : videoElement
        }
    });*/

    /*var billboard = viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(-79, 39, 1000),
        billboard :
            {
            image : '../images/Cesium_Logo_overlay.png'
        }
    });*/
//alert(billboard);

    var rectangel = viewer.entities.add({
        rectangle : {
            coordinates : Cesium.Rectangle.fromDegrees(-92.0, 20.0, -86.0, 27.0),
            outline : true,
            outlineColor : Cesium.Color.WHITE,
            outlineWidth : 4,
            stRotation : Cesium.Math.toRadians(45),
            material : videoElement
        }
    });

    viewer.entities.add({
        wall : {
            positions : Cesium.Cartesian3.fromDegreesArray([-95.0, 50.0,
                -85.0, 50.0,
                -75.0, 50.0]),
            maximumHeights : [500000, 500000, 500000],
            minimumHeights : [0, 0, 0],
            outline : true,
            outlineColor : Cesium.Color.LIGHTGRAY,
            outlineWidth : 4,
            material : videoElement
        }
    });



    // viewer.trackedEntity = sphere;
    //viewer.trackedEntity = billboard;
    viewer.zoomTo(viewer.entities);

   // var synchronizer;
    /*Sandcastle.addToggleButton('Clock synchronization', false, function(checked) {
        // By default, the video plays normally and simply shows
        // whatever frame the video is currently on.
        // We can synchronize the video with the scene clock
        // using a VideoSynchronizer.

        if (Cesium.defined(synchronizer)) {
            synchronizer = synchronizer.destroy();
            videoElement.playbackRate = 1.0;
            return;
        }

        synchronizer = new Cesium.VideoSynchronizer({
            clock : viewer.clock,
            element : videoElement
        });
    });*/

// Since it's just an image material, we can modify the number
// of times the video repeats in each direction..
   /* var isRepeating = true;
    Sandcastle.addToggleButton('Image Repeat', isRepeating, function(checked) {
        isRepeating = checked;
    });*/
//ctrl+ shift +/
  /*  sphere.ellipsoid.material.repeat = new Cesium.CallbackProperty(function(time, result) {
        if (!Cesium.defined(result)) {
            result = new Cesium.Cartesian2();
        }
        if (isRepeating) {
            result.x = 8;
            result.y = 8;
        } else {
            result.x = 1;
            result.y = 1;
        }
        return result;
    }, false);*/

// Like Image, the video element doesn't have to be part of the DOM or
// otherwise on the screen to be used as a texture.
    /*Sandcastle.addToggleButton('Video Overlay', false, function(checked) {
        if (checked){
            videoElement.style.display = '';
        } else {
            videoElement.style.display = 'none';
        }
    });*/

// Older browsers do not support WebGL video textures,
// put up a friendly error message indicating such.
    viewer.scene.renderError.addEventListener(function() {
        if(!videoElement.paused){
            videoElement.pause();
        }
        viewer.cesiumWidget.showErrorPanel('This browser does not support cross-origin WebGL video textures.', '', '');
    });






}