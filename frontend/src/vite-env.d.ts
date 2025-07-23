/// <reference types="vite/client" />

type ViteTypeOptions = {};

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


declare namespace NodeJS {
  interface ProcessEnv {
    readonly POCKETBASE_URL: string;
    readonly POCKETBASE_EMAIL: string;
    readonly POCKETBASE_PASSWORD: string;
  }
}