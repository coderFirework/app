/**
 * Created by 亢叙杰 on 2017/5/4.
 */
function jiashansanweimoxing() {
    viewer.entities.removeAll();
    viewer.dataSources.removeAll();
    $("#draggable").css("display","none");
    if(($(".overlayIcon").length)>0)
    {
        for(var j=0;j<($(".overlayIcon").length);j++)
        {
            $(".overlayIcon").remove();
        }
    }

    var scene = viewer.scene;
    var globe = scene.globe;
    var camera = viewer.scene.camera;
    var mousePosition;
    var ellipsoid = scene.globe.ellipsoid;
    $.getJSON("getfiles.php", function (data) {

        loadmodel(data);
    });
    var eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    eventHandler.setInputAction(function (event) {
        mousePosition = event.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    function loadmodel(files) {
        var position = Cesium.Cartesian3.fromDegrees(120.9184265136719, 30.84843635559082, -100);
        var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-0.0), Cesium.Math.toRadians(-90.0));
        var modelMatrix = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        /*
        var heading = Cesium.Math.toRadians(0.0);//heading往右转角度是正的角度，往左是负的角度
        var pitch = Cesium.Math.toRadians(0.0);//pitch头往下，尾巴朝上是正的角度，头朝上而尾巴朝下手负的角度
        var roll = Cesium.Math.toRadians(-90.0);//roll往右转角度为正的角度，往左转角度为负的角度
        var modelMatrix = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);
*/
        for (var i = 0, l = files.length; i < l; i++) {
            //alert(files[i]);
            createModel(files[i]);
        }

//            createModel(files);
        function createModel(url) {
            var entity = viewer.entities.add({
                name: url,
                position: position,
                orientation: modelMatrix,
                model: {
                    uri: url,
                    minimumPixelSize: 1,
                    scale: 0.2
                }
            });
        }
    }
    viewer.camera.flyTo({

        destination: Cesium.Cartesian3.fromDegrees(120.9294365136719, 30.83243635559082, 1000),
        orientation:
            {
                up: new Cesium.Cartesian3(-0.23472675952122293, 0.6533781396365526, 0.7197224152472318), //target
                direction: new Cesium.Cartesian3(0.7200634175703672, -0.3805126075528655, 0.5802747885012751)
            },
        duration: 0
    });
}
function aoyunchangjingsanweimoxing() {
    // viewer.scene.globe.enableLighting = true;
    viewer.entities.removeAll();
    $("#draggable").css("display","none");
    viewer.dataSources.removeAll();
    if(($(".overlayIcon").length)>0)
    {
        for(var j=0;j<($(".overlayIcon").length);j++)
        {
            $(".overlayIcon").remove();
        }
    }

    var scene = viewer.scene;
    var globe = scene.globe;

    var camera = viewer.scene.camera;
    var mousePosition;
    var ellipsoid = scene.globe.ellipsoid;
    $.getJSON("getfiles1.php", function (data)
    {

        loadmodel(data);
    });
    var eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    eventHandler.setInputAction(function (event) {
        mousePosition = event.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    function loadmodel(files) {
        var position = Cesium.Cartesian3.fromDegrees(116.39433333, 39.90843333, -5);
        var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-0.0), Cesium.Math.toRadians(0.0));
        var modelMatrix = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

      /*
        var position = Cesium.Cartesian3.fromDegrees(116.39333333, 39.90833333, -5);

        var heading = Cesium.Math.toRadians(0.0);//heading往右转角度是正的角度，往左是负的角度
        var pitch = Cesium.Math.toRadians(-0.0);//pitch头往下，尾巴朝上是正的角度，头朝上而尾巴朝下手负的角度
        var roll = Cesium.Math.toRadians(0);//roll往右转角度为正的角度，往左转角度为负的角度

        var hpr = new HeadingPitchRoll(heading, pitch, roll);

        var modelMatrix = Cesium.Transforms.headingPitchRollQuaternion(position, hpr );
        */
        //var modelMatrix = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);

        for (var i = 0, l = files.length; i < l; i++) {
            //alert(files[i]);
            createModel(files[i]);
        }
        function createModel(url) {
            var entity = viewer.entities.add({
                name: url,
                position: position,
                orientation: modelMatrix,
                model: {
                    uri: url,
                    minimumPixelSize: 1,
                    scale: 1
                }
            });
        }
    }
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.39433333, 39.90843333, 500),
        orientation:
            {
                up: new Cesium.Cartesian3(-0.23472675952122293, 0.6533781396365526, 0.7197224152472318), //target
                direction: new Cesium.Cartesian3(0.7200634175703672, -0.3805126075528655, 0.5802747885012751)
            },
        duration: 0
    });
}
function sanweimoxing()
{
    // viewer.scene.globe.enableLighting = true;
    viewer.entities.removeAll();
    viewer.dataSources.removeAll();
    $("#draggable").css("display","none");
    if(($(".overlayIcon").length)>0)
    {
        for(var j=0;j<($(".overlayIcon").length);j++)
        {
            $(".overlayIcon").remove();
        }
    }

    var scene = viewer.scene;
    var globe = scene.globe;
    var camera = viewer.scene.camera;
    var mousePosition;
    var ellipsoid = scene.globe.ellipsoid;
    /*
    $.getJSON("getfiles2.php", function (data)
    {
        loadmodel(data);
    });
    */
    loadmodel(["./models/SceneX/tileset.json"]);
    var eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    eventHandler.setInputAction(function (event) {
        mousePosition = event.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    function loadmodel(files)
    {

        for (var i = 0, l = files.length; i < l; i++)
        {
            createModel(files[i]);
        }
//            createModel(files);
        function createModel(url)

        {
             var position = Cesium.Cartesian3.fromDegrees(116.39433333, 39.90843333, 100);
            //var position = Cesium.Cartesian3.fromDegrees(112.60109, 37.99234, 100);
            // var position = Cesium.Cartesian3.fromDegrees(11, 3, 0);

            //alert(position);
            // var hpr=Cesium.HeadingPitchRoll.fromDegrees(0,-180,180);
            var hpr=Cesium.HeadingPitchRoll.fromDegrees(0,-150,135);
           var matrix=Cesium.Matrix3.fromHeadingPitchRoll(hpr);

            //var v = [1.0, 0, 0, 0, 1.0, 0.0, 0.0, 0.0, 1.0];
            //var m = Cesium.Matrix3.fromArray(v);
            //var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-0.0), Cesium.Math.toRadians(0.0));
            //alert(matrix);
            var tileset = viewer.scene.primitives.add(
                new Cesium.Cesium3DTileset({
                url:url,
                maximumScreenSpaceError: 2,
               maximumNumberOfLoadedTiles: 1000,
              modelMatrix: Cesium.Matrix4.fromRotationTranslation(matrix,  position, new Cesium.Matrix4())
           //modelMatrix: Cesium.Matrix4.fromTranslation(position, new Cesium.Matrix4())
            }));
           // alert( url);
        }
    }
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.39433333, 39.90833333, 500),
        orientation:
            {
                up: new Cesium.Cartesian3(-0.23472675952122293, 0.6533781396365526, 0.7197224152472318), //target
                direction: new Cesium.Cartesian3(0.7200634175703672, -0.3805126075528655, 0.5802747885012751)
            },
        duration: 0
    });
}

