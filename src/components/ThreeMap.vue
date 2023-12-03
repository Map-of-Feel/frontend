<script setup lang="ts">


import Renderer from './threeComponents/Renderer.vue'
import Camera from "./threeComponents/Camera.vue";
import SceneComponent from "./threeComponents/SceneComponent.vue";
import EmotionGroup from "./threeComponents/EmotionGroup.vue"
// import {Emotion} from "../types/Emotion";
import emotions from "../emotions.json"
import {Emotion} from "../types/Emotion";
// const testEmotion = new Emotion("Happiness",
//     "Lorem ipsum Happiness",
//     1,
//     0,
//     0,
//     0xfffff,
// )

console.log(emotions[0] as Emotion)

</script>

<template>
  <div id="instructions">
    <div>Scroll: zoom,</div>
    <div>right click + drag: move</div>
  </div>
  <Renderer>
    <Camera/>
    <SceneComponent>
      <EmotionGroup v-for="emotion in emotions" :emotion="emotion as Emotion"/>
    </SceneComponent>
  </Renderer>
</template>

<style scoped>

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
