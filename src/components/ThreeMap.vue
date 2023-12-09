<script setup lang="ts">


import Renderer from './threeComponents/Renderer.vue'
import Camera from "./threeComponents/Camera.vue"
import SceneComponent from "./threeComponents/SceneComponent.vue"
import EmotionGroup from "./threeComponents/EmotionGroup.vue"
import baseEmotions from "../emotions.json"
import {Emotion} from "../types/Emotion"
import {Ref, ref} from "vue"
import {Vector3} from "three";

let clickedEmotion = ref<Emotion>()
const allEmotions: Ref<Emotion[]> = ref(baseEmotions)
const examplePercentage = [.1, 0, 0, .25, 0, .65]
const exampleCompositeEmotion = {
  name: 'example',
  key: 123,
  x:0,
  y:0,
  description: 'Just a test object to show the composition of emotions',
  percentages: baseEmotions.map((emotion, i) => {
    return {
      emotion: emotion,
      percentage: examplePercentage[i]
    }
  })
}
calculateEmotionsPosition(exampleCompositeEmotion)
allEmotions.value.push(exampleCompositeEmotion)

function calculateEmotionsPosition(emotion: Emotion) {
  const position = new Vector3()
  emotion.percentages?.forEach((percentage) =>{
    if(percentage.percentage > 0){
      const scaledPosition = new Vector3(percentage.emotion.x, percentage.emotion.y, 0).multiplyScalar(percentage.percentage)
      position.add(scaledPosition)
    }
  })
  emotion.x = position.x
  emotion.y = position.y
}

function handleClickedEmotion(key: number) {
 const index = allEmotions.value.findIndex(emotion => emotion.key == key)
  clickedEmotion.value = allEmotions.value[index] as Emotion
}

function handleDetailClose() {
  clickedEmotion.value = undefined
}
</script>

<template>
  <div id="instructions">
    <div>Scroll: zoom,</div>
    <div>right click + drag: move</div>
  </div>
  <div v-if="clickedEmotion !== undefined" id="emotion-details">
    <div class="detail-functions">
      <div class="close" @click="handleDetailClose">X</div>

    </div>
    <h2 :style="'color: #'+ clickedEmotion.color?.toString(16)">{{clickedEmotion.name}}</h2>
    <hr :style="'color: #'+ clickedEmotion.color?.toString(16)"/>
    <section style="color: #1a1a1a">
      {{clickedEmotion.description}}
    </section>
    <hr :style="'color: #'+ clickedEmotion.color?.toString(16)"/>
    <section class="log-entries">
      <div v-for="i in 5" :key="i" class="log-entry">
        <div class="log-title-wrap">
          <h3 class="title">Log entry</h3>
          <div class="timestamp">04.12.2023</div>
        </div>
        <div class="log-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium commodi consectetur, debitis deleniti dignissimos, distinctio eaque, eligendi eum harum inventore maxime officia placeat rem repellendus saepe temporibus ut vero voluptas!</div>
      </div>
    </section>
  </div>
  <Renderer @clicked="handleClickedEmotion">
    <Camera :far="10000"/>
    <SceneComponent>
      <EmotionGroup v-for="emotion in allEmotions" :emotion="emotion"/>
<!--      <EmotionGroup  :emotion="exampleCompositeEmotion as Emotion"/>-->
    </SceneComponent>
  </Renderer>
</template>

<style scoped>
h2 {
  line-height: 1;
}
hr{
  width: 100%;
}
#instructions {
  box-sizing: content-box;
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
  background: rgba(200, 200, 200, .8);
  border-radius: 5px;
}

#emotion-details {
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 5px;
  border-radius: 5px 0 0 5px;
  padding: 5px;
  background: #d3d3d3;
  max-width: 100%;
  max-height: calc(100vh - 10px);
  overflow-y: scroll;
}

.detail-functions{
  display: flex;
  flex-direction: row-reverse;
}
.close{
  width: 25px;
  cursor: pointer;
}
.log-entry{
  color: #1a1a1a;
  background: #fff;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 0;
}

.log-title-wrap {
  display: flex;
  justify-content: space-between;
}

@media (min-width: 450px) {
  #emotion-details {
    width: 450px;
    padding: 0 1.5rem;

  }
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
