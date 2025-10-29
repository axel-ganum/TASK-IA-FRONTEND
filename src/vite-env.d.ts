/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // podés agregar más variables si querés, por ejemplo:
  // readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
