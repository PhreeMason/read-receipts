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
      authors: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      book_authors: {
        Row: {
          author_id: string
          book_id: string
        }
        Insert: {
          author_id: string
          book_id: string
        }
        Update: {
          author_id?: string
          book_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_authors_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_notes: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          note: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id: string
          note?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          note?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_notes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      book_reading_logs: {
        Row: {
          audio_end_time: number | null
          audio_start_time: number | null
          book_id: string
          created_at: string | null
          date: string | null
          duration: number | null
          emotional_state: string | null
          end_page: number | null
          format: Database["public"]["Enums"]["book_format_enum"][] | null
          id: string
          listening_speed: number | null
          notes: string | null
          pages_read: number | null
          rating: number | null
          start_page: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_end_time?: number | null
          audio_start_time?: number | null
          book_id: string
          created_at?: string | null
          date?: string | null
          duration?: number | null
          emotional_state?: string | null
          end_page?: number | null
          format?: Database["public"]["Enums"]["book_format_enum"][] | null
          id: string
          listening_speed?: number | null
          notes?: string | null
          pages_read?: number | null
          rating?: number | null
          start_page?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_end_time?: number | null
          audio_start_time?: number | null
          book_id?: string
          created_at?: string | null
          date?: string | null
          duration?: number | null
          emotional_state?: string | null
          end_page?: number | null
          format?: Database["public"]["Enums"]["book_format_enum"][] | null
          id?: string
          listening_speed?: number | null
          notes?: string | null
          pages_read?: number | null
          rating?: number | null
          start_page?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_reading_logs_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_reading_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      book_reviews: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          rating: number | null
          review: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      book_status_history: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["book_status_enum"] | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id: string
          status?: Database["public"]["Enums"]["book_status_enum"] | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["book_status_enum"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_status_history_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_status_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          api_id: string
          api_source: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          edition: Json | null
          format: Database["public"]["Enums"]["book_format_enum"] | null
          genres: string[] | null
          id: string
          isbn10: string | null
          isbn13: string | null
          language: string | null
          metadata: Json | null
          publication_date: string | null
          publisher: string | null
          rating: number | null
          title: string
          total_duration: number | null
          total_pages: number | null
          updated_at: string | null
        }
        Insert: {
          api_id: string
          api_source?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          edition?: Json | null
          format?: Database["public"]["Enums"]["book_format_enum"] | null
          genres?: string[] | null
          id: string
          isbn10?: string | null
          isbn13?: string | null
          language?: string | null
          metadata?: Json | null
          publication_date?: string | null
          publisher?: string | null
          rating?: number | null
          title: string
          total_duration?: number | null
          total_pages?: number | null
          updated_at?: string | null
        }
        Update: {
          api_id?: string
          api_source?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          edition?: Json | null
          format?: Database["public"]["Enums"]["book_format_enum"] | null
          genres?: string[] | null
          id?: string
          isbn10?: string | null
          isbn13?: string | null
          language?: string | null
          metadata?: Json | null
          publication_date?: string | null
          publisher?: string | null
          rating?: number | null
          title?: string
          total_duration?: number | null
          total_pages?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_books: {
        Row: {
          book_id: string
          completion_date: string | null
          cover_image_url: string | null
          current_audio_time: number | null
          current_page: number | null
          date_added: string | null
          format: Database["public"]["Enums"]["book_format_enum"][] | null
          genres: string[] | null
          note: string | null
          rating: number | null
          start_date: string | null
          target_completion_date: string | null
          total_duration: number | null
          total_pages: number | null
          user_id: string
        }
        Insert: {
          book_id: string
          completion_date?: string | null
          cover_image_url?: string | null
          current_audio_time?: number | null
          current_page?: number | null
          date_added?: string | null
          format?: Database["public"]["Enums"]["book_format_enum"][] | null
          genres?: string[] | null
          note?: string | null
          rating?: number | null
          start_date?: string | null
          target_completion_date?: string | null
          total_duration?: number | null
          total_pages?: number | null
          user_id: string
        }
        Update: {
          book_id?: string
          completion_date?: string | null
          cover_image_url?: string | null
          current_audio_time?: number | null
          current_page?: number | null
          date_added?: string | null
          format?: Database["public"]["Enums"]["book_format_enum"][] | null
          genres?: string[] | null
          note?: string | null
          rating?: number | null
          start_date?: string | null
          target_completion_date?: string | null
          total_duration?: number | null
          total_pages?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_searches: {
        Row: {
          created_at: string | null
          id: string
          query: string
          result_count: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id: string
          query: string
          result_count: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          result_count?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_prefixed_id: {
        Args: { prefix: string }
        Returns: string
      }
      store_book_with_authors: {
        Args: { book_data: Json }
        Returns: undefined
      }
    }
    Enums: {
      book_format_enum: "physical" | "ebook" | "audio"
      book_status_enum: "tbr" | "current" | "completed" | "dnf" | "pause"
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
    Enums: {
      book_format_enum: ["physical", "ebook", "audio"],
      book_status_enum: ["tbr", "current", "completed", "dnf", "pause"],
    },
  },
} as const

