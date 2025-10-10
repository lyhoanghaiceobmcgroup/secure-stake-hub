// import { supabase } from "@/integrations/supabase/client";

export interface InvestmentOpportunity {
  id: string;
  company_name: string;
  project_name: string;
  description: string;
  target_rate: number;
  payout_frequency: string;
  min_investment: number;
  total_target: number;
  raised: number;
  sector: string;
  duration: string;
  uy_tin_score: number;
  risk_level: string;
  deadline: string;
  status: string;
  
  // Extended fields
  founded_year?: number;
  employees?: number;
  headquarters?: string;
  website?: string;
  business_description?: string;
  key_achievements?: any;
  leadership?: any;
  financials?: any;
  certifications?: string[];
  partnerships?: string[];
  market_position?: string;
  competitive_advantages?: string[];
  
  timeline?: string;
  expected_roi?: string;
  market_size?: string;
  risk_factors?: string[];
  mitigation_strategies?: string[];
  
  investment_breakdown?: any;
  milestones?: any;
  
  logo_url?: string;
  images?: string[];
  documents?: any;
  
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export const opportunityService = {
  // Fetch all opportunities (mock data until DB tables are created)
  async getAll(): Promise<InvestmentOpportunity[]> {
    // TODO: Uncomment after running SQL migration
    /*
    const { data, error } = await supabase
      .from('investment_opportunities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching opportunities:', error);
      throw error;
    }
    
    return data || [];
    */
    return []; // Return empty array until DB is ready
  },

  // Fetch single opportunity
  async getById(id: string): Promise<InvestmentOpportunity | null> {
    /*
    const { data, error } = await supabase
      .from('investment_opportunities')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching opportunity:', error);
      throw error;
    }
    
    return data;
    */
    return null;
  },

  // Create new opportunity
  async create(opportunity: Partial<InvestmentOpportunity>): Promise<InvestmentOpportunity> {
    /*
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('investment_opportunities')
      .insert({
        ...opportunity,
        created_by: user?.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
    
    return data;
    */
    return { id: Date.now().toString(), ...opportunity } as InvestmentOpportunity;
  },

  // Update opportunity
  async update(id: string, updates: Partial<InvestmentOpportunity>): Promise<InvestmentOpportunity> {
    /*
    const { data, error } = await supabase
      .from('investment_opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating opportunity:', error);
      throw error;
    }
    
    return data;
    */
    return { id, ...updates } as InvestmentOpportunity;
  },

  // Delete opportunity
  async delete(id: string): Promise<void> {
    /*
    const { error } = await supabase
      .from('investment_opportunities')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting opportunity:', error);
      throw error;
    }
    */
  },

  // Track user activity
  async trackActivity(
    opportunityId: string,
    activityType: 'view' | 'bookmark' | 'invest' | 'document_download',
    metadata?: any
  ): Promise<void> {
    /*
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    const { error } = await supabase
      .from('user_investment_activities')
      .insert({
        user_id: user.id,
        opportunity_id: opportunityId,
        activity_type: activityType,
        metadata
      });
    
    if (error) {
      console.error('Error tracking activity:', error);
    }
    */
  },

  // Get user activities (for admin)
  async getUserActivities(userId?: string) {
    /*
    let query = supabase
      .from('user_investment_activities')
      .select(`
        *,
        investment_opportunities(company_name, project_name),
        profiles!user_id(full_name)
      `)
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
    
    return data || [];
    */
    return [];
  },

  // Get activities for a specific opportunity (for admin)
  async getOpportunityActivities(opportunityId: string) {
    /*
    const { data, error } = await supabase
      .from('user_investment_activities')
      .select(`
        *,
        profiles!user_id(full_name, phone)
      `)
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching opportunity activities:', error);
      throw error;
    }
    
    return data || [];
    */
    return [];
  }
};
