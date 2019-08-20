
// Global Draco decoder type.
var dracoDecoderType = {};
var dracoLoader;
function createDracoDecoder() {
    dracoLoader = new THREE.DRACOLoader();
    //dracoLoader.setDracoDecoderType(dracoDecoderType);
}
createDracoDecoder();

// Download and decode the Draco encoded geometry.
function downloadEncodedMesh(filename) {
    // Download the encoded file.
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filename, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (event) {
        const arrayBuffer = xhr.response;
        if (arrayBuffer) {
            dracoLoader.setVerbosity(1);
            dracoLoader.decodeDracoFile(arrayBuffer, onDecode);
        }
    };
    xhr.send(null);

}

// bufferGeometry is a geometry decoded by DRACOLoader.js
function onDecode(bufferGeometry) {
    const material = new THREE.MeshStandardMaterial({vertexColors: THREE.VertexColors});
    const geometry = resizeGeometry(bufferGeometry, material);
    const selectedObject = scene.getObjectByName("my_mesh");
    scene.remove(selectedObject);
    geometry.name = "my_mesh";
    scene.add(geometry);
}

//缩放模型至合适大小、移动模型至合适位置
function resizeGeometry(bufferGeometry, material) {
    var geometry;
    // Point cloud does not have face indices.
    if (bufferGeometry.index == null) {
        geometry = new THREE.Points(bufferGeometry, material);
    } else {
        bufferGeometry.computeVertexNormals();
        geometry = new THREE.Mesh(bufferGeometry, material);    //------------------
    }
    // Compute range of the geometry coordinates for proper rendering.
    bufferGeometry.computeBoundingBox();
    const sizeX = bufferGeometry.boundingBox.max.x - bufferGeometry.boundingBox.min.x;
    const sizeY = bufferGeometry.boundingBox.max.y - bufferGeometry.boundingBox.min.y;
    const sizeZ = bufferGeometry.boundingBox.max.z - bufferGeometry.boundingBox.min.z;
    const diagonalSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);
    const scale = 1.0 / diagonalSize;
    const midX =
        (bufferGeometry.boundingBox.min.x + bufferGeometry.boundingBox.max.x) / 2;
    const midY =
        (bufferGeometry.boundingBox.min.y + bufferGeometry.boundingBox.max.y) / 2;
    const midZ =
        (bufferGeometry.boundingBox.min.z + bufferGeometry.boundingBox.max.z) / 2;
    geometry.scale.multiplyScalar(scale);
    geometry.position.x = -midX * scale;
    geometry.position.y = -midY * scale;
    geometry.position.z = -midZ * scale;
    geometry.castShadow = true;
    geometry.receiveShadow = true;
    return geometry;
}
