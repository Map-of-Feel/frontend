
<script setup lang="ts">
import {inject, provide} from "vue";
import {RendererInjectionKey} from "../../types/InjectionKeys";
import {Color, Scene} from "three";
const scene = new Scene()
defineProps({background: Color})
scene.background = new Color(0xffffff)
const renderer = inject(RendererInjectionKey)
if (renderer){
  renderer.scene = scene
} else {
  console.log("No renderer")
}
provide<Scene>("Scene", scene)

</script>
<template>
  <slot></slot>
</template>


