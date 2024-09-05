import { describe, it, expect, vi, Mock } from "vitest";

vi.mock("../fileUtils", async () => {
  const actual = await vi.importActual<typeof metaMapPluginLogic>(
    "../fileUtils"
  );

  return {
    ...actual,
    writeFile: vi.fn(),
  };
});

import * as fileUtils from "../fileUtils";
import * as metaMapPluginLogic from "../metaMapPluginLogic";

describe("MetaMapPlugin Logic Tests", () => {
  it("writes HTML with correct component props and injects bundle assets", async () => {
    const outDir = "dist";
    const publicAssetsPath = "/";
    const pageTemplateFilePath = "./src/__tests__/mocks/PageTemplate1.tsx";
    const pageMetaMapFilePath = "./src/__tests__/mocks/pageMetaMap1.ts";

    // Mock Vite generated entry chunks
    const entryChunkData: metaMapPluginLogic.EntryChunkData[] = [
      {
        fileName: "assets/index-3Fqgzshn.js",
        imports: [],
        modules: ["/src/main.tsx"],
        css: ["assets/index-D2on-Gs3.css"],
      },
    ];

    // Run the logic to generate HTML pages
    await metaMapPluginLogic.generateHtmlPages(
      outDir,
      publicAssetsPath,
      pageTemplateFilePath,
      pageMetaMapFilePath,
      entryChunkData
    );

    // Check that the writeFile function was called with correct arguments
    const calls = (fileUtils.writeFile as Mock).mock.calls;

    expect(calls.length).toBe(1); // Ensure it was called once

    const writtenHtml = calls[0][1]; // Second argument is the HTML content

    // Check for the correct HTML content
    expect(writtenHtml).toContain("<title>Hello World</title>");
    expect(writtenHtml).toContain(
      '<meta name="description" content="Test Description"/>'
    );

    // Check for the generated JS and CSS assets
    expect(writtenHtml).toContain(
      '<script type="module" crossorigin src="/assets/index-3Fqgzshn.js"></script>'
    );
    expect(writtenHtml).toContain(
      '<link rel="stylesheet" crossorigin href="/assets/index-D2on-Gs3.css">'
    );
  });
});
