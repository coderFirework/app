/**
 * Created by Administrator on 2017/5/16.
 */
// 百度地图API功能
var map = new BMap.Map("allmap");
var point = new BMap.Point(116.331398,39.897445);
//map.centerAndZoom(point,6);
var test=true;
function theLocation() {
    var city = document.getElementById("cityName").value;
    if(cityName.value==""){
        viewer.entities.removeById("mark");
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(116.46, 39.92 , 100000),
            duration: 0
        });
    }
    else {
    if (city != ""&&test==true) {
        test=false;
       // map.centerAndZoom(city, 8);      // 用城市名设置地图中心点
    }
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(cityName.value, function (point) {
        if (point) {
           // console.log(point.lng)
           // map.centerAndZoom(point, 8);
          //  map.addOverlay(new BMap.Marker(point));

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(point.lng, point.lat , 100000),


                /*
                orientation:
                    {
                        up: new Cesium.Cartesian3(-0.23472675952122293, 0.6533781396365526, 0.7197224152472318), //target
                        direction: new Cesium.Cartesian3(0.7200634175703672, -0.3805126075528655, 0.5802747885012751)
                    },
                */
            duration: 0
            });
            var pinBuilder = new Cesium.PinBuilder();
            var questionPin = viewer.entities.add({
                id:"mark",
                name: 'Question mark',
                position : Cesium.Cartesian3.fromDegrees(point.lng, point.lat ),
                billboard : {
                    image : pinBuilder.fromText(cityName.value, Cesium.Color.GREEN,60).toDataURL(),
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM
                }
            });


        } else {
            alert("对不起!没有找到您输入的地址。");
        }
    }, "中国");
}
}

function removePin() {
if(test==false) {
    viewer.entities.removeById("mark");
    test=true;
}
}
/*function play_search(){
    $("#cityName").show();
    //document.getElementById("cityName").setAttribute("style", "display:none");
}
function display_search(){
    $("#cityName").hide();
    //document.getElementById("cityName").setAttribute("style", "display:none");
}
*/
/*
$('#cityName').mouseover(function () {
    document.getElementById("cityName").setAttribute("style", "display:inline");
})
$('#search_label').mouseover(function () {
    document.getElementById("cityName").setAttribute("style", "display:inline");
})
$('#cityName').mouseout(function () {
    document.getElementById("cityName").setAttribute("style", "display:none");
})
$('#search_label').mouseout(function () {
    document.getElementById("cityName").setAttribute("style", "display:none");
})
*/