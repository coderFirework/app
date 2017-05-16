/**
 * Created by myhom on 2017/5/15.
 */
var position = Cesium.Cartesian3.fromDegrees(120.9184265136719, 30.84843635559082, 2);
var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-0.0), Cesium.Math.toRadians(-90.0));
var modelMatrix = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

var entity;
var isSync=false;
function createModel(url) {
     entity = viewer.entities.add({
        name: url,
        position: position,
        orientation: modelMatrix,
        model: {
            uri: url,
            minimumPixelSize: 1,
            scale: 1
            //color : getColor(viewModel.color, viewModel.alpha),
            //colorBlendMode : getColorBlendMode(viewModel.colorBlendMode)
        }
    });
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(120.9184265136719, 30.84843635559082, 3),
        orientation:
            {
                up: new Cesium.Cartesian3(-0.23472675952122293, 0.6533781396365526, 0.7197224152472318), //target
                direction: new Cesium.Cartesian3(0.7200634175703672, -0.3805126075528655, 0.5802747885012751)
            },
        duration: 0
    });
}
createModel("./models/Cesium_Air.gltf");
var lastPick;
var po;
function clickSelect() {
    //Change color on mouse over.  This relies on the fact that given a primitive,
    //you can retrieve an associted en
    var lastColor;

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(movement) {
        //var primitive;
        //var pickedObject = viewer.scene.pick(movement.endPosition);
        if(lastPick!=undefined){
            lastPick.model.color=Cesium.Color.WHITE;
        }
        var pickedObject = viewer.scene.pick(movement.position);
        po=pickedObject;
        if (pickedObject) {

           var  primitive = pickedObject.primitive;
            if (pickedObject !== lastPick && primitive instanceof Cesium.Model) {
                var iDiv = toast("hi");
                //We don't use the entity here, but if you need to color based on
                //some entity property, you can get to that data it here.
                var entity = primitive.id;
                syncDiv(entity,iDiv);
                entity.model.color=Cesium.Color.YELLOW
                lastPick = entity;
/*                console.log(entity);
                var material = primitive.getMaterial('Material_0');
                console.log(material);
                //var material = primitive.getMaterial('Red'); - original line
                lastColor = material.getValue('diffuse').clone();
                //material.setValue('diffuse', Cesium.Cartesian4.fromColor(Cesium.Color.BLUE));
                material.setValue('diffuse', Cesium.Cartesian4.fromColor(Cesium.Color.YELLOW));
                lastPick = pickedObject;*/
            }
        } else if (lastPick) {
            isSync = false;
           /* primitive = lastPick.primitive;
            var material = primitive.getMaterial('Material_0');
            //var material = primitive.getMaterial('Red'); - original line
            material.setValue('diffuse', lastColor);
            lastPick = undefined;*/
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
function syncDiv(entity,iDiv) {
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movent) {
        isSync= true;
    },Cesium.ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(function (movent) {
        isSync= false;
    },Cesium.ScreenSpaceEventType.LEFT_UP);
    handler.setInputAction(function(movement) {
        if(entity!=undefined && isSync){
            var worldPosition = entity.position._value;
            var screenPosition= Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, worldPosition);
            var x = screenPosition.x;
            var y =  screenPosition.y;
            iDiv.css({'left':x+'px','top':y+'px'});
            console.log("x is:"+x+",y is:"+y);
        }
    },Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}
clickSelect();
function toast(content,left,top) {
    var iDiv = $("<div>hello</div>");
    iDiv.attr("class","toast");
    iDiv.css({'left':left+'px','top':top+'px'});
    $("#cesiumContainer").append(iDiv);
    return iDiv;
}