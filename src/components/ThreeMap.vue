<script setup lang="ts">

import {
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  RingGeometry,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three'
import {computed, onMounted, ref, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Text} from 'troika-three-text'

const {width, height} = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)
const raycaster = new Raycaster()
const emotionObjects = []
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
scene.background = new Color(0xffffff)
camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 1000)
camera.position.z = 100
scene.add(camera)

// function generateGradientMaterial(colorFrom: ColorRepresentation, colorTo: ColorRepresentation) {
//   return new ShaderMaterial({
//     uniforms: {
//       color1: {
//         value: new Color(colorFrom)
//       },
//       color2: {
//         value: new Color(colorTo)
//       }
//     },
//     vertexShader: `
//     varying vec2 vUv;
//
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//     }
//   `,
//     fragmentShader: `
//     uniform vec3 color1;
//     uniform vec3 color2;
//     varying vec2 vUv;
//
//     void main() {
//       gl_FragColor = vec4(mix(color1, color2, vUv.y), .1);
//     }
//   `,
//     side: DoubleSide
//   })
// }
// const mat = generateGradientMaterial(0x0eeaa, 0x008080)
function generateEmotionCircle(emotion: string, color: Color) {
  const text = new Text()
  text.text = emotion
  text.fontSize = 3
  text.fontWeight ="bold"
  text.color = 0x000000
  text.anchorX = 'center'
  text.anchorY = 'middle'
  const ring = new Mesh(
      new RingGeometry(1, 1, 64, 1),
      new MeshBasicMaterial({
        color: color,
      })
  )

  console.log(ring)
  text.sync(() => {
    const textWidth = text.geometry.boundingSphere?.radius
    ring.geometry = new RingGeometry(0, textWidth + 1, 64, 1)
    ring.add(text)
  })
  return ring
}



for (let i = 0; i < 5; i++) {
  let genCircle = generateEmotionCircle(
      "Happiness", new Color(0x0eeaa))
  genCircle.position.setX(100 * Math.cos((2*Math.PI) / 5 * i + ((2 * Math.PI) / 4)))
  genCircle.position.setY(100 * Math.sin((2*Math.PI) / 5 * i + ((2 * Math.PI) / 4)))
  scene.add(genCircle)
  emotionObjects.push(genCircle)
}

function handleCanvasClick(event ){
const mouse = new Vector2()
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  emotionObjects.forEach((obj) => {
    const intersection = raycaster.intersectObject( obj );

    if ( intersection.length > 0 ) {
      console.log(intersection[0])
    }
  })

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
  controls.enableRotate = false
  controls.minDistance = 0
  controls.maxDistance = 500
  controls.enableZoom = true
  controls.zoomSpeed = 0.3
  controls.zoomToCursor = true
  controls.enableDamping = true
  controls.dampingFactor = .4
  updateCamera()
  updateRenderer()
  loop()
})

</script>
<template>
  <div id="instructions">
    <div>Scroll: zoom,</div>
    <div>right click + drag: move</div>
  </div>
  <div id="canvas-wrap">
    <canvas @click="handleCanvasClick" ref="output"/>
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
  color: #eee;
  font-size: 15px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .3);
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
