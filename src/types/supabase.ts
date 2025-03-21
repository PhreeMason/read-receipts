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
      authors: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      book_api_data: {
        Row: {
          api_id: string
          api_source: string
          created_at: string | null
          original_api_data: Json
        }
        Insert: {
          api_id: string
          api_source: string
          created_at?: string | null
          original_api_data: Json
        }
        Update: {
          api_id?: string
          api_source?: string
          created_at?: string | null
          original_api_data?: Json
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
      books: {
        Row: {
          api_id: string | null
          api_source: string | null
          completion_date: string | null
          cover_image_url: string | null
          created_at: string | null
          current_position: Json | null
          date_added: string | null
          description: string | null
          edition: Json | null
          epub_path: string | null
          epub_url: string
          format: Database["public"]["Enums"]["book_format_enum"] | null
          genres: string[] | null
          has_user_edits: boolean | null
          id: string
          isbn10: string | null
          isbn13: string | null
          language: string | null
          metadata: Json | null
          publication_date: string | null
          publisher: string | null
          rating: number | null
          source: Database["public"]["Enums"]["book_source_enum"] | null
          start_date: string | null
          status: Database["public"]["Enums"]["book_status_enum"] | null
          target_completion_date: string | null
          title: string
          total_duration: number | null
          total_pages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          api_id?: string | null
          api_source?: string | null
          completion_date?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          current_position?: Json | null
          date_added?: string | null
          description?: string | null
          edition?: Json | null
          epub_path?: string | null
          epub_url: string
          format?: Database["public"]["Enums"]["book_format_enum"] | null
          genres?: string[] | null
          has_user_edits?: boolean | null
          id?: string
          isbn10?: string | null
          isbn13?: string | null
          language?: string | null
          metadata?: Json | null
          publication_date?: string | null
          publisher?: string | null
          rating?: number | null
          source?: Database["public"]["Enums"]["book_source_enum"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["book_status_enum"] | null
          target_completion_date?: string | null
          title: string
          total_duration?: number | null
          total_pages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          api_id?: string | null
          api_source?: string | null
          completion_date?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          current_position?: Json | null
          date_added?: string | null
          description?: string | null
          edition?: Json | null
          epub_path?: string | null
          epub_url?: string
          format?: Database["public"]["Enums"]["book_format_enum"] | null
          genres?: string[] | null
          has_user_edits?: boolean | null
          id?: string
          isbn10?: string | null
          isbn13?: string | null
          language?: string | null
          metadata?: Json | null
          publication_date?: string | null
          publisher?: string | null
          rating?: number | null
          source?: Database["public"]["Enums"]["book_source_enum"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["book_status_enum"] | null
          target_completion_date?: string | null
          title?: string
          total_duration?: number | null
          total_pages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_api_ref"
            columns: ["api_id", "api_source"]
            isOneToOne: false
            referencedRelation: "book_api_data"
            referencedColumns: ["api_id", "api_source"]
          },
          {
            foreignKeyName: "books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_prefixed_id: {
        Args: {
          prefix: string
        }
        Returns: string
      }
      get_status_date: {
        Args: {
          user_book_id: string
          target_status: Database["public"]["Enums"]["book_status"]
        }
        Returns: string
      }
    }
    Enums: {
      annotation_type: "highlight" | "mark" | "underline"
      book_format_enum: "physical" | "ebook" | "audio"
      book_source_enum: "api" | "user_created"
      book_status: "to-read" | "reading" | "read" | "did-not-finish"
      book_status_enum: "tbr" | "current" | "completed" | "dnf"
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
