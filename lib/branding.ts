import { supabase } from '@/integrations/supabase/client';
import { getSupabaseServer } from '@/lib/supabase/server-client';
import { CompanyBranding } from '@/integrations/supabase/types';

// Default branding configuration
export const DEFAULT_BRANDING: Partial<CompanyBranding> = {
  company_name: 'Your Company Name',
  tagline: 'Professional Services',
  primary_color: '#000000',
  secondary_color: '#6B7280',
  accent_color: '#3B82F6',
  background_color: '#FFFFFF',
  text_color: '#1F2937',
  footer_text: 'Thank you for your business!',
  contact_email: 'info@yourcompany.com',
};

/**
 * Client-side function to get company branding for the current user
 */
export async function getCompanyBranding(userId: string): Promise<CompanyBranding | null> {
  try {
    const { data, error } = await supabase
      .from('company_branding')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No branding found, return null
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching company branding:', error);
    throw error;
  }
}

/**
 * Server-side function to get company branding for a user
 */
export async function getCompanyBrandingServer(userId: string): Promise<CompanyBranding | null> {
  try {
    const supabaseServer = getSupabaseServer();
    
    const { data, error } = await supabaseServer
      .from('company_branding')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No branding found, return null
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching company branding (server):', error);
    throw error;
  }
}

/**
 * Get company branding with fallback to defaults
 */
export async function getCompanyBrandingWithDefaults(userId: string): Promise<CompanyBranding> {
  const branding = await getCompanyBranding(userId);
  
  if (!branding) {
    // Return default branding with required fields
    return {
      id: '',
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...DEFAULT_BRANDING,
    } as CompanyBranding;
  }

  // Fill in any missing fields with defaults
  return {
    ...DEFAULT_BRANDING,
    ...branding,
  };
}

/**
 * Server-side function to get company branding with fallback to defaults
 */
export async function getCompanyBrandingWithDefaultsServer(userId: string): Promise<CompanyBranding> {
  const branding = await getCompanyBrandingServer(userId);
  
  if (!branding) {
    // Return default branding with required fields
    return {
      id: '',
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...DEFAULT_BRANDING,
    } as CompanyBranding;
  }

  // Fill in any missing fields with defaults
  return {
    ...DEFAULT_BRANDING,
    ...branding,
  };
}

/**
 * Create or update company branding
 */
export async function upsertCompanyBranding(
  userId: string,
  brandingData: Partial<CompanyBranding>
): Promise<CompanyBranding> {
  try {
    // Remove fields that shouldn't be updated
    const { id, created_at, updated_at, user_id, ...updateData } = brandingData;

    const { data, error } = await supabase
      .from('company_branding')
      .upsert(
        {
          user_id: userId,
          ...updateData,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error upserting company branding:', error);
    throw error;
  }
}

/**
 * Delete company branding (revert to defaults)
 */
export async function deleteCompanyBranding(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('company_branding')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting company branding:', error);
    throw error;
  }
}

/**
 * Upload logo to storage and update branding
 */
export async function uploadLogo(
  userId: string,
  file: File
): Promise<string> {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/logo.${fileExt}`;

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}

/**
 * Remove logo from storage and update branding
 */
export async function removeLogo(userId: string): Promise<void> {
  try {
    // List files in user's folder
    const { data: files, error: listError } = await supabase.storage
      .from('company-logos')
      .list(userId);

    if (listError) throw listError;

    if (files && files.length > 0) {
      // Remove all logo files for the user
      const filePaths = files.map(file => `${userId}/${file.name}`);
      
      const { error: removeError } = await supabase.storage
        .from('company-logos')
        .remove(filePaths);

      if (removeError) throw removeError;
    }

    // Update branding to remove logo URL
    await upsertCompanyBranding(userId, { logo_url: null });
  } catch (error) {
    console.error('Error removing logo:', error);
    throw error;
  }
}

/**
 * Validate color hex code
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validate branding data
 */
export function validateBrandingData(data: Partial<CompanyBranding>): string[] {
  const errors: string[] = [];

  if (data.primary_color && !isValidHexColor(data.primary_color)) {
    errors.push('Primary color must be a valid hex color (e.g., #000000)');
  }

  if (data.secondary_color && !isValidHexColor(data.secondary_color)) {
    errors.push('Secondary color must be a valid hex color (e.g., #6B7280)');
  }

  if (data.accent_color && !isValidHexColor(data.accent_color)) {
    errors.push('Accent color must be a valid hex color (e.g., #3B82F6)');
  }

  if (data.background_color && !isValidHexColor(data.background_color)) {
    errors.push('Background color must be a valid hex color (e.g., #FFFFFF)');
  }

  if (data.text_color && !isValidHexColor(data.text_color)) {
    errors.push('Text color must be a valid hex color (e.g., #1F2937)');
  }

  if (data.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
    errors.push('Contact email must be a valid email address');
  }

  if (data.website_url && !/^https?:\/\/.+\..+/.test(data.website_url)) {
    errors.push('Website URL must be a valid URL starting with http:// or https://');
  }

  return errors;
}