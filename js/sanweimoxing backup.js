/**
 * Created by 亢叙杰 on 2017/5/4.
 */
function jiashansanweimoxing() {
    viewer.entities.removeAll();
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
        var position = Cesium.Cartesian3.fromDegrees(120.9184265136719, 30.84843635559082, 2);
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
                    scale: 1
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
function sanweimoxing() {
    // viewer.scene.globe.enableLighting = true;
    viewer.entities.removeAll();
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
    function loadmodel(files)
    {
        for (var i = 0, l = files.length; i < l; i++) {
            alert(files[i]);
            createModel(files[i]);
        }
//            createModel(files);
        function createModel(url)

        {
            var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: url,
                maximumScreenSpaceError: 2,
                maximumNumberOfLoadedTiles: 1000,
                // modelMatrix: Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.fromDegrees(101.5030614, 25.05679125, 1844.50133), new Cesium.Matrix4())


            }));
        }
    }
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.39333333, 39.90833333, 500),
        orientation:
            {
                up: new Cesium.Cartesian3(-0.23472675952122293, 0.6533781396365526, 0.7197224152472318), //target
                direction: new Cesium.Cartesian3(0.7200634175703672, -0.3805126075528655, 0.5802747885012751)
            },
        duration: 0
    });
}
