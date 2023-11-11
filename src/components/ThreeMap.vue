<script setup lang="ts">
import {
  CircleGeometry,
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'
import {computed, onMounted, ref, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createText} from "three/examples/jsm/webxr/Text2D";

const {width, height} = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)
let renderer: WebGLRenderer
let camera: PerspectiveCamera
let controls: OrbitControls

watch(aspectRatio, updateCamera)
watch(aspectRatio, updateRenderer)
function updateCamera() {
  renderer.setSize(width.value, height.value, true)
  renderer.setPixelRatio(devicePixelRatio)
}

function updateRenderer() {
  controls.update()
  camera.aspect = aspectRatio.value
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}

const scene = new Scene()
camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 1000)
camera.position.z = 15
scene.add(camera)

function generateGradientMaterial(colorFrom: ColorRepresentation, colorTo: ColorRepresentation) {
  return new ShaderMaterial({
    uniforms: {
      color1: {
        value: new Color(colorFrom)
      },
      color2: {
        value: new Color(colorTo)
      }
    },
    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(mix(color1, color2, vUv.y), .1);
    }
  `,
    side: DoubleSide
  })
}
const mat = generateGradientMaterial(0x0eeaa, 0x008080)
function generateEmotionCircle(emotion: string) {
  const text = createText(emotion, 3)
  text.geometry.computeBoundingSphere()
  let textWidth = text.geometry.boundingSphere?.radius
  return new Mesh(
     new CircleGeometry(textWidth ? textWidth + .5 : 1, 36),
     mat
     // new MeshBasicMaterial({
     //   color: 0x0eeaa,
     //   side: DoubleSide
     // })
 ).attach(text)
}

for (let i = 0; i < 10; i++) {
  let genCircle = generateEmotionCircle("Happiness");
  genCircle.position.setZ(i * 100)
  scene.add(genCircle)
}

const output = ref<HTMLCanvasElement | null>(null)
const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}
onMounted(() => {
  renderer = new WebGLRenderer({
    canvas: output.value as unknown as HTMLCanvasElement,
    antialias: true
  })
  controls = new OrbitControls(camera, renderer.domElement)
  // controls.minPolarAngle = 0;
  // controls.maxPolarAngle = Math.PI;


// How far you can dolly in and out ( PerspectiveCamera only )
  controls.minDistance = 0;
  controls.maxDistance = 5000;

  controls.enableZoom = true;
  controls.zoomSpeed = 1.0;
  controls.zoomToCursor = true
  controls.enableDamping = true;
  controls.dampingFactor = .1;
  updateCamera()
  updateRenderer()
  loop()
})

</script>
<template>
  <div id="instructions">
    <div>Scroll: zoom</div>
    <div>left drag: rotate</div>
    <div>right drag: move</div>
  </div>
  <div id="canvas-wrap">
    <canvas ref="output"/>
  </div>
</template>

<style scoped>
#canvas-wrap {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
#instructions {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  margin: 5px;
  padding: 10px 30px;
  color: white;
  font-size: 15px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255,255,255,.3);
  border-radius: 5px;
}
@media (min-width: 750px) {
  #instructions {
    font-size: 28px;
  }
}
@media (min-width: 1050px) {
  #instructions {
    font-size: 2rem;
  }
}
</style>
