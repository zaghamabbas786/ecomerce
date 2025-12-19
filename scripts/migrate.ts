import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function migrate() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
    }

    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    if (!supabaseKey) {
      throw new Error('Either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
    }

    // Use service role key if available for migrations
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('🚀 Starting database migration...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);

    // Read the SQL schema file
    const schemaPath = join(process.cwd(), 'lib', 'schema.sql');
    const sql = readFileSync(schemaPath, 'utf-8');

    console.log('📄 Read schema file');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements and comments
      if (!statement || statement.startsWith('--')) continue;

      try {
        // Use RPC to execute SQL (if available) or use direct query
        // Note: Supabase doesn't allow arbitrary SQL execution via client for security
        // This is a fallback - the user should run SQL in the dashboard
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        // For now, we'll just validate the connection
        // The actual SQL needs to be run in Supabase SQL Editor
        if (i === 0) {
          const { error } = await supabase.from('users').select('id').limit(0);
          if (error && error.code === 'PGRST116') {
            console.log('✅ Connection successful, but tables need to be created');
          } else if (error) {
            console.warn('⚠️  Connection test:', error.message);
          } else {
            console.log('✅ Connection successful');
          }
        }
      } catch (error: any) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
      }
    }

    console.log('\n⚠️  IMPORTANT: Supabase client cannot execute arbitrary SQL for security reasons.');
    console.log('📋 Please run the SQL schema manually:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy the contents of lib/schema.sql');
    console.log('   4. Paste and execute it');
    console.log('\n📄 Schema file location: lib/schema.sql');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n📋 Please run the SQL schema manually in Supabase SQL Editor:');
    console.error('   1. Go to: https://supabase.com/dashboard');
    console.error('   2. Select your project');
    console.error('   3. Go to SQL Editor');
    console.error('   4. Copy contents of lib/schema.sql');
    console.error('   5. Paste and execute');
    process.exit(1);
  }
}

migrate();


