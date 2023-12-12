<script setup lang="ts">
import {Emotion, EmotionPercentage} from "../../types/Emotion";
import {inject, watch} from "vue";
import {Color, Group, Mesh, MeshBasicMaterial, RingGeometry} from "three";
import {Text} from "troika-three-text";
import {RendererInjectionKey} from "../../types/InjectionKeys";
import {LineMaterial, LineMaterialParameters} from "three/examples/jsm/lines/LineMaterial";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";

const props = defineProps<{ emotion: Emotion }>()
const emit = defineEmits([])
const scene = inject(RendererInjectionKey)?.scene
let emotionCircle = new Group()
if (!scene) {
  console.error("No scene found.")
} else {
  generateEmotionCircle(props.emotion)
  scene.add(emotionCircle)
}

watch(props.emotion, () => {
  scene?.remove(emotionCircle)
  emotionCircle = new Group()
  generateEmotionCircle(props.emotion)
  scene?.add(emotionCircle)
})


function generateEmotionCircle(emotion: Emotion) {
  addLinesToGroup(emotion)
  emotionCircle.position.setX(emotion.x as number)
  emotionCircle.position.setY(emotion.y as number)
  emotionCircle.userData.emotion = props.emotion
  const emotionsName = generateTextObject(emotion)
  emotionsName.sync(() => {
    const textWidth = emotionsName.geometry.boundingSphere?.radius
    const circleWidth = textWidth + 5
    if (emotion.color !== undefined) {
      addRingToGroup(0, circleWidth, {emotion: emotion, percentage: 1})
    } else if (emotion.percentages !== undefined) {
      const perc = emotion.percentages
          .filter(baseEmotion => baseEmotion.percentage > 0)
          .sort((a, b) => b.percentage - a.percentage)
      for (let i = 0, amount = 0; i < perc.length; i++) {
        addRingToGroup(amount, circleWidth, perc[i]);
        amount += perc[i].percentage
      }
    }
    emotionCircle.add(emotionsName)
  })
}

function addLinesToGroup(emotion: Emotion) {
  if (emotion.percentages !== undefined) {
    emotion.percentages
        .filter((percentage: EmotionPercentage) => percentage.percentage > 0)
        .forEach((percentageEmotion) => {
          const geometry = new LineGeometry()
          geometry.setPositions([
            percentageEmotion.emotion.x - emotion.x || 0,
            percentageEmotion.emotion.y - emotion.y || 0,
            -0.1,
            0,
            0,
            -0.1
          ])
          // geometry.setFromPoints([
          //   new Vector3(
          //       percentageEmotion.emotion.x,
          //       percentageEmotion.emotion.y,
          //       -0.1
          //   ).sub(new Vector3(emotion.x, emotion.y)),
          //   new Vector3(
          //       0,
          //       0,
          //       -0.1
          //   )
          // ])
          const material = new LineMaterial({
            color: percentageEmotion.emotion.color,
            linewidth: 0.0012,

          } as LineMaterialParameters)
          const line = new Line2(geometry, material)
          line.computeLineDistances()
          line.scale.set(1,1,1)
          emotionCircle.add(line)
        })
  }
}

function generateTextObject(emotion: Emotion): Text {
  const emotionsName = new Text()
  emotionsName.text = emotion.name
  emotionsName.fontSize = emotion.color !== undefined ? 8 : 5
  emotionsName.outlineWidth = emotionsName.fontSize / 20
  // emotionsName.fontWeight ="bold"
  emotionsName.outlineColor = 0xffffff
  emotionsName.color = 0x0
  emotionsName.anchorX = 'center'
  emotionsName.anchorY = 'middle'
  return emotionsName
}

function addRingToGroup(
    amount: number,
    circleWidth: number,
    percentage: {
      emotion: Emotion,
      percentage: number
    }) {
  emotionCircle.add(new Mesh(
      new RingGeometry(
          amount * circleWidth,
          (percentage.percentage + amount) * circleWidth,
          64, 1),
      new MeshBasicMaterial({
        color: new Color(percentage.emotion.color),
      })
  ))
}

</script>
<template>
</template>
