import { supabase } from '../lib/supabase';
import { Asset, AssetType } from '../types/asset';

export type AssetError = {
  message: string;
  code?: string;
};

/**
 * Get all assets for a project
 */
export async function getProjectAssets(
  projectId: string
): Promise<{ assets: Asset[]; error: AssetError | null }> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      return { assets: [], error: { message: error.message, code: error.code } };
    }

    return { assets: data as Asset[], error: null };
  } catch (error) {
    console.error('Get project assets error:', error);
    return { assets: [], error: { message: 'An unexpected error occurred while fetching assets' } };
  }
}

/**
 * Upload an asset
 */
export async function uploadAsset(
  projectId: string,
  file: File,
  type: AssetType
): Promise<{ asset: Asset | null; error: AssetError | null }> {
  try {
    // Generate a unique file path
    const filePath = `projects/${projectId}/${Date.now()}_${file.name}`;
    
    // Upload the file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);
    
    if (uploadError) {
      return { asset: null, error: { message: uploadError.message } };
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage.from('assets').getPublicUrl(filePath);
    const url = urlData.publicUrl;
    
    // Create an asset record
    const { data, error } = await supabase
      .from('assets')
      .insert({
        project_id: projectId,
        type,
        url,
        name: file.name,
        size: file.size,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      // If there's an error creating the record, delete the uploaded file
      await supabase.storage.from('assets').remove([filePath]);
      return { asset: null, error: { message: error.message, code: error.code } };
    }
    
    return { asset: data as Asset, error: null };
  } catch (error) {
    console.error('Upload asset error:', error);
    return { asset: null, error: { message: 'An unexpected error occurred while uploading the asset' } };
  }
}

/**
 * Delete an asset
 */
export async function deleteAsset(
  assetId: string
): Promise<{ error: AssetError | null }> {
  try {
    // Get the asset to find the file path
    const { data: asset, error: getError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .single();
    
    if (getError) {
      return { error: { message: getError.message, code: getError.code } };
    }
    
    // Extract the file path from the URL
    const url = new URL(asset.url);
    const filePath = url.pathname.split('/').slice(2).join('/');
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('assets')
      .remove([filePath]);
    
    if (storageError) {
      console.error('Delete asset storage error:', storageError);
      // Continue with deleting the record even if storage deletion fails
    }
    
    // Delete the asset record
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', assetId);
    
    if (error) {
      return { error: { message: error.message, code: error.code } };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Delete asset error:', error);
    return { error: { message: 'An unexpected error occurred while deleting the asset' } };
  }
}

