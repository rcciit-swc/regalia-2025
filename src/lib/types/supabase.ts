export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      defined_roles: {
        Row: {
          role: string
        }
        Insert: {
          role: string
        }
        Update: {
          role?: string
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          convenors: Json | null
          fest_id: string
          id: string
          name: string | null
          tagline: string | null
        }
        Insert: {
          convenors?: Json | null
          fest_id?: string
          id?: string
          name?: string | null
          tagline?: string | null
        }
        Update: {
          convenors?: Json | null
          fest_id?: string
          id?: string
          name?: string | null
          tagline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_categories_fest_id_fkey"
            columns: ["fest_id"]
            isOneToOne: false
            referencedRelation: "fests"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          coordinators: Json[] | null
          description: string | null
          event_category_id: string
          id: string
          image_url: string | null
          links: Json | null
          max_team_size: number | null
          min_team_size: number | null
          name: string | null
          prize_pool: number | null
          reg_status: boolean | null
          registration_fees: number | null
          rules: string | null
          schedule: string | null
        }
        Insert: {
          coordinators?: Json[] | null
          description?: string | null
          event_category_id?: string
          id?: string
          image_url?: string | null
          links?: Json | null
          max_team_size?: number | null
          min_team_size?: number | null
          name?: string | null
          prize_pool?: number | null
          reg_status?: boolean | null
          registration_fees?: number | null
          rules?: string | null
          schedule?: string | null
        }
        Update: {
          coordinators?: Json[] | null
          description?: string | null
          event_category_id?: string
          id?: string
          image_url?: string | null
          links?: Json | null
          max_team_size?: number | null
          min_team_size?: number | null
          name?: string | null
          prize_pool?: number | null
          reg_status?: boolean | null
          registration_fees?: number | null
          rules?: string | null
          schedule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_event_category_id_fkey"
            columns: ["event_category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      fests: {
        Row: {
          id: string
          name: string | null
          year: number | null
        }
        Insert: {
          id?: string
          name?: string | null
          year?: number | null
        }
        Update: {
          id?: string
          name?: string | null
          year?: number | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          email: string
          name: string
          phone: string | null
          team_id: string
        }
        Insert: {
          email: string
          name: string
          phone?: string | null
          team_id?: string
        }
        Update: {
          email?: string
          name?: string
          phone?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["team_id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          community_name: string
          referral_code: string
        }
        Insert: {
          community_name: string
          referral_code: string
        }
        Update: {
          community_name?: string
          referral_code?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          event_category_id: string | null
          event_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_category_id?: string | null
          event_id?: string | null
          role: string
          user_id?: string
        }
        Update: {
          created_at?: string
          event_category_id?: string | null
          event_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_event_category_id_fkey"
            columns: ["event_category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "defined_roles"
            referencedColumns: ["role"]
          },
          {
            foreignKeyName: "roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "SWC-2025": {
        Row: {
          email: string | null
          name: string
          phone: string | null
          roll: string
        }
        Insert: {
          email?: string | null
          name: string
          phone?: string | null
          roll: string
        }
        Update: {
          email?: string | null
          name?: string
          phone?: string | null
          roll?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          attendance: boolean | null
          college: string | null
          event_id: string
          is_team: boolean | null
          payment_mode: string | null
          referral_code: string | null
          reg_mode: string | null
          registered_at: string | null
          team_id: string
          team_lead_email: string | null
          team_lead_id: string | null
          team_name: string | null
          transaction_id: string | null
          transaction_screenshot: string | null
          transaction_verified: string | null
          verification_mail_sent: boolean | null
        }
        Insert: {
          attendance?: boolean | null
          college?: string | null
          event_id?: string
          is_team?: boolean | null
          payment_mode?: string | null
          referral_code?: string | null
          reg_mode?: string | null
          registered_at?: string | null
          team_id?: string
          team_lead_email?: string | null
          team_lead_id?: string | null
          team_name?: string | null
          transaction_id?: string | null
          transaction_screenshot?: string | null
          transaction_verified?: string | null
          verification_mail_sent?: boolean | null
        }
        Update: {
          attendance?: boolean | null
          college?: string | null
          event_id?: string
          is_team?: boolean | null
          payment_mode?: string | null
          referral_code?: string | null
          reg_mode?: string | null
          registered_at?: string | null
          team_id?: string
          team_lead_email?: string | null
          team_lead_id?: string | null
          team_name?: string | null
          transaction_id?: string | null
          transaction_screenshot?: string | null
          transaction_verified?: string | null
          verification_mail_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_referral_code_fkey"
            columns: ["referral_code"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["referral_code"]
          },
          {
            foreignKeyName: "teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          referred: string
          referrer: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          referred?: string
          referrer?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          referred?: string
          referrer?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_referred_fkey"
            columns: ["referred"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_referrer_fkey"
            columns: ["referrer"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          coin: number
          college: string | null
          college_roll: string | null
          course: string | null
          created_at: string | null
          email: string
          gender: string | null
          id: string
          name: string | null
          phone: string | null
          referral: string | null
          stream: string | null
        }
        Insert: {
          coin?: number
          college?: string | null
          college_roll?: string | null
          course?: string | null
          created_at?: string | null
          email: string
          gender?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          referral?: string | null
          stream?: string | null
        }
        Update: {
          coin?: number
          college?: string | null
          college_roll?: string | null
          course?: string | null
          created_at?: string | null
          email?: string
          gender?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          referral?: string | null
          stream?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_referral_fkey"
            columns: ["referral"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["referral_code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_approval_table_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          serial_no: number
          paymentstatus: string
          eventname: string
          type: string
          teamname: string
          college: string
          teamlead: string
          teamleadphone: string
          teamleademail: string
          transactionid: string
          transaction_screenshot: string
          team_id: string
          teammembers: Json
          registeredat: string
        }[]
      }
      get_event_by_id_with_registration: {
        Args: { p_event_id: string; p_user_id?: string }
        Returns: {
          id: string
          event_category_id: string
          name: string
          description: string
          min_team_size: number
          max_team_size: number
          registration_fees: number
          prize_pool: number
          schedule: string
          rules: string
          reg_status: boolean
          image_url: string
          coordinators: Json[]
          links: Json
          registered: boolean
        }[]
      }
      get_event_by_name_with_registration: {
        Args: { p_event_name: string; p_user_id?: string }
        Returns: {
          id: string
          event_category_id: string
          name: string
          description: string
          min_team_size: number
          max_team_size: number
          registration_fees: number
          prize_pool: number
          schedule: string
          rules: string
          reg_status: boolean
          image_url: string
          coordinators: Json
          links: Json
          registered: boolean
        }[]
      }
      get_events_by_fest: {
        Args: { p_fest_id: string; p_user_id?: string }
        Returns: {
          id: string
          event_category_id: string
          name: string
          description: string
          min_team_size: number
          max_team_size: number
          registration_fees: number
          prize_pool: number
          schedule: string
          rules: string
          reg_status: boolean
          image_url: string
          coordinators: Json
          links: Json
          registered: boolean
        }[]
      }
      get_events_with_registration: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          event_category_id: string
          name: string
          description: string
          min_team_size: number
          max_team_size: number
          registration_fees: number
          prize_pool: number
          schedule: string
          rules: string
          reg_status: boolean
          image_url: string
          coordinators: Json
          links: Json
          registered: boolean
        }[]
      }
      get_registration_data: {
        Args: {
          p_fest_id: string
          p_event_category_id?: string
          p_event_id?: string
        }
        Returns: {
          serial_no: number
          paymentstatus: string
          eventname: string
          type: string
          teamname: string
          college: string
          teamlead: string
          teamleadphone: string
          teamleademail: string
          transactionid: string
          transaction_screenshot: string
          team_id: string
          teammembers: Json
          registeredat: string
        }[]
      }
      get_registration_details: {
        Args: { p_event_id: string; p_user_id: string }
        Returns: {
          is_team: boolean
          team_name: string
          team_members: Json
        }[]
      }
      get_registrations_by_event_ids: {
        Args: {
          p_fest_id: string
          p_event_category_id?: string
          p_event_id?: string[]
        }
        Returns: {
          serial_no: number
          paymentstatus: string
          eventname: string
          type: string
          teamname: string
          college: string
          teamlead: string
          teamleadphone: string
          teamleademail: string
          transactionid: string
          transaction_screenshot: string
          team_id: string
          teammembers: Json
          registeredat: string
        }[]
      }
      register_solo_event: {
        Args: {
          p_user_id: string
          p_event_id: string
          p_transaction_id: string
          p_college: string
          p_transaction_screenshot: string
        }
        Returns: string
      }
      register_solo_event_with_details: {
        Args: {
          p_user_id: string
          p_event_id: string
          p_transaction_id: string
          p_transaction_screenshot: string
          p_college: string
          p_attendance?: boolean
          p_reg_mode?: string
          p_payment_mode?: string
          p_referral_code?: string
        }
        Returns: string
      }
      register_team_with_new_participants: {
        Args: {
          p_user_id: string
          p_event_id: string
          p_transaction_id: string
          p_team_name: string
          p_college: string
          p_transaction_screenshot: string
          p_team_lead_name: string
          p_team_lead_phone: string
          p_team_lead_email: string
          p_team_members: Json
          p_reg_mode?: string
          p_payment_mode?: string
          p_referral_code?: string
          p_attendance?: boolean
        }
        Returns: string
      }
      register_team_with_participants: {
        Args: {
          p_user_id: string
          p_event_id: string
          p_transaction_id: string
          p_team_name: string
          p_team_lead_email: string
          p_team_lead_name: string
          p_team_lead_phone: string
          p_college: string
          p_transaction_screenshot: string
          p_team_members: Json
        }
        Returns: string
      }
      verify_referral_code_transaction: {
        Args: { _referrer: string; _referred: string; _referral_code: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
