import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'API key is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the API key exists and is active in the api_keys table
    const { data: apiKeyData, error } = await supabase
      .from('api_keys')
      .select('id, key_name, is_active')
      .eq('api_key', apiKey)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Error validating API key' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (apiKeyData && apiKeyData.is_active) {
      return new Response(JSON.stringify({ 
        success: true,
        message: `API key '${apiKeyData.key_name}' validated successfully`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: apiKeyData ? 'API key is disabled' : 'Invalid API key' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('API validation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Server error during validation' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
