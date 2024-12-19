import { Database } from './supabase'

// Type for the database annotation insert
export type AnnotationInsert = Database['public']['Tables']['annotations']['Insert']

export type AnnotationSelect = Database['public']['Tables']['annotations']['Row']

export type AnnotationType = Database['public']['Enums']['annotation_type']