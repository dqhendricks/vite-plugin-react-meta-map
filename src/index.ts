import { Plugin } from "vite";
import { OutputBundle } from "rollup";

import {
  EntryChunkData,
  returnEntryChunkData,
  generateHtmlPages,
} from "./metaMapPluginLogic";

interface MetaMapPluginOptions {
  pageTemplateFilePath: string;
  pageMetaMapFilePath: string;
}

function metaMapPlugin(options: MetaMapPluginOptions): Plugin {
  let outDir: string;
  let base: string;
  let generatedEntryChunks: EntryChunkData[];

  return {
    name: "vite-plugin-react-meta-map",

    configResolved(resolvedConfig) {
      // get the output directory from Vite config
      outDir = resolvedConfig.build.outDir;
      base = resolvedConfig.base;
    },

    generateBundle(_, bundle: OutputBundle) {
      // track entry point assets generated by vite
      generatedEntryChunks = returnEntryChunkData(bundle);
    },

    async closeBundle() {
      const { pageTemplateFilePath, pageMetaMapFilePath } = options;
      await generateHtmlPages(
        outDir,
        base,
        pageTemplateFilePath,
        pageMetaMapFilePath,
        generatedEntryChunks
      );
    },
  };
}

export default metaMapPlugin;
