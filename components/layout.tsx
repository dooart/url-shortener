import React from "react";
import Head from "next/head";

export const siteTitle = "Site";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>
        <Head>
          <link rel="icon" href="/images/meta/favicon.ico" />
          <title>{siteTitle}</title>
        </Head>
        <header></header>
        <main>{children}</main>
      </div>
    </div>
  );
};
