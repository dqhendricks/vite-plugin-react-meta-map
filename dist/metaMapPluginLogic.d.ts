import { OutputBundle } from "rollup";
export interface EntryChunkData {
    fileName: string;
    imports: string[];
    modules: string[];
    css: string[];
}
export declare function returnEntryChunkData(bundle: OutputBundle): EntryChunkData[];
export declare function generateHtmlPages(outDir: string, base: string, pageTemplateFilePath: string, pageMetaMapFilePath: string, generatedEntryChunks: EntryChunkData[]): Promise<void>;
//# sourceMappingURL=metaMapPluginLogic.d.ts.map