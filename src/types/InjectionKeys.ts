import {InjectionKey} from "vue";
import {OrthographicCamera, PerspectiveCamera, Scene} from "three";

export interface RendererInjectionInterface {
  camera: PerspectiveCamera | OrthographicCamera | null
  scene: Scene | null
}
export const RendererInjectionKey = Symbol("Renderer") as InjectionKey<RendererInjectionInterface>
