(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__6f9abd._.js", {

"[turbopack]/browser/dev/hmr-client/websocket.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// Adapted from https://github.com/vercel/next.js/blob/canary/packages/next/src/client/dev/error-overlay/websocket.ts
__turbopack_esm__({
    "addMessageListener": (()=>addMessageListener),
    "connectHMR": (()=>connectHMR),
    "sendMessage": (()=>sendMessage)
});
let source;
const eventCallbacks = [];
// TODO: add timeout again
// let lastActivity = Date.now()
function getSocketProtocol(assetPrefix) {
    let protocol = location.protocol;
    try {
        // assetPrefix is a url
        protocol = new URL(assetPrefix).protocol;
    } catch (_) {}
    return protocol === "http:" ? "ws" : "wss";
}
function addMessageListener(cb) {
    eventCallbacks.push(cb);
}
function sendMessage(data) {
    if (!source || source.readyState !== source.OPEN) return;
    return source.send(data);
}
function connectHMR(options) {
    const { timeout = 5 * 1000 } = options;
    function init() {
        if (source) source.close();
        console.log("[HMR] connecting...");
        function handleOnline() {
            const connected = {
                type: "turbopack-connected"
            };
            eventCallbacks.forEach((cb)=>{
                cb(connected);
            });
            if (options.log) console.log("[HMR] connected");
        // lastActivity = Date.now()
        }
        function handleMessage(event) {
            // lastActivity = Date.now()
            const message = {
                type: "turbopack-message",
                data: JSON.parse(event.data)
            };
            eventCallbacks.forEach((cb)=>{
                cb(message);
            });
        }
        // let timer: NodeJS.Timeout
        function handleDisconnect() {
            source.close();
            setTimeout(init, timeout);
        }
        const { hostname, port } = location;
        const protocol = getSocketProtocol(options.assetPrefix || "");
        const assetPrefix = options.assetPrefix.replace(/^\/+/, "");
        let url = `${protocol}://${hostname}:${port}${assetPrefix ? `/${assetPrefix}` : ""}`;
        if (assetPrefix.startsWith("http")) {
            url = `${protocol}://${assetPrefix.split("://")[1]}`;
        }
        source = new window.WebSocket(`${url}${options.path}`);
        source.onopen = handleOnline;
        source.onerror = handleDisconnect;
        source.onmessage = handleMessage;
    }
    init();
}
}}),
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_esm__({
    "connect": (()=>connect),
    "setHooks": (()=>setHooks),
    "subscribeToUpdate": (()=>subscribeToUpdate)
});
var __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[turbopack]/browser/dev/hmr-client/websocket.ts [client] (ecmascript)");
;
function connect({ // TODO(WEB-1465) Remove this backwards compat fallback once
// vercel/next.js#54586 is merged.
addMessageListener = __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["addMessageListener"], // TODO(WEB-1465) Remove this backwards compat fallback once
// vercel/next.js#54586 is merged.
sendMessage = __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["sendMessage"], onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case "turbopack-connected":
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error("A separate HMR handler was already registered");
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: "turbopack-subscribe",
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: "turbopack-unsubscribe",
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: "ChunkListUpdate",
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted" || updateA.type === "deleted" && updateB.type === "added") {
        return undefined;
    }
    if (updateA.type === "partial") {
        invariant(updateA.instruction, "Partial updates are unsupported");
    }
    if (updateB.type === "partial") {
        invariant(updateB.instruction, "Partial updates are unsupported");
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: "EcmascriptMergedUpdate",
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted") {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === "deleted" && updateB.type === "added") {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: "partial",
            added,
            deleted
        };
    }
    if (updateA.type === "partial" && updateB.type === "partial") {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: "partial",
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === "added" && updateB.type === "partial") {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: "added",
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === "partial" && updateB.type === "deleted") {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: "deleted",
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    "bug",
    "error",
    "fatal"
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    "bug",
    "fatal",
    "error",
    "warning",
    "info",
    "log"
];
const CATEGORY_ORDER = [
    "parse",
    "resolve",
    "code generation",
    "rendering",
    "typescript",
    "other"
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case "issues":
            break;
        case "partial":
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    // TODO(WEB-1465) Remove this backwards compat fallback once
    // vercel/next.js#54586 is merged.
    if (callback === undefined) {
        callback = sendMessage;
        sendMessage = __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["sendMessage"];
    }
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === "notFound") {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}}),
"[project]/src/data/questions.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/data/questions.js
__turbopack_esm__({
    "questions": (()=>questions)
});
const questions = [
    {
        id: 1,
        text: "Apart from English, which of the following languages do you speak?",
        options: [
            "French",
            "German",
            "Portuguese",
            "Mandarin",
            "None"
        ]
    },
    {
        id: 2,
        text: "What grade did you score in High school (or similar)?",
        options: [
            "A",
            "B",
            "C",
            "D"
        ]
    },
    {
        id: 3,
        text: "Have you undertaken/undertaking any Masters degree?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        id: 4,
        text: "What was your University score at graduation?",
        options: [
            "First class",
            "Second class upper division",
            "Second class lower division",
            "Third class"
        ]
    },
    {
        id: 5,
        text: "Which of the following are you most proficient in?",
        options: [
            "Written communication",
            "Oral communication",
            "Both"
        ]
    },
    {
        id: 6,
        text: "How would you rate your interpersonal skills?",
        options: [
            "Beginner",
            "Intermediate",
            "Proficient"
        ]
    },
    {
        id: 7,
        text: "How many certifications/short courses have you undertaken within the last 6 months?",
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5+"
        ]
    },
    {
        id: 8,
        text: "You are working in a call center at Growthpad. You have received a call from a customer who has been waiting for a project manager who has failed to arrive within the scheduled time slot for a meeting. The customer is upset and is talking in a raised voice. Which would be the ‘most effective’ action to take first?",
        type: "situational",
        options: [
            "Apologize to the customer and say you will arrange for a re-scheduled appointment.",
            "Listen to the customer’s feedback and tell them that you can understand why they are upset and that it must be very inconvenient for them.",
            "Explain that the project manager has a very busy schedule and it’s difficult for her to always be on time but you’re sure she will arrive soon.",
            "Apologize to the customer and ask them to hold while you contact the project manager to establish where she is."
        ]
    },
    {
        id: 9,
        text: "What is the first step in learning about a product/service?",
        type: "situational",
        options: [
            "Contact your supervisor and ask for a meeting to walk you through the products/services.",
            "Take some time to read the information provided with the product e.g., product briefs, catalog etc.",
            "Ask a colleague who has already read about the product to give you a brief summary of the information you need.",
            "Read the information provided with the product while helping customers."
        ]
    },
    {
        id: 10,
        text: "A customer approaches you and says: 'The service here is just horrible!' What would you say to her?",
        type: "situational",
        options: [
            "“I am really sorry you feel that way. Would you like to get the manager so that you can talk to him?”",
            "“I understand your frustration; this is an unexpectedly busy hour. We are doing our best.”",
            "“I am sorry to hear that. What is it about the service that disappointed you today?”",
            "“I am sorry to hear that you had a bad experience today. I hope your next visit will be more pleasant.”"
        ]
    },
    {
        id: 11,
        text: "You manage a department that is comprised of 4 teams. Things go rather smoothly - your teams are cooperative, the atmosphere is good and the department manages to meet its deadlines. You know that things go fine but think that the team leaders are resting on their laurels. You believe they can do better and productivity rates can be higher. What would you do?",
        type: "situational",
        options: [
            "Set a goal to increase productivity by 5% next month and provide an incentive.",
            "Speak openly to the team leaders - tell them that they perform well but can do better and ask them to improve.",
            "Give a motivational speech in which you focus on how competent the team leaders are.",
            "Tell the team leaders that you feel they are not motivated enough and you want them to aim higher."
        ]
    },
    {
        id: 12,
        text: "If given the opportunity, for how long would you like to work at Growthpad?",
        options: [
            "1 year",
            "2-3 years",
            "3-5 years",
            "5-10 years",
            "10+ years"
        ]
    },
    {
        id: 13,
        text: "How many countries have you visited in your lifetime?",
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6+"
        ]
    },
    {
        id: 14,
        text: "How do you manage competing priorities with tight deadlines?",
        type: "situational",
        options: [
            "Work overtime to complete all tasks.",
            "Communicate with stakeholders to clarify priorities and delegate tasks.",
            "Focus only on high-visibility tasks.",
            "Request deadline extensions."
        ]
    },
    {
        id: 15,
        text: "A key stakeholder disagrees with your approach. How do you handle this?",
        type: "situational",
        options: [
            "Avoid confrontation to maintain harmony.",
            "Listen to their concerns, present data, and seek alignment.",
            "Escalate the issue to senior management.",
            "Insist your approach is correct."
        ]
    },
    {
        id: 16,
        text: "Have you ever worked as a volunteer?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        id: 17,
        text: "In your previous role, can you name one innovative thing that you introduced to the organization? This one thing can be confirmed by your referees.",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        id: 18,
        text: "How many years did you work in your previous organization?",
        options: [
            "Less than 1 year",
            "1-2 years",
            "2-3 years",
            "3-5 years",
            "6+ years"
        ]
    },
    {
        id: 19,
        text: "You encounter an unexpected obstacle that threatens a project deadline. How do you respond?",
        type: "situational",
        options: [
            "Immediately take charge and implement a solution.",
            "Assess the situation, gather input from stakeholders, and then act.",
            "Delegate the issue to a team member.",
            "Wait for instructions from leadership."
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/layouts/header.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/layouts/header.js
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
;
;
;
const Header = ({ mode, toggleMode, step, currentPage, totalPages, uploadProgress, answeredQuestions, totalQuestions, isStep1Complete })=>{
    let progressPercentage = 0;
    let progressText = "";
    if (step === 1) {
        progressPercentage = isStep1Complete ? 5 : 0;
        progressText = `${progressPercentage}% Done`;
    } else if (step === 2 && totalPages > 0) {
        progressPercentage = 5 + Math.round(answeredQuestions / totalQuestions * 90);
        progressText = `${progressPercentage}% Done`;
    } else if (step === 3) {
        const resumeProgress = uploadProgress?.resume || 0;
        const coverLetterProgress = uploadProgress?.coverLetter || 0;
        const resumeContribution = resumeProgress / 100 * 2.5;
        const coverLetterContribution = coverLetterProgress / 100 * 2.5;
        progressPercentage = 95 + resumeContribution + coverLetterContribution;
        progressText = `${Math.round(progressPercentage)}% Done`;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-[#fff8f7] border-[#231812]"} border-b shadow-lg py-4 md:py-6 px-4 md:px-24 flex items-center sticky top-0 z-50`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between items-center w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: mode === "dark" ? "/assets/images/logo-tagline-white.svg" : "/assets/images/logo-tagline-orange.svg",
                            alt: "Growthpad Logo",
                            width: 240,
                            height: 40,
                            className: "w-32 md:w-[300px]"
                        }, void 0, false, {
                            fileName: "[project]/src/layouts/header.js",
                            lineNumber: 33,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/layouts/header.js",
                        lineNumber: 32,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/layouts/header.js",
                    lineNumber: 31,
                    columnNumber: 17
                }, this),
                (step === 1 || step === 2 || step === 3) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-1/2 relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-full ${mode === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-lg h-10`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#f05d23] h-10 px-8 rounded-lg transition-all duration-300 flex items-center justify-center text-white text-base font-semibold",
                            style: {
                                width: `${progressPercentage}%`
                            },
                            children: progressText
                        }, void 0, false, {
                            fileName: "[project]/src/layouts/header.js",
                            lineNumber: 50,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/layouts/header.js",
                        lineNumber: 45,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/layouts/header.js",
                    lineNumber: 44,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: toggleMode,
                            className: "p-2 focus:outline-none md:hidden",
                            "aria-label": "Toggle dark mode",
                            children: mode === "dark" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                icon: "bi:sun",
                                className: "h-6 w-6 text-yellow-400"
                            }, void 0, false, {
                                fileName: "[project]/src/layouts/header.js",
                                lineNumber: 68,
                                columnNumber: 29
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                icon: "bi:moon",
                                className: "h-6 w-6 text-gray-600"
                            }, void 0, false, {
                                fileName: "[project]/src/layouts/header.js",
                                lineNumber: 70,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/layouts/header.js",
                            lineNumber: 62,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "hidden md:inline-flex items-center cursor-pointer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: mode === "dark",
                                    onChange: toggleMode,
                                    className: "hidden"
                                }, void 0, false, {
                                    fileName: "[project]/src/layouts/header.js",
                                    lineNumber: 75,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `relative w-14 h-8 rounded-full border-2 flex items-center ${mode === "dark" ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-gray-300"} transition`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform ${mode === "dark" ? "translate-x-6" : ""}`,
                                        children: mode === "dark" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "bi:moon",
                                            className: "h-4 w-4 text-gray-700"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/header.js",
                                            lineNumber: 87,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "bi:sun",
                                            className: "h-4 w-4 text-yellow-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/header.js",
                                            lineNumber: 89,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/header.js",
                                        lineNumber: 81,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/layouts/header.js",
                                    lineNumber: 76,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/layouts/header.js",
                            lineNumber: 74,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/layouts/header.js",
                    lineNumber: 60,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/layouts/header.js",
            lineNumber: 30,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/layouts/header.js",
        lineNumber: 25,
        columnNumber: 9
    }, this);
};
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_refresh__.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useFormData.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/hooks/useFormData.js
__turbopack_esm__({
    "useFormData": (()=>useFormData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-hot-toast/dist/index.mjs [client] (ecmascript)");
var _s = __turbopack_refresh__.signature();
;
;
const useFormData = ()=>{
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        answers: {},
        resume: null,
        coverLetter: null
    });
    const [submissionStatus, setSubmissionStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleOptionToggle = (questionIndex, option)=>{
        const currentAnswers = formData.answers[questionIndex] || [];
        let newAnswers;
        if (currentAnswers.includes(option)) {
            newAnswers = currentAnswers.filter((ans)=>ans !== option);
        } else {
            newAnswers = questionIndex === 0 ? [
                ...currentAnswers,
                option
            ] : [
                option
            ];
        }
        setFormData((prev)=>({
                ...prev,
                answers: {
                    ...prev.answers,
                    [questionIndex]: newAnswers
                }
            }));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])(`${option} ${newAnswers.includes(option) ? "selected" : "deselected"}`, {
            duration: 1000
        });
    };
    const fileToBase64 = (file)=>new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = ()=>resolve(reader.result.split(",")[1]);
            reader.onerror = (error)=>reject(error);
        });
    return {
        formData,
        setFormData,
        submissionStatus,
        setSubmissionStatus,
        handleChange,
        handleOptionToggle,
        fileToBase64
    };
};
_s(useFormData, "3x1FU9ypTCcg1eTFNFMjzwsmRBs=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useFileUpload.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/hooks/useFileUpload.js
__turbopack_esm__({
    "useFileUpload": (()=>useFileUpload)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-hot-toast/dist/index.mjs [client] (ecmascript)");
var _s = __turbopack_refresh__.signature();
;
;
const useFileUpload = (formData, setFormData)=>{
    _s();
    const [isDraggingResume, setIsDraggingResume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDraggingCoverLetter, setIsDraggingCoverLetter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadProgress, setUploadProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        resume: 0,
        coverLetter: 0
    });
    const handleFileChange = (e, type)=>{
        const file = e.target.files[0];
        if (file) {
            setFormData((prev)=>({
                    ...prev,
                    [type]: file
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success(`${type === "resume" ? "Resume" : "Cover Letter"} selected: ${file.name}`);
        }
    };
    const handleDrop = (e, type)=>{
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setFormData((prev)=>({
                    ...prev,
                    [type]: file
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success(`${type === "resume" ? "Resume" : "Cover Letter"} dropped: ${file.name}`);
        }
        if (type === "resume") setIsDraggingResume(false);
        else setIsDraggingCoverLetter(false);
    };
    const handleDragOver = (e, type)=>{
        e.preventDefault();
        if (type === "resume") setIsDraggingResume(true);
        else setIsDraggingCoverLetter(true);
    };
    const handleDragLeave = (e, type)=>{
        e.preventDefault();
        if (type === "resume") setIsDraggingResume(false);
        else setIsDraggingCoverLetter(false);
    };
    const removeFile = (type)=>{
        setFormData((prev)=>({
                ...prev,
                [type]: null
            }));
        setUploadProgress((prev)=>({
                ...prev,
                [type]: 0
            }));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success(`${type === "resume" ? "Resume" : "Cover Letter"} removed`);
    };
    return {
        isDraggingResume,
        isDraggingCoverLetter,
        uploadProgress,
        setUploadProgress,
        handleFileChange,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        removeFile
    };
};
_s(useFileUpload, "jm8eLvj3qS01S7AIQTP0/Kt7Pfo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Step1Form.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/Step1Form.js
__turbopack_esm__({
    "default": (()=>Step1Form)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
function Step1Form({ formData, handleChange, mode }) {
    _s();
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    const validateField = (name, value)=>{
        let error = "";
        if (name === "fullName" && !value.trim()) {
            error = "Full name is required";
        } else if (name === "email") {
            if (!value.trim()) {
                error = "Email is required";
            } else if (!emailRegex.test(value)) {
                error = "Please enter a valid email (e.g., hello@gmail.com)";
            }
        } else if (name === "phone" && !value.trim()) {
            error = "Phone number is required";
        } else if (name === "linkedin") {
            if (!value.trim()) {
                error = "LinkedIn URL is required";
            } else if (!urlRegex.test(value)) {
                error = "Please enter a valid URL (e.g., https://example.com)";
            }
        }
        setErrors((prev)=>({
                ...prev,
                [name]: error
            }));
    };
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        handleChange(e);
        validateField(name, value);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-fade-in max-w-2xl mx-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                            icon: "mdi:handshake",
                            className: "w-8 h-8 text-[#f05d23] mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Step1Form.js",
                            lineNumber: 47,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-bold text-center",
                            children: "Let’s Get Started"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Step1Form.js",
                            lineNumber: 48,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Step1Form.js",
                    lineNumber: 46,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `text-center mb-8 italic ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`,
                    children: "Welcome to Growthpad! Please fill out all fields to begin your journey."
                }, void 0, false, {
                    fileName: "[project]/src/components/Step1Form.js",
                    lineNumber: 50,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "fullName",
                                    className: "block text-sm font-medium mb-1",
                                    children: [
                                        "Full Name ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 60,
                                            columnNumber: 39
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 59,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:user",
                                            className: "absolute left-3 text-[#f05d23] w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 63,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            name: "fullName",
                                            id: "fullName",
                                            value: formData.fullName,
                                            onChange: handleInputChange,
                                            placeholder: "e.g., John Doe",
                                            required: true,
                                            className: `w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${mode === "dark" ? `bg-gray-700 text-white border-gray-600 ${errors.fullName ? "border-red-500" : "focus:border-[#f05d23]"}` : `bg-gray-50 text-[#231812] border-gray-300 ${errors.fullName ? "border-red-500" : "focus:border-[#f05d23]"}`}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 64,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 62,
                                    columnNumber: 25
                                }, this),
                                errors.fullName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-1 text-xs text-red-500 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:alert-circle",
                                            className: "w-4 h-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 85,
                                            columnNumber: 33
                                        }, this),
                                        " ",
                                        errors.fullName
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 84,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Step1Form.js",
                            lineNumber: 58,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "email",
                                    className: "block text-sm font-medium mb-1",
                                    children: [
                                        "Email ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 92,
                                            columnNumber: 35
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 91,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:email",
                                            className: "absolute left-3 text-[#f05d23] w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 95,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            name: "email",
                                            id: "email",
                                            value: formData.email,
                                            onChange: handleInputChange,
                                            placeholder: "e.g., john.doe@example.com",
                                            required: true,
                                            className: `w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${mode === "dark" ? `bg-gray-700 text-white border-gray-600 ${errors.email ? "border-red-500" : "focus:border-[#f05d23]"}` : `bg-gray-50 text-[#231812] border-gray-300 ${errors.email ? "border-red-500" : "focus:border-[#f05d23]"}`}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 96,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 94,
                                    columnNumber: 25
                                }, this),
                                errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-1 text-xs text-red-500 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:alert-circle",
                                            className: "w-4 h-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 117,
                                            columnNumber: 33
                                        }, this),
                                        " ",
                                        errors.email
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 116,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Step1Form.js",
                            lineNumber: 90,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "phone",
                                    className: "block text-sm font-medium mb-1",
                                    children: [
                                        "Phone ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 124,
                                            columnNumber: 35
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 123,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:phone",
                                            className: "absolute left-3 text-[#f05d23] w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 127,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            name: "phone",
                                            id: "phone",
                                            value: formData.phone,
                                            onChange: handleInputChange,
                                            placeholder: "e.g., +254 701 850 850",
                                            required: true,
                                            className: `w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${mode === "dark" ? `bg-gray-700 text-white border-gray-600 ${errors.phone ? "border-red-500" : "focus:border-[#f05d23]"}` : `bg-gray-50 text-[#231812] border-gray-300 ${errors.phone ? "border-red-500" : "focus:border-[#f05d23]"}`}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 128,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 126,
                                    columnNumber: 25
                                }, this),
                                errors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-1 text-xs text-red-500 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:alert-circle",
                                            className: "w-4 h-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 149,
                                            columnNumber: 33
                                        }, this),
                                        " ",
                                        errors.phone
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 148,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Step1Form.js",
                            lineNumber: 122,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "linkedin",
                                    className: "block text-sm font-medium mb-1",
                                    children: [
                                        "LinkedIn Profile ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 156,
                                            columnNumber: 46
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 155,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:linkedin",
                                            className: "absolute left-3 text-[#f05d23] w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 159,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            name: "linkedin",
                                            id: "linkedin",
                                            value: formData.linkedin,
                                            onChange: handleInputChange,
                                            placeholder: "e.g., https://linkedin.com/in/johndoe",
                                            required: true,
                                            className: `w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${mode === "dark" ? `bg-gray-700 text-white border-gray-600 ${errors.linkedin ? "border-red-500" : "focus:border-[#f05d23]"}` : `bg-gray-50 text-[#231812] border-gray-300 ${errors.linkedin ? "border-red-500" : "focus:border-[#f05d23]"}`}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 160,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 158,
                                    columnNumber: 25
                                }, this),
                                errors.linkedin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-1 text-xs text-red-500 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:alert-circle",
                                            className: "w-4 h-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 181,
                                            columnNumber: 33
                                        }, this),
                                        " ",
                                        errors.linkedin
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 180,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Step1Form.js",
                            lineNumber: 154,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium mb-1",
                                    children: [
                                        "Applying for ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 188,
                                            columnNumber: 42
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 187,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:briefcase",
                                            className: "absolute left-3 text-[#f05d23] w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 191,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.opening || "Please select an opening on the landing page",
                                            readOnly: true,
                                            className: `w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed ${mode === "dark" ? "bg-gray-600 border-gray-500 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-500"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Step1Form.js",
                                            lineNumber: 192,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Step1Form.js",
                                    lineNumber: 190,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Step1Form.js",
                            lineNumber: 186,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Step1Form.js",
                    lineNumber: 57,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Step1Form.js",
            lineNumber: 41,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Step1Form.js",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_s(Step1Form, "o+SUXTQUSJNurFcpxixiLrA9BM0=");
_c = Step1Form;
var _c;
__turbopack_refresh__.register(_c, "Step1Form");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Step2Questions.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/Step2Questions.js
__turbopack_esm__({
    "default": (()=>Step2Questions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
function Step2Questions({ formData, handleOptionToggle, currentPage, questionsPerPage, questions, handleNextPage, totalPages, onComplete, mode }) {
    _s();
    const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
    const borderColors = [
        "border-red-500",
        "border-blue-500",
        "border-green-500",
        "border-yellow-500",
        "border-purple-500"
    ];
    const questionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hasContinuedFromQ1, setHasContinuedFromQ1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(formData.answers[0]?.length > 0);
    const currentQuestionIndex = currentQuestions.findIndex((q)=>(!formData.answers[q.id - 1] || formData.answers[q.id - 1].length === 0) && q.id !== 1);
    const allQuestionsAnswered = questions.every((q)=>formData.answers[q.id - 1]?.length > 0);
    const isLastPage = currentPage === totalPages - 1;
    const lastQuestionId = questions[questions.length - 1].id;
    const isLastQuestionAnswered = formData.answers[lastQuestionId - 1]?.length > 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Step2Questions.useEffect": ()=>{
            const allCurrentPageAnswered = currentQuestions.every({
                "Step2Questions.useEffect.allCurrentPageAnswered": (q)=>formData.answers[q.id - 1]?.length > 0
            }["Step2Questions.useEffect.allCurrentPageAnswered"]);
            if (allCurrentPageAnswered && currentPage < totalPages - 1) {
                handleNextPage();
            } else if (isLastPage && allQuestionsAnswered) {
                const lastQuestionRef = questionRefs.current[currentQuestions.findIndex({
                    "Step2Questions.useEffect": (q)=>q.id === lastQuestionId
                }["Step2Questions.useEffect"])];
                if (lastQuestionRef && containerRef.current) {
                    lastQuestionRef.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            } else if (!hasContinuedFromQ1 && currentQuestions[0]?.id === 1) {
                const q1Ref = questionRefs.current[0];
                if (q1Ref && containerRef.current) {
                    q1Ref.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            } else {
                const indexToFocus = currentQuestionIndex >= 0 ? currentQuestionIndex : 0;
                const currentQuestion = questionRefs.current[indexToFocus];
                if (currentQuestion && containerRef.current) {
                    currentQuestion.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }
        }
    }["Step2Questions.useEffect"], [
        formData.answers,
        currentQuestionIndex,
        currentPage,
        totalPages,
        handleNextPage,
        hasContinuedFromQ1,
        allQuestionsAnswered,
        lastQuestionId,
        isLastPage
    ]);
    const handleContinue = ()=>{
        if (formData.answers[0]?.length > 0) {
            setHasContinuedFromQ1(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6 p-4",
            children: currentQuestions.map((question, index)=>{
                const isAnswered = formData.answers[question.id - 1]?.length > 0;
                const isLastQuestion = question.id === lastQuestionId;
                let isCurrent = false;
                if (question.id === 1 && !hasContinuedFromQ1) {
                    isCurrent = true;
                } else if (hasContinuedFromQ1) {
                    if (currentQuestionIndex === -1) {
                        isCurrent = isLastQuestion && isLastPage ? true : index === 0;
                    } else {
                        isCurrent = index === currentQuestionIndex;
                    }
                }
                const isDisabled = !isCurrent;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: (el)=>questionRefs.current[index] = el,
                    className: `shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] transition-all duration-500 transform ${mode === "dark" ? "bg-gray-800" : "bg-white"} ${isAnswered && !isCurrent ? "opacity-50 blur-sm scale-95 -translate-y-10 pointer-events-none" : isCurrent ? "opacity-100 scale-100 animate-fade-in" : "opacity-50 blur-sm translate-y-10 pointer-events-none"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center mb-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    icon: "mdi:question-mark-circle",
                                    className: "w-6 h-6 text-[#f05d23] mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Step2Questions.js",
                                    lineNumber: 95,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-xl font-semibold ${mode === "dark" ? "text-white" : "text-[#231812]"}`,
                                    children: question.text
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Step2Questions.js",
                                    lineNumber: 96,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Step2Questions.js",
                            lineNumber: 94,
                            columnNumber: 29
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                question.options.map((option, optIndex)=>{
                                    const isSelected = (formData.answers[question.id - 1] || []).includes(option);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        disabled: isDisabled,
                                        onClick: ()=>handleOptionToggle(question.id - 1, option),
                                        className: `w-full p-3 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200 ${borderColors[optIndex % borderColors.length]} ${isSelected ? "bg-[#f05d23] border-[#f05d23] text-white shadow-md" : mode === "dark" ? "bg-gray-700 text-white hover:bg-gray-600 hover:border-[#d94f1e]" : "bg-gray-50 text-[#231812] hover:bg-gray-100 hover:border-[#d94f1e]"} ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center",
                                            children: [
                                                isSelected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                    icon: "mdi:check-circle",
                                                    className: "w-5 h-5 mr-2 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Step2Questions.js",
                                                    lineNumber: 124,
                                                    columnNumber: 53
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                    icon: "mdi:circle-outline",
                                                    className: `w-5 h-5 mr-2 flex-shrink-0 ${mode === "dark" ? "text-gray-400" : "text-gray-400"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Step2Questions.js",
                                                    lineNumber: 126,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex-1",
                                                    children: option
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Step2Questions.js",
                                                    lineNumber: 133,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Step2Questions.js",
                                            lineNumber: 122,
                                            columnNumber: 45
                                        }, this)
                                    }, option, false, {
                                        fileName: "[project]/src/components/Step2Questions.js",
                                        lineNumber: 108,
                                        columnNumber: 41
                                    }, this);
                                }),
                                question.id === 1 && !hasContinuedFromQ1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 text-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleContinue,
                                        disabled: !formData.answers[0]?.length,
                                        className: "px-6 py-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] disabled:bg-gray-300 disabled:text-gray-600 transition-all duration-200 shadow-md",
                                        children: "Continue"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Step2Questions.js",
                                        lineNumber: 140,
                                        columnNumber: 41
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Step2Questions.js",
                                    lineNumber: 139,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Step2Questions.js",
                            lineNumber: 104,
                            columnNumber: 29
                        }, this),
                        isLastQuestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onComplete,
                                disabled: !isLastQuestionAnswered,
                                className: `px-6 py-3 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition-all duration-200 shadow-md ${!isLastQuestionAnswered ? "opacity-50 cursor-not-allowed" : ""}`,
                                children: "Upload CV"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Step2Questions.js",
                                lineNumber: 152,
                                columnNumber: 37
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Step2Questions.js",
                            lineNumber: 151,
                            columnNumber: 33
                        }, this)
                    ]
                }, question.id, true, {
                    fileName: "[project]/src/components/Step2Questions.js",
                    lineNumber: 81,
                    columnNumber: 25
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/Step2Questions.js",
            lineNumber: 64,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Step2Questions.js",
        lineNumber: 60,
        columnNumber: 9
    }, this);
}
_s(Step2Questions, "HeQIBB2vK7FqjVLHqo6Lua8Vd7U=");
_c = Step2Questions;
var _c;
__turbopack_refresh__.register(_c, "Step2Questions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/DragDropZone.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/DragDropZone.js
__turbopack_esm__({
    "default": (()=>DragDropZone)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
;
;
function DragDropZone({ type, file, isDragging, uploadProgress, isSubmitting, handleFileChange, handleDrop, handleDragOver, handleDragLeave, removeFile, mode, required }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onDrop: (e)=>handleDrop(e, type),
        onDragOver: (e)=>handleDragOver(e, type),
        onDragLeave: (e)=>handleDragLeave(e, type),
        className: `p-6 flex justify-center border-2 border-dashed rounded-xl transition-all duration-300 transform ${isDragging ? "border-[#f05d23] bg-orange-50 scale-105" : mode === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"}`,
        children: !file ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `inline-flex justify-center items-center w-12 h-12 rounded-full mb-4 ${mode === "dark" ? "bg-gray-600 text-[#f05d23]" : "bg-gray-100 text-[#f05d23]"}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                        icon: "mdi:upload",
                        className: "w-6 h-6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DragDropZone.js",
                        lineNumber: 38,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/DragDropZone.js",
                    lineNumber: 33,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `text-sm ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `font-medium ${mode === "dark" ? "text-white" : "text-[#231812]"}`,
                            children: [
                                type === "resume" ? "Resume" : "Cover Letter",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-500",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DragDropZone.js",
                                    lineNumber: 47,
                                    columnNumber: 29
                                }, this),
                                " - Drop your file here or",
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DragDropZone.js",
                            lineNumber: 45,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "file",
                            name: type,
                            accept: ".pdf,.docx",
                            onChange: (e)=>handleFileChange(e, type),
                            className: "hidden",
                            id: `${type}-upload`,
                            required: required
                        }, void 0, false, {
                            fileName: "[project]/src/components/DragDropZone.js",
                            lineNumber: 49,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: `${type}-upload`,
                            className: "font-semibold text-[#f05d23] hover:text-[#d94f1e] cursor-pointer transition",
                            children: "browse"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DragDropZone.js",
                            lineNumber: 58,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DragDropZone.js",
                    lineNumber: 40,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `mt-1 text-xs ${mode === "dark" ? "text-gray-500" : "text-gray-400"}`,
                    children: "PDF or DOCX, max 5MB"
                }, void 0, false, {
                    fileName: "[project]/src/components/DragDropZone.js",
                    lineNumber: 65,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/DragDropZone.js",
            lineNumber: 32,
            columnNumber: 17
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `w-full p-4 border rounded-xl shadow-sm ${mode === "dark" ? "bg-gray-600 border-gray-500" : "bg-gray-50 border-gray-300"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `w-10 h-10 flex justify-center items-center border rounded-lg ${mode === "dark" ? "border-gray-500 text-[#f05d23]" : "border-gray-200 text-[#f05d23]"}`,
                                    children: file.name.endsWith(".pdf") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        icon: "mdi:file-pdf",
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DragDropZone.js",
                                        lineNumber: 81,
                                        columnNumber: 37
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        icon: "mdi:file-word",
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DragDropZone.js",
                                        lineNumber: 83,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DragDropZone.js",
                                    lineNumber: 75,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm font-medium truncate max-w-[200px] ${mode === "dark" ? "text-white" : "text-[#231812]"}`,
                                            children: file.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DragDropZone.js",
                                            lineNumber: 87,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`,
                                            children: [
                                                (file.size / 1024).toFixed(2),
                                                " KB"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DragDropZone.js",
                                            lineNumber: 94,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DragDropZone.js",
                                    lineNumber: 86,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DragDropZone.js",
                            lineNumber: 74,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>removeFile(type),
                            className: `transition ${mode === "dark" ? "text-gray-300 hover:text-[#f05d23]" : "text-gray-500 hover:text-[#f05d23]"}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                icon: "mdi:trash-can-outline",
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DragDropZone.js",
                                lineNumber: 109,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/DragDropZone.js",
                            lineNumber: 103,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DragDropZone.js",
                    lineNumber: 73,
                    columnNumber: 21
                }, this),
                isSubmitting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-full h-2 rounded-full overflow-hidden ${mode === "dark" ? "bg-gray-700" : "bg-gray-200"}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-[#f05d23] rounded-full transition-all duration-500",
                                style: {
                                    width: `${uploadProgress[type]}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/DragDropZone.js",
                                lineNumber: 119,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/DragDropZone.js",
                            lineNumber: 114,
                            columnNumber: 29
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 text-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm ${mode === "dark" ? "text-white" : "text-[#231812]"}`,
                                children: [
                                    uploadProgress[type],
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DragDropZone.js",
                                lineNumber: 125,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/DragDropZone.js",
                            lineNumber: 124,
                            columnNumber: 29
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DragDropZone.js",
                    lineNumber: 113,
                    columnNumber: 25
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/DragDropZone.js",
            lineNumber: 68,
            columnNumber: 17
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/DragDropZone.js",
        lineNumber: 19,
        columnNumber: 9
    }, this);
}
_c = DragDropZone;
var _c;
__turbopack_refresh__.register(_c, "DragDropZone");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Step3Documents.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/Step3Documents.js
__turbopack_esm__({
    "default": (()=>Step3Documents)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DragDropZone$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/DragDropZone.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
;
;
;
function Step3Documents({ formData, setFormData, isSubmitting, uploadProgress, setUploadProgress, mode, ...fileUploadProps }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-fade-in max-w-2xl mx-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                            icon: "mdi:upload",
                            className: "w-8 h-8 text-[#f05d23] mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Step3Documents.js",
                            lineNumber: 22,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-bold text-center",
                            children: "Submit Your Documents"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Step3Documents.js",
                            lineNumber: 23,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Step3Documents.js",
                    lineNumber: 21,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `text-center mb-8 italic ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`,
                    children: "Please upload both your resume and cover letter to complete your application. Both fields are required."
                }, void 0, false, {
                    fileName: "[project]/src/components/Step3Documents.js",
                    lineNumber: 25,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DragDropZone$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            type: "resume",
                            file: formData.resume,
                            isDragging: fileUploadProps.isDraggingResume,
                            uploadProgress: uploadProgress,
                            isSubmitting: isSubmitting,
                            setFormData: setFormData,
                            setUploadProgress: setUploadProgress,
                            mode: mode,
                            required: true,
                            ...fileUploadProps
                        }, void 0, false, {
                            fileName: "[project]/src/components/Step3Documents.js",
                            lineNumber: 33,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DragDropZone$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            type: "coverLetter",
                            file: formData.coverLetter,
                            isDragging: fileUploadProps.isDraggingCoverLetter,
                            uploadProgress: uploadProgress,
                            isSubmitting: isSubmitting,
                            setFormData: setFormData,
                            setUploadProgress: setUploadProgress,
                            mode: mode,
                            required: true,
                            ...fileUploadProps
                        }, void 0, false, {
                            fileName: "[project]/src/components/Step3Documents.js",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Step3Documents.js",
                    lineNumber: 32,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Step3Documents.js",
            lineNumber: 16,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Step3Documents.js",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
_c = Step3Documents;
var _c;
__turbopack_refresh__.register(_c, "Step3Documents");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Step4Confirmation.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/Step4Confirmation.js
__turbopack_esm__({
    "default": (()=>Step4Confirmation)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/canvas-confetti/dist/confetti.module.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
;
function Step4Confirmation({ formData, submissionStatus, mode }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Step4Confirmation.useEffect": ()=>{
            if (submissionStatus?.success) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])({
                    particleCount: 100,
                    spread: 70,
                    origin: {
                        y: 0.6
                    },
                    colors: [
                        "#f05d23",
                        "#231812",
                        "#d94f1e"
                    ]
                });
            }
        }
    }["Step4Confirmation.useEffect"], [
        submissionStatus
    ]);
    // Calculate percentage
    const percentage = submissionStatus?.success ? Math.round(submissionStatus.score / 190 * 100) : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-fade-in max-w-2xl mx-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] ${mode === "dark" ? "bg-gray-800" : "bg-white"}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                        icon: submissionStatus.success ? "mdi:check-circle" : "mdi:alert-circle",
                        className: `w-16 h-16 mx-auto mb-4 animate-bounce ${submissionStatus.success ? "text-[#f05d23]" : "text-red-500"}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/Step4Confirmation.js",
                        lineNumber: 29,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: `text-3xl font-bold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`,
                        children: submissionStatus.success ? `Thank You, ${formData.fullName}!` : "Submission Failed"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Step4Confirmation.js",
                        lineNumber: 35,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-lg mb-4 ${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`,
                        children: submissionStatus.success ? "Your application has been successfully submitted." : "Something went wrong. Please try again."
                    }, void 0, false, {
                        fileName: "[project]/src/components/Step4Confirmation.js",
                        lineNumber: 44,
                        columnNumber: 21
                    }, this),
                    submissionStatus.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-semibold text-[#f05d23] mb-6",
                                children: [
                                    "Your Score: ",
                                    submissionStatus.score,
                                    "/190 (",
                                    percentage,
                                    "%)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Step4Confirmation.js",
                                lineNumber: 55,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-sm max-w-md mx-auto ${mode === "dark" ? "text-gray-400" : "text-[#231812]"}`,
                                children: [
                                    "We’ve sent a confirmation email to ",
                                    formData.email,
                                    ". Please check your inbox (and spam folder) for further details."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Step4Confirmation.js",
                                lineNumber: 58,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true),
                    !submissionStatus.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-sm text-red-500 max-w-md mx-auto ${mode === "dark" ? "text-red-400" : ""}`,
                        children: submissionStatus.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/Step4Confirmation.js",
                        lineNumber: 68,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Step4Confirmation.js",
                lineNumber: 28,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Step4Confirmation.js",
            lineNumber: 23,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Step4Confirmation.js",
        lineNumber: 22,
        columnNumber: 9
    }, this);
}
_s(Step4Confirmation, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Step4Confirmation;
var _c;
__turbopack_refresh__.register(_c, "Step4Confirmation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/layouts/footer.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
;
;
;
const Footer = ({ mode })=>{
    const currentYear = new Date().getFullYear(); // Get the current year
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: `${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-[#231812] border-[#231812]"} border-b shadow-lg py-4 md:py-6 px-4 md:px-10 flex flex-col items-center sticky top-0 z-50`,
        style: {
            backgroundImage: 'url(/assets/images/footer-pattern.png)',
            backgroundPosition: 'left',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '50px 100%' // Adjust width to make it slimmer
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center text-white px-24 w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row space-2 text-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        target: "_blank",
                                        href: "https://growthpad.co.ke",
                                        className: "transform transition duration-300 hover:translate-y-[-4px]",
                                        children: "Home |"
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 23,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        target: "_blank",
                                        href: "https://growthpad.co.ke/gdc-trainings/",
                                        className: "transform transition duration-300 hover:translate-y-[-4px]",
                                        children: "Trainings |"
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 30,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        target: "_blank",
                                        href: "https://growthpad.co.ke",
                                        className: "transform transition duration-300 hover:translate-y-[-4px]",
                                        children: "Careers |"
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 37,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        target: "_blank",
                                        href: "https://growthpad.co.ke",
                                        className: "transform transition duration-300 hover:translate-y-[-4px]",
                                        children: "Insights |"
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 44,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        target: "_blank",
                                        href: "https://growthpad.co.ke",
                                        className: "relative transform transition duration-300 hover:translate-y-[-4px]",
                                        children: [
                                            "Tenders",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sup", {
                                                className: "relative md:absolute -top-3 -right-3 bg-[#F05D23] text-white text-xs px-2 rounded",
                                                children: "New"
                                            }, void 0, false, {
                                                fileName: "[project]/src/layouts/footer.js",
                                                lineNumber: 57,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 51,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/layouts/footer.js",
                                lineNumber: 22,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base mt-6 mb-4",
                                children: [
                                    "7th Floor, Mitsumi Business Park,",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 65,
                                        columnNumber: 58
                                    }, this),
                                    "Westlands – Nairobi, Kenya ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 66,
                                        columnNumber: 52
                                    }, this),
                                    "P.O. Box 1093-00606"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/layouts/footer.js",
                                lineNumber: 64,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-4 sm:space-x-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://x.com/growthpadEA",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "transform transition duration-300 hover:-translate-y-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "fa6-brands:square-x-twitter",
                                            width: 30,
                                            height: 30,
                                            className: "text-gray-300"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 78,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 72,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://www.youtube.com/channel/UCDGqgoqam13s-e8BAw5xkCQ",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "transform transition duration-300 hover:-translate-y-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:youtube",
                                            width: 30,
                                            height: 30,
                                            className: "text-gray-300"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 87,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 81,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://ke.linkedin.com/company/growthpad-consulting",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "transform transition duration-300 hover:-translate-y-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:linkedin",
                                            width: 30,
                                            height: 30,
                                            className: "text-gray-300"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 96,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 90,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://www.facebook.com/growthpadconsulting/",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "transform transition duration-300 hover:-translate-y-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:facebook",
                                            width: 30,
                                            height: 30,
                                            className: "text-gray-300"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 105,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/layouts/footer.js",
                                        lineNumber: 99,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/layouts/footer.js",
                                lineNumber: 70,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/layouts/footer.js",
                        lineNumber: 21,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:block relative -top-20 right-0 bottom-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/assets/images/footer-image.png",
                            alt: "Growthpad Logo",
                            width: 500,
                            height: 40
                        }, void 0, false, {
                            fileName: "[project]/src/layouts/footer.js",
                            lineNumber: 111,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/layouts/footer.js",
                        lineNumber: 110,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/layouts/footer.js",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full justify-between items-center px-24 mt-4 text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-base",
                            children: [
                                "© ",
                                currentYear,
                                " Growthpad Consulting Group. Made with ♡ in",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "cursor-default",
                                            children: "Nairobi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 126,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-[-110%] left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-150%] group-hover:opacity-100",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/assets/images/kenya.gif",
                                                alt: "Nairobi Flag",
                                                width: 30,
                                                height: 30,
                                                className: "absolute top-0 left-0"
                                            }, void 0, false, {
                                                fileName: "[project]/src/layouts/footer.js",
                                                lineNumber: 130,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 128,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/layouts/footer.js",
                                    lineNumber: 125,
                                    columnNumber: 25
                                }, this),
                                " ",
                                "x",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "cursor-default",
                                            children: "Accra"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 141,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-[-110%] left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-150%] group-hover:opacity-100",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/assets/images/ghana.gif",
                                                alt: "Accra Flag",
                                                width: 30,
                                                height: 30,
                                                className: "absolute top-0 left-0"
                                            }, void 0, false, {
                                                fileName: "[project]/src/layouts/footer.js",
                                                lineNumber: 144,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/layouts/footer.js",
                                            lineNumber: 143,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/layouts/footer.js",
                                    lineNumber: 140,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/layouts/footer.js",
                            lineNumber: 123,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/layouts/footer.js",
                        lineNumber: 122,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex flex-col items-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://growthpad.co.ke",
                            target: "_blank",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                src: mode === "dark" ? "/assets/images/logo-tagline-white.svg" : "/assets/images/logo-tagline-white-orange.svg",
                                alt: "Growthpad Logo",
                                width: 300,
                                height: 40
                            }, void 0, false, {
                                fileName: "[project]/src/layouts/footer.js",
                                lineNumber: 158,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/layouts/footer.js",
                            lineNumber: 157,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/layouts/footer.js",
                        lineNumber: 156,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/layouts/footer.js",
                lineNumber: 121,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/layouts/footer.js",
        lineNumber: 8,
        columnNumber: 9
    }, this);
};
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_refresh__.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/pages/interview.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/pages/interview.js
__turbopack_esm__({
    "default": (()=>InterviewPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/data/questions.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layouts$2f$header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/layouts/header.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-hot-toast/dist/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFormData$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/hooks/useFormData.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFileUpload$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/hooks/useFileUpload.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step1Form$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Step1Form.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step2Questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Step2Questions.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step3Documents$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Step3Documents.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step4Confirmation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Step4Confirmation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layouts$2f$footer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/layouts/footer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
function InterviewPage({ mode, toggleMode }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [uploadProgress, setUploadProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        resume: 0,
        coverLetter: 0
    });
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false); // New state for client-side check
    const { formData, setFormData, submissionStatus, setSubmissionStatus, handleChange, handleOptionToggle, fileToBase64 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFormData$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useFormData"])();
    // Set opening from query parameter on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InterviewPage.useEffect": ()=>{
            setIsClient(true); // Set client-side flag after mount
            const opening = router.query.opening;
            if (opening && !formData.opening) {
                setFormData({
                    "InterviewPage.useEffect": (prev)=>({
                            ...prev,
                            opening: decodeURIComponent(opening)
                        })
                }["InterviewPage.useEffect"]);
            }
        }
    }["InterviewPage.useEffect"], [
        router.query.opening,
        formData.opening,
        setFormData
    ]);
    const fileUploadProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFileUpload$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useFileUpload"])(formData, setFormData);
    const questionsPerPage = 5;
    const totalPages = Math.ceil(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__["questions"].length / questionsPerPage);
    const totalQuestions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__["questions"].length; // 19
    const currentQuestions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__["questions"].slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
    const handleNext = async ()=>{
        if (step === 1) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
            if (!formData.fullName || !formData.email || !formData.phone || !formData.linkedin) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Please fill out all required fields.", {
                    icon: "⚠️"
                });
                return;
            }
            if (!emailRegex.test(formData.email)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Please enter a valid email (e.g., hello@gmail.com)", {
                    icon: "⚠️"
                });
                return;
            }
            if (!urlRegex.test(formData.linkedin)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Please enter a valid URL for LinkedIn (e.g., https://example.com)", {
                    icon: "⚠️"
                });
                return;
            }
            setStep(2);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success("Great! Let’s move to the questions.", {
                icon: "🎉"
            });
        } else if (step === 2) {
            if (!isPageComplete()) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Please answer all questions on this page.", {
                    icon: "⚠️"
                });
                return;
            }
            if (currentPage < totalPages - 1) {
                handleNextPage();
            } else {
                setStep(3);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success("All questions completed! Upload your documents next.", {
                    icon: "📝"
                });
            }
        } else if (step === 3) {
            setIsSubmitting(true);
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            if (!formData.resume || !formData.coverLetter) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Please upload both your resume and cover letter.", {
                    icon: "⚠️"
                });
                setIsSubmitting(false);
                return;
            }
            if (formData.resume && formData.resume.size > maxFileSize) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Resume file size exceeds 5MB limit.", {
                    icon: "⚠️"
                });
                setIsSubmitting(false);
                return;
            }
            if (formData.coverLetter && formData.coverLetter.size > maxFileSize) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Cover letter file size exceeds 5MB limit.", {
                    icon: "⚠️"
                });
                setIsSubmitting(false);
                return;
            }
            const dataToSend = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                linkedin: formData.linkedin,
                opening: formData.opening,
                answers: formData.answers,
                resume: formData.resume ? await fileToBase64(formData.resume) : null,
                coverLetter: formData.coverLetter ? await fileToBase64(formData.coverLetter) : null
            };
            console.log("Data to send:", {
                ...dataToSend,
                resume: dataToSend.resume ? "present" : "none",
                coverLetter: dataToSend.coverLetter ? "present" : "none"
            });
            const submitToast = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].loading("Submitting your application...");
            const simulateProgress = ()=>{
                let progress = 0;
                const interval = setInterval(()=>{
                    progress += 10;
                    setUploadProgress({
                        resume: formData.resume ? Math.min(progress, 100) : 0,
                        coverLetter: formData.coverLetter ? Math.min(progress, 100) : 0
                    });
                    if (progress >= 100) clearInterval(interval);
                }, 200);
                return interval;
            };
            const progressInterval = simulateProgress();
            try {
                const response = await fetch("/api/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataToSend)
                });
                const result = await response.json();
                if (response.ok) {
                    clearInterval(progressInterval);
                    setUploadProgress({
                        resume: 100,
                        coverLetter: 100
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success("Submission successful!", {
                        id: submitToast,
                        icon: "✅"
                    });
                    setSubmissionStatus({
                        success: true,
                        score: result.score
                    });
                    setStep(4);
                } else {
                    throw new Error(result.error || "Unknown error");
                }
            } catch (error) {
                clearInterval(progressInterval);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error(`Submission failed: ${error.message}`, {
                    id: submitToast,
                    icon: "❌"
                });
                setSubmissionStatus({
                    success: false,
                    message: error.message
                });
            } finally{
                setIsSubmitting(false);
            }
        }
    };
    const handleBack = ()=>{
        if (step === 2 && currentPage > 0) {
            setCurrentPage(currentPage - 1);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])("Going back to the previous set...", {
                icon: "⬅️"
            });
        } else if (step > 1) {
            setStep(step - 1);
            setUploadProgress({
                resume: 0,
                coverLetter: 0
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])("Returning to the previous step...", {
                icon: "⬅️"
            });
        }
    };
    const handleNextPage = ()=>{
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])("Moving to the next set of questions...", {
                icon: "➡️"
            });
        }
    };
    const handleQuestionsComplete = ()=>{
        setStep(3);
        setUploadProgress({
            resume: 0,
            coverLetter: 0
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].success("All questions completed! Upload your documents next.", {
            icon: "📝"
        });
    };
    const isPageComplete = ()=>currentQuestions.every((q)=>formData.answers[q.id - 1]?.length > 0);
    const isStep1Complete = formData.fullName && formData.email;
    const answeredQuestions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__["questions"].filter((q)=>formData.answers[q.id - 1]?.length > 0).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layouts$2f$header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                mode: mode,
                toggleMode: toggleMode,
                step: step,
                currentPage: currentPage,
                totalPages: totalPages,
                uploadProgress: uploadProgress,
                answeredQuestions: answeredQuestions,
                totalQuestions: totalQuestions,
                isStep1Complete: isStep1Complete
            }, void 0, false, {
                fileName: "[project]/src/pages/interview.js",
                lineNumber: 182,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `min-h-screen flex flex-col justify-center items-center ${mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-100 to-gray-200"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-3xl w-full mx-auto p-6",
                    children: [
                        isClient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Toaster"], {
                            position: "top-right",
                            reverseOrder: false
                        }, void 0, false, {
                            fileName: "[project]/src/pages/interview.js",
                            lineNumber: 200,
                            columnNumber: 34
                        }, this),
                        step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step1Form$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            formData: formData,
                            handleChange: handleChange,
                            mode: mode
                        }, void 0, false, {
                            fileName: "[project]/src/pages/interview.js",
                            lineNumber: 201,
                            columnNumber: 36
                        }, this),
                        step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step2Questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            formData: formData,
                            handleOptionToggle: handleOptionToggle,
                            currentPage: currentPage,
                            questionsPerPage: questionsPerPage,
                            questions: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$questions$2e$js__$5b$client$5d$__$28$ecmascript$29$__["questions"],
                            handleNextPage: handleNextPage,
                            totalPages: totalPages,
                            onComplete: handleQuestionsComplete,
                            mode: mode
                        }, void 0, false, {
                            fileName: "[project]/src/pages/interview.js",
                            lineNumber: 203,
                            columnNumber: 25
                        }, this),
                        step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step3Documents$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            formData: formData,
                            setFormData: setFormData,
                            isSubmitting: isSubmitting,
                            uploadProgress: uploadProgress,
                            setUploadProgress: setUploadProgress,
                            mode: mode,
                            ...fileUploadProps
                        }, void 0, false, {
                            fileName: "[project]/src/pages/interview.js",
                            lineNumber: 216,
                            columnNumber: 25
                        }, this),
                        step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Step4Confirmation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            formData: formData,
                            submissionStatus: submissionStatus,
                            mode: mode
                        }, void 0, false, {
                            fileName: "[project]/src/pages/interview.js",
                            lineNumber: 226,
                            columnNumber: 36
                        }, this),
                        step !== 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex justify-between items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleBack,
                                    disabled: step === 1 || isSubmitting,
                                    className: `flex items-center justify-center px-4 py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-500 disabled:text-gray-300 transition-all duration-200 shadow-md ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-400 text-white"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:arrow-left",
                                            className: "mr-2 w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/interview.js",
                                            lineNumber: 236,
                                            columnNumber: 33
                                        }, this),
                                        "Back"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/interview.js",
                                    lineNumber: 229,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleNext,
                                    disabled: step === 2 && !isPageComplete() || isSubmitting,
                                    className: `flex items-center justify-center px-4 py-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] disabled:bg-gray-300 disabled:text-gray-600 transition-all duration-200 shadow-md`,
                                    children: step === 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Submit",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                icon: "mdi:send",
                                                className: "ml-2 w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/interview.js",
                                                lineNumber: 247,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Next",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                icon: "mdi:arrow-right",
                                                className: "ml-2 w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/interview.js",
                                                lineNumber: 252,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/interview.js",
                                    lineNumber: 239,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/interview.js",
                            lineNumber: 228,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/interview.js",
                    lineNumber: 198,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/interview.js",
                lineNumber: 193,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layouts$2f$footer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                mode: mode
            }, void 0, false, {
                fileName: "[project]/src/pages/interview.js",
                lineNumber: 260,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_s(InterviewPage, "uQIPYyVqFuPAtsoY8Pp7WK6iojk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFormData$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useFormData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFileUpload$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useFileUpload"]
    ];
});
_c = InterviewPage;
var _c;
__turbopack_refresh__.register(_c, "InterviewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/interview.js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const PAGE_PATH = "/interview";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_require__("[project]/src/pages/interview.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}}),
"[project]/src/pages/interview (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_require__("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/interview.js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__6f9abd._.js.map