var camera, scene, renderer,
    geometry, material, mesh;
 
init();
animate(); 

function init() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    scene = new THREE.Scene();
 
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );
 
    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    material = new THREE.MeshLambertMaterial( { color: 0xaa6666, wireframe: false } );
    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );
    cubeSineDriver = 0;
 
    // textGeo = new THREE.PlaneGeometry(300,300);
    // THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    // textTexture = THREE.ImageUtils.loadTexture('img/quickText.png');
    // textMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff, opacity: 1, map: textTexture, transparent: true, blending: THREE.AdditiveBlending})
    // text = new THREE.Mesh(textGeo,textMaterial);
    // text.position.z = 800;
    // scene.add(text);

    light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(-1,0,1);
    scene.add(light);
  
    smokeTexture = THREE.ImageUtils.loadTexture('img/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({color: 0x00dddd, map: smokeTexture, transparent: true});
    smokeGeo = new THREE.PlaneGeometry(300,300);
    smokeParticles = [];


    for (p = 0; p < 150; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }
 
    document.body.appendChild( renderer.domElement );
 
}
 
function animate() {
 
    // note: three.js includes requestAnimationFrame shim
    stats.begin();
    delta = clock.getDelta();
    requestAnimationFrame( animate );
    evolveSmoke();
    render();
    stats.end();
}
 
function evolveSmoke() {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}

function render() {
 
    // mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.01;
    // cubeSineDriver += .01;
    // mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
    renderer.render( scene, camera );
 
}