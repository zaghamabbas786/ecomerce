import { createClient } from '@supabase/supabase-js';

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Please define NEXT_PUBLIC_SUPABASE_URL environment variable');
}

// Use service role key if available (for server-side operations), otherwise use anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseKey) {
  throw new Error('Please define either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with service role key (preferred) or anon key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Connection test function
export async function connectDB() {
  try {
    // Test connection by querying a simple table
    const { error } = await supabase.from('users').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "relation does not exist" - table might not be created yet
      console.warn('Database connection test:', error.message);
    }
    
    return supabase;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
