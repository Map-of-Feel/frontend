<script setup lang="ts">

import {
  Color, Group,
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
const output = ref<HTMLCanvasElement | null>(null)

const rayCaster = new Raycaster()
const emotionObjects: Group[] = []
let renderer: WebGLRenderer
let camera: PerspectiveCamera
let controls: OrbitControls

watch(aspectRatio, updateCamera)
watch(aspectRatio, updateRenderer)

function updateRenderer() {
  renderer.setSize(width.value, height.value, true)
  renderer.setPixelRatio(devicePixelRatio)
}

function updateCamera() {
  controls.update()
  camera.aspect = aspectRatio.value
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}

const scene = new Scene()
scene.background = new Color(0xffffff)
camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 1000)
camera.position.z = 300
scene.add(camera)


function generateEmotionCircle(emotion: string, color: Color) {
  const text = new Text()
  text.text = emotion
  text.fontSize = 3
  text.fontWeight ="bold"
  text.color = 0x000000
  text.anchorX = 'center'
  text.anchorY = 'middle'
  const emotionCircle = new Group()

  text.sync(() => {
    const textWidth = text.geometry.boundingSphere?.radius
    emotionCircle.add(new Mesh(
        new RingGeometry(0, textWidth + 1, 64, 1),
        new MeshBasicMaterial({
          color: color,
        })
    ))
    emotionCircle.add(text)
  })
  return emotionCircle
}

for (let i = 0; i < 5; i++) {
  let genCircle = generateEmotionCircle(
      "Happiness", new Color(0x0eeaa))
  genCircle.position.setX(100 * Math.cos((2*Math.PI) / 5 * i + ((2 * Math.PI) / 4)))
  genCircle.position.setY(100 * Math.sin((2*Math.PI) / 5 * i + ((2 * Math.PI) / 4)))
  scene.add(genCircle)
  emotionObjects.push(genCircle)
}

function handleCanvasClick(event: MouseEvent ){
const mouse = new Vector2()
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  rayCaster.setFromCamera( mouse, camera )
  emotionObjects.forEach((obj) => {
    const intersection = rayCaster.intersectObject(obj)
    if ( intersection.length > 0 ) {
      console.log(intersection[0].object)
    }
  })
}

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
