import { StatusOption } from "@/types/book";
import { statusOptions } from "./constants";
import { AnnotationInsert, AnnotationType, AnnotationSelect } from "@/types/annotations";
import { Annotation } from '@epubjs-react-native/core';

export const getCurrentStatusDetails = (status: string): StatusOption => {
    return statusOptions.find(option => option.id === status) || statusOptions[0];
};

export const formatAutorName = (author: string | { name: string }) => {
    if (typeof author === 'string') {
        return author
    }
    return author.name
}