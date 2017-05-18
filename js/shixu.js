/**
 * Created by 亢叙杰 on 2017/5/16.
 */
function shixushujudongtaizhanshi()
{
    $("#draggable").css("display","block");
    /*
    var div1=document.createElement("div");
    var p=document.createElement("p");
    var label=document.createElement("label");
    var input=document.createElement("input");
    var div2=document.createElement("div");
    div1.setAttribute("style"," width: 250px;height: 100px;padding: 0.5em;z-index:200;position:absolute;left:5%;top:10%;");
    div1.setAttribute("id","draggable");
    div1.setAttribute("class","ui-widget-content");
    div2.setAttribute("id","timeSlider");
    input.setAttribute("readonly style"," width: 250px;height: 100px;padding: 0.5em;z-index:200;position:absolute;left:5%;top:10%;");
    label.setAttribute("for","amount");
    input.setAttribute("id","amount");
    p.appendChild(label);
    p.appendChild(label);
    div1.appendChild(p);
    div1.appendChild(div2);
    var div3=$(".cesiumContainer");
    div3.appendChild(div1);
    */
    var options =
        {
        container:viewer.container,
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas
    };
//viewer.dataSources.add(Cesium.dKmlDataSource.load('./bohai/1by1.kml', options));
//console.log(Cesium.dKmlDataSource.entityTimeArray);

    var promise = Cesium.dKmlDataSource.load('./test/test.kml', options);
//    var promise = Cesium.dKmlDataSource.load('../Appsk/kmldataset/doc.kml', options);
    promise.then(function(dataSource) {
       viewer.dataSources.add(dataSource);

        var entityTimeArray=Window.entityTimeArray;

        var length=entityTimeArray.length;
        //Get the array of entities
        var entities = dataSource.entities;
        var kmlEntities=[];
        for(var i=0;i<length;i++)
        {
            var entity=entities.getById(entityTimeArray[i]);
            entity.show=false;
            kmlEntities.push(entity);
        }
        kmlEntities[length-1].show=true;

        $( "#amount" ).val(entityTimeArray[length-1]);
        $("#draggable").draggable();
        var entityShowIndex=length-1;
        var slider = $("#timeSlider" ).slider({
            min: 0,
            max: length-1,
            range: "max",
            value: length-1,
            slide: function( event, ui ) {
                $( "#amount" ).val(entityTimeArray[ui.value]);
                kmlEntities[ui.value].show=true;
                kmlEntities[entityShowIndex].show=false;
                entityShowIndex=ui.value;
//                if(ui.value>0){
//                    $( "#amount" ).val(entityTimeArray[ui.value-1]);
//
//                }else{
//                    $( "#amount" ).val(entityTimeArray[ui.value]);
//                }
                //console.log(viewer.entities.getById(entityTimeArray[1]));
               // console.log(viewer.entities);
            }
        });

//        var entityTimeArray=Window.entityTimeArray;
//        console.log(entityTimeArray);
//        console.log(viewer.entities.getById(entityTimeArray[1]));
    }).otherwise(function(error){
        //Display any errrors encountered while loading.
        window.alert(error);
    });

    var scene = viewer.scene;
    var clickDetailHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    var ellipsoid = scene.globe.ellipsoid;
    clickDetailHandler.setInputAction(function (click) { // actionFunction, mouseEventType, eventModifierKey
            var pickedObject = scene.pick(click.position);
            console.log(viewer.entities);
            console.log(viewer.dataSources);
            if (Cesium.defined(pickedObject)) {
                if (typeof window !== 'undefined') {
                    if (pickedObject.primitive.imageFoot) {
                        var pickedObjId = pickedObject.primitive;
                        clickposition = scene.camera.pickEllipsoid(click.position, ellipsoid);
                        balloonViewModel.position = click.position;
                        balloonViewModel.content = getHtml(pickedObjId.satllite, pickedObjId.acceptTime, pickedObjId.pathNum, pickedObjId.rowNum, pickedObjId.imageUrl);
                        balloonViewModel.showBalloon = true;
                        balloonViewModel.update();
                    }
                }
            }
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
    );
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(120.9294365136719, 30.83243635559082, 40000000),
        duration: 0
    });
}

