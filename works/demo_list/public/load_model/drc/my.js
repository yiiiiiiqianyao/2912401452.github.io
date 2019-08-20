    // show demo https://www.kujiale.com/festatic/musi

    let dom = document.getElementById("targetEle");
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45,dom.clientWidth/dom.clientHeight);
    let renderer = new THREE.WebGLRenderer({antialias:true})//抗锯齿
    let controller = new THREE.OrbitControls(camera,renderer.domElement)
    controller.rotateSpeed = 2
    controller.target = new THREE.Vector3(0, 0, 0)//控制焦点

    let clock = new THREE.Clock()//用于更新轨道控制器
    renderer.setClearColor(0xEEEEEE)
    renderer.setSize(dom.clientWidth,dom.clientHeight)

    // var axes = new THREE.AxesHelper(10)
    // scene.add(axes)

    //旋转场景使模型正对
    scene.rotation.y = Math.PI

    //设置摄像机
    camera.position.x = 0
    camera.position.y = 20
    camera.position.z = -50
    //指定摄像机的指向
    // camera.lookAt(cube.position)

    //初次渲染
    dom.appendChild(renderer.domElement)
    renderer.render(scene,camera)

    //dom event
    //dom 的点击动作
     dom.onmousedown = function(downE){
        judgeController(downE)//判断用户的点击效果
    }
    function judgeController(downE){     //在鼠标点击的时候判断是否选中了场景中的网格(模拟交替)
        var raycaster = new THREE.Raycaster()
        var mouse = new THREE.Vector3()
        mouse.x = ((downE.clientX - dom.getBoundingClientRect().x) / dom.clientWidth)*2-1
        mouse.y = -((downE.clientY - dom.getBoundingClientRect().y) / dom.clientHeight)*2+1 

        raycaster.setFromCamera(mouse,camera)
        var intersects = raycaster.intersectObjects(scene.children)//在当前射线路径上的网格对象
        console.log(intersects.length)
        if(intersects.length > 1){
            console.log('open')
            // console.log(intersects[0])

            intersects[0].object.material.map = new THREE.TextureLoader().load("texture/buoy1.jpg")
            return
        }
        console.log('close')
        // currentControllerState = 'trackballControls'//控制器的控制权归还给控制球控制器
    }


    let modelCount = 0
    var dracoDecoderType = { type: 'js' }
    var dracoLoader = new THREE.DRACOLoader()
    
    //async load test
    let my_modules = [
        {src:"model/result.obj1.drc",mapSrc:"texture/buoy1.jpg"},
        {src:"model/result.obj2.drc",mapSrc:"texture/buoy2.jpg"},
        {src:"model/result.obj3.drc",mapSrc:"texture/diffuse.jpg"},
        {src:"model/result.obj4.drc",mapSrc:"texture/line.jpg"},
        {src:"model/result.obj5.drc",mapSrc:"texture/base.jpg"}
    ]
    for(let i = 0;i < my_modules.length;i++){
        loadModel(my_modules[i])
    }
    function loadModel(my_module){
        const xhr = new XMLHttpRequest()
        xhr.open("GET", my_module.src, true)
        xhr.responseType = "arraybuffer"
        xhr.onload = function (event) {
            const arrayBuffer = xhr.response;
            if (arrayBuffer) {
                dracoLoader.setVerbosity(1);
                dracoLoader.decodeDracoFile(arrayBuffer,onDecode);

                function onDecode(bufferGeometry) {
                    let material = new THREE.MeshLambertMaterial()
                    let texture = new THREE.TextureLoader().load(my_module['mapSrc'])
                    material.map = texture//设置材质为纹理
                    material.needsUpdate = true
                    let geometry = new THREE.Mesh(bufferGeometry, material)
                    geometry.scale.set(0.08, 0.08, 0.08)
                    scene.add(geometry);
                    modelCount++;if(modelCount == 5){clearLoadingPage()}
                }
            }
        };
        xhr.send(null);
    }
    
    // dracoLoader.load("model/result.obj1.drc",function(mesh){//救生圈1
    //     const material = new THREE.MeshLambertMaterial()    
    //     const texture = new THREE.TextureLoader().load("texture/buoy1.jpg")//获取纹理图
    //     material.map = texture//设置材质为纹理
    //     material.needsUpdate = true
    //     let model=new THREE.Mesh(mesh,material)//模型
    //     model.scale.set(0.08, 0.08, 0.08)
    //     scene.add(model)
    //     modelCount++;if(modelCount == 5){clearLoadingPage()}
    // })
    // dracoLoader.load("model/result.obj2.drc",function(mesh){//救生圈2
    //     const material = new THREE.MeshLambertMaterial()    
    //     const texture = new THREE.TextureLoader().load("texture/buoy2.jpg")//获取纹理图
    //     material.map = texture//设置材质为纹理
    //     material.needsUpdate = true
    //     let model=new THREE.Mesh(mesh,material)//模型
    //     model.scale.set(0.08, 0.08, 0.08)
    //     scene.add(model)
    //     modelCount++;if(modelCount == 5){clearLoadingPage()}
    // })
    // dracoLoader.load("model/result.obj3.drc",function(mesh){//床垫
    //     const material = new THREE.MeshLambertMaterial()    
    //     const texture = new THREE.TextureLoader().load("texture/diffuse.jpg")//获取纹理图
    //     material.map = texture//设置材质为纹理
    //     material.needsUpdate = true
    //     let model=new THREE.Mesh(mesh,material)//模型
    //     model.scale.set(0.08, 0.08, 0.08)
    //     scene.add(model)
    //     modelCount++;if(modelCount == 5){clearLoadingPage()}
    // })
    // dracoLoader.load("model/result.obj4.drc",function(mesh){//床垫边线
    //     const material = new THREE.MeshLambertMaterial()    
    //     const texture = new THREE.TextureLoader().load("texture/line.jpg")//获取纹理图
    //     material.map = texture//设置材质为纹理
    //     material.needsUpdate = true
    //     let model=new THREE.Mesh(mesh,material)//模型
    //     model.scale.set(0.08, 0.08, 0.08)
    //     scene.add(model)
    //     modelCount++;if(modelCount == 5){clearLoadingPage()}
    // })
    // dracoLoader.load("model/result.obj5.drc",function(mesh){//床架
    //     const material = new THREE.MeshLambertMaterial()    
    //     const texture = new THREE.TextureLoader().load("texture/base.jpg")//获取纹理图
    //     material.map = texture//设置材质为纹理
    //     material.needsUpdate = true
    //     let model=new THREE.Mesh(mesh,material)//模型
    //     model.scale.set(0.08, 0.08, 0.08)
    //     scene.add(model)
    //     modelCount++;if(modelCount == 5){clearLoadingPage()}
    // })
    

    //添加光源 
    //环境光源
    scene.add(new THREE.AmbientLight("#0xFFFFFF"))
    //为场景添加光源

    window.addEventListener('resize', onWindowResize, false)
    //监听浏览器窗口大小的变化，从而改变绘制区域    
    function onWindowResize() {        
        camera.aspect = window.innerWidth / window.innerHeight     
        camera.updateProjectionMatrix()   
        renderer.setSize(window.innerWidth, window.innerHeight)  
    }
    function renderScene(){
        renderer.render(scene,camera)
        let delta = clock.getDelta();
        controller.update(delta)
        // scene.rotation.y += 0.01
        animationID = requestAnimationFrame(renderScene)
    }
    function clearLoadingPage(){
        setTimeout(function(){
            let page = document.getElementById('loadingPage')
            page.style.display = 'none'
        },5)
    }
    //开启动画
    renderScene()
