// you can add more to the PageMetaData type (such as Open Graph data) to be consumed by your PageTemplate component
export interface PageMetaData {
  url: string;
  bundleEntryPoint: string;
  title: string;
  description: string;
}

/*
    here you will list all your pages and their needed meta data.
    bundleEntryPoint can be the same for all pages, or you can use vite
    config's rollup options to create multiple bundle entry points for your app.
*/
export const pages: PageMetaData[] = [
  {
    url: "index.html",
    bundleEntryPoint: "/src/main.tsx",
    title: "My App",
    description:
      "This app can use multiple html files that each contain the needed entry points for my React app.",
  },
];
