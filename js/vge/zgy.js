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
        name: 'building',
         data:"test",
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
function createBillboard() {
    viewer.entities.add({
        name:"chart",
        position:Cesium.Cartesian3.fromDegrees(120.9184265136719, 39.84843635559082, 100),
        billboard:{
            image:'./img/chart2.png',
        }
    });
}
createBillboard();
createModel("./models/jianzhuwu.gltf");
var lastPick;
var lastModel;
var po;
function clickSelect() {
    //Change color on mouse over.  This relies on the fact that given a primitive,
    //you can retrieve an associted en
    var lastColor;

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(movement) {
        var iDiv;
        //var primitive;
        //var pickedObject = viewer.scene.pick(movement.endPosition);

        if(lastModel!=undefined && lastModel instanceof (Cesium.Model)){
            lastModel.id.model.color=Cesium.Color.WHITE;
        }
        var pickedObject = viewer.scene.pick(movement.position);
        po=pickedObject;
        if (pickedObject) {
           //primitive = pickedObject.primitive;
            var pickedEntity = pickedObject.id;

            var worldPosition = pickedEntity.position._value;
            var screenPosition= Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, worldPosition);
            var x = screenPosition.x;
            var y =  screenPosition.y;

            if (pickedObject !== lastPick && pickedEntity.name=="building") {

                var content='<p><b>名称</b>:飞机</p></br> <p><b>经度</b>:120.17</p></br> <p><b>纬度</b>:39.04</p>';
                iDiv = toast("三维模型",content,x,y);
                syncDiv(pickedEntity,iDiv);
                pickedEntity.model.color=Cesium.Color.YELLOW
                lastPick = pickedEntity;
                lastModel=pickedObject.primitive;
            }else if(pickedObject !== lastPick && pickedEntity.name=="chart"){
                //var entity = primitive.id;
                //iDiv = toast("图表",getVideoElement(),x,y);
                //createChart();
                iDiv = toast("图表","",x,y);
                createChart();
                iDiv.width(300);
                iDiv.height(240);
                syncDiv(pickedEntity,iDiv);
                //pickedEntity.model.color=Cesium.Color.YELLOW
                lastPick = pickedEntity;
                lastModel=pickedObject.primitive;
                //popContent
            }else if(pickedObject !== lastPick && pickedEntity.name=="chart"){
                var url = pickedEntity.data;
                iDiv = toast("视频",getVideoElement(url),x,y);
                iDiv.width(300);
                iDiv.height(240);
                syncDiv(pickedEntity,iDiv);
                //pickedEntity.model.color=Cesium.Color.YELLOW
                lastPick = pickedEntity;
                lastModel=pickedObject.primitive;
            }
        } else if (lastPick) {
            isSync = false;
            $("#toast").hide();
           /* primitive = lastPick.primitive;
            var material = primitive.getMaterial('Material_0');
            //var material = primitive.getMaterial('Red'); - original line
            material.setValue('diffuse', lastColor);
            lastPick = undefined;*/
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
function createChart() {
    $("#popContent").height(200);
    $("#popContent").width(260);
    var myChart = echarts.init(document.getElementById('popContent'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '土地覆被图'
        },
        tooltip: {},
        legend: {
            data:['m²']
        },
        xAxis: {
            data: ["农用地","建设用地","农田","养殖用地","林地","草地"]
        },
        yAxis: {},
        series: [{
            name: 'm²',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
function syncDiv(entity,iDiv) {
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movent) {
        isSync= true;
    },Cesium.ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(function (movent) {
        isSync= false;
    },Cesium.ScreenSpaceEventType.LEFT_UP);
    handler.setInputAction(function (movent) {
        isSync= true;
    },Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
    handler.setInputAction(function (movent) {
        isSync= false;
    },Cesium.ScreenSpaceEventType.MIDDLE_UP);
    /*
    handler.setInputAction(function (movent) {
        isSync= true;
    },Cesium.Cesium.KeyboardEventModifier.CTRL);
    */
    handler.setInputAction(function(movement) {
        if(entity!=undefined && isSync){
            var worldPosition = entity.position._value;
            var screenPosition= Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, worldPosition);
            var x = screenPosition.x;
            var y =  screenPosition.y;
            y=y-(iDiv.height()/2);
            iDiv.css({'left':x+'px','top':y+'px'});
            console.log("x is:"+x+",y is:"+y);
        }
    },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function(movement) {
        if(entity!=undefined){
            var worldPosition = entity.position._value;
            var screenPosition= Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, worldPosition);
            var x = screenPosition.x;
            var y =  screenPosition.y;
            y=y-(iDiv.height()/2);
            iDiv.css({'left':x+'px','top':y+'px'});
            console.log("x is:"+x+",y is:"+y);
        }
    },Cesium.ScreenSpaceEventType.WHEEL)

}
clickSelect();
function toast(title,content,left,top) {
    var iDiv = $("#toast");
    $("#popTitle").text(title);
    $("#popContent").html(content);
    top=top-(iDiv.height()/2);
    iDiv.css({'left':left+'px','top':top+'px'});
    iDiv.show();
    return iDiv;
}
function  getVideoElement( url) {
    return '<video id="trailer"  autoplay="" loop="" crossorigin="" controls=""> <source src="'+url+'" type="video/mp4">Your browser does not support the <code>video</code> element.</video>'
}