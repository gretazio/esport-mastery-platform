export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_active?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "admins_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "authenticated_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      best_games: {
        Row: {
          created_at: string
          description_en: string
          description_it: string
          format: string
          id: string
          image_url: string
          phase: string
          players: string
          replay_url: string
          tournament: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en: string
          description_it: string
          format: string
          id?: string
          image_url: string
          phase: string
          players: string
          replay_url: string
          tournament: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_it?: string
          format?: string
          id?: string
          image_url?: string
          phase?: string
          players?: string
          replay_url?: string
          tournament?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_en: string
          answer_it: string
          created_at: string
          id: string
          is_active: boolean
          position: number
          question_en: string
          question_it: string
          updated_at: string
        }
        Insert: {
          answer_en: string
          answer_it: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          question_en: string
          question_it: string
          updated_at?: string
        }
        Update: {
          answer_en?: string
          answer_it?: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          question_en?: string
          question_it?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_resources: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          position: number
          title_en: string
          title_it: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          position?: number
          title_en: string
          title_it: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          position?: number
          title_en?: string
          title_it?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          achievements: string[]
          created_at: string
          id: string
          image: string
          join_date: string | null
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          achievements: string[]
          created_at?: string
          id?: string
          image: string
          join_date?: string | null
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          achievements?: string[]
          created_at?: string
          id?: string
          image?: string
          join_date?: string | null
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      authenticated_users_view: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
