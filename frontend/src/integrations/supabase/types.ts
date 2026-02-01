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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      artist_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          bio: string | null
          category_id: string | null
          cover_image: string | null
          created_at: string
          featured: boolean | null
          id: string
          location: string | null
          name: string
          photo: string | null
          skills: string[] | null
          slug: string
          social_facebook: string | null
          social_instagram: string | null
          social_youtube: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          location?: string | null
          name: string
          photo?: string | null
          skills?: string[] | null
          slug: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_youtube?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          location?: string | null
          name?: string
          photo?: string | null
          skills?: string[] | null
          slug?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_youtube?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "artist_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          read: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          read?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          read?: boolean | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          active: boolean | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          id: string
          image: string
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string
          video: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image: string
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string
          video?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string
          video?: string | null
        }
        Relationships: []
      }
      media_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["media_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["media_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["media_type"]
        }
        Relationships: []
      }
      media_items: {
        Row: {
          artist_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          duration: string | null
          featured: boolean | null
          id: string
          project_id: string | null
          slug: string
          thumbnail: string | null
          title: string
          type: Database["public"]["Enums"]["media_type"]
          updated_at: string
          url: string
        }
        Insert: {
          artist_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          project_id?: string | null
          slug: string
          thumbnail?: string | null
          title: string
          type?: Database["public"]["Enums"]["media_type"]
          updated_at?: string
          url: string
        }
        Update: {
          artist_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          project_id?: string | null
          slug?: string
          thumbnail?: string | null
          title?: string
          type?: Database["public"]["Enums"]["media_type"]
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_items_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "media_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_applications: {
        Row: {
          bio: string | null
          category: string | null
          created_at: string
          email: string
          id: string
          location: string | null
          name: string
          phone: string
          portfolio_links: string[] | null
          profile_photo: string | null
          skills: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          category?: string | null
          created_at?: string
          email: string
          id?: string
          location?: string | null
          name: string
          phone: string
          portfolio_links?: string[] | null
          profile_photo?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          location?: string | null
          name?: string
          phone?: string
          portfolio_links?: string[] | null
          profile_photo?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_credits: {
        Row: {
          artist_id: string
          created_at: string
          id: string
          project_id: string
          role: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          id?: string
          project_id: string
          role: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          id?: string
          project_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_credits_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_credits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          banner_image: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          release_date: string | null
          slug: string
          status: Database["public"]["Enums"]["project_status"]
          synopsis: string | null
          thumbnail: string | null
          title: string
          type: Database["public"]["Enums"]["project_type"]
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          release_date?: string | null
          slug: string
          status?: Database["public"]["Enums"]["project_status"]
          synopsis?: string | null
          thumbnail?: string | null
          title: string
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          release_date?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["project_status"]
          synopsis?: string | null
          thumbnail?: string | null
          title?: string
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      bootstrap_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      media_type: "video" | "photo" | "audio" | "document"
      project_status: "ongoing" | "completed" | "upcoming"
      project_type: "film" | "theatre" | "music" | "visual" | "documentary"
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
      app_role: ["admin"],
      media_type: ["video", "photo", "audio", "document"],
      project_status: ["ongoing", "completed", "upcoming"],
      project_type: ["film", "theatre", "music", "visual", "documentary"],
    },
  },
} as const
