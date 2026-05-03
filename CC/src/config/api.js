const trimSlash = (value) => value.replace(/\/+$/, "");

const phpBaseFromEnv = import.meta.env.VITE_PHP_BASE_URL;
const socketBaseFromEnv = import.meta.env.VITE_SOCKET_SERVER_URL;
const uploadBaseFromEnv = import.meta.env.VITE_UPLOAD_SERVER_URL;

export const PHP_BASE_URL = trimSlash(
  phpBaseFromEnv || "http://localhost/Campus%20Connect/CC/src/php"
);
export const SOCKET_SERVER_URL = trimSlash(socketBaseFromEnv || "http://localhost:3000");
export const UPLOAD_SERVER_URL = trimSlash(uploadBaseFromEnv || "http://localhost:3090");
