// lib/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        "Supabase server configuration missing: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env. " +
        "Current values - URL: " + (supabaseUrl || "undefined") + ", Service Key: " + (supabaseServiceKey ? "Present" : "Missing")
    );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);