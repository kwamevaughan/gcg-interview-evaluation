import { createClient } from "@supabase/supabase-js";

// Use private server-side variable (do NOT use NEXT_PUBLIC_* on the server-side)
const supabaseUrl = process.env.SUPABASE_URL; // Use a private URL for server-side
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        "Supabase server configuration missing: Ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in the environment variables. " +
        "Current values - URL: " + (supabaseUrl || "undefined") + ", Service Key: " + (supabaseServiceKey ? "Present" : "Missing")
    );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
