/**
 * @author huaqing / https://github.com/2912401452/
 */
THREE.DepthFogPass = function(scene, camera, options) {
    THREE.Pass.call( this );

    this.scene = scene;
    this.camera = camera;
    options = options?options:{}
   
    this.fogColor = options.fogColor ? options.fogColor : new THREE.Color(1, 1, 1)
    this.fogLinearDis = options.fogLinearDis ? options.fogLinearDis : 300

    this.depthTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
    this.depthTarget.texture.format = THREE.RGBFormat;
    this.depthTarget.texture.minFilter = THREE.NearestFilter;
    this.depthTarget.texture.magFilter = THREE.NearestFilter;
    this.depthTarget.texture.generateMipmaps = false;
    this.depthTarget.stencilBuffer = false;
    this.depthTarget.depthBuffer = true;
    this.depthTarget.depthTexture = new THREE.DepthTexture();
    this.depthTarget.depthTexture.type = THREE.UnsignedShortType;

    renderer.autoClear = false
    renderer.setRenderTarget( this.depthTarget );
    renderer.render(scene, camera)
    renderer.autoClear = true
    renderer.setRenderTarget( null );

    this.calCameraVectors()

    let { topLeftVec, topRightVec, bottomLeftVec, bottomRightVec } = this.depthMaterial = this.getDepthMaterial();
    this.depthMaterial.uniforms[ "topLeftVec" ].value = topLeftVec
    this.depthMaterial.uniforms[ "topRightVec" ].value = topRightVec
    this.depthMaterial.uniforms[ "bottomLeftVec" ].value = bottomLeftVec
    this.depthMaterial.uniforms[ "bottomRightVec" ].value = bottomRightVec

    this.fsQuad = new THREE.Pass.FullScreenQuad( this.depthMaterial );
}

THREE.DepthFogPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {
    constructor: THREE.DepthFogPass,
    render: function(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
        
        this.depthMaterial.uniforms[ "colorTexture" ].value = readBuffer.texture;

        let { topLeftVec, topRightVec, bottomLeftVec, bottomRightVec } = this.calCameraVectors()

        this.depthMaterial.uniforms[ "cameraPos" ].value = this.camera.position
        this.depthMaterial.uniforms[ "topLeftVec" ].value = topLeftVec
        this.depthMaterial.uniforms[ "topRightVec" ].value = topRightVec
        this.depthMaterial.uniforms[ "bottomLeftVec" ].value = bottomLeftVec
        this.depthMaterial.uniforms[ "bottomRightVec" ].value = bottomRightVec
        
        renderer.setRenderTarget( this.depthTarget );
        renderer.render( this.scene, this.camera );
        
        renderer.setRenderTarget( null );
        this.fsQuad.render( renderer );

    },

    calCameraVectors() {
        let near = camera.near
        let { fov, aspect } = camera
        let h = Math.tan(this.ang2rad(fov/2))*near
        let w = h*aspect
  
        // let forwardDir = (new THREE.Vector3(0, 0, 1).applyMatrix4(camera.matrixWorld)).sub(camera.position.clone()).normalize()
        // let rightDir = (new THREE.Vector3(1, 0, 0).applyMatrix4(camera.matrixWorld)).sub(camera.position.clone()).normalize()
        // let topDir = (new THREE.Vector3(0, 1, 0).applyMatrix4(camera.matrixWorld)).sub(camera.position.clone()).normalize()
        
        let forwardDir = (new THREE.Vector3(0, 0, 1).applyMatrix4(camera.matrixWorld.clone()))
        forwardDir.sub(camera.position.clone())
        forwardDir.normalize()
        
        let rightDir = (new THREE.Vector3(-1, 0, 0).applyMatrix4(camera.matrixWorld.clone()))
        rightDir.sub(camera.position.clone())
        rightDir.normalize()

        let topDir = (new THREE.Vector3(0, -1, 0).applyMatrix4(camera.matrixWorld.clone()))
        topDir.sub(camera.position.clone())
        topDir.normalize()
       
       
        let toRight = rightDir.multiplyScalar(w);
        let toTop = topDir.multiplyScalar(h)
        
        let topLeftVec = (forwardDir.clone().multiplyScalar(near)).add(toTop.clone()).sub(toRight.clone())
        let scale = topLeftVec.length() / near;
       
        topLeftVec.normalize()
        topLeftVec.multiplyScalar(-scale)
        
        let topRightVec = (forwardDir.clone().multiplyScalar(near)).add(toRight.clone()).add(toTop.clone())
        topRightVec.normalize()
        topRightVec.multiplyScalar(-scale)
        
        let bottomLeftVec = (forwardDir.clone().multiplyScalar(near)).sub(toTop.clone()).sub(toRight.clone())
        bottomLeftVec.normalize()
        bottomLeftVec.multiplyScalar(-scale)
       
        let bottomRightVec = (forwardDir.clone().multiplyScalar(near)).add(toRight.clone()).sub(toTop.clone())
        bottomRightVec.normalize()
        bottomRightVec.multiplyScalar(-scale)

        return { topLeftVec, topRightVec, bottomLeftVec, bottomRightVec }

    },
    ang2rad(ang){ // 角度变弧度
        return (ang * Math.PI) / 180;
    },
    getDepthMaterial: function() {
        return new THREE.ShaderMaterial( {
            uniforms: {
                "colorTexture": { value: null },
                "depthTexture": { value: this.depthTarget.depthTexture },
                "cameraFar": { value: this.camera.far },
                "cameraNear": { value: this.camera.near },
                "cameraPos": { value: this.camera.position.clone() },
                "topLeftVec": { value: this.topLeftVec },
                "topRightVec": { value: this.topRightVec },
                "bottomLeftVec": { value: this.bottomLeftVec },
                "bottomRightVec": { value: this.bottomRightVec },
                "fogColor": { value: this.fogColor },
                "fogLinearDis": { value: this.fogLinearDis }
            },
            transparent: true,
            vertexShader:
                `
                uniform vec3 topLeftVec;
                uniform vec3 topRightVec;
                uniform vec3 bottomLeftVec;
                uniform vec3 bottomRightVec;
                
                varying vec2 vUv;
                varying vec3 cameraVec;
                
                void main() {
                    vUv = uv;
                    if(uv.x < 0.5 && uv.y < 0.5) { // bottom left 
                        cameraVec = bottomLeftVec;
                    }else if(uv.x < 0.5 && uv.y > 0.5) { // top left
                        cameraVec = topLeftVec;
                    }else if(uv.x > 0.5 && uv.y > 0.5) { // top right
                        cameraVec = topRightVec;
                    }else { // bottom right 
                        cameraVec = bottomRightVec;
                    }

					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
            fragmentShader:
                `
                #include <packing>
                varying vec2 vUv;
                varying vec3 cameraVec;

                uniform float cameraFar;
                uniform float cameraNear;
                uniform vec3 cameraPos;
                uniform sampler2D colorTexture;
                uniform sampler2D depthTexture;
         
                uniform vec3 fogColor;
                uniform float fogLinearDis;

                float readClipZ( sampler2D depthSampler, vec2 coord ) {
                    float fragCoordZ = texture2D( depthSampler, coord ).x;
                    return perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar ); // 返回相机空间的 viewZ（相对于相机空间的实际z）
                }

                void main() {
                    float clipZ = readClipZ( depthTexture, vUv );
                    vec3 wP = cameraPos + (cameraVec)*abs(clipZ);

                    float dis = distance(cameraPos, wP);
                    vec4 linearFogColor = mix(vec4(fogColor, 0.0), vec4(fogColor, 0.0), dis/fogLinearDis);
                 
                    if(distance(wP, cameraPos) < cameraFar*0.9 && length(wP.y) < 4.0) {
                        gl_FragColor = mix(texture2D( colorTexture, vUv), vec4(fogColor, 1.0), min(dis/fogLinearDis, 0.8));
                    }else {
                        gl_FragColor = texture2D( colorTexture, vUv);
                    }
                   
                }`
        })
    }
})