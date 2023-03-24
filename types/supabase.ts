export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      domains: {
        Row: {
          id: number
          inserted_at: string
          name: string
          project_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          name: string
          project_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          name?: string
          project_id?: string
        }
      }
      file_sections: {
        Row: {
          content: string | null
          embedding: unknown | null
          file_id: number
          id: number
          token_count: number | null
        }
        Insert: {
          content?: string | null
          embedding?: unknown | null
          file_id: number
          id?: number
          token_count?: number | null
        }
        Update: {
          content?: string | null
          embedding?: unknown | null
          file_id?: number
          id?: number
          token_count?: number | null
        }
      }
      files: {
        Row: {
          id: number
          meta: Json | null
          path: string
          project_id: string
          updated_at: string
        }
        Insert: {
          id?: number
          meta?: Json | null
          path: string
          project_id: string
          updated_at?: string
        }
        Update: {
          id?: number
          meta?: Json | null
          path?: string
          project_id?: string
          updated_at?: string
        }
      }
      memberships: {
        Row: {
          id: string
          inserted_at: string
          team_id: string
          type: Database["public"]["Enums"]["membership_type"]
          user_id: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          team_id: string
          type: Database["public"]["Enums"]["membership_type"]
          user_id: string
        }
        Update: {
          id?: string
          inserted_at?: string
          team_id?: string
          type?: Database["public"]["Enums"]["membership_type"]
          user_id?: string
        }
      }
      projects: {
        Row: {
          created_by: string
          github_repo: string | null
          id: string
          inserted_at: string
          is_starter: boolean
          name: string
          public_api_key: string
          slug: string
          team_id: string
        }
        Insert: {
          created_by: string
          github_repo?: string | null
          id?: string
          inserted_at?: string
          is_starter?: boolean
          name: string
          public_api_key: string
          slug: string
          team_id: string
        }
        Update: {
          created_by?: string
          github_repo?: string | null
          id?: string
          inserted_at?: string
          is_starter?: boolean
          name?: string
          public_api_key?: string
          slug?: string
          team_id?: string
        }
      }
      teams: {
        Row: {
          billing_cycle_start: string | null
          created_by: string
          id: string
          inserted_at: string
          is_personal: boolean | null
          name: string | null
          slug: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
        }
        Insert: {
          billing_cycle_start?: string | null
          created_by: string
          id?: string
          inserted_at?: string
          is_personal?: boolean | null
          name?: string | null
          slug: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
        }
        Update: {
          billing_cycle_start?: string | null
          created_by?: string
          id?: string
          inserted_at?: string
          is_personal?: boolean | null
          name?: string | null
          slug?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
        }
      }
      tokens: {
        Row: {
          created_by: string
          id: number
          inserted_at: string
          project_id: string
          value: string
        }
        Insert: {
          created_by: string
          id?: number
          inserted_at?: string
          project_id: string
          value: string
        }
        Update: {
          created_by?: string
          id?: number
          inserted_at?: string
          project_id?: string
          value?: string
        }
      }
      users: {
        Row: {
          avatar_url: string | null
          email: string
          full_name: string | null
          has_completed_onboarding: boolean
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          full_name?: string | null
          has_completed_onboarding?: boolean
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          full_name?: string | null
          has_completed_onboarding?: boolean
          id?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_file_sections: {
        Args: {
          embedding: unknown
          match_threshold: number
          match_count: number
          min_content_length: number
        }
        Returns: {
          path: string
          content: string
          token_count: number
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      vector_dims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      membership_type: "viewer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
