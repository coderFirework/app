/**
 * Created by myhom on 2017/5/15.
 */
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
createModel("./models/Cesium_Air.gltf");