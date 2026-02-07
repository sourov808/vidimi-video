import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log("Checking columns...");
    // Try to select a single row to see properties
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Error:", error);
    } else if (data && data.length > 0) {
        console.log("Columns found:", Object.keys(data[0]));
    } else {
        console.log("Table accessible but empty. Cannot infer columns from data.");
        // Try selecting 'creadit' specifically to see if it errors
        const { error: creditError } = await supabase.from("users").select("creadit").limit(1);
        if (!creditError) console.log("Column 'creadit' EXISTS.");
        else console.log("Column 'creadit' error:", creditError.message);

        const { error: creditCorrectError } = await supabase.from("users").select("credit").limit(1);
        if (!creditCorrectError) console.log("Column 'credit' EXISTS.");
        else console.log("Column 'credit' error:", creditCorrectError.message);
        // Check for 'role'
        const { error: roleError } = await supabase.from("users").select("role").limit(1);
        if (!roleError) console.log("Column 'role' EXISTS.");
        else console.log("Column 'role' missing:", roleError.message);

        // Check for 'plan' or 'subscription'
        const { error: planError } = await supabase.from("users").select("plan").limit(1);
        if (!planError) console.log("Column 'plan' EXISTS.");
        else console.log("Column 'plan' missing:", planError.message);

        const { error: subError } = await supabase.from("users").select("subscription").limit(1);
        if (!subError) console.log("Column 'subscription' EXISTS.");
        else console.log("Column 'subscription' missing:", subError.message);
    }
}

checkColumns();
