import {ColorRepresentation} from "three";

export class Emotion {
  name: string
  key: string | number
  x: number | undefined
  y: number | undefined
  description: string
  color: ColorRepresentation | undefined
  percentages: { emotion: Emotion; percentage: number }[] |undefined

  constructor(name: string, description: string, key: string | number, x?: number, y?: number, color?: ColorRepresentation, percentages?: { emotion: Emotion; percentage: number }[] ) {
    this.name = name;
    this.key = key;
    this.x = x;
    this.y = y;
    this.description = description;
    this.color = color;
    this.percentages = percentages;
  }
}
