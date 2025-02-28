// lib/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for server-side

console.log("Supabase URL (server):", supabaseUrl);
console.log("Supabase Service Key (server):", supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase server configuration missing: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);