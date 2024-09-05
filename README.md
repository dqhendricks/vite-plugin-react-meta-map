# vite-plugin-react-meta-map

A Vite plugin for React projects that uses TSX/JSX to generate multiple static .html files during build time, where each can use their own meta tag and other `<head>` information, and all will load your React app seamlessly.

## Installation

Install the plugin as a dev dependency:

```bash
npm install vite-plugin-react-meta-map --save-dev
```

## Usage

In your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import metaMapPlugin from "vite-plugin-react-meta-map";

// be sure to correctly link the plugin to the two files you create in the example below
export default defineConfig({
  plugins: [
    react(),
    metaMapPlugin({
      pageMetaMapFilePath: "./src/pageMetaMap.ts",
      pageTemplateFilePath: "./src/PageTemplate.tsx",
    }),
  ],
});
```

### Example

1. Create a `pageMetaMap.ts` file with your page data:

```typescript
// you can add more to the PageMetaData type (such as Open Graph data) to be consumed by your PageTemplate component
export interface PageMetaData {
  url: string; // required by plugin
  bundleEntryPoint: string; // required by plugin
  title: string;
  description: string;
}

// here you will list all your pages and their needed meta data.
export const pages: PageMetaData[] = [
  {
    url: "index.html",
    bundleEntryPoint: "/src/main.tsx",
    title: "My App",
    description:
      "This app uses multiple html files that each contain the needed entry point(s) for my React app.",
  },
];
```

2. Create a `PageTemplate.tsx` file in your project that consumes your page meta data:

```typescript
import React from "react";
import type { PageMetaData } from "./pageMetaMap";

// must contain an element with id="root"
const PageTemplate: React.FC<PageMetaData> = ({ title, description }) => {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  );
};

export default PageTemplate;
```

And you're all set! Building the project will now generate the needed .html files based on your page meta data and page template files.

### Summary

By following these steps, you’ll be able to:

1. Automatically create different .html entry points with appropriate meta tags for each route of your app.
2. Customize your .html file template using a single TSX/JSX component.
3. Customize the shape of the data your template component uses to include anything you need.

This will allow developers to further optimize their SEO and use Open Graph without needing SSR.
