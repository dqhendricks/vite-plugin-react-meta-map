// you can add more to the PageMetaData type (such as Open Graph data) to be consumed by your PageTemplate component
export interface PageMetaData {
  url: string;
  bundleEntryPoint: string;
  title: string;
  description: string;
}

export const pages: PageMetaData[] = [
  {
    title: "Hello World",
    description: "Test Description",
    bundleEntryPoint: "/src/main.tsx",
    url: "index.html",
  },
];
