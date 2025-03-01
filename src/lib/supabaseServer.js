// lib/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://monmftrotnvyuaqtvuwl.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbm1mdHJvdG52eXVhcXR2dXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDU4ODU5NywiZXhwIjoyMDU2MTY0NTk3fQ.-_SnuADVAhHSBFQ6Ff5KKD3zfcEXNrYgYka9VUyVrng";

console.log("Hardcoded Supabase URL (server):", supabaseUrl);
console.log("Hardcoded Supabase Service Key (server):", supabaseServiceKey ? "Present" : "Missing");

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);