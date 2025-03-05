// lib/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

// Load Supabase URL and Service Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Key is missing in environment variables");
}

console.log("Supabase URL (server):", supabaseUrl);
console.log("Supabase Service Key (server):", supabaseServiceKey ? "Present" : "Missing");

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
