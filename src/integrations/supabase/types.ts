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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      gallery: {
        Row: {
          created_at: string
          id: string
          name: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          url?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          link: string | null
          sort_order: number | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          name: string
          product_url: string | null
          rating: string | null
          specs: Json | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          product_url?: string | null
          rating?: string | null
          specs?: Json | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          product_url?: string | null
          rating?: string | null
          specs?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      socials: {
        Row: {
          data: Json
          id: number
          updated_at: string
        }
        Insert: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      specs: {
        Row: {
          created_at: string
          data: Json | null
          game_image: string | null
          game_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          game_image?: string | null
          game_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          game_image?: string | null
          game_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          coupon_code: string | null
          created_at: string
          description: string | null
          discount_text: string | null
          featured: boolean | null
          id: string
          logo_url: string | null
          name: string
          sort_order: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          description?: string | null
          discount_text?: string | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          description?: string | null
          discount_text?: string | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      steam_games: {
        Row: {
          achievements_earned: number | null
          achievements_total: number | null
          app_id: string | null
          created_at: string
          featured: boolean | null
          hours_played: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          achievements_earned?: number | null
          achievements_total?: number | null
          app_id?: string | null
          created_at?: string
          featured?: boolean | null
          hours_played?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          achievements_earned?: number | null
          achievements_total?: number | null
          app_id?: string | null
          created_at?: string
          featured?: boolean | null
          hours_played?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
