/**
 * Created by Administrator on 2017/5/15.
 */
var scene = viewer.scene;


//点击图标量距
$('#ruler').click(function () {
    //var linepoints = new Array(2);
    var p1 = new Array(2);
    var p2 = new Array(2);
    //设置鼠标左键单击事件的处理函数，负责在画布上加起始
    handler.setInputAction(function (leftclick) {
        //更换标签1
        viewer.entities.remove(viewer.entities.getById("entity1"));
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity4.position = cartesian;
                entity4.label.show = true;
                entity4.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0'+
                    '\n单击右键选择终点算出距离';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //通过指定的椭球，将鼠标的二维坐标转换为对应椭球体三维坐标
        var cartesian = viewer.camera.pickEllipsoid(leftclick.position, scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//                console.log(cartographic.longitude);
//                console.log(cartographic.latitude);
            //将弧度转为度的十进制度表示
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            p1[0] = longitudeString;
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            p1[1] = latitudeString;
            //在地球上添加点
            addPoint(longitudeString, latitudeString);
            //存储起始点
            //linepoints[0] = p1;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //设置鼠标右键单击事件的处理函数，负责在画布上加终止点
    handler.setInputAction(function (rightclick) {
        //更换标签4
        viewer.entities.remove(viewer.entities.getById("entity4"));
        var entity1 = viewer.entities.add({
            id:"entity1",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        entity4 = viewer.entities.add({
            id:"entity4",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity1.position = cartesian;
                entity1.label.show = true;
                entity1.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //通过指定的椭球，将鼠标的二维坐标转换为对应椭球体三维坐标
        var cartesian = viewer.camera.pickEllipsoid(rightclick.position, scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            //将弧度转为度的十进制度表示
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            p2[0] = longitudeString;
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            p2[1] = latitudeString;
            addPoint(longitudeString, latitudeString);
            addLine(p1, p2);
            var resultInKm = adddistance(p1, p2);
            entity2.position = cartesian;
            entity2.label.show = true;
            entity2.label.text =
                '起点经度: ' + ('   ' + p1[0].toFixed(3)) + '\u00B0' +
                '\n起点纬度: ' + ('   ' + p1[1].toFixed(3)) + '\u00B0'+
                '\n终点经度: ' + ('   ' + p2[0].toFixed(3)) + '\u00B0' +
                '\n终点纬度: ' + ('   ' + p2[1].toFixed(3)) + '\u00B0'+
                '\n距离是: ' + resultInKm.toFixed(3) + '千米';
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
});

//点击图标求面积
$('#area').click(function () {
    var pointsArr = new Array();
    //设置鼠标左键单击事件的处理函数，负责在画布上加起始点
    handler.setInputAction(function (leftclick) {
        //更换标签1
        viewer.entities.remove(viewer.entities.getById("entity1"));
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity4.position = cartesian;
                entity4.label.show = true;
                entity4.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0'+
                    '\n单击右键闭合区域算出面积';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //截止到此
        var p=new Array(2);
        //通过指定的椭球，将鼠标的二维坐标转换为对应椭球体三维坐标
        var cartesian = viewer.camera.pickEllipsoid(leftclick.position, scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            //将弧度转为度的十进制度表示
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            p[0] = longitudeString;
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            p[1] = latitudeString;
            //在地球上添加点
            addPoint(longitudeString, latitudeString);
            //存储起始点
            pointsArr.push(p);
            //获取索引
            var index=pointsArr.length-1;
            //判断前一个位置是否有点
            if(pointsArr[index-1])
            {
                //有点，连线
                addLine(pointsArr[index-1],p)
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //设置鼠标右键单击事件的处理函数，结束绘制
    handler.setInputAction(function (rightclick) {
        //更换标签4
        viewer.entities.remove(viewer.entities.getById("entity4"));
        var entity1 = viewer.entities.add({
            id:"entity1",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        entity4 = viewer.entities.add({
            id:"entity4",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity1.position = cartesian;
                entity1.label.show = true;
                entity1.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //截止到此


        //首尾相连
        addLine(pointsArr[0],pointsArr[pointsArr.length-1]);
        //拼接坐标数组
        var xyArray=new Array();
        for(i=0;i<pointsArr.length;i++)
        {
            var x=pointsArr[i][0];
            xyArray.push(x);
            var y=pointsArr[i][1];
            xyArray.push(y);
        }
        //console.log(xyArray);
        var bluePolygon = viewer.entities.add({
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArray(xyArray),
                material : Cesium.Color.BLUE.withAlpha(0.2)
            }
        });
        var hierarchy=new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(xyArray));
        var indices = Cesium.PolygonPipeline.triangulate(hierarchy.positions, hierarchy.holes);
        var area = 0; // In square kilometers
        for (var i = 0; i < indices.length; i += 3) {
            var vector1 = hierarchy.positions[indices[i]];
            var vector2 = hierarchy.positions[indices[i + 1]];
            var vector3 = hierarchy.positions[indices[i + 2]];
            // These vectors define the sides of a parallelogram (double the size of the triangle)
            var vectorC = Cesium.Cartesian3.subtract(vector2, vector1, new Cesium.Cartesian3());
            var vectorD = Cesium.Cartesian3.subtract(vector3, vector1, new Cesium.Cartesian3());

            // Area of parallelogram is the cross product of the vectors defining its sides
            var areaVector = Cesium.Cartesian3.cross(vectorC, vectorD, new Cesium.Cartesian3());

            // Area of the triangle is just half the area of the parallelogram, add it to the sum.
            area += Cesium.Cartesian3.magnitude(areaVector)/2.0;
        }
        //console.log(area);
        var cartesian = viewer.camera.pickEllipsoid(rightclick.position, scene.globe.ellipsoid);
        entity3.position = cartesian;
        entity3.label.show = true;
        entity3.label.text = '面积是: ' + (area/1000000).toFixed(3) + ' 平方千米';
        //重置数组
        pointsArr=[];
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
});
//显示、隐藏工具栏
function measurement()
{
    var node=document.getElementById("tool");
    if(node.className=="open")
    {
        node.className="close";
    }
    else
    {
        node.className="open"
    }
}
//工具显示
function list()
{
    var linode=event.srcElement;
    var divnode=linode.parentNode;
    var tabnode=divnode.getElementsByTagName("table")[0];
    var ulnode=divnode.parentNode;
    var tabnodes=ulnode.getElementsByTagName("table");
    for(var x=0;x<tabnodes.length;x++)
    {
        if(tabnodes[x]==tabnode)
        {
            if(tabnode.className=="open")
            {
                tabnode.className="close";
            }
            else
            {
                tabnode.className="open";
            }
        }
        else
        {
            tabnodes[x].className="close";
        }

    }

}

    var entity1 = viewer.entities.add({
        id:"entity1",
        label: {
            show: false,
            showBackground: true,
            font: '16px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });
    var entity2 = viewer.entities.add({
        id:"entity2",
        label: {
            show: false,
            showBackground: true,
            font: '16px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });
    var entity3 = viewer.entities.add({
        id:"entity3",
        label: {
            show: false,
            showBackground: true,
            font: '16px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });
    var entity4 = viewer.entities.add({
        id:"entity4",
        label: {
            show: false,
            showBackground: true,
            font: '16px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });

var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
handler.setInputAction(function (movement) {
    cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        entity1.position = cartesian;
        entity1.label.show = true;
        entity1.label.text =
            '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
            '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0';
    } else {
        entity.label.show = false;
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//测量距离
$('#jl').click(function () {
    //var linepoints = new Array(2);
    var p1 = new Array(2);
    var p2 = new Array(2);
    //设置鼠标左键单击事件的处理函数，负责在画布上加起始
    handler.setInputAction(function (leftclick) {
        //更换标签1
        viewer.entities.remove(viewer.entities.getById("entity1"));
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity4.position = cartesian;
                entity4.label.show = true;
                entity4.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0'+
                    '\n单击右键选择终点算出距离';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //通过指定的椭球，将鼠标的二维坐标转换为对应椭球体三维坐标
        var cartesian = viewer.camera.pickEllipsoid(leftclick.position, scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//                console.log(cartographic.longitude);
//                console.log(cartographic.latitude);
            //将弧度转为度的十进制度表示
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            p1[0] = longitudeString;
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            p1[1] = latitudeString;
            //在地球上添加点
            addPoint(longitudeString, latitudeString);
            //存储起始点
            //linepoints[0] = p1;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //设置鼠标右键单击事件的处理函数，负责在画布上加终止点
    handler.setInputAction(function (rightclick) {
        //更换标签4
        viewer.entities.remove(viewer.entities.getById("entity4"));
        var entity1 = viewer.entities.add({
            id:"entity1",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        entity4 = viewer.entities.add({
            id:"entity4",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity1.position = cartesian;
                entity1.label.show = true;
                entity1.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //通过指定的椭球，将鼠标的二维坐标转换为对应椭球体三维坐标
        var cartesian = viewer.camera.pickEllipsoid(rightclick.position, scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            //将弧度转为度的十进制度表示
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            p2[0] = longitudeString;
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            p2[1] = latitudeString;
            addPoint(longitudeString, latitudeString);
            addLine(p1, p2);
            var resultInKm = adddistance(p1, p2);
            entity2.position = cartesian;
            entity2.label.show = true;
            entity2.label.text =
                '起点经度: ' + ('   ' + p1[0].toFixed(3)) + '\u00B0' +
                '\n起点纬度: ' + ('   ' + p1[1].toFixed(3)) + '\u00B0'+
                '\n终点经度: ' + ('   ' + p2[0].toFixed(3)) + '\u00B0' +
                '\n终点纬度: ' + ('   ' + p2[1].toFixed(3)) + '\u00B0'+
                '\n距离是: ' + resultInKm + '千米';
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
});

function addPoint(x, y) {
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y),
        point: {
            color: Cesium.Color.YELLOW,
            pixelSize: 8
        }
    });
}


//加线
function addLine(p1, p2) {
    var redLine = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([p1[0], p1[1], p2[0], p2[1]]),
            width: 1,
            material: Cesium.Color.RED
        }
    });
    return redLine;
}


function adddistance(p1, p2) {
    var redLine=addLine(p1, p2);
    //球面距离
    var linepoints = new Array(2);
    linepoints = redLine.polyline.positions.getValue();
    //获取弧线间隔点
    var surfacePositions = Cesium.PolylinePipeline.generateArc({
        positions: linepoints
    });
    var scratchCartesian3 = new Cesium.Cartesian3();
    var surfacePositionsLength = surfacePositions.length;
    var totalDistanceInMeters = 0;
    for (var i = 3; i < surfacePositionsLength; i += 3) {
        scratchCartesian3.x = surfacePositions[i] - surfacePositions[i - 3];
        scratchCartesian3.y = surfacePositions[i + 1] - surfacePositions[i - 2];
        scratchCartesian3.z = surfacePositions[i + 2] - surfacePositions[i - 1];
        totalDistanceInMeters += Cesium.Cartesian3.magnitude(scratchCartesian3);
    }
    var totalDistanceInKm = totalDistanceInMeters * 0.001;
    return totalDistanceInKm;
}

//输入经纬度测量距离

var startlon,startlat,endlon,endlat;
function distance(startlon,startlat,endlon,endlat){
    //var linepoints = new Array(2);
    var p1 = new Array(2);
    var p2 = new Array(2);
    p1[0] = startlon;
    p1[1] = startlat;
    addPoint(startlon,startlat);
    //linepoints[0] = p1;
    p2[0] = endlon;
    p2[1] = endlat;
    addPoint(endlon, endlat);
    addLine(p1,p2);
    var resultInKm = adddistance(p1, p2);
    return resultInKm;
}
function createdistance(){
    getValue();
    var mydistance=distance(startlon,startlat,endlon,endlat);
    document.getElementById("distance").value=mydistance;
    //alert(mydistance);
}
//获取text中的值
function selText(id)
{
    var x=document.getElementById(id).value;
    return x;
}
//字符串转换为小数
function getValue()
{
    startlon=parseFloat(selText("startlon"));
    startlat=parseFloat(selText("startlat"));
    endlon=parseFloat(selText("endlon"));
    endlat=parseFloat(selText("endlat"));
    return startlon,startlat,endlon,endlat;
}
//测量面积
$('#mj').click(function () {
    var pointsArr = new Array();
    //设置鼠标左键单击事件的处理函数，负责在画布上加起始点
    handler.setInputAction(function (leftclick) {
        //更换标签1
        viewer.entities.remove(viewer.entities.getById("entity1"));
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity4.position = cartesian;
                entity4.label.show = true;
                entity4.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0'+
                    '\n单击右键闭合区域算出面积';
            } else {
                //entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //截止到此
        var p=new Array(2);
        //通过指定的椭球，将鼠标的二维坐标转换为对应椭球体三维坐标
        var cartesian = viewer.camera.pickEllipsoid(leftclick.position, scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            //将弧度转为度的十进制度表示
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            p[0] = longitudeString;
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            p[1] = latitudeString;
            //在地球上添加点
            addPoint(longitudeString, latitudeString);
            //存储起始点
            pointsArr.push(p);
            //获取索引
            var index=pointsArr.length-1;
            //判断前一个位置是否有点
            if(pointsArr[index-1])
            {
                //有点，连线
                addLine(pointsArr[index-1],p)
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //设置鼠标右键单击事件的处理函数，结束绘制
    handler.setInputAction(function (rightclick) {
        //更换标签4
        viewer.entities.remove(viewer.entities.getById("entity4"));
        var entity1 = viewer.entities.add({
            id:"entity1",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        entity4 = viewer.entities.add({
            id:"entity4",
            label: {
                show: false,
                showBackground: true,
                font: '16px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0),
                fillColor:Cesium.Color.YELLOW,
            }
        });
        handler.setInputAction(function (movement) {
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                entity1.position = cartesian;
                entity1.label.show = true;
                entity1.label.text =
                    '经度: ' + ('   ' + longitudeString.toFixed(3)) + '\u00B0' +
                    '\n纬度: ' + ('   ' + latitudeString.toFixed(3)) + '\u00B0';
            } else {
                //entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //截止到此


        //首尾相连
        addLine(pointsArr[0],pointsArr[pointsArr.length-1]);
        //拼接坐标数组
        var xyArray=new Array();
        for(i=0;i<pointsArr.length;i++)
        {
            var x=pointsArr[i][0];
            xyArray.push(x);
            var y=pointsArr[i][1];
            xyArray.push(y);
        }
        //console.log(xyArray);
        var bluePolygon = viewer.entities.add({
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArray(xyArray),
                material : Cesium.Color.BLUE.withAlpha(0.2)
            }
        });
        var hierarchy=new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(xyArray));
        var indices = Cesium.PolygonPipeline.triangulate(hierarchy.positions, hierarchy.holes);
        var area = 0; // In square kilometers
        for (var i = 0; i < indices.length; i += 3) {
            var vector1 = hierarchy.positions[indices[i]];
            var vector2 = hierarchy.positions[indices[i + 1]];
            var vector3 = hierarchy.positions[indices[i + 2]];
            // These vectors define the sides of a parallelogram (double the size of the triangle)
            var vectorC = Cesium.Cartesian3.subtract(vector2, vector1, new Cesium.Cartesian3());
            var vectorD = Cesium.Cartesian3.subtract(vector3, vector1, new Cesium.Cartesian3());

            // Area of parallelogram is the cross product of the vectors defining its sides
            var areaVector = Cesium.Cartesian3.cross(vectorC, vectorD, new Cesium.Cartesian3());

            // Area of the triangle is just half the area of the parallelogram, add it to the sum.
            area += Cesium.Cartesian3.magnitude(areaVector)/2.0;
        }
        //console.log(area);
        var cartesian = viewer.camera.pickEllipsoid(rightclick.position, scene.globe.ellipsoid);
        entity3.position = cartesian;
        entity3.label.show = true;
        entity3.label.text = '面积是: ' + (area/1000000).toFixed(3) + ' 平方千米';
        //重置数组
        pointsArr=[];
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
});

//输入点求面积
var myLon,myLat;
var pointsArr = new Array();
function getValueArea()
{
    myLon=parseFloat(selText("myLon"));
    myLat=parseFloat(selText("myLat"));
    return myLon,myLat;
}
$("#addmypoint").click(function(){
    var p=new Array(2);
    getValueArea();
    p[0]=myLon;
    p[1]=myLat;
    addPoint(myLon,myLat);
    pointsArr.push(p);
    var index=pointsArr.length-1;
    if(pointsArr[index-1])
    {
        addLine(pointsArr[index-1],p)
    }
});
$("#getarea").click(function(){
    addLine(pointsArr[0],pointsArr[pointsArr.length-1]);
    var xyArray=new Array();
    for(i=0;i<pointsArr.length;i++)
    {
        var x=pointsArr[i][0];
        xyArray.push(x);
        var y=pointsArr[i][1];
        xyArray.push(y);
    }
    var bluePolygon = viewer.entities.add({
        polygon : {
            hierarchy : Cesium.Cartesian3.fromDegreesArray(xyArray),
            material : Cesium.Color.BLUE.withAlpha(0.2)
        }
    });
    var hierarchy=new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(xyArray));
    var indices = Cesium.PolygonPipeline.triangulate(hierarchy.positions, hierarchy.holes);
    var area = 0; // In square kilometers
    for (var i = 0; i < indices.length; i += 3) {
        var vector1 = hierarchy.positions[indices[i]];
        var vector2 = hierarchy.positions[indices[i + 1]];
        var vector3 = hierarchy.positions[indices[i + 2]];
        // These vectors define the sides of a parallelogram (double the size of the triangle)
        var vectorC = Cesium.Cartesian3.subtract(vector2, vector1, new Cesium.Cartesian3());
        var vectorD = Cesium.Cartesian3.subtract(vector3, vector1, new Cesium.Cartesian3());

        // Area of parallelogram is the cross product of the vectors defining its sides
        var areaVector = Cesium.Cartesian3.cross(vectorC, vectorD, new Cesium.Cartesian3());

        // Area of the triangle is just half the area of the parallelogram, add it to the sum.
        area += Cesium.Cartesian3.magnitude(areaVector)/2.0;
    }
    //alert(area/1000000);
    document.getElementById("myArea").value=area/1000000;
    //重置数组
    pointsArr=[];
});

//清除所有实体
$("#clear").click(function(){
    //viewer.entities.removeAll();
    entity1 = viewer.entities.add({
        label: {
            show: false,
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });
    entity2 = viewer.entities.add({
        id:"entity2",
        label: {
            show: false,
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });
    entity3 = viewer.entities.add({
        id:"entity3",
        label: {
            show: false,
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });
    entity4 = viewer.entities.add({
        id:"entity4",
        label: {
            show: false,
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            fillColor:Cesium.Color.YELLOW,
        }
    });


});

//图标加载
$(document).ready(function () {
   var symbolsymbol = $("#symbol");
   var container = $(".cesium-viewer-toolbar");
   symbolsymbol.css("float","right");
   container.append(symbolsymbol);
});
