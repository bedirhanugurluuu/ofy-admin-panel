import { supabaseAdmin as supabase } from '../config/supabaseAdmin';

export interface IPAddress {
  id: string;
  ip_address: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export const ipWhitelistAPI = {
  // IP listesini getir
  async getIPs(): Promise<IPAddress[]> {
    const { data, error } = await supabase
      .from('allowed_ips')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Yeni IP ekle
  async addIP(ip_address: string, description: string): Promise<IPAddress> {
    const { data, error } = await supabase
      .from('allowed_ips')
      .insert([{ ip_address, description }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // IP sil
  async deleteIP(id: string): Promise<void> {
    const { error } = await supabase
      .from('allowed_ips')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
