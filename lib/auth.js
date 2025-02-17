import { supabase } from './supabase';

/**
 * Creates or updates a user in Supabase after successful OAuth authentication
 */
export const handleSupabaseUser = async ({ user, provider = 'google' }) => {
  if (!user?.email) return null;

  try {
    // First check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // If user exists, update last login
    if (existingUser) {
      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          last_sign_in: new Date().toISOString(),
          name: user.name || existingUser.name, // Update name if provided
          image: user.image || existingUser.image // Update image if provided
        })
        .eq('email', user.email)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    }

    // If user doesn't exist, create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          email: user.email,
          name: user.name,
          image: user.image,
          provider,
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (createError) throw createError;
    return newUser;

  } catch (error) {
    console.error('Error in handleSupabaseUser:', error);
    throw error;
  }
};

/**
 * Gets the current user's data from Supabase
 */
export const getCurrentUser = async (email) => {
  if (!email) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
