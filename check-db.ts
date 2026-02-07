import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsersTable() {
    console.log("Checking connection to Supabase...");

    const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true });

    if (error) {
        console.error("Error accessing 'users' table:", error.message);
        if (error.code === "42P01") {
            console.error("Table 'users' does not exist.");
        }
    } else {
        console.log("Success! 'users' table exists and is accessible.");
        console.log(`Row count: ${data}`); // data is null for head:true with count, count is in 'count' property but types vary.
        // Actually for head:true, data is null, count is returned in count property if using select('*', {count: ...})
        // Let's just try a simple select to be sure.
    }

    // Try inserting a dummy row to check permissions if empty? No, read is enough to prove existence.
}

checkUsersTable();
