import Head from "next/head";
import React from "react";

export const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/meta/favicon.ico" />
        <title>URL Shortener</title>
      </Head>
      <header></header>
      <main className={`from-gray-900 to-gray-600 bg-gradient-to-br`}>
        <div className={`container mx-auto w-80 h-screen flex items-center`}>
          {children}
        </div>
      </main>
    </>
  );
};

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={`bg-white w-full p-5 rounded drop-shadow flex flex-col gap-5`}
    >
      {children}
    </div>
  );
};

export const Spinner = () => {
  return (
    <div className="animate-spin w-full h-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          strokeOpacity="0.25"
        ></circle>
        <path
          fill="currentColor"
          fillOpacity="0.75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};
