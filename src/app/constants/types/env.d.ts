// / <reference types="vite/client" />

interface ImportMetaEnv {
  // vite built-in variables
  readonly MODE: string
  readonly PROD: boolean

  // user defined enviroment variables
  VITE_APP_STAGING_URL: string
  readonly VITE_APP_THEME: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_THEME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
