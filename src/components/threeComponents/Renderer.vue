<script setup lang="ts">
import {PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer} from "three";
import {useWindowSize} from "@vueuse/core";
import {computed, ref, onMounted, provide, watch} from "vue";
import {RendererInjectionKey} from "../../types/InjectionKeys";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


// const props = defineProps({})
const emit = defineEmits<{
  (event: 'clicked', key: number): void
}>()

let renderer: WebGLRenderer
const rayCaster = new Raycaster()
const {width, height} = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)
const output = ref<HTMLCanvasElement | null>(null)
let controls: OrbitControls
const publicIF = {camera: new PerspectiveCamera(), scene: new Scene()}

watch(aspectRatio, updateRenderer)
watch(aspectRatio, updateCamera)

function updateRenderer() {
  renderer.setSize(width.value, height.value, true)
  renderer.setPixelRatio(devicePixelRatio)
}

function updateCamera() {
  controls.update()
  publicIF.camera.aspect = aspectRatio.value
  publicIF.camera.updateProjectionMatrix()
  renderer.render(publicIF.scene, publicIF.camera)
}
function handleCanvasClick(event: MouseEvent ) {
  const mouse = new Vector2()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  rayCaster.setFromCamera(mouse, publicIF.camera)
  publicIF.scene.children.forEach((obj) => {
    const intersection = rayCaster.intersectObject(obj)
    if (intersection.length > 0) {
      console.log(intersection[0].object.parent?.userData.emotion.key)
      emit('clicked', intersection[0].object.parent?.userData?.emotion.key)
    }
  })
}

const loop = () => {
  controls.update()
  renderer.render(publicIF.scene, publicIF.camera)
  requestAnimationFrame(loop)
}

  onMounted(() => {
    renderer = new WebGLRenderer({
      canvas: output.value as unknown as HTMLCanvasElement,
      antialias: true
    })
    controls = new OrbitControls(publicIF.camera, renderer.domElement)
    controls.enableRotate = false
    controls.minDistance = 0
    controls.maxDistance = Infinity
    controls.enableZoom = true
    controls.zoomSpeed = 0.3
    controls.zoomToCursor = true
    controls.enableDamping = true
    controls.dampingFactor = .4
    updateCamera()
    updateRenderer()
    loop()
  })

provide(RendererInjectionKey, publicIF)

</script>
<template>
  <div id="canvas-wrap">
    <canvas @click="handleCanvasClick" ref="output"/>
  </div>
  <slot></slot>
</template>
<style scoped>
#canvas-wrap {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
</style>
