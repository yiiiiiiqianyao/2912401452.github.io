THREE.GrayPass = function(scene, camera) {
    THREE.Pass.call( this );

    this.scene = scene;
	this.camera = camera;

    this.gryMaterial = this.getGrayMaterial( );
    this.fsQuad = new THREE.Pass.FullScreenQuad( this.gryMaterial );
}

THREE.GrayPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {
    constructor: THREE.GrayPass,
    render: function(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
        
        this.gryMaterial.uniforms[ "colorTexture" ].value = readBuffer.texture;
        
        renderer.setRenderTarget( null );
        this.fsQuad.render( renderer );
    },

    getGrayMaterial: function() {
        return new THREE.ShaderMaterial( {
            uniforms: {
				"colorTexture": { value: null }
			},
            vertexShader:
                "varying vec2 vUv;\n\
                void main() {\n\
                    vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

            fragmentShader:
                "varying vec2 vUv;\n\
                uniform sampler2D colorTexture;\n\
                void main() {\n\
                    vec4 diff = texture2D( colorTexture, vUv);\
                    float g = diff.r * 0.3 + diff.g*0.59 + diff.b*0.11;\n\
                    gl_FragColor = vec4(g , g , g , diff.a);\n\
				}"
        })
    }
})