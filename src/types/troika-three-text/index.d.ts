declare module "troika-three-text" {
  export { fontResolverWorkerModule } from "./FontResolver";
  export { Text } from "./Text";
  export { GlyphsGeometry } from "./GlyphsGeometry";
  export { createTextDerivedMaterial } from "./TextDerivedMaterial";
  export { configureTextBuilder, getTextRenderInfo, typesetterWorkerModule, preloadFont, dumpSDFTextures } from "./TextBuilder";
  export { getCaretAtPoint, getSelectionRects } from "./selectionUtils";
}
