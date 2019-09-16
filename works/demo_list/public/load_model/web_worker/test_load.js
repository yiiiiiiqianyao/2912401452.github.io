importScripts('../../src/three.js')
importScripts('../../src/loaders/OBJLoader.js')

var loader = new THREE.OBJLoader()
loader.load( './male02/male02.obj', function ( obj ) {
    self.postMessage(JSON.stringify(obj))
    self.close()
})