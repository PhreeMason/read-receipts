import { StatusOption } from "@/types/book";
import { statusOptions } from "./constants";
import { AnnotationInsert, AnnotationType, AnnotationSelect } from "@/types/annotations";
import { Annotation } from '@epubjs-react-native/core';

export const getCurrentStatusDetails = (status: string): StatusOption => {
    return statusOptions.find(option => option.id === status) || statusOptions[0];
};

export const formatAnnotationForDb = (
    annotation: Annotation,
    bookId: string,
    userId: string
): AnnotationInsert => {
    // Validate the annotation type
    const validTypes = ['highlight', 'mark', 'underline']
    if (!validTypes.includes(annotation.type)) {
        throw new Error(`Invalid annotation type: ${annotation.type}`)
    }

    return {
        book_id: bookId,
        cfi_range: annotation.cfiRange,
        cfi_range_text: annotation.cfiRangeText,
        section_index: annotation.sectionIndex,
        annotation_type: annotation.type as AnnotationType,
        color: annotation.styles?.color,
        opacity: annotation.styles?.opacity,
        thickness: annotation.styles?.thickness,
        note: annotation.data.observation || null,
        user_id: userId
    }
}

/**
* Converts a database annotation to the client-side format
* @param dbAnnotation The database annotation object
* @returns The formatted annotation for client-side use
*/
export const formatAnnotationForClient = (dbAnnotation: AnnotationSelect): Annotation => {
    return {
        type: dbAnnotation.annotation_type,
        data: {
            key: dbAnnotation.id,
            text: dbAnnotation.cfi_range_text || '',
            observation: dbAnnotation.note || undefined,
            epubcfi: dbAnnotation.cfi_range
        },
        cfiRange: dbAnnotation.cfi_range,
        sectionIndex: dbAnnotation.section_index || 0,
        cfiRangeText: dbAnnotation.cfi_range_text || '',
        styles: {
            color: dbAnnotation.color || '#000000',
            opacity: dbAnnotation.opacity || 1,
            thickness: dbAnnotation.thickness || undefined
        }
    }
}