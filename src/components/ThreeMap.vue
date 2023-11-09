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
import {rand, useWindowSize} from "@vueuse/core";
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
    // wireframe: true,
    side: DoubleSide
  })
}

function generateEmotionCircle(emotion: String) {
  const text = createText(emotion, 3)
  text.geometry.computeBoundingSphere()
  let textWidth = text.geometry.boundingSphere?.radius
  const circle = new Mesh(
      new CircleGeometry(textWidth + .5, 64),
      generateGradientMaterial(0x0eeaa, 0x008080)
      // new MeshBasicMaterial({
      //   color: 0x0eeaa,
      //   side: DoubleSide
      // })
  ).attach(text)
  circle.position.setX(rand(-500, 500))
  circle.position.setY(rand(-500, 500))
  circle.position.setZ(rand(-500, 500))
  scene.add(circle)
}

for (let i = 0; i < 1000; i++) {
  generateEmotionCircle("Happiness");
}

const output = ref<HTMLCanvasElement | null>(null)
const loop = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}
onMounted(() => {
  renderer = new WebGLRenderer({
    canvas: output.value as unknown as HTMLCanvasElement,
    antialias: true
  })
  controls = new OrbitControls(camera, renderer.domElement)
  updateCamera()
  updateRenderer()
  loop()
})

</script>
<template>
  <div id="instructions">
    <div>Scroll: zoom</div>
    <div>left click + move: rotate</div>
    <div>right click + move: move</div>
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
  column-gap: 30px;
  padding: 10px 30px;
  color: white;
  font-size: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255,255,255,.3);
}
</style>
