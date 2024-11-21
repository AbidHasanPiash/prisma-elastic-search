const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost'
const PORT = process.env.NEXT_PUBLIC_PORT || '3000'
const VERSION = process.env.NEXT_PUBLIC_VERSION || 'v1'

const isServer = typeof window === 'undefined';

export default {
    // BASE_URL : `${URL}:${PORT}/${VERSION}`,
    // BASE_URL : `/api/v1`,
    BASE_URL: isServer ? `${URL}:${PORT}/api` : `/api`,  // Absolute URL for server, relative for client

    //────────────────────────────────────────────
    //? API: ---- Auth
    //────────────────────────────────────────────
    LOGIN : '/auth/login',
    SIGNUP : '/auth/signup',

    //────────────────────────────────────────────
    //? API: ---- Story
    //────────────────────────────────────────────
    GET_STORIES : '/stories',
    CREATE_STORY : '/stories',
}