

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const hasValidCredentials = supabaseUrl?.startsWith('http') && supabaseKey && !supabaseUrl.includes('your_supabase');

if (!hasValidCredentials) {
  console.warn('Warning: Valid Supabase credentials not found; game history is disabled');
}

const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseKey) : null;

module.exports = supabase;
