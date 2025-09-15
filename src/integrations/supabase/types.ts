export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      app_events: {
        Row: {
          chain_tx_hash: string | null
          created_at: string
          doc_hash: string | null
          event_type: string
          id: string
          payload: Json
          ref_id: string
        }
        Insert: {
          chain_tx_hash?: string | null
          created_at?: string
          doc_hash?: string | null
          event_type: string
          id?: string
          payload: Json
          ref_id: string
        }
        Update: {
          chain_tx_hash?: string | null
          created_at?: string
          doc_hash?: string | null
          event_type?: string
          id?: string
          payload?: Json
          ref_id?: string
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          amount: number
          amount_filled: number | null
          bid_id: string
          created_at: string
          delta_g_min: number | null
          hold_tx_id: string | null
          id: string
          receipt_doc_hash: string | null
          receipt_doc_url: string | null
          round_id: string
          state: Database["public"]["Enums"]["bid_state"]
          type: Database["public"]["Enums"]["bid_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          amount_filled?: number | null
          bid_id: string
          created_at?: string
          delta_g_min?: number | null
          hold_tx_id?: string | null
          id?: string
          receipt_doc_hash?: string | null
          receipt_doc_url?: string | null
          round_id: string
          state?: Database["public"]["Enums"]["bid_state"]
          type: Database["public"]["Enums"]["bid_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          amount_filled?: number | null
          bid_id?: string
          created_at?: string
          delta_g_min?: number | null
          hold_tx_id?: string | null
          id?: string
          receipt_doc_hash?: string | null
          receipt_doc_url?: string | null
          round_id?: string
          state?: Database["public"]["Enums"]["bid_state"]
          type?: Database["public"]["Enums"]["bid_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "auction_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_clear_results: {
        Row: {
          allocation_doc_hash: string | null
          allocation_doc_url: string | null
          created_at: string
          delta_g_clear: number
          id: string
          r_clear: number
          round_id: string
          total_filled: number
        }
        Insert: {
          allocation_doc_hash?: string | null
          allocation_doc_url?: string | null
          created_at?: string
          delta_g_clear: number
          id?: string
          r_clear: number
          round_id: string
          total_filled: number
        }
        Update: {
          allocation_doc_hash?: string | null
          allocation_doc_url?: string | null
          created_at?: string
          delta_g_clear?: number
          id?: string
          r_clear?: number
          round_id?: string
          total_filled?: number
        }
        Relationships: [
          {
            foreignKeyName: "auction_clear_results_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "auction_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_documents: {
        Row: {
          created_at: string
          doc_hash: string
          doc_id: string
          filename: string
          id: string
          round_id: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          doc_hash: string
          doc_id: string
          filename: string
          id?: string
          round_id: string
          type: string
          url: string
        }
        Update: {
          created_at?: string
          doc_hash?: string
          doc_id?: string
          filename?: string
          id?: string
          round_id?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_documents_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "auction_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_rounds: {
        Row: {
          anti_sniping_extend_min: number | null
          anti_sniping_max_extensions: number | null
          anti_sniping_mode: Database["public"]["Enums"]["anti_sniping_mode"]
          anti_sniping_window_min: number | null
          base_rate: number
          company_id: string
          cover_ratio: number
          created_at: string
          decay_factor_a: number
          decay_factor_b: number
          delta_floor: number
          delta_g_clear: number | null
          delta_max: number
          delta_now: number
          end_at: string
          gid: string
          id: string
          investor_cap_pct: number
          lot_size: number
          r_clear: number | null
          raised_amount: number
          round_count: number
          round_id: string
          round_index: number
          start_at: string
          status: Database["public"]["Enums"]["auction_status"]
          target_amount: number
          terms_doc_hash: string | null
          terms_doc_url: string | null
          updated_at: string
        }
        Insert: {
          anti_sniping_extend_min?: number | null
          anti_sniping_max_extensions?: number | null
          anti_sniping_mode?: Database["public"]["Enums"]["anti_sniping_mode"]
          anti_sniping_window_min?: number | null
          base_rate: number
          company_id: string
          cover_ratio?: number
          created_at?: string
          decay_factor_a?: number
          decay_factor_b?: number
          delta_floor?: number
          delta_g_clear?: number | null
          delta_max: number
          delta_now?: number
          end_at: string
          gid: string
          id?: string
          investor_cap_pct?: number
          lot_size?: number
          r_clear?: number | null
          raised_amount?: number
          round_count?: number
          round_id: string
          round_index?: number
          start_at: string
          status?: Database["public"]["Enums"]["auction_status"]
          target_amount: number
          terms_doc_hash?: string | null
          terms_doc_url?: string | null
          updated_at?: string
        }
        Update: {
          anti_sniping_extend_min?: number | null
          anti_sniping_max_extensions?: number | null
          anti_sniping_mode?: Database["public"]["Enums"]["anti_sniping_mode"]
          anti_sniping_window_min?: number | null
          base_rate?: number
          company_id?: string
          cover_ratio?: number
          created_at?: string
          decay_factor_a?: number
          decay_factor_b?: number
          delta_floor?: number
          delta_g_clear?: number | null
          delta_max?: number
          delta_now?: number
          end_at?: string
          gid?: string
          id?: string
          investor_cap_pct?: number
          lot_size?: number
          r_clear?: number | null
          raised_amount?: number
          round_count?: number
          round_id?: string
          round_index?: number
          start_at?: string
          status?: Database["public"]["Enums"]["auction_status"]
          target_amount?: number
          terms_doc_hash?: string | null
          terms_doc_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_auction_rounds_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          actor: string | null
          chain_tx_hash: string | null
          created_at: string
          doc_hash: string | null
          id: string
          payload_digest: string | null
          ref_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          actor?: string | null
          chain_tx_hash?: string | null
          created_at?: string
          doc_hash?: string | null
          id?: string
          payload_digest?: string | null
          ref_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          actor?: string | null
          chain_tx_hash?: string | null
          created_at?: string
          doc_hash?: string | null
          id?: string
          payload_digest?: string | null
          ref_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_id: string
          created_at: string
          id: string
          is_primary: boolean
          is_verified: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          is_verified?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          is_verified?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
        ]
      }
      banks: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          amount: number
          cert_hash: string | null
          cert_pdf_url: string | null
          cqid: string
          created_at: string
          gid: string
          id: string
          intent_id: string
          join_date: string
          qr_url: string | null
          r_base: number
          r_clear: number | null
          status: Database["public"]["Enums"]["certificate_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          cert_hash?: string | null
          cert_pdf_url?: string | null
          cqid: string
          created_at?: string
          gid: string
          id?: string
          intent_id: string
          join_date?: string
          qr_url?: string | null
          r_base: number
          r_clear?: number | null
          status?: Database["public"]["Enums"]["certificate_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          cert_hash?: string | null
          cert_pdf_url?: string | null
          cqid?: string
          created_at?: string
          gid?: string
          id?: string
          intent_id?: string
          join_date?: string
          qr_url?: string | null
          r_base?: number
          r_clear?: number | null
          status?: Database["public"]["Enums"]["certificate_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          g_trust: number | null
          gid: string
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          g_trust?: number | null
          gid: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          g_trust?: number | null
          gid?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          contract_id: string
          created_at: string
          draft_hash: string | null
          draft_pdf_url: string | null
          final_hash: string | null
          final_pdf_url: string | null
          gid: string
          id: string
          intent_id: string
          status: Database["public"]["Enums"]["contract_status"]
          updated_at: string
          user_id: string
          version: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          draft_hash?: string | null
          draft_pdf_url?: string | null
          final_hash?: string | null
          final_pdf_url?: string | null
          gid: string
          id?: string
          intent_id: string
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
          user_id: string
          version?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          draft_hash?: string | null
          draft_pdf_url?: string | null
          final_hash?: string | null
          final_pdf_url?: string | null
          gid?: string
          id?: string
          intent_id?: string
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          doc_hash: string
          file_size: number | null
          file_url: string
          filename: string
          id: string
          mime_type: string | null
          ref_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_hash: string
          file_size?: number | null
          file_url: string
          filename: string
          id?: string
          mime_type?: string | null
          ref_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_hash?: string
          file_size?: number | null
          file_url?: string
          filename?: string
          id?: string
          mime_type?: string | null
          ref_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      esign_sessions: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          provider_ref: string | null
          role: Database["public"]["Enums"]["esign_role"]
          session_id: string
          sign_url: string | null
          status: Database["public"]["Enums"]["esign_status"]
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          provider_ref?: string | null
          role: Database["public"]["Enums"]["esign_role"]
          session_id: string
          sign_url?: string | null
          status?: Database["public"]["Enums"]["esign_status"]
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          provider_ref?: string | null
          role?: Database["public"]["Enums"]["esign_role"]
          session_id?: string
          sign_url?: string | null
          status?: Database["public"]["Enums"]["esign_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esign_sessions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      intent_index: {
        Row: {
          active_intent_id: string
          created_at: string
          gid: string
          user_id: string
        }
        Insert: {
          active_intent_id: string
          created_at?: string
          gid: string
          user_id: string
        }
        Update: {
          active_intent_id?: string
          created_at?: string
          gid?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intent_index_active_intent_id_fkey"
            columns: ["active_intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
      intents: {
        Row: {
          amount: number
          created_at: string
          expires_at: string
          hold_tx_id: string | null
          id: string
          intent_id: string
          opportunity_id: string
          r_clear: number | null
          status: Database["public"]["Enums"]["intent_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at: string
          hold_tx_id?: string | null
          id?: string
          intent_id: string
          opportunity_id: string
          r_clear?: number | null
          status?: Database["public"]["Enums"]["intent_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string
          hold_tx_id?: string | null
          id?: string
          intent_id?: string
          opportunity_id?: string
          r_clear?: number | null
          status?: Database["public"]["Enums"]["intent_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intents_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_verifications: {
        Row: {
          cccd_back_url: string | null
          cccd_front_url: string | null
          created_at: string
          id: string
          rejection_reason: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          cccd_back_url?: string | null
          cccd_front_url?: string | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          cccd_back_url?: string | null
          cccd_front_url?: string | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          auction_end_at: string | null
          auction_start_at: string | null
          company_id: string
          created_at: string
          description: string | null
          gid: string
          id: string
          is_active: boolean
          is_auction: boolean
          max_amount: number | null
          min_amount: number
          payout_schedule: string | null
          r_base: number
          risk_level: number | null
          term_months: number
          title: string
          updated_at: string
        }
        Insert: {
          auction_end_at?: string | null
          auction_start_at?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          gid: string
          id?: string
          is_active?: boolean
          is_auction?: boolean
          max_amount?: number | null
          min_amount: number
          payout_schedule?: string | null
          r_base: number
          risk_level?: number | null
          term_months: number
          title: string
          updated_at?: string
        }
        Update: {
          auction_end_at?: string | null
          auction_start_at?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          gid?: string
          id?: string
          is_active?: boolean
          is_auction?: boolean
          max_amount?: number | null
          min_amount?: number
          payout_schedule?: string | null
          r_base?: number
          risk_level?: number | null
          term_months?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          cccd: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          cccd?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          cccd?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          intent_id: string | null
          reference_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          intent_id?: string | null
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          intent_id?: string | null
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          available_balance: number
          created_at: string
          held_balance: number
          id: string
          total_distributed: number
          total_invested: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          held_balance?: number
          id?: string
          total_distributed?: number
          total_invested?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          held_balance?: number
          id?: string
          total_distributed?: number
          total_invested?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      anti_sniping_mode: "extend" | "snapshot" | "disabled"
      app_role: "admin" | "moderator" | "user"
      auction_status: "draft" | "active" | "clearing" | "cleared" | "cancelled"
      bid_state: "active" | "filled" | "cancelled" | "partial"
      bid_type: "market" | "limit"
      certificate_status: "allocated" | "revoked"
      contract_status:
        | "draft"
        | "investor_signed"
        | "issuer_signed"
        | "signed_all"
        | "declined"
      esign_role: "investor" | "issuer"
      esign_status: "created" | "completed" | "expired"
      intent_status:
        | "created"
        | "drafted"
        | "investor_signed"
        | "issuer_signed"
        | "signed_all"
        | "certificate_issued"
        | "cancelled"
        | "expired"
      kyc_status: "pending" | "in_review" | "verified" | "rejected"
      transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "investment"
        | "distribution"
        | "hold"
        | "release_hold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      anti_sniping_mode: ["extend", "snapshot", "disabled"],
      app_role: ["admin", "moderator", "user"],
      auction_status: ["draft", "active", "clearing", "cleared", "cancelled"],
      bid_state: ["active", "filled", "cancelled", "partial"],
      bid_type: ["market", "limit"],
      certificate_status: ["allocated", "revoked"],
      contract_status: [
        "draft",
        "investor_signed",
        "issuer_signed",
        "signed_all",
        "declined",
      ],
      esign_role: ["investor", "issuer"],
      esign_status: ["created", "completed", "expired"],
      intent_status: [
        "created",
        "drafted",
        "investor_signed",
        "issuer_signed",
        "signed_all",
        "certificate_issued",
        "cancelled",
        "expired",
      ],
      kyc_status: ["pending", "in_review", "verified", "rejected"],
      transaction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      transaction_type: [
        "deposit",
        "withdrawal",
        "investment",
        "distribution",
        "hold",
        "release_hold",
      ],
    },
  },
} as const
