<script setup lang="ts">
import {PerspectiveCamera, Vector3} from "three";
import {inject} from "vue";
import {RendererInjectionKey} from "../../types/InjectionKeys";
let camera: PerspectiveCamera
const props = defineProps({
  fov: Number,
  aspect: Number,
  near: Number,
  far: Number,
  position: {
    type: Vector3,
  }
})

// camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 1000)
// camera.position.z = 300
const renderer = inject(RendererInjectionKey)
if (!renderer) {
  console.error('Renderer not found')
} else {
  camera = new PerspectiveCamera(props.fov, props.aspect, props.near, props.far)
  renderer.camera = camera
  camera.position.z = 700
}
</script>
