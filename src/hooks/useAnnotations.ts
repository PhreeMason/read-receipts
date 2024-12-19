import { createAnnotation, deleteAnnotation, fetchAnnotations } from "@/services/annotations";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { Annotation } from '@epubjs-react-native/core';
import { formatAnnotationForDb } from "@/utils/helpers";

export const useFetchAnnotations = (bookId: string) => {
    const { profile: user } = useAuth();
    return useQuery({
        queryKey: ['annotations', bookId],
        queryFn: () => fetchAnnotations(bookId, user?.id || ''),
        enabled: !!user?.id && !!bookId,
    });
}

export const useCreateAnnotation = () => {
    const queryClient = useQueryClient();
    const { profile: user } = useAuth();

    return useMutation({
        mutationFn: async ({ annotation, bookId }: { annotation: Annotation, bookId: string }) => {
            if (!user?.id) return null;
            const formattedAnnotation = formatAnnotationForDb(annotation, bookId, user.id);
            if (!formattedAnnotation.cfi_range_text) return null;
            return createAnnotation(formattedAnnotation);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['annotations'] });
        }
    })
}

export const useDeleteAnnotation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (annotationId: string) => deleteAnnotation(annotationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['annotations'] });
        }
    })
}