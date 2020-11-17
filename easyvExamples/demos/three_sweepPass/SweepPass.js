THREE.SweepPass = function(scene, camera) {
    THREE.Pass.call( this );

    this.scene = scene;
	this.camera = camera;

    this.sweepMaterial = this.getSweepMaterial( );
    this.fsQuad = new THREE.Pass.FullScreenQuad( this.sweepMaterial );
}

THREE.SweepPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {
    constructor: THREE.SweepPass,
    render: function(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
        
        this.sweepMaterial.uniforms[ "colorTexture" ].value = readBuffer.texture;
        
        renderer.setRenderTarget( null );
        this.fsQuad.render( renderer );
    },

    getSweepMaterial: function() {
        return new THREE.ShaderMaterial( {
            uniforms: {
                "colorTexture": { value: null },
                "time":{type: "f", value: .0}
			},
            vertexShader:
                `
                varying vec2 vUv;
                varying vec3 iPosition;
                void main() {
                    vUv = uv;
                    iPosition = position; // -1.0 -> 1.0
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

            fragmentShader:
                `
                uniform float time;

                varying vec2 vUv;
                varying vec3 iPosition;
                uniform sampler2D colorTexture;
                void main() {

                    vec4 diff = texture2D( colorTexture, vUv);

                    float x = iPosition.x;
                    float lighty = -x*1.2 + time;
                    float alpha = abs(iPosition.y - lighty);

                    if(alpha < 0.1){
                        float a = 1.0 -  alpha / 0.1;
                        //float enda = smoothstep(0.0,1.0,a) + 0.3;
                        float enda = smoothstep(1.0, 0.0,a) + 0.3;
                        //gl_FragColor = diff * enda;
                      
                        // 卢马换算公式光度; 
                        float diffA = 0.2126*diff.r + 0.7152*diff.g + 0.0722*diff.b;
                    
                        // if(length(diff.xyz) < 0.3) {
                        // if(diffA < 0.3) {
                        //     gl_FragColor = vec4(diff.xyz * 0.3, 1.0);
                        // }else {
                        //     gl_FragColor = diff * enda;
                        // }

                        gl_FragColor = mix(vec4(diff.xyz * 0.3, 1.0), diff * enda, diffA);

                        //gl_FragColor = diff * enda;
                    }else{
                        //gl_FragColor = diff * 0.3;
                        gl_FragColor = vec4(diff.xyz * 0.3, 1.0);
                        //gl_FragColor = diff;
                    }
				}`
        })
    }
})