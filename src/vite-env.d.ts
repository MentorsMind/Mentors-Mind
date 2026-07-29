/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BOOKING_FAILURE_RATE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}


