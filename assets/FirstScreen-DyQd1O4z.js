var et=Object.defineProperty;var tt=(o,d,x)=>d in o?et(o,d,{enumerable:!0,configurable:!0,writable:!0,value:x}):o[d]=x;var K=(o,d,x)=>tt(o,typeof d!="symbol"?d+"":d,x);import{j as n}from"./vendor-three-BBAFg9Pr.js";import{r as g}from"./vendor-router-D-vyc9e_.js";import{u as pe,a as rt,b as ee}from"./index-BVI1PlHm.js";import{m as p,A as Ce}from"./vendor-animation-B9DHSz8D.js";import"./vendor-react-bcwKtWt2.js";function it(){return{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,down:!1,moved:!1,color:{r:0,g:0,b:0}}}function nt({SIM_RESOLUTION:o=128,DYE_RESOLUTION:d=1440,CAPTURE_RESOLUTION:x=512,DENSITY_DISSIPATION:u=3.5,VELOCITY_DISSIPATION:b=2,PRESSURE:v=.1,PRESSURE_ITERATIONS:T=20,CURL:z=3,SPLAT_RADIUS:D=.2,SPLAT_FORCE:_=6e3,SHADING:A=!0,COLOR_UPDATE_SPEED:h=10,BACK_COLOR:X={r:.5,g:0,b:0},TRANSPARENT:Y=!0}){const q=g.useRef(null);return g.useEffect(()=>{const S=q.current;if(!S)return;let j=[it()],w={SIM_RESOLUTION:o,DYE_RESOLUTION:d,DENSITY_DISSIPATION:u,VELOCITY_DISSIPATION:b,PRESSURE:v,PRESSURE_ITERATIONS:T,CURL:z,SPLAT_RADIUS:D,SPLAT_FORCE:_,SHADING:A,COLOR_UPDATE_SPEED:h};const{gl:t,ext:E}=J(S);if(!t||!E)return;E.supportLinearFiltering||(w.DYE_RESOLUTION=256,w.SHADING=!1);function J(e){const i={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let r=e.getContext("webgl2",i);if(r||(r=e.getContext("webgl",i)||e.getContext("experimental-webgl",i)),!r)throw new Error("Unable to initialize WebGL.");const a="drawBuffers"in r;let s=!1,f=null;a?(r.getExtension("EXT_color_buffer_float"),s=!!r.getExtension("OES_texture_float_linear")):(f=r.getExtension("OES_texture_half_float"),s=!!r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const y=a?r.HALF_FLOAT:f&&f.HALF_FLOAT_OES||0;let U,I,W;return a?(U=$(r,r.RGBA16F,r.RGBA,y),I=$(r,r.RG16F,r.RG,y),W=$(r,r.R16F,r.RED,y)):(U=$(r,r.RGBA,r.RGBA,y),I=$(r,r.RGBA,r.RGBA,y),W=$(r,r.RGBA,r.RGBA,y)),{gl:r,ext:{formatRGBA:U,formatRG:I,formatR:W,halfFloatTexType:y,supportLinearFiltering:s}}}function $(e,i,r,a){if(!te(e,i,r,a)){if("drawBuffers"in e){const s=e;switch(i){case s.R16F:return $(s,s.RG16F,s.RG,a);case s.RG16F:return $(s,s.RGBA16F,s.RGBA,a);default:return null}}return null}return{internalFormat:i,format:r}}function te(e,i,r,a){const s=e.createTexture();if(!s)return!1;e.bindTexture(e.TEXTURE_2D,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,4,4,0,r,a,null);const f=e.createFramebuffer();return f?(e.bindFramebuffer(e.FRAMEBUFFER,f),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,s,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE):!1}function re(e){if(!e.length)return 0;let i=0;for(let r=0;r<e.length;r++)i=(i<<5)-i+e.charCodeAt(r),i|=0;return i}function fe(e,i){if(!i)return e;let r="";for(const a of i)r+=`#define ${a}
`;return r+e}function k(e,i,r=null){const a=fe(i,r),s=t.createShader(e);return s?(t.shaderSource(s,a),t.compileShader(s),t.getShaderParameter(s,t.COMPILE_STATUS),s):null}function oe(e,i){if(!e||!i)return null;const r=t.createProgram();return r?(t.attachShader(r,e),t.attachShader(r,i),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS),r):null}function se(e){let i={};const r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<r;a++){const s=t.getActiveUniform(e,a);s&&(i[s.name]=t.getUniformLocation(e,s.name))}return i}class G{constructor(i,r){K(this,"program");K(this,"uniforms");this.program=oe(i,r),this.uniforms=this.program?se(this.program):{}}bind(){this.program&&t.useProgram(this.program)}}class xe{constructor(i,r){K(this,"vertexShader");K(this,"fragmentShaderSource");K(this,"programs");K(this,"activeProgram");K(this,"uniforms");this.vertexShader=i,this.fragmentShaderSource=r,this.programs={},this.activeProgram=null,this.uniforms={}}setKeywords(i){let r=0;for(const s of i)r+=re(s);let a=this.programs[r];if(a==null){const s=k(t.FRAGMENT_SHADER,this.fragmentShaderSource,i);a=oe(this.vertexShader,s),this.programs[r]=a}a!==this.activeProgram&&(a&&(this.uniforms=se(a)),this.activeProgram=a)}bind(){this.activeProgram&&t.useProgram(this.activeProgram)}}const O=k(t.VERTEX_SHADER,`
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `),ge=k(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `),ye=k(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),ce=`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `,le=k(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `),be=k(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);

          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,E.supportLinearFiltering?null:["MANUAL_FILTERING"]),Te=k(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `),ue=k(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `),we=k(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),Re=k(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `),Se=k(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),L=(()=>{const e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW);const i=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0),(r,a=!1)=>{t&&(r?(t.viewport(0,0,r.width,r.height),t.bindFramebuffer(t.FRAMEBUFFER,r.fbo)):(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)),a&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT)),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0))}})();let l,c,m,R,N;const M=new G(O,ge),C=new G(O,ye),P=new G(O,le),F=new G(O,be),de=new G(O,Te),me=new G(O,ue),H=new G(O,we),Z=new G(O,Re),Q=new G(O,Se),ie=new xe(O,ce);function ne(e,i,r,a,s,f){t.activeTexture(t.TEXTURE0);const y=t.createTexture();t.bindTexture(t.TEXTURE_2D,y),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,f),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,f),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,e,i,0,a,s,null);const U=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,U),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,y,0),t.viewport(0,0,e,i),t.clear(t.COLOR_BUFFER_BIT);const I=1/e,W=1/i;return{texture:y,fbo:U,width:e,height:i,texelSizeX:I,texelSizeY:W,attach(ae){return t.activeTexture(t.TEXTURE0+ae),t.bindTexture(t.TEXTURE_2D,y),ae}}}function Ee(e,i,r,a,s,f){const y=ne(e,i,r,a,s,f),U=ne(e,i,r,a,s,f);return{width:e,height:i,texelSizeX:y.texelSizeX,texelSizeY:y.texelSizeY,read:y,write:U,swap(){const I=this.read;this.read=this.write,this.write=I}}}function Be(e,i,r,a,s,f,y){const U=ne(i,r,a,s,f,y);return M.bind(),M.uniforms.uTexture&&t.uniform1i(M.uniforms.uTexture,e.attach(0)),L(U,!1),U}function Fe(e,i,r,a,s,f,y){return e.width===i&&e.height===r||(e.read=Be(e.read,i,r,a,s,f,y),e.write=ne(i,r,a,s,f,y),e.width=i,e.height=r,e.texelSizeX=1/i,e.texelSizeY=1/r),e}function _e(){const e=je(w.SIM_RESOLUTION),i=je(w.DYE_RESOLUTION),r=E.halfFloatTexType,a=E.formatRGBA,s=E.formatRG,f=E.formatR,y=E.supportLinearFiltering?t.LINEAR:t.NEAREST;t.disable(t.BLEND),l?l=Fe(l,i.width,i.height,a.internalFormat,a.format,r,y):l=Ee(i.width,i.height,a.internalFormat,a.format,r,y),c?c=Fe(c,e.width,e.height,s.internalFormat,s.format,r,y):c=Ee(e.width,e.height,s.internalFormat,s.format,r,y),m=ne(e.width,e.height,f.internalFormat,f.format,r,t.NEAREST),R=ne(e.width,e.height,f.internalFormat,f.format,r,t.NEAREST),N=Ee(e.width,e.height,f.internalFormat,f.format,r,t.NEAREST)}function Ue(){const e=[];w.SHADING&&e.push("SHADING"),ie.setKeywords(e)}function je(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight,a=i/r;let s=a<1?1/a:a;const f=Math.round(e),y=Math.round(e*s);return i>r?{width:y,height:f}:{width:f,height:y}}function B(e){const i=window.devicePixelRatio||1;return Math.floor(e*i)}Ue(),_e();let Pe=Date.now(),he=0;function De(){const e=Ie();Xe()&&_e(),ke(e),Ge(),Ye(e),Oe(null),requestAnimationFrame(De)}function Ie(){const e=Date.now();let i=(e-Pe)/1e3;return i=Math.min(i,.016666),Pe=e,i}function Xe(){const e=B(S.clientWidth),i=B(S.clientHeight);return S.width!==e||S.height!==i?(S.width=e,S.height=i,!0):!1}function ke(e){he+=e*w.COLOR_UPDATE_SPEED,he>=1&&(he=Qe(he,0,1),j.forEach(i=>{i.color=ve()}))}function Ge(){for(const e of j)e.moved&&(e.moved=!1,$e(e))}function Ye(e){t.disable(t.BLEND),me.bind(),me.uniforms.texelSize&&t.uniform2f(me.uniforms.texelSize,c.texelSizeX,c.texelSizeY),me.uniforms.uVelocity&&t.uniform1i(me.uniforms.uVelocity,c.read.attach(0)),L(R),H.bind(),H.uniforms.texelSize&&t.uniform2f(H.uniforms.texelSize,c.texelSizeX,c.texelSizeY),H.uniforms.uVelocity&&t.uniform1i(H.uniforms.uVelocity,c.read.attach(0)),H.uniforms.uCurl&&t.uniform1i(H.uniforms.uCurl,R.attach(1)),H.uniforms.curl&&t.uniform1f(H.uniforms.curl,w.CURL),H.uniforms.dt&&t.uniform1f(H.uniforms.dt,e),L(c.write),c.swap(),de.bind(),de.uniforms.texelSize&&t.uniform2f(de.uniforms.texelSize,c.texelSizeX,c.texelSizeY),de.uniforms.uVelocity&&t.uniform1i(de.uniforms.uVelocity,c.read.attach(0)),L(m),C.bind(),C.uniforms.uTexture&&t.uniform1i(C.uniforms.uTexture,N.read.attach(0)),C.uniforms.value&&t.uniform1f(C.uniforms.value,w.PRESSURE),L(N.write),N.swap(),Z.bind(),Z.uniforms.texelSize&&t.uniform2f(Z.uniforms.texelSize,c.texelSizeX,c.texelSizeY),Z.uniforms.uDivergence&&t.uniform1i(Z.uniforms.uDivergence,m.attach(0));for(let r=0;r<w.PRESSURE_ITERATIONS;r++)Z.uniforms.uPressure&&t.uniform1i(Z.uniforms.uPressure,N.read.attach(1)),L(N.write),N.swap();Q.bind(),Q.uniforms.texelSize&&t.uniform2f(Q.uniforms.texelSize,c.texelSizeX,c.texelSizeY),Q.uniforms.uPressure&&t.uniform1i(Q.uniforms.uPressure,N.read.attach(0)),Q.uniforms.uVelocity&&t.uniform1i(Q.uniforms.uVelocity,c.read.attach(1)),L(c.write),c.swap(),F.bind(),F.uniforms.texelSize&&t.uniform2f(F.uniforms.texelSize,c.texelSizeX,c.texelSizeY),!E.supportLinearFiltering&&F.uniforms.dyeTexelSize&&t.uniform2f(F.uniforms.dyeTexelSize,c.texelSizeX,c.texelSizeY);const i=c.read.attach(0);F.uniforms.uVelocity&&t.uniform1i(F.uniforms.uVelocity,i),F.uniforms.uSource&&t.uniform1i(F.uniforms.uSource,i),F.uniforms.dt&&t.uniform1f(F.uniforms.dt,e),F.uniforms.dissipation&&t.uniform1f(F.uniforms.dissipation,w.VELOCITY_DISSIPATION),L(c.write),c.swap(),!E.supportLinearFiltering&&F.uniforms.dyeTexelSize&&t.uniform2f(F.uniforms.dyeTexelSize,l.texelSizeX,l.texelSizeY),F.uniforms.uVelocity&&t.uniform1i(F.uniforms.uVelocity,c.read.attach(0)),F.uniforms.uSource&&t.uniform1i(F.uniforms.uSource,l.read.attach(1)),F.uniforms.dissipation&&t.uniform1f(F.uniforms.dissipation,w.DENSITY_DISSIPATION),L(l.write),l.swap()}function Oe(e){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),He(e)}function He(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight;ie.bind(),w.SHADING&&ie.uniforms.texelSize&&t.uniform2f(ie.uniforms.texelSize,1/i,1/r),ie.uniforms.uTexture&&t.uniform1i(ie.uniforms.uTexture,l.read.attach(0)),L(e,!1)}function $e(e){const i=e.deltaX*w.SPLAT_FORCE,r=e.deltaY*w.SPLAT_FORCE;ze(e.texcoordX,e.texcoordY,i,r,e.color)}function We(e){const i=ve();i.r*=10,i.g*=10,i.b*=10;const r=10*(Math.random()-.5),a=30*(Math.random()-.5);ze(e.texcoordX,e.texcoordY,r,a,i)}function ze(e,i,r,a,s){P.bind(),P.uniforms.uTarget&&t.uniform1i(P.uniforms.uTarget,c.read.attach(0)),P.uniforms.aspectRatio&&t.uniform1f(P.uniforms.aspectRatio,S.width/S.height),P.uniforms.point&&t.uniform2f(P.uniforms.point,e,i),P.uniforms.color&&t.uniform3f(P.uniforms.color,r,a,0),P.uniforms.radius&&t.uniform1f(P.uniforms.radius,Ke(w.SPLAT_RADIUS/100)),L(c.write),c.swap(),P.uniforms.uTarget&&t.uniform1i(P.uniforms.uTarget,l.read.attach(0)),P.uniforms.color&&t.uniform3f(P.uniforms.color,s.r,s.g,s.b),L(l.write),l.swap()}function Ke(e){const i=S.width/S.height;return i>1&&(e*=i),e}function Ne(e,i,r,a){e.id=i,e.down=!0,e.moved=!1,e.texcoordX=r/S.width,e.texcoordY=1-a/S.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=ve()}function Ae(e,i,r,a){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=i/S.width,e.texcoordY=1-r/S.height,e.deltaX=qe(e.texcoordX-e.prevTexcoordX),e.deltaY=Je(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0,e.color=a}function Ve(e){e.down=!1}function qe(e){const i=S.width/S.height;return i<1&&(e*=i),e}function Je(e){const i=S.width/S.height;return i>1&&(e/=i),e}function ve(){const e=Ze(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function Ze(e,i,r){let a=0,s=0,f=0;const y=Math.floor(e*6),U=e*6-y,I=r*(1-i),W=r*(1-U*i),ae=r*(1-(1-U)*i);switch(y%6){case 0:a=r,s=ae,f=I;break;case 1:a=W,s=r,f=I;break;case 2:a=I,s=r,f=ae;break;case 3:a=I,s=W,f=r;break;case 4:a=ae,s=I,f=r;break;case 5:a=r,s=I,f=W;break}return{r:a,g:s,b:f}}function Qe(e,i,r){const a=r-i;return(e-i)%a+i}window.addEventListener("mousedown",e=>{const i=j[0],r=B(e.clientX),a=B(e.clientY);Ne(i,-1,r,a),We(i)});function Me(e){const i=j[0],r=B(e.clientX),a=B(e.clientY),s=ve();De(),Ae(i,r,a,s),document.body.removeEventListener("mousemove",Me)}document.body.addEventListener("mousemove",Me),window.addEventListener("mousemove",e=>{const i=j[0],r=B(e.clientX),a=B(e.clientY),s=i.color;Ae(i,r,a,s)});function Le(e){const i=e.targetTouches,r=j[0];for(let a=0;a<i.length;a++){const s=B(i[a].clientX),f=B(i[a].clientY);De(),Ne(r,i[a].identifier,s,f)}document.body.removeEventListener("touchstart",Le)}document.body.addEventListener("touchstart",Le),window.addEventListener("touchstart",e=>{const i=e.targetTouches,r=j[0];for(let a=0;a<i.length;a++){const s=B(i[a].clientX),f=B(i[a].clientY);Ne(r,i[a].identifier,s,f)}},!1),window.addEventListener("touchmove",e=>{const i=e.targetTouches,r=j[0];for(let a=0;a<i.length;a++){const s=B(i[a].clientX),f=B(i[a].clientY);Ae(r,s,f,r.color)}},!1),window.addEventListener("touchend",e=>{const i=e.changedTouches,r=j[0];for(let a=0;a<i.length;a++)Ve(r)})},[o,d,x,u,b,v,T,z,D,_,A,h,X,Y]),n.jsx("div",{className:"fixed top-0 left-0 z-50 pointer-events-none w-full h-full",children:n.jsx("canvas",{ref:q,id:"fluid",className:"w-screen h-screen block"})})}const at=({glitchColors:o=["#2b4539","#61dca3","#61b3dc"],glitchSpeed:d=40,centerVignette:x=!1,outerVignette:u=!0,smooth:b=!0,onComplete:v,duration:T=0,className:z=""})=>{const D=g.useRef(null),_=g.useRef(null),A=g.useRef(null),h=g.useRef([]),X=g.useRef({columns:0,rows:0}),Y=g.useRef(null),q=g.useRef(Date.now()),S=g.useRef(Date.now()),j=g.useRef(!1),{isMobile:w,isTablet:t,prefersReducedMotion:E}=pe(),J=rt(),$=w?12:t?14:16,te=w?8:t?9:10,re=w?16:t?18:20,fe=E||J?d*3:w?d*1.2:d,k=w?.05:t?.06:.07,oe=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","!","@","#","$","&","*","(",")","-","_","+","=","/","[","]","{","}",";",":","<",">",",","0","1","2","3","4","5","6","7","8","9"],se=()=>oe[Math.floor(Math.random()*oe.length)],G=()=>o[Math.floor(Math.random()*o.length)],xe=l=>{const c=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;l=l.replace(c,(R,N,M)=>R+R+N+N+M+M);const m=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(l);return m?{r:parseInt(m[1],16),g:parseInt(m[2],16),b:parseInt(m[3],16)}:null},O=(l,c,m)=>{const R={r:Math.round(l.r+(c.r-l.r)*m),g:Math.round(l.g+(c.g-l.g)*m),b:Math.round(l.b+(c.b-l.b)*m)};return`rgb(${R.r}, ${R.g}, ${R.b})`},ge=(l,c)=>{const m=Math.ceil(l/te),R=Math.ceil(c/re);return{columns:m,rows:R}},ye=(l,c)=>{X.current={columns:l,rows:c};const m=l*c;h.current=Array.from({length:m},()=>({char:se(),color:G(),targetColor:G(),colorProgress:1}))},ce=()=>{const l=D.current,c=_.current;if(!l||!c||j.current)return;c.parentElement&&(c.style.width="100%",c.style.height="100%");const R=c.getBoundingClientRect(),N=R.width,M=R.height;if(N===0||M===0){setTimeout(()=>{j.current||ce()},50);return}const C=w?Math.min(window.devicePixelRatio||1,2):window.devicePixelRatio||1;l.width=N*C,l.height=M*C,l.style.width=`${N}px`,l.style.height=`${M}px`,Y.current&&Y.current.setTransform(C,0,0,C,0,0);const{columns:P,rows:F}=ge(N,M);ye(P,F),le()},le=()=>{if(!Y.current||h.current.length===0||j.current)return;const l=Y.current;if(!D.current)return;const m=_.current;if(!m)return;const R=m.getBoundingClientRect();l.fillStyle="#000000",l.fillRect(0,0,R.width,R.height),l.font=`${$}px monospace`,l.textBaseline="top",h.current.forEach((N,M)=>{const C=M%X.current.columns*te,P=Math.floor(M/X.current.columns)*re;C>=-te&&C<=R.width+te&&P>=-re&&P<=R.height+re&&(l.fillStyle=N.color,l.fillText(N.char,C,P))})},be=()=>{if(!h.current||h.current.length===0||j.current)return;const l=Math.max(1,Math.floor(h.current.length*k));for(let c=0;c<l;c++){const m=Math.floor(Math.random()*h.current.length);h.current[m]&&(Math.random()>.4&&(h.current[m].char=se()),Math.random()>.5&&(h.current[m].targetColor=G()),!b||E||J?(h.current[m].color=h.current[m].targetColor,h.current[m].colorProgress=1):h.current[m].colorProgress=0)}},Te=()=>{if(E||J)return;let l=!1;const c=w?.15:.12;h.current.forEach(m=>{if(m.colorProgress<1){m.colorProgress+=c,m.colorProgress>1&&(m.colorProgress=1);const R=xe(m.color),N=xe(m.targetColor);R&&N&&(m.color=O(R,N,m.colorProgress),l=!0)}}),l&&le()},ue=()=>{if(j.current)return;const l=Date.now();if(T>0&&l-S.current>=T){A.current&&cancelAnimationFrame(A.current),v==null||v();return}l-q.current>=fe&&(be(),le(),q.current=l),b&&!E&&!J&&Te(),A.current=requestAnimationFrame(ue)};g.useEffect(()=>{const l=D.current;if(!l)return;j.current=!1,Y.current=l.getContext("2d",{alpha:!1,willReadFrequently:!1,desynchronized:!w}),S.current=Date.now(),setTimeout(()=>{j.current||(ce(),ue())},10);let c;const m=()=>{clearTimeout(c),c=setTimeout(()=>{j.current||(A.current&&cancelAnimationFrame(A.current),ce(),ue())},100)};let R=null;return"ResizeObserver"in window&&_.current&&(R=new ResizeObserver(N=>{for(const M of N)if(M.target===_.current){m();break}}),R.observe(_.current)),window.addEventListener("resize",m),()=>{j.current=!0,A.current&&cancelAnimationFrame(A.current),window.removeEventListener("resize",m),R&&R.disconnect(),clearTimeout(c)}},[fe,b,T,v,w,E,J]);const we={position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000000",overflow:"hidden",willChange:"transform",transform:"translateZ(0)",backfaceVisibility:"hidden"},Re={position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"block",backgroundColor:"#000000",willChange:"transform",transform:"translateZ(0)",imageRendering:"auto"},Se={position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",background:"radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",opacity:w?.7:1},L={position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",background:"radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",opacity:w?.6:.8};return n.jsxs("div",{ref:_,style:we,className:z,children:[n.jsx("canvas",{ref:D,style:Re}),u&&n.jsx("div",{style:Se}),x&&n.jsx("div",{style:L})]})},ot=({text:o,delay:d=0,className:x=""})=>{const[u,b]=g.useState(0);return g.useEffect(()=>{const v=setTimeout(()=>{const T=setInterval(()=>{b(z=>z<o.length?z+1:(clearInterval(T),z))},80);return()=>clearInterval(T)},d);return()=>clearTimeout(v)},[o,d]),n.jsx(p.h1,{className:`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${x}`,initial:{opacity:0},animate:{opacity:1},transition:{duration:.5,delay:d},children:o.split("").map((v,T)=>n.jsx(p.span,{className:"bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent inline-block",initial:{opacity:0,y:50,scale:.3,filter:"blur(5px)",rotateX:-90},animate:T<u?{opacity:1,y:0,scale:1,filter:"blur(0px)",rotateX:0}:{},transition:{duration:.8,ease:[.23,1,.32,1],type:"spring",stiffness:100,damping:15},style:{textShadow:T<u?"0 0 20px rgba(16,185,129,0.5)":"none"},children:v===" "?" ":v},T))})},st=({isActive:o=!0})=>n.jsx("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:Array.from({length:50}).map((x,u)=>n.jsx(p.div,{className:"absolute w-1 h-1 bg-emerald-400/30 rounded-full",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`},animate:o?{x:[0,Math.random()*200-100],y:[0,Math.random()*200-100],opacity:[0,1,0],scale:[0,1,0]}:{},transition:{duration:Math.random()*4+2,repeat:Number.POSITIVE_INFINITY,ease:"easeInOut",delay:Math.random()*2}},u))}),ct=({isVisible:o=!0})=>{const[d,x]=g.useState(!1);return g.useEffect(()=>{if(o){const u=setTimeout(()=>{x(!0)},300);return()=>clearTimeout(u)}else{x(!1);return}},[o]),n.jsxs("div",{className:"min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",children:[n.jsx(p.nav,{className:"fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-emerald-500/20",initial:{y:-100,opacity:0},animate:{y:o?0:-100,opacity:o?1:0},transition:{duration:.8,ease:[.23,1,.32,1]},children:n.jsxs("div",{className:"max-w-7xl mx-auto px-6 py-4 flex justify-between items-center",children:[n.jsx(p.div,{initial:{opacity:0,x:-50},animate:{opacity:o?1:0,x:o?0:-50},transition:{duration:.8,delay:.2},children:d&&n.jsx(ot,{text:"WISHANT BHAJAN",delay:0,className:"!text-2xl md:!text-3xl !mb-0"})}),n.jsx(p.div,{className:"flex space-x-8",initial:{opacity:0,x:50},animate:{opacity:o?1:0,x:o?0:50},transition:{duration:.8,delay:.4},children:["Portfolio","About","Skills","Contact"].map((u,b)=>n.jsxs(p.a,{href:`#${u.toLowerCase()}`,className:"text-emerald-200/80 hover:text-emerald-200 font-medium tracking-wide transition-colors duration-300 relative group",initial:{opacity:0,y:-20},animate:{opacity:o?1:0,y:o?0:-20},transition:{duration:.5,delay:.6+b*.1},children:[u,n.jsx(p.div,{className:"absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"})]},u))})]})}),n.jsx(p.div,{className:"pt-20 px-6",initial:{opacity:0},animate:{opacity:o?1:0},transition:{duration:1,delay:.8},children:n.jsxs("div",{className:"max-w-7xl mx-auto",children:[n.jsxs(p.div,{className:"text-center py-20",initial:{opacity:0,y:50},animate:{opacity:o?1:0,y:o?0:50},transition:{duration:1,delay:1},children:[n.jsx(p.h2,{className:"text-4xl md:text-5xl lg:text-7xl font-bold text-emerald-100 mb-6 md:mb-8",initial:{y:100,opacity:0,scale:.9},animate:{y:o?0:100,opacity:o?1:0,scale:o?1:.9},transition:{delay:o?1.2:0,duration:1.2,ease:[.23,1,.32,1]},children:"Welkom in mijn"}),n.jsx(p.h1,{className:"text-6xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-8",animate:o?{textShadow:["0 0 20px rgba(16,185,129,0.5)","0 0 40px rgba(16,185,129,0.8)","0 0 20px rgba(16,185,129,0.5)"]}:{},transition:{duration:3,repeat:o?Number.POSITIVE_INFINITY:0,ease:"easeInOut"},children:"Digitale Wereld"}),n.jsx(p.p,{className:"text-lg md:text-xl text-emerald-200/80 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed",initial:{y:80,opacity:0,scale:.95},animate:{y:o?0:80,opacity:o?1:0,scale:o?1:.95},transition:{delay:o?1.6:0,duration:1,ease:[.23,1,.32,1]},children:"Hier deel ik mijn passie voor technologie, innovatie en het creëren van digitale ervaringen die het verschil maken."})]}),n.jsx(p.div,{className:"grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-16",initial:{y:120,opacity:0,scale:.9},animate:{y:o?0:120,opacity:o?1:0,scale:o?1:.9},transition:{delay:o?2:0,duration:1.2,ease:[.23,1,.32,1]},children:[{title:"Frontend Development",desc:"React, TypeScript, Next.js"},{title:"Backend Development",desc:"Node.js, Python, Databases"},{title:"UI/UX Design",desc:"Figma, Prototyping, User Research"}].map((u,b)=>n.jsxs(p.div,{className:"bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-emerald-500/20",initial:{y:80,opacity:0,scale:.9},animate:{y:o?0:80,opacity:o?1:0,scale:o?1:.9},transition:{delay:o?2.4+b*.2:0,duration:1,ease:[.23,1,.32,1]},whileHover:{scale:1.08,y:-12,backgroundColor:"rgba(255,255,255,0.15)",transition:{duration:.6,ease:[.23,1,.32,1]}},children:[n.jsx("h3",{className:"text-lg md:text-xl font-semibold text-emerald-300 mb-2 md:mb-3",children:u.title}),n.jsx("p",{className:"text-sm md:text-base text-emerald-100/70",children:u.desc})]},u.title))}),n.jsx(p.div,{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16",initial:{opacity:0,y:100},animate:{opacity:o?1:0,y:o?0:100},transition:{duration:1,delay:o?3:0},children:["Projects","Experience","About Me"].map((u,b)=>n.jsxs(p.div,{className:"bg-black/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-500/60 transition-all duration-300",initial:{opacity:0,y:50},animate:{opacity:o?1:0,y:o?0:50},transition:{duration:.8,delay:o?3.2+b*.2:0},whileHover:{scale:1.05,y:-10},children:[n.jsx("h3",{className:"text-2xl font-bold text-emerald-200 mb-4",children:u}),n.jsxs("p",{className:"text-emerald-200/60",children:["Ontdek mijn ",u.toLowerCase()," en prestaties in webontwikkeling."]})]},u))}),n.jsxs(p.div,{className:"py-20",initial:{opacity:0,y:100},animate:{opacity:o?1:0,y:o?0:100},transition:{duration:1,delay:o?4:0},children:[n.jsxs("div",{className:"text-center mb-16",children:[n.jsx("h2",{className:"text-4xl md:text-6xl font-bold text-emerald-200 mb-4",children:"Featured Projects"}),n.jsx("p",{className:"text-lg text-emerald-200/70 max-w-2xl mx-auto",children:"Een selectie van mijn meest recente en innovatieve projecten"})]}),n.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[{title:"E-commerce Platform",description:"Full-stack webshop met React, Node.js en Stripe integratie",tech:["React","Node.js","MongoDB","Stripe"]},{title:"Portfolio Dashboard",description:"Interactive dashboard voor portfolio management",tech:["Next.js","TypeScript","Prisma","PostgreSQL"]}].map((u,b)=>n.jsxs(p.div,{className:"bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300",initial:{opacity:0,x:b===0?-50:50},animate:{opacity:o?1:0,x:o?0:b===0?-50:50},transition:{duration:.8,delay:o?4.2+b*.2:0},whileHover:{scale:1.02,y:-5},children:[n.jsx("h3",{className:"text-2xl font-bold text-emerald-200 mb-4",children:u.title}),n.jsx("p",{className:"text-emerald-200/70 mb-6 leading-relaxed",children:u.description}),n.jsx("div",{className:"flex flex-wrap gap-2",children:u.tech.map(v=>n.jsx("span",{className:"px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium",children:v},v))})]},u.title))})]}),n.jsxs(p.div,{className:"py-20 text-center",initial:{opacity:0,y:100},animate:{opacity:o?1:0,y:o?0:100},transition:{duration:1,delay:o?5:0},children:[n.jsx("h2",{className:"text-4xl md:text-6xl font-bold text-emerald-200 mb-8",children:"Laten we samenwerken"}),n.jsx("p",{className:"text-lg text-emerald-200/70 mb-12 max-w-2xl mx-auto",children:"Heb je een interessant project of wil je gewoon een gesprek? Ik hoor graag van je!"}),n.jsx(p.button,{className:"px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-2xl",whileHover:{scale:1.05,y:-2},whileTap:{scale:.95},children:"Contact Opnemen"})]})]})}),n.jsx(st,{isActive:o})]})},V={particleCounts:{xs:15,sm:20,md:25,lg:30,xl:35,"2xl":40,"3xl":45,"4xl":50},animationSpeeds:{xs:120,sm:100,md:90,lg:80,xl:70,"2xl":60,"3xl":50,"4xl":40},buttonSizes:{normal:{xs:{width:"280px",height:"50px"},sm:{width:"320px",height:"55px"},md:{width:"360px",height:"60px"},lg:{width:"400px",height:"60px"},xl:{width:"420px",height:"65px"},"2xl":{width:"450px",height:"70px"},"3xl":{width:"480px",height:"75px"},"4xl":{width:"520px",height:"80px"}},expanded:{xs:{width:"300px",height:"120px"},sm:{width:"380px",height:"140px"},md:{width:"450px",height:"160px"},lg:{width:"550px",height:"220px"},xl:{width:"600px",height:"240px"},"2xl":{width:"650px",height:"260px"},"3xl":{width:"700px",height:"280px"},"4xl":{width:"750px",height:"300px"}}},textSizes:{title:{xs:"text-3xl",sm:"text-4xl",md:"text-5xl",lg:"text-6xl",xl:"text-7xl","2xl":"text-8xl","3xl":"text-9xl","4xl":"text-[8rem]"},subtitle:{xs:"text-sm",sm:"text-base",md:"text-lg",lg:"text-xl",xl:"text-2xl","2xl":"text-3xl","3xl":"text-4xl","4xl":"text-5xl"},button:{xs:"text-sm",sm:"text-base",md:"text-lg",lg:"text-xl",xl:"text-xl","2xl":"text-2xl","3xl":"text-3xl","4xl":"text-4xl"}},spacing:{xs:{container:16,elements:24},sm:{container:20,elements:32},md:{container:24,elements:40},lg:{container:32,elements:48},xl:{container:40,elements:56},"2xl":{container:48,elements:64},"3xl":{container:56,elements:72},"4xl":{container:64,elements:80}}},lt=({text:o,delay:d=0,className:x=""})=>{var D;const[u,b]=g.useState(0),v=(D=pe())==null?void 0:D.prefersReducedMotion,T=ee(V.animationSpeeds),z=ee(V.textSizes.title);return g.useEffect(()=>{const _=v?T*2:T,A=setInterval(()=>{b(h=>h<o.length?h+1:(clearInterval(A),h))},_);return()=>clearInterval(A)},[o,T,v]),n.jsx(p.h1,{className:`${z} font-bold tracking-tight ${x}`,initial:{opacity:0},animate:{opacity:1},transition:{duration:v?.3:.5,delay:v?0:d},children:o.split("").map((_,A)=>n.jsx(p.span,{className:"bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent inline-block",initial:{opacity:0,y:v?0:50,scale:v?1:.3,filter:"blur(5px)",rotateX:v?0:-90},animate:A<u?{opacity:1,y:0,scale:1,filter:"blur(0px)",rotateX:0}:{},transition:{duration:v?.3:.8,ease:v?"easeOut":[.23,1,.32,1],type:v?"tween":"spring",stiffness:100,damping:15},style:{textShadow:A<u?"0 0 20px rgba(16,185,129,0.5)":"none"},children:_===" "?" ":_},A))})},ut=({onComplete:o})=>{const[d,x]=g.useState(""),u="ACCESS GRANTED",b=ee(V.textSizes.button);return g.useEffect(()=>{let v=0;const z=setInterval(()=>{v<=u.length?(x(u.slice(0,v)),v++):(clearInterval(z),setTimeout(()=>{o==null||o()},1e3))},60);return()=>clearInterval(z)},[o]),n.jsx("div",{className:"flex items-center justify-center w-full h-full bg-black/70 backdrop-blur-sm rounded-3xl border border-blue-500/30",children:n.jsx("div",{className:`font-mono ${b} font-bold text-center`,children:n.jsxs("span",{className:"text-blue-400",style:{textShadow:"0 0 10px #3b82f6, 0 0 20px #3b82f6"},children:[d,n.jsx("span",{className:"inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse"})]})})})},dt=({text:o,delay:d=0,speed:x=50,className:u="",style:b={}})=>{const[v,T]=g.useState(""),[z,D]=g.useState(!0),{prefersReducedMotion:_}=pe();return g.useEffect(()=>{const A=_?x/2:x,h=setTimeout(()=>{let X=0;const Y=setInterval(()=>{X<=o.length?(T(o.slice(0,X)),X++):(clearInterval(Y),D(!1))},A);return()=>clearInterval(Y)},d);return()=>clearTimeout(h)},[o,d,x,_]),n.jsxs("span",{className:u,style:b,children:[v,z&&n.jsx("span",{className:"animate-pulse",children:"|"})]})},mt=()=>{const o=g.useRef(null);return g.useEffect(()=>{const d=o.current;if(!d)return;const x=d.getContext("2d");if(!x)return;const u=()=>{d.width=window.innerWidth,d.height=window.innerHeight};u(),window.addEventListener("resize",u);const v="ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split(""),T=14,z=d.width/T,D=[];for(let h=0;h<z;h++)D[h]=1;const A=setInterval(()=>{x.fillStyle="rgba(0, 0, 0, 0.04)",x.fillRect(0,0,d.width,d.height),x.fillStyle="#0F4",x.font=T+"px monospace";for(let h=0;h<D.length;h++){const X=v[Math.floor(Math.random()*v.length)];x.fillStyle=`rgba(0, 255, 70, ${Math.random()*.5+.5})`,x.fillText(X,h*T,D[h]*T),D[h]*T>d.height&&Math.random()>.975&&(D[h]=0),D[h]++}},35);return()=>{clearInterval(A),window.removeEventListener("resize",u)}},[]),n.jsx("canvas",{ref:o,className:"absolute inset-0 opacity-20 pointer-events-none"})},ft=({isActive:o=!0})=>{const d=ee(V.particleCounts);return n.jsx("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:Array.from({length:d}).map((x,u)=>n.jsx(p.div,{className:"absolute w-1 h-1 bg-emerald-400/30 rounded-full",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`},animate:o?{x:[0,Math.random()*200-100],y:[0,Math.random()*200-100],opacity:[0,1,0],scale:[0,1,0]}:{},transition:{duration:Math.random()*4+2,repeat:Number.POSITIVE_INFINITY,ease:"easeInOut",delay:Math.random()*2}},u))})},bt=()=>{const[o,d]=g.useState(!1),[x,u]=g.useState("normal"),[b,v]=g.useState(!1),[T,z]=g.useState(!1),D=g.useRef([]),{isTablet:_}=pe(),A=ee(V.textSizes.subtitle),h=ee(V.textSizes.button),X=ee(V.spacing);g.useEffect(()=>{document.body.style.backgroundColor="#0f172a",document.body.style.overflow="hidden",document.body.style.height="100vh";const t=setTimeout(()=>{d(!0)},500);return D.current.push(t),()=>{D.current.forEach(E=>clearTimeout(E)),document.body.style.overflow="unset",document.body.style.height="auto"}},[]);const Y=g.useCallback(()=>{if(b)return;v(!0),u("expanded");const t=setTimeout(()=>u("glitch"),800);D.current.push(t)},[b]),q=g.useCallback(()=>{u("access")},[]),S=g.useCallback(()=>{const t=setTimeout(()=>{z(!0),document.body.style.overflow="unset",document.body.style.height="auto"},500);D.current.push(t)},[]),j=()=>{const t=_?"md":"lg",E=V.buttonSizes;switch(x){case"expanded":case"glitch":case"access":return E.expanded[t]||E.expanded.lg;default:return E.normal[t]||E.normal.lg}},w=()=>{switch(x){case"expanded":case"glitch":case"access":return 1;default:return 1}};return n.jsxs("div",{className:"relative min-h-screen bg-slate-900",children:[!T&&n.jsx(nt,{}),n.jsx("div",{className:"fixed inset-0 bg-slate-900 z-0"}),n.jsx(Ce,{mode:"wait",children:T?n.jsx(p.div,{className:"relative z-10",initial:{opacity:0,scale:1.05},animate:{opacity:1,scale:1},transition:{duration:.6,ease:[.23,1,.32,1]},children:n.jsx(ct,{isVisible:!0})},"page2"):n.jsxs(p.div,{className:"min-h-screen relative overflow-hidden z-10",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0,scale:.9,filter:"blur(5px)"},transition:{duration:1,ease:[.23,1,.32,1]},children:[n.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900"}),n.jsx(mt,{}),!_&&n.jsx(ft,{isActive:!0}),n.jsx("div",{className:"relative z-20 flex flex-col items-center justify-center min-h-screen",style:{padding:X.container},children:o&&n.jsxs(n.Fragment,{children:[n.jsx(p.div,{className:"text-center mb-8",initial:{opacity:0,y:50},animate:{opacity:1,y:0},transition:{duration:.8,delay:.2},children:n.jsx(lt,{text:"WISHANT BHAJAN",delay:0})}),n.jsx(p.div,{className:"text-center mb-12",initial:{opacity:0,y:40},animate:{opacity:1,y:0},transition:{duration:.8,delay:.6},children:n.jsx("div",{className:`${A} font-normal tracking-wide`,children:n.jsx(dt,{text:"Full Stack Developer",delay:1200,speed:100,className:"text-emerald-200/90 font-sans",style:{fontFamily:"'Inter', sans-serif",fontWeight:400,letterSpacing:"0.08em"}})})}),n.jsx(p.div,{className:"text-center",initial:{opacity:0,y:60},animate:{opacity:1,y:0},transition:{duration:.8,delay:1},children:n.jsxs(p.button,{onClick:Y,className:`relative overflow-hidden group bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-cyan-500/30 backdrop-blur-xl border-2 border-emerald-400/50 rounded-3xl font-bold transition-all duration-500 shadow-2xl ${h} px-8 py-4`,animate:{...j(),scale:w()},transition:{duration:.8,ease:[.23,1,.32,1]},whileHover:b?{}:{scale:1.1,y:-10,boxShadow:"0 25px 50px rgba(16,185,129,0.4)",borderColor:"rgba(16,185,129,0.8)"},whileTap:b?{}:{scale:.95},disabled:b,children:[n.jsxs(Ce,{mode:"wait",children:[x==="normal"&&n.jsx(p.div,{className:"relative z-10 flex items-center justify-center w-full h-full",exit:{opacity:0},children:n.jsx("span",{className:"bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent font-bold tracking-wide",children:"Hack Website"})},"normal"),x==="expanded"&&n.jsx(p.div,{className:"relative z-10 flex items-center justify-center w-full h-full",initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0},children:n.jsx("span",{className:"bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent font-bold tracking-wide",children:"Initiating Hack..."})},"expanded"),x==="glitch"&&n.jsx(p.div,{className:"absolute inset-0",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:n.jsx(at,{onComplete:q,duration:3e3,glitchColors:["#10b981","#06d6a0","#118ab2","#3b82f6","#8b5cf6","#f59e0b"],glitchSpeed:50,smooth:!1,className:"rounded-3xl"})},"glitch"),x==="access"&&n.jsx(p.div,{className:"absolute inset-0",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:n.jsx(ut,{onComplete:S})},"access")]}),x==="normal"&&n.jsxs(n.Fragment,{children:[n.jsx(p.div,{className:"absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-3xl",animate:{scale:[1,1.15,1],opacity:[.4,.7,.4],rotate:[0,1,-1,0]},transition:{duration:2.5,repeat:Number.POSITIVE_INFINITY,ease:"easeInOut"}}),n.jsx("div",{className:"absolute inset-0 overflow-hidden rounded-3xl opacity-20",children:Array.from({length:15}).map((t,E)=>n.jsx(p.div,{className:"absolute text-emerald-300 font-mono text-xs",style:{left:`${Math.random()*100}%`,top:"-10px"},animate:{y:[0,80],opacity:[0,1,0]},transition:{duration:Math.random()*2+1,repeat:Number.POSITIVE_INFINITY,delay:Math.random()*3,ease:"linear"},children:Math.random()>.5?"1":"0"},E))})]})]})})]})})]},"homepage")})]})};export{bt as default};
