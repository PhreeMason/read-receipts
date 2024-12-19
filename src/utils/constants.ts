import { StatusOption } from "@/types/book";
import {
    Book,
    BookOpen,
    Check,
    Clock,
} from 'lucide-react-native';

// Helper function to convert Tailwind color classes to RN colors
export const convertTailwindColor = (tailwindColor: string): string => {
    const colorMap: Record<string, string> = {
        'text-blue-600': '#2563EB',
        'text-purple-600': '#9333EA',
        'text-green-600': '#16A34A',
        'text-gray-600': '#4B5563',
        'bg-blue-100': '#DBEAFE',
        'bg-purple-100': '#F3E8FF',
        'bg-green-100': '#DCFCE7',
        'bg-gray-100': '#F3F4F6',
    };

    return colorMap[tailwindColor] || tailwindColor;
};

// Reading status options with colors and states
export const statusOptions: StatusOption[] = [
    {
        id: "currently-reading",
        label: "Currently Reading",
        description: "In progress - Page 136",
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        actionLabel: "Continue Reading"
    },
    {
        id: "want-to-read",
        label: "Want to Read",
        description: "Saved for later",
        icon: Clock,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        actionLabel: "Start Reading"
    },
    {
        id: "finished",
        label: "Finished",
        description: "Completed reading",
        icon: Check,
        color: "text-green-600",
        bgColor: "bg-green-100",
        actionLabel: "Read Again"
    },
    {
        id: "paused",
        label: "Paused",
        description: "Taking a break",
        icon: Book,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        actionLabel: "Resume Reading"
    }
];

export const MINIMUM_SESSION_TIME = 10; // 10 seconds, 
export const MIN_READING_TIME = 60; // 1 minute