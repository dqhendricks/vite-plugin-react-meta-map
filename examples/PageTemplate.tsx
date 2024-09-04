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
