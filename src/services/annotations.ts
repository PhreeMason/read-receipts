import supabase from '@/lib/supabase';
import { AnnotationInsert } from '@/types/annotations';
import { formatAnnotationForClient } from "@/utils/helpers";
import { Annotation } from '@epubjs-react-native/core';

export const fetchAnnotations = async (bookId: string, userId: string):
    Promise<Annotation[]> => {
    const { data, error } = await supabase
        .from('annotations')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', userId);
    if (error) throw error;

    const formattedData = data.map((annotation: any) => {
        return formatAnnotationForClient(annotation)
    })
    return formattedData;
}

export const createAnnotation = async (annotation: AnnotationInsert) => {
    const { data, error } = await supabase
        .from('annotations')
        .upsert(annotation, {
            onConflict: 'cfi_range',
            ignoreDuplicates: false
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const deleteAnnotation = async (annotationId: string) => {
    const { error } = await supabase
        .from('annotations')
        .delete()
        .eq('id', annotationId);
    if (error) throw error;
}