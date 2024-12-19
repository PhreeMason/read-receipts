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
            annotations: {
                Row: {
                    annotation_type: Database["public"]["Enums"]["annotation_type"]
                    book_id: string
                    cfi_range: string
                    cfi_range_text: string | null
                    color: string | null
                    created_at: string | null
                    id: string
                    note: string | null
                    opacity: number | null
                    section_index: number | null
                    thickness: number | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    annotation_type: Database["public"]["Enums"]["annotation_type"]
                    book_id: string
                    cfi_range: string
                    cfi_range_text?: string | null
                    color?: string | null
                    created_at?: string | null
                    id?: string
                    note?: string | null
                    opacity?: number | null
                    section_index?: number | null
                    thickness?: number | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    annotation_type?: Database["public"]["Enums"]["annotation_type"]
                    book_id?: string
                    cfi_range?: string
                    cfi_range_text?: string | null
                    color?: string | null
                    created_at?: string | null
                    id?: string
                    note?: string | null
                    opacity?: number | null
                    section_index?: number | null
                    thickness?: number | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "annotations_book_id_fkey"
                        columns: ["book_id"]
                        isOneToOne: false
                        referencedRelation: "books"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "annotations_user_id_book_id_fkey"
                        columns: ["user_id", "book_id"]
                        isOneToOne: false
                        referencedRelation: "user_books"
                        referencedColumns: ["user_id", "book_id"]
                    },
                    {
                        foreignKeyName: "annotations_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            books: {
                Row: {
                    author: string
                    cover_url: string | null
                    created_at: string | null
                    description: string | null
                    epub_path: string | null
                    epub_url: string
                    id: string
                    metadata: Json | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    author: string
                    cover_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    epub_path?: string | null
                    epub_url: string
                    id?: string
                    metadata?: Json | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    author?: string
                    cover_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    epub_path?: string | null
                    epub_url?: string
                    id?: string
                    metadata?: Json | null
                    title?: string
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
            reading_sessions: {
                Row: {
                    book_id: string
                    created_at: string | null
                    end_cfi: string | null
                    end_location: number | null
                    end_time: string | null
                    id: string
                    pages_read: number | null
                    start_cfi: string
                    start_location: number
                    start_time: string
                    user_id: string
                }
                Insert: {
                    book_id: string
                    created_at?: string | null
                    end_cfi?: string | null
                    end_location?: number | null
                    end_time?: string | null
                    id?: string
                    pages_read?: number | null
                    start_cfi: string
                    start_location: number
                    start_time: string
                    user_id: string
                }
                Update: {
                    book_id?: string
                    created_at?: string | null
                    end_cfi?: string | null
                    end_location?: number | null
                    end_time?: string | null
                    id?: string
                    pages_read?: number | null
                    start_cfi?: string
                    start_location?: number
                    start_time?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reading_sessions_book_id_fkey"
                        columns: ["book_id"]
                        isOneToOne: false
                        referencedRelation: "books"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reading_sessions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reading_stats: {
                Row: {
                    book_id: string
                    created_at: string | null
                    id: string
                    last_read_at: string
                    total_pages_read: number | null
                    total_time_read: number | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    book_id: string
                    created_at?: string | null
                    id?: string
                    last_read_at: string
                    total_pages_read?: number | null
                    total_time_read?: number | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    book_id?: string
                    created_at?: string | null
                    id?: string
                    last_read_at?: string
                    total_pages_read?: number | null
                    total_time_read?: number | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reading_stats_book_id_fkey"
                        columns: ["book_id"]
                        isOneToOne: false
                        referencedRelation: "books"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reading_stats_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reading_streaks: {
                Row: {
                    created_at: string | null
                    current_streak: number | null
                    id: string
                    last_read_date: string
                    longest_streak: number | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    current_streak?: number | null
                    id?: string
                    last_read_date: string
                    longest_streak?: number | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    current_streak?: number | null
                    id?: string
                    last_read_date?: string
                    longest_streak?: number | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reading_streaks_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_book_status_history: {
                Row: {
                    changed_at: string
                    id: string
                    note: string | null
                    progress: number | null
                    status: Database["public"]["Enums"]["book_status"]
                    user_book_id: string | null
                }
                Insert: {
                    changed_at?: string
                    id?: string
                    note?: string | null
                    progress?: number | null
                    status: Database["public"]["Enums"]["book_status"]
                    user_book_id?: string | null
                }
                Update: {
                    changed_at?: string
                    id?: string
                    note?: string | null
                    progress?: number | null
                    status?: Database["public"]["Enums"]["book_status"]
                    user_book_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_book_status_history_user_book_id_fkey"
                        columns: ["user_book_id"]
                        isOneToOne: false
                        referencedRelation: "user_books"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_books: {
                Row: {
                    book_id: string | null
                    created_at: string | null
                    id: string
                    last_position: string | null
                    reading_progress: number | null
                    status: Database["public"]["Enums"]["book_status"]
                    user_id: string | null
                }
                Insert: {
                    book_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_position?: string | null
                    reading_progress?: number | null
                    status?: Database["public"]["Enums"]["book_status"]
                    user_id?: string | null
                }
                Update: {
                    book_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_position?: string | null
                    reading_progress?: number | null
                    status?: Database["public"]["Enums"]["book_status"]
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_books_book_id_fkey"
                        columns: ["book_id"]
                        isOneToOne: false
                        referencedRelation: "books"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
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
            book_status: "to-read" | "reading" | "read" | "did-not-finish"
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
