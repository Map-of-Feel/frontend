import {ColorRepresentation} from "three";

export interface Emotion {
  name: string
  key: string | number
  description: string
  x: number
  y: number
  color?: ColorRepresentation
  percentages?: EmotionPercentage[]
}

export interface EmotionPercentage {
  emotion: Emotion
  percentage: number
}
