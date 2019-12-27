/**
 * 确定相应位置上选中了那些对象
 * @param {*} coords 
 * @param {*} camera 
 * @param {*} Meshes 
 */
function getSelectedMeshes( coords, camera, Meshes ){
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( coords, camera );	
    var intersects = raycaster.intersectObjects( Meshes );
    return intersects;
}
/**
 * 返回传入对象的父对象 (需要由额外属性isParent的支持)
 * @param {*} selectedMesh 
 */
function getParent(selectedMesh){
    if(selectedMesh.userData.isParent !== true){
        return getParent(selectedMesh.parent);
    }
    return selectedMesh;
}

/**
 * 在加载模型的时候使用 自动调整模型的大小以确保模型大小比例与场景比例相适应 （根据高度来调整）
 * @param {*} object        待调整的模型
 * @param {*} sceneSize     该类型的模型在场景中应该有的尺寸    
 */
function autoAdjustScale(object, sceneSize){
    var box3 = new THREE.Box3();
    box3.setFromObject(object);
    var oH = box3.max.y - box3.min.y;
    var scale = sceneSize/oH;
    object.scale.set(scale, scale, scale)
    return object;
}

/**
 * 在加载模型的时候使用 将地面模型自动调整至地面
 * @param {*} object 
 */
function autoPutGround(object){
    var box3 = new THREE.Box3();
    box3.setFromObject(object);
    var bottomY = box3.min.y;
    object.position.y += (bottomY < 0 ? -bottomY : bottomY);
}

/**
 * aabb 包围盒的碰撞检测
 * @param {*} obj1 
 * @param {*} obj2 
 */
function aabbCrashTest(obj1, obj2){
    var box3 =new THREE.Box3();
    var a = box3.setFromObject(obj1)
    var b = box3.clone().setFromObject(obj2)
    return  (a.min.x <= b.max.x && a.max.x >= b.min.x) &&
            (a.min.y <= b.max.y && a.max.y >= b.min.y) &&
            (a.min.z <= b.max.z && a.max.z >= b.min.z)
}
/**
 * 获取模型的世界坐标
 * @param {*} mesh 
 */
function getPointWorldPos (mesh) {
    mesh.geometry.computeBoundingBox()
    var centroid = new THREE.Vector3()
    centroid.addVectors( mesh.geometry.boundingBox.min, mesh.geometry.boundingBox.max )
    centroid.multiplyScalar( 0.5 )
    return centroid.applyMatrix4( mesh.matrixWorld )
}