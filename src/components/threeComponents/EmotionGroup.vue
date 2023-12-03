<script setup lang="ts">
import {Emotion} from "../../types/Emotion";
import {inject} from "vue";
import {Color, Group, Mesh, MeshBasicMaterial, RingGeometry} from "three";
import {Text} from "troika-three-text";
import {RendererInjectionKey} from "../../types/InjectionKeys";
const props = defineProps<{emotion: Emotion}>()
const emit = defineEmits([])
const scene = inject(RendererInjectionKey)?.scene
if(!scene){
  console.error("No scene found.")
} else {
  scene.add(generateEmotionCircle(props.emotion)
  )

}

function generateEmotionCircle(emotion: Emotion) {
  const emotionCircle = new Group()
  emotionCircle.position.setX(emotion.x as number)
  emotionCircle.position.setY(emotion.y as number)
  const emotionsName = new Text()

  emotionsName.text = emotion.name
  emotionsName.fontSize = 7
  // emotionsName.fontWeight ="bold"
  emotionsName.color = 0xffffff
  emotionsName.anchorX = 'center'
  emotionsName.anchorY = 'middle'
  emotionsName.sync(() => {
    const textWidth = emotionsName.geometry.boundingSphere?.radius
    console.log(emotion.name, textWidth)
    const circleWidth = textWidth < 18 ? 18 : textWidth
    emotionCircle.add(new Mesh(
        new RingGeometry(0, circleWidth + 5, 64, 1),
        new MeshBasicMaterial({
          color: new Color(emotion.color),
        })
    ))
    emotionCircle.add(emotionsName)
  })
  return emotionCircle
}

</script>
<template>
</template>
