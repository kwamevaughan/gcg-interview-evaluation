const CHUNK_PUBLIC_PATH = "server/pages/_app.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/node_modules_28b3d9._.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__de768b._.js");
runtime.loadChunk("server/chunks/ssr/_37ae64._.css");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/src/pages/_app.js [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
