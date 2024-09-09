import path from "path";
import { pathToFileURL } from "url";
import { build } from "esbuild";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { OutputBundle } from "rollup";
import * as fileUtils from "./fileUtils.js";

export interface EntryChunkData {
  fileName: string;
  imports: string[];
  modules: string[];
  css: string[];
}

export function returnEntryChunkData(bundle: OutputBundle) {
  const entryChunkData: EntryChunkData[] = [];
  for (const [, chunk] of Object.entries(bundle)) {
    if (chunk.type === "chunk") {
      if (chunk.isEntry)
        entryChunkData.push({
          fileName: chunk.fileName,
          imports: chunk.imports,
          modules: Object.keys(chunk.modules),
          css: Array.from(chunk.viteMetadata?.importedCss || []),
        });
    }
  }
  return entryChunkData;
}

export async function generateHtmlPages(
  outDir: string,
  base: string,
  pageTemplateFilePath: string,
  pageMetaMapFilePath: string,
  generatedEntryChunks: EntryChunkData[]
) {
  // ensure output directory exists
  const resolvedOutDir = path.resolve(outDir);
  fileUtils.ensureDirExists(resolvedOutDir);

  // generate temp output directory path for bundled files
  const tempBundleOutputDir = path.join(
    resolvedOutDir,
    `temp-bundle-${Date.now()}`
  );

  // bundle user files
  await build({
    entryPoints: [pageTemplateFilePath, pageMetaMapFilePath],
    outdir: tempBundleOutputDir,
    bundle: true,
    platform: "node",
    format: "esm",
    external: ["react", "react-dom"],
    entryNames: "[name]",
  });

  // construct the bundled output file URL
  const getFileUrl = (filePath: string) => {
    const { name } = path.parse(filePath);
    const fullPath = path.join(tempBundleOutputDir, name + ".js");
    return pathToFileURL(fullPath).href;
  };

  // get URLs for both PageTemplate and pages files
  const pageTemplateUrl = getFileUrl(pageTemplateFilePath);
  const pageMetaMapUrl = getFileUrl(pageMetaMapFilePath);

  // import the PageTemplate and pages from their respective files
  const { default: PageTemplate } = await import(pageTemplateUrl);
  const { pages } = await import(pageMetaMapUrl);

  // cycle through page meta data and inject into PageTemplate component via props
  pages.forEach((page: React.ComponentProps<typeof PageTemplate>) => {
    let html = ReactDOMServer.renderToString(
      React.createElement(PageTemplate, page)
    );

    // check if the generated HTML contains ' id="root"'
    if (!html.includes(' id="root"')) {
      throw new Error(
        `Error: The vite-plugin-react-meta-map's PageTemplate does not contain ' id="root"'. Ensure that the PageTemplate renders an element with id="root".`
      );
    }
    // ensure that `page` contains `url` and `bundleEntryPoint` properties
    if (!("url" in page)) {
      throw new Error(
        `Error: The vite-plugin-react-meta-map's pageMetaMap does not contain the "url" property. The "url" property is required to know each page's relative .html file path (ie: "index.html").`
      );
    }
    if (!("bundleEntryPoint" in page)) {
      throw new Error(
        `Error: The vite-plugin-react-meta-map's pageMetaMap does not contain the "bundleEntryPoint" property. The "bundleEntryPoint" property is required to know which bundle entry file to load for each page (ie: "/src/main.tsx").`
      );
    }

    // inject the correct bundle assets into the head section
    const htmlStart = html.indexOf("</head>");
    const htmlBeforeHeadClose = html.slice(0, htmlStart);
    const htmlAfterHeadClose = html.slice(htmlStart);

    const assetTags: string[] = [];

    let entryPointmatchFound = false;
    generatedEntryChunks.forEach((chunk) => {
      const isMatchingEntryPoint = chunk.modules.some((modulePath) => {
        const normalizedModulePath = modulePath.replace(/\\/g, "/");
        const normalizedEntryPoint = page.bundleEntryPoint.replace(/\\/g, "/");
        return normalizedModulePath.endsWith(normalizedEntryPoint);
      });
      if (isMatchingEntryPoint) {
        entryPointmatchFound = true;
        // include script tag for entry chunk
        assetTags.push(
          `<script type="module" crossorigin src="${base}${chunk.fileName}"></script>`
        );
        // include preload links for imports
        for (const importFile of chunk.imports) {
          assetTags.push(
            `<link rel="modulepreload" crossorigin href="${base}${importFile}">`
          );
        }
        // include CSS links
        for (const cssFile of chunk.css) {
          assetTags.push(
            `<link rel="stylesheet" crossorigin href="${base}${cssFile}">`
          );
        }
      }
    });

    // ensure page's entry point file found
    if (!entryPointmatchFound) {
      throw new Error(
        `Error: "bundleEntryPoint" set for ${page.url} in the vite-plugin-react-meta-map's pageMetaMap could not be found in the Vite bundle as an entry point. Ensure that the "bundleEntryPoint" is set to an existing bundle entry point file (ie: "/src/main.tsx").`
      );
    }

    html = htmlBeforeHeadClose + assetTags.join("") + htmlAfterHeadClose;

    const filePath = path.join(resolvedOutDir, page.url);
    const directoryPath = path.dirname(filePath);
    fileUtils.ensureDirExists(directoryPath);

    // create .html file
    fileUtils.writeFile(filePath, `<!DOCTYPE html>${html}`);
  });

  // clean up the temporary dir using the callback method
  fileUtils.cleanupDir(tempBundleOutputDir);
}
