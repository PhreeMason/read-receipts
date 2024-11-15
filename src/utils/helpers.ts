import { StatusOption } from "@/types/book";
import { statusOptions } from "./constants";

export const getCurrentStatusDetails = (status: string ): StatusOption => {
    return statusOptions.find(option => option.id === status) || statusOptions[0];
};