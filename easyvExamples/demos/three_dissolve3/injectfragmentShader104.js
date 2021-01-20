
/**
 * huaqing
 * 该方法主要的作用是对 THREE 原有材质的 shader 统一注入自定义 shader 字段
 * 默认之前的 输出为 preFragColor
 */
const SHADER_RLACE_INDEX = { // 控制对原有shader的替换
    MeshNormalMaterial: {
        index: 21,
        len: 1
    },
    MeshBasicMaterial: {
      index: 37,
      len: 1
    },
    MeshLambertMaterial: {
      index: 58,
      len: 1
    }
}

function injectfragmentShader(material, injectChunks, options) {
  

    if(material.type == "MeshNormalMaterial" ) {
      /**
        #define NORMAL
          uniform float opacity;
          #if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || ( defined( USE_NORMALMAP ) && ! defined( OBJECTSPACE_NORMALMAP ) )
            varying vec3 vViewPosition;
          #endif
          #ifndef FLAT_SHADED
            varying vec3 vNormal;
            #ifdef USE_TANGENT
              varying vec3 vTangent;
              varying vec3 vBitangent;
            #endif
          #endif
          #include <packing>
          #include <uv_pars_fragment>
          #include <bumpmap_pars_fragment>
          #include <normalmap_pars_fragment>
          #include <logdepthbuf_pars_fragment>
          void main() {
            #include <logdepthbuf_fragment>
            #include <normal_fragment_begin>
            #include <normal_fragment_maps>
            gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
      */
        let replaceConfig = SHADER_RLACE_INDEX["MeshNormalMaterial"]
        material.type = "ShaderMaterial"
        material.uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.normal.uniforms]) 
        material.vertexShader = THREE.ShaderChunk.normal_vert

        let preFragColor = "vec4 preFragColor = vec4( packNormalToRGB( normal ), opacity );\n"
        let chunks = THREE.ShaderChunk.normal_frag.split('\n')
        chunks.splice(replaceConfig.index, replaceConfig.len, preFragColor, ...injectChunks)
     
        material.fragmentShader = chunks.join("\n")
      
    } else if(material.type == "MeshBasicMaterial") {
      

      material.type = "ShaderMaterial"
      material.uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.basic.uniforms]) 

      material.uniforms = {...material.uniforms, ...options}

      material.vertexShader = `
      #include <common>
      #include <uv_pars_vertex>
      #include <uv2_pars_vertex>
      #include <envmap_pars_vertex>
      #include <color_pars_vertex>
      #include <fog_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <skinning_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>
      varying vec3 worldPos;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        #include <uv_vertex>
        #include <uv2_vertex>
        #include <color_vertex>
        #include <skinbase_vertex>
        #ifdef USE_ENVMAP
        #include <beginnormal_vertex>
        #include <morphnormal_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>
        #endif
        #include <begin_vertex>
        #include <morphtarget_vertex>
        #include <skinning_vertex>
        #include <project_vertex>
        #include <logdepthbuf_vertex>
        #include <worldpos_vertex>
        #include <clipping_planes_vertex>
        #include <envmap_vertex>
        #include <fog_vertex>
      }
       
    
      `
      material.fragmentShader = `
      uniform vec3 diffuse;
      uniform sampler2D dissolveMap;
      varying vec3 worldPos;
      uniform float time;
      uniform bool flag;
      varying vec2 vUv;

      uniform float opacity;
      #ifndef FLAT_SHADED
        varying vec3 vNormal;
      #endif
      #include <common>
      #include <color_pars_fragment>
      #include <uv_pars_fragment>
      #include <uv2_pars_fragment>
      #include <map_pars_fragment>
      #include <alphamap_pars_fragment>
      #include <aomap_pars_fragment>
      #include <lightmap_pars_fragment>
      #include <envmap_pars_fragment>
      #include <fog_pars_fragment>
      #include <specularmap_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>
      void main() {
        #include <clipping_planes_fragment>
        vec4 diffuseColor = vec4( diffuse, opacity );
        #include <logdepthbuf_fragment>
        #include <map_fragment>
        #include <color_fragment>
        #include <alphamap_fragment>
        #include <alphatest_fragment>
        #include <specularmap_fragment>
        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
        #ifdef USE_LIGHTMAP
          reflectedLight.indirectDiffuse += texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;
        #else
          reflectedLight.indirectDiffuse += vec3( 1.0 );
        #endif
        #include <aomap_fragment>
        reflectedLight.indirectDiffuse *= diffuseColor.rgb;
        vec3 outgoingLight = reflectedLight.indirectDiffuse;
        #include <envmap_fragment>


        float bottom = -2.0;
        float top = 2.0;
        float yScale = (worldPos.y - bottom)/(top - bottom);
        float t;
        if(flag) {
          t = fract(time);
        }else {
          t = 1. - fract(time);
        }
        float h = texture2D( dissolveMap, vUv).r;
  
        float dissolveWidth = 4.0; // 值越大越窄

        // gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        vec4 color = vec4( outgoingLight, diffuseColor.a );

        float condition_if_1 = step(h + yScale*dissolveWidth, t*(dissolveWidth + 1.0) + 0.04);
        float condition_if_2 = step(h + yScale*dissolveWidth, t*(dissolveWidth + 1.0));
        color = mix(color, vec4(1.0 ,1.0 , 0.0, 1.0), condition_if_1 );
        color = color * (1. - condition_if_2);
        gl_FragColor = color;

        #include <premultiplied_alpha_fragment>
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
      }
      `

    } else if(material.type == "MeshLambertMaterial") {
      /**
       uniform vec3 diffuse;
        uniform vec3 emissive;
        uniform float opacity;
        varying vec3 vLightFront;
        varying vec3 vIndirectFront;
        #ifdef DOUBLE_SIDED
          varying vec3 vLightBack;
          varying vec3 vIndirectBack;
        #endif
        #include <common>
        #include <packing>
        #include <dithering_pars_fragment>
        #include <color_pars_fragment>
        #include <uv_pars_fragment>
        #include <uv2_pars_fragment>
        #include <map_pars_fragment>
        #include <alphamap_pars_fragment>
        #include <aomap_pars_fragment>
        #include <lightmap_pars_fragment>
        #include <emissivemap_pars_fragment>
        #include <envmap_pars_fragment>
        #include <bsdfs>
        #include <lights_pars_begin>
        #include <fog_pars_fragment>
        #include <shadowmap_pars_fragment>
        #include <shadowmask_pars_fragment>
        #include <specularmap_pars_fragment>
        #include <logdepthbuf_pars_fragment>
        #include <clipping_planes_pars_fragment>
        void main() {
          #include <clipping_planes_fragment>
          vec4 diffuseColor = vec4( diffuse, opacity );
          ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
          vec3 totalEmissiveRadiance = emissive;
          #include <logdepthbuf_fragment>
          #include <map_fragment>
          #include <color_fragment>
          #include <alphamap_fragment>
          #include <alphatest_fragment>
          #include <specularmap_fragment>
          #include <emissivemap_fragment>
          reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );
          #ifdef DOUBLE_SIDED
            reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
          #else
            reflectedLight.indirectDiffuse += vIndirectFront;
          #endif
          #include <lightmap_fragment>
          reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );
          #ifdef DOUBLE_SIDED
            reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
          #else
            reflectedLight.directDiffuse = vLightFront;
          #endif
          reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();
          #include <aomap_fragment>
          vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
          #include <envmap_fragment>
          gl_FragColor = vec4( outgoingLight, diffuseColor.a );
          #include <tonemapping_fragment>
          #include <encodings_fragment>
          #include <fog_fragment>
          #include <premultiplied_alpha_fragment>
          #include <dithering_fragment>
        }
       */
      let replaceConfig = SHADER_RLACE_INDEX["MeshLambertMaterial"]
      material.type = "ShaderMaterial"
      material.uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.lambert.uniforms]) 
      material.vertexShader = THREE.ShaderChunk.meshlambert_vert

      let preFragColor = "vec4 preFragColor = vec4( outgoingLight, diffuseColor.a );\n"
      let chunks = THREE.ShaderChunk.meshlambert_frag.split('\n')
      chunks.splice(replaceConfig.index, replaceConfig.len, preFragColor, ...injectChunks)
   
      material.fragmentShader = chunks.join("\n")
    }
}