import { supabase } from '../config/supabase';

interface InviteCode {
  code: string;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

export const validateInviteCode = async (code: string): Promise<{ 
  valid: boolean; 
  message: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error('Error validating invite code:', error);
      throw new Error('Error validating invite code');
    }

    if (!data) {
      return { 
        valid: false, 
        message: 'Invalid invite code' 
      };
    }

    if (data.used) {
      return { 
        valid: false, 
        message: 'This invite code has already been used' 
      };
    }

    return { 
      valid: true, 
      message: 'Valid invite code' 
    };
  } catch (error) {
    console.error('Error validating invite code:', error);
    return { 
      valid: false, 
      message: 'Error validating invite code. Please try again.' 
    };
  }
};

export const markInviteCodeAsUsed = async (code: string, userId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { error } = await supabase
      .from('invite_codes')
      .update({ 
        used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('code', code.toUpperCase());

    if (error) {
      console.error('Error marking invite code as used:', error);
      throw error;
    }

    return {
      success: true,
      message: 'Invite code successfully used'
    };
  } catch (error) {
    console.error('Error marking invite code as used:', error);
    return {
      success: false,
      message: 'Error processing invite code. Please try again.'
    };
  }
};