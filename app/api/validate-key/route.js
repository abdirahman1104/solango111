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

    // Check if the API key exists and is active in the api_keys table
    const { data: apiKeyData, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error || !apiKeyData) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid API key' 
      }, { status: 401 });
    }

    // Check if the API key is enabled
    if (!apiKeyData.enabled) {
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
      message: 'Error validating API key' 
    }, { status: 500 });
  }
}
