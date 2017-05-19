/**
 * Created by 亢叙杰 on 2017/5/4.
 */
var viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    fullscreenButton:false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    timeline: false,
    geocoder:false,
    imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
        url : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    }),
    baseLayerPicker : false
});
var terrainProvider = new Cesium.CesiumTerrainProvider({
    url :'https://assets.agi.com/stk-terrain/world',
    requestWaterMask : true,
    requestVertexNormals : true
});

//viewer.terrainProvider = terrainProvider;
viewer.extend(Cesium.viewerCesiumNavigationMixin, {});
viewer._cesiumWidget._creditContainer.style.display="none";
//viewer.scene.globe.enableLighting = true;
var layers = viewer.scene.imageryLayers;
var tiandituProviderBoundary = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.cn/ibo_w/wmts',
    layer: 'ibo',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',//注意web墨卡托此时是w
    // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
    maximumLevel: 19,
    //credit: new Cesium.Credit('天地图')
});
//天地图中文地名注记
var tiandituProviderPlaceName = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.com/cia_w/wmts',
    layer: 'cia',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',//注意web墨卡托此时是w
    maximumLevel: 19,
    //credit: new Cesium.Credit('天地图')
});
var tianditu_image = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.com/img_w/wmts',
    layer: 'img',
    //url: 'http://t0.tianditu.com/vec_w/wmts',
    // layer: 'vec',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',//注意web墨卡托此时是w
    maximumLevel: 19,
    //credit: new Cesium.Credit('天地图')
});

var Arr=[];
Arr.push(tianditu_image );
// Arr.push(quadServerProviderImage );
Arr.push(tiandituProviderBoundary );
Arr.push(tiandituProviderPlaceName );
for (var i=0;i<Arr.length;i++)
{
    layers.addImageryProvider(Arr[i]);
}
//天地图中文地名注记
/* imageryProvider :  Cesium.WebMapTileServiceImageryProvider({
 url: 'http://t0.tianditu.com/cia_w/wmts',
 layer: 'cia',
 style: 'default',
 format: 'tiles',
 tileMatrixSetID: 'w',//注意web墨卡托此时是w
 maximumLevel: 19,
 credit: new Cesium.Credit('天地图')
 }),*/
// var terrainProvider = new Cesium.CesiumTerrainProvider({
//url : 'https://assets.agi.com/stk-terrain/world',
//requestVertexNormals : true
//});
//viewer.terrainProvider = terrainProvider;
$(document).ready(function () {
    var layers = [];
    layers.push(["卫星影像", 'world_image']);
    layers.push(["天地图影像", 'tianditu_image']);
    layers.push(["Bing影像地图", 'bing_image']);
    layers.push(["ESRI影像地图", 'esri_image']);
    layers.push(["全球灯光影像地图", 'blackmarkble_image']);
    layers.push(["汶川地震信息", 'wenchuan_image']);
    layers.push(["全球NDVI", 'yushu_image']);
    var source = [

        { icon: "js/jqwidgets-4.4.0/treePng/folder.png", label: "遥感影像图层", expanded: true, items: [
            { icon: "img/weixing .png",label: "卫星影像" },
            { icon: "img/tianditu.png",label: "天地图影像" },
            {icon: "img/bing.png",label:"Bing影像地图"},
            {icon: "img/esri1.png", label: "ESRI影像地图"},

        ]
        },
        { icon: "js/jqwidgets-4.4.0/treePng/folder.png", label: "时序数据展示", expanded: true, items: [
            { icon: "img/weixing .png",label: "2011.1-2011.6全球地表短波辐射" }
        ]
        },
        {
            icon: "js/jqwidgets-4.4.0/treePng/folder.png", label:"灾害信息" ,expand:true,items:
            [
                {
                    icon: "js/jqwidgets-4.4.0/treePng/folder.png",label:"遥感地图加载",items:
                    [
                        {icon: "js/jqwidgets-4.4.0/treePng/contactsIcon.png",label: "汶川地震信息"},
                        {icon: "js/jqwidgets-4.4.0/treePng/contactsIcon.png",label:"全球NDVI"}
                    ]
                },
                {icon: "js/jqwidgets-4.4.0/treePng/folder.png",label:"洪水灾害信息"}
            ]
        },
        {
            icon: "js/jqwidgets-4.4.0/treePng/folder.png",label:"三维模型加载" ,expand:true,items:
            [
                {icon: "img/jiashan.png",label:"嘉善地区三维模型"},
                {icon: "img/sanweimoxing1.png",label:"3Dtiles三维模型加载"},
                {icon: "img/sanweimoxing1.png",label:"奥运场景三维模型"},
                {icon: "img/building.png",label:"居民楼"},
                {icon: "img/play.png",label:"视频"},
                {icon: "img/chart1.png",label:"图表"}
            ]
        }
    ];

    /* var quadServerProviderImage = new Cesium.WebMapTileServiceImageryProvider({
     url: '/QuadServer/services/maps/wmts100',
     layer: 'world_image',
     //layer: 'world_vector',
     style: 'default',
     format: 'image/jpeg',
     tileMatrixSetID: 'PGIS_TILE_STORE',
     minimumLevel: 0,
     maximumLevel: 19,
     credit: new Cesium.Credit('world_country'),
     tilingScheme: new Cesium.GeographicTilingScheme({
     rectangle: extent,
     numberOfLevelZeroTilesX: 1,
     numberOfLevelZeroTilesY: 1
     }),
     });*/
    // Create jqxTree.

    $('#dataTree').jqxTree({ source: source, height: '700px', width: '300px' });
    $('#dataTree').on('select', function (event)
    {

        var args = event.args;
        var item = $('#dataTree').jqxTree('getItem', args.element);
        if(item.label=="嘉善地区三维模型")
    {
        jiashansanweimoxing();

    }
        if(item.label=="2011.1-2011.6全球地表短波辐射")
        {
            shixushujudongtaizhanshi();

        }
        if(item.label=="3Dtiles三维模型加载")
        {
            sanweimoxing();

        }
        if(item.label=="居民楼"){
            createModel("./models/jianzhuwusmall.gltf");
        }
        if (item.label=="视频"){
            createVideoCube();
        }
        if (item.label=="图表"){
            createEcharts();
        }
        if(item.label=="奥运场景三维模型")
        {
            aoyunchangjingsanweimoxing();
        }

        $.each(layers, function (key, value)
        {

            if (item.label == value[0])
            {

                var it=viewer.scene.imageryLayers;
                it.removeAll();
                viewer.entities.removeAll();
                viewer.dataSources.removeAll();
                if(($(".overlayIcon").length)>0)
                {
                    for(var j=0;j<($(".overlayIcon").length);j++)
                    {
                        $(".overlayIcon").remove();
                    }
                }
                $("#draggable").css("display","none");

              // alert(document.getElementsByClass("overlayIcon")[0]);
                var getImageryProvider = getImageryFromLayerName(value[1]);

                if (getImageryProvider instanceof Array)
                {

                    getImageryProvider[1].alpha = 0.0;
                    getImageryProvider[2].alpha = 0.0;
                    var length = getImageryProvider.length;
                    for (var i = 0; i < length; i++)
                    {

                        viewer.scene.imageryLayers.addImageryProvider(getImageryProvider[i]);
                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(120.9294365136719, 30.83243635559082, 40000000),
                            duration: 0
                        });
                    }
                }

            }
        }) ;
        $('#basicLayer').jqxTree('checkAll');
        $("#basicLayer").jqxTree('unCheck',  $("#treeTerrain")[0]);
    });


    var tiandituProviderBoundary = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.cn/ibo_w/wmts',
        layer: 'ibo',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',//注意web墨卡托此时是w
        // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
        maximumLevel: 19,
        // credit: new Cesium.Credit('天地图')
    });
    //天地图中文地名注记
    var tiandituProviderPlaceName = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.com/cia_w/wmts',
        layer: 'cia',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',//注意web墨卡托此时是w
        maximumLevel: 19,
        //credit: new Cesium.Credit('天地图')
    });
    var bing = new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: Cesium.BingMapsApi.defaultKey,
        mapStyle: Cesium.BingMapsStyle.AERIAL
    });
    function getLayerFromTMS(layerName)
    {
        var layersArr = [];
        layersArr.push(bing);

        var NDVI =Cesium.createTileMapServiceImageryProvider
        ({
            url : './models/tiler2',
            fileExtension: 'png',
            rectangle: new Cesium.Rectangle
            (
                Cesium.Math.toRadians(-180.0),
                Cesium.Math.toRadians(-90.0),
                Cesium.Math.toRadians(179.9821780),
                Cesium.Math.toRadians(90.0)
            )
        });
        var TMSProvider =Cesium.createTileMapServiceImageryProvider
        ({
            url : './models/zhongyaPlant/zhongyaPlant',
            fileExtension: 'png',
            rectangle: new Cesium.Rectangle
            (
                Cesium.Math.toRadians(-180.0),
                Cesium.Math.toRadians(-90.0),
                Cesium.Math.toRadians(179.9821780),
                Cesium.Math.toRadians(90.0)
            )
        });
        if (layerName == 'yushu_image')
        {
            layersArr.push(NDVI);
        }
        if (layerName == 'wenchuan_image')
        {
            layersArr.push(TMSProvider);
        }
        layersArr.push(tiandituProviderBoundary);
        layersArr.push(tiandituProviderPlaceName);
        return layersArr;
    }
    function getLayerFromOuterServer(layerName)
    {
        var layersArr = [];
        var bing = new Cesium.BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: Cesium.BingMapsApi.defaultKey,
            mapStyle: Cesium.BingMapsStyle.AERIAL
        });
        /*
        var blackMarble = layers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
            url : '//cesiumjs.org/tilesets/imagery/blackmarble',
            maximumLevel : 8,
            credit : 'Black Marble imagery courtesy NASA Earth Observatory'
        }));
        var blackMarble = new Cesium.TileMapServiceImageryProvider({
            url: '//cesiumjs.org/tilesets/imagery/blackmarble',
            maximumLevel: 19,
            //credit: 'Black Marble imagery courtesy NASA Earth Observatory'
        });
        */
        var esri = new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        });
        // var esri = new Cesium.ArcGisMapServerImageryProvider({
        //     url: 'https://services.arcgisonline.com/arcgis/rest/services/ESRI_StreetMap_World_2D/MapServer'
        // });
        var tianditu_image = new Cesium.WebMapTileServiceImageryProvider({
            url: 'http://t0.tianditu.com/img_w/wmts',
            layer: 'img',
            //url: 'http://t0.tianditu.com/vec_w/wmts',
            // layer: 'vec',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'w',//注意web墨卡托此时是w
            maximumLevel: 19,
            //credit: new Cesium.Credit('天地图')
        });

        if (layerName == 'blackmarkble_image')
        {
            layersArr.push(blackMarble);
        }
        if (layerName == 'world_image')
        {
            layersArr.push(bing);
        }
        if (layerName == 'tianditu_image')
        {
            layersArr.push(tianditu_image);
        } else if (layerName == 'bing_image')
        {
            layersArr.push(bing);
        } else if (layerName == 'esri_image')
        {
            layersArr.push(esri);
        }

        layersArr.push(tiandituProviderBoundary);
        layersArr.push(tiandituProviderPlaceName);
        return layersArr;
    }
    /*function getLayerfromWebside(name)
     {
     viewer.dataSources.removeAll();
     switch (name)
     {

     case"tianditu_image":
     viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
     url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
     layer: "tdtImgBasicLayer",
     style: "default",
     format: "image/jpeg",
     tileMatrixSetID: "GoogleMapsCompatible",
     show: false
     }));
     viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
     url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
     layer: "tdtImgBasicLayer",
     style: "default",
     format: "image/jpeg",
     tileMatrixSetID: "GoogleMapsCompatible",
     show: false
     }));

     viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
     url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
     layer: "tdtImgAnnoLayer",
     style: "default",
     format: "image/jpeg",
     tileMatrixSetID: "GoogleMapsCompatible",
     show: false
     }));
     break;
     case"esri_image":

     }
     }*/

    function getImageryFromLayerName(layerName) {

        switch (layerName) {

            case 'world_vector':
                return getLayerFromQuadServer(layerName);
                break;
            case 'world_image':
                return getLayerFromOuterServer(layerName);
                break;
            case 'tianditu_image':
                return getLayerFromOuterServer(layerName);
                break;
            case 'bing_image':
                return getLayerFromOuterServer(layerName);
                break;
            case 'esri_image':
                return getLayerFromOuterServer(layerName);
                break;
            case 'blackmarkble_image':
                return getLayerFromOuterServer(layerName);
                break;
            case 'wenchuan_image':
                return getLayerFromTMS(layerName);
                break;
            case 'yushu_image':
                return getLayerFromTMS(layerName);
                break;
        }
    }
    var checksource =
        [
            {
                icon: "js/jqwidgets-4.4.0/treePng/folder.png", label: "基础图层", expanded: true,  items:
                [
                    {icon: "img/diming.png", label: "地名",checked: true},
                    {icon: "img/xingzhen.png", label: "行政边界",checked: true},
                    {icon: "img/dixing.png", label: "地形", id:"treeTerrain",checked: false}
                ]
            }]

    $('#basicLayer').jqxTree({ checkboxes: true,source: checksource, height: '120px', width: '300px' });
    $("#basicLayer").on("checkChange",function(event)
    {
        var args = event.args;
        var htmlElement = args.element;
        var item = $('#basicLayer').jqxTree('getItem', htmlElement);
        var checked = args.checked;
        checkBoxChange(item.label, checked);
    });
    function checkBoxChange(labelName, isChecked) {
        switch (labelName) {
            case "地名":
                afterPlaceNameChecked(isChecked);
                break;
            case "行政边界":
                afterBoundaryChecked(isChecked);
                break;
            case "地形":
                afterTerrainChecked(isChecked);
                break;
        }
    }
    function afterPlaceNameChecked(isChecked) {
        var imageryLayersLength = viewer.scene.imageryLayers.length;
        if (isChecked) {
            var placeNameImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 1);
            placeNameImagery.alpha = 1.0

        } else {
            var placeNameImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 1);
            placeNameImagery.alpha = 0.0
        }
    }

    function afterBoundaryChecked(isChecked) {
        var imageryLayersLength = viewer.scene.imageryLayers.length;
        if (isChecked) {
            var boundaryImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 2);
            boundaryImagery.alpha = 1.0
        } else {
            var boundaryImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 2);
            boundaryImagery.alpha = 0.0
        }
    }


    //viewer.terrainProvider = terrainProvider;
    function afterTerrainChecked(isChecked) {
        if (isChecked) {
            viewer.terrainProvider = terrainProvider;
        }
        else {
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        }
    }

})
