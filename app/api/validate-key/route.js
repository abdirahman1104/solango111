import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        message: 'API key is required' 
      }, { status: 400 });
    }

    // Log the API key being checked (for debugging)
    console.log('Checking API key:', apiKey);

    // Check if the API key exists in the api_keys table
    const { data: apiKeyData, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey) // Using 'key' as the column name
      .single();

    // Log the result (for debugging)
    console.log('Supabase response:', { data: apiKeyData, error });

    if (error || !apiKeyData) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid API key',
        debug: { error, data: apiKeyData }
      }, { status: 401 });
    }

    // Check if the API key is active
    if (apiKeyData.active === false) { // Explicitly check for false
      return NextResponse.json({ 
        success: false, 
        message: 'API key is disabled' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Valid API key',
      apiKey: apiKeyData
    }, { status: 200 });

  } catch (error) {
    console.error('API validation error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error validating API key',
      debug: error.message
    }, { status: 500 });
  }
}
