import { View, Text, FlatList, TouchableOpacity, Animated, ScrollView } from 'react-native';
import tw from 'twrnc';
import React, { useState } from 'react'
import { useGetReadingLogs } from '@/hooks/useBooks';
import { Link } from 'expo-router';
import BookHeader from '@/components/books/AddToLibraryDetails/BookHeader';
import { BookFormat, BookReadingLog } from '@/types/book';
import { AntDesign } from '@expo/vector-icons';
import { Loading } from '@/components/shared/Loading';

// Format badge component to display reading format(s)
const FormatBadge = ({ format }: {
    format: 'physical' | 'ebook' | 'audio';
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const formatStyles = {
        physical: 'bg-blue-50 border-blue-200 text-blue-800',
        ebook: 'bg-green-50 border-green-200 text-green-800',
        audio: 'bg-amber-50 border-amber-200 text-amber-800',
    };

    return (
        <Animated.View
            style={[
                tw`rounded-full px-3 py-1 mr-2 mb-1 border ${formatStyles[format] || 'bg-gray-50 border-gray-200 text-gray-800'}`,
                {
                    transform: [{ scale: isPressed ? 0.95 : 1 }],
                }
            ]}
        >
            <Text style={tw`text-xs font-semibold`}>{format}</Text>
        </Animated.View>
    );
};

const renderEmotionalStates = (log: BookReadingLog) => {
    if (!log.emotional_state || log.emotional_state.length === 0) {
        return null;
    }

    return (
        <View style={tw`mt-3`}>
            <Text style={tw`text-sm font-semibold text-gray-700 mb-1.5`}>How you felt:</Text>
            <View style={tw`flex-row flex-wrap`}>
                {log.emotional_state.map((emotion, index) => (
                    <View
                        key={index}
                        style={tw`bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mr-2 mb-1`}
                    >
                        <Text style={tw`text-xs text-gray-700`}>{emotion}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const renderNotes = (log: BookReadingLog) => {
    if (!log.note) {
        return null;
    }

    // State for expanded/collapsed notes
    const [expanded, setExpanded] = useState(false);
    const notePreviewLength = 100; // Characters to show in preview
    const shouldTruncate = log.note.length > notePreviewLength;

    return (
        <View style={tw`mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100`}>
            <Text style={tw`text-sm font-semibold text-gray-700 mb-1`}>Notes:</Text>
            <Text style={tw`text-sm text-gray-700`}>
                {shouldTruncate && !expanded
                    ? `${log.note.substring(0, notePreviewLength)}...`
                    : log.note}
            </Text>

            {shouldTruncate && (
                <TouchableOpacity
                    onPress={() => setExpanded(!expanded)}
                    style={tw`mt-1`}
                >
                    <Text style={tw`text-xs text-blue-600 font-semibold`}>
                        {expanded ? 'Show less' : 'Read more'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};



const renderProgressSection = (log: BookReadingLog) => {
    const { start_page, end_page, audio_start_time, audio_end_time, current_percentage, pages_read } = log;

    if (start_page && end_page) {
        // Calculate percentage for progress bar
        const percentage = current_percentage ||
            (Math.round(end_page / 400 * 100));

        return (
            <View>
                <View style={tw`flex-row justify-between mb-1`}>
                    <Text style={tw`text-gray-800 font-semibold`}>
                        Pages {start_page}-{end_page}
                    </Text>
                    <Text style={tw`text-green-600 font-semibold`}>
                        +{pages_read} pages
                    </Text>
                </View>

                {/* Elegant progress bar */}
                <View style={tw`h-1.5 bg-gray-100 rounded-full w-full mt-1 mb-2`}>
                    <View
                        style={[
                            tw`h-1.5 bg-green-500 rounded-full`,
                            { width: `${percentage}%` }
                        ]}
                    />
                </View>

                <Text style={tw`text-xs text-gray-500 text-right`}>
                    {percentage}% complete
                </Text>
            </View>
        );
    }

    if (audio_start_time && audio_end_time) {
        const percentage = current_percentage || 0;

        return (
            <View>
                <View style={tw`flex-row justify-between mb-1`}>
                    <Text style={tw`text-gray-800 font-semibold`}>
                        {audio_start_time} - {audio_end_time}
                    </Text>
                    <Text style={tw`text-green-600 font-semibold`}>
                        +{percentage}% complete
                    </Text>
                </View>

                {/* Elegant progress bar */}
                <View style={tw`h-1.5 bg-gray-100 rounded-full w-full mt-1 mb-2`}>
                    <View
                        style={[
                            tw`h-1.5 bg-green-500 rounded-full`,
                            { width: `${percentage}%` }
                        ]}
                    />
                </View>
            </View>
        );
    }
};



// Individual reading log item component
const ReadingLogItem = ({ log, onPress }: { log: BookReadingLog; onPress: (log: BookReadingLog) => void }) => {
    // Format date display
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Today';

        const date = new Date(dateStr);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <TouchableOpacity
            style={tw`bg-white rounded-xl my-2 shadow-sm border border-gray-100 overflow-hidden`}
            onPress={() => onPress(log)}
            activeOpacity={0.9} // Micro-interaction feedback
        >
            <View style={tw`p-4`}>
                {/* Header with date and duration */}
                <View style={tw`flex-row justify-between items-center mb-3`}>
                    <Text style={tw`text-lg font-semibold text-gray-800`}>
                        {log.date && formatDate(log.date)}
                    </Text>
                    {log.duration ? (
                        <View style={tw`bg-gray-50 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-gray-600 font-semibold`}>{log.duration} min</Text>
                        </View>
                    ) : null}
                </View>

                {/* Progress section with visual progress indicator */}
                <View style={tw`mb-3`}>
                    {renderProgressSection(log)}
                </View>

                {/* Format badges in a more refined style */}
                <View style={tw`flex-row flex-wrap mb-2`}>
                    {log.format && log.format.map((fmt, index) => (
                        <FormatBadge key={index} format={fmt} />
                    ))}
                </View>

                {/* Collapsible sections for emotional states and notes */}
                {renderEmotionalStates(log)}
                {renderNotes(log)}
            </View>
        </TouchableOpacity>
    );
};

// Main component
const ReadingLogsDisplay = ({ bookReadingLogs, onEditLog }: { bookReadingLogs: BookReadingLog[]; onEditLog: (log: BookReadingLog) => void }) => {
    return (
        <View style={tw`flex-1 bg-white`}>
            <FlatList
                data={bookReadingLogs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ReadingLogItem log={item} onPress={onEditLog} />
                )}
                contentContainerStyle={tw`px-4`}
            />
        </View>
    );
};

// Component to show statistics summary for reading logs
const ReadingStatsSummary = ({ logs }: { logs: BookReadingLog[] }) => {
    // Calculate stats from logs
    const calculateStats = () => {
        if (!logs || logs.length === 0) {
            return { totalSessions: 0, totalTime: 0, totalPages: 0 };
        }

        return logs.reduce((stats, log) => {
            return {
                totalSessions: stats.totalSessions + 1,
                totalTime: stats.totalTime + (log.duration || 0),
                totalPages: stats.totalPages + (log.pages_read || 0)
            };
        }, { totalSessions: 0, totalTime: 0, totalPages: 0 });
    };

    const stats = calculateStats();

    return (
        <View style={tw`bg-white p-4 mx-4 my-3 rounded-xl shadow-sm border border-gray-100`}>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Reading Summary</Text>
            <View style={tw`flex-row justify-between`}>
                <View style={tw`items-center`}>
                    <Text style={tw`text-2xl font-bold text-amber-600`}>{stats.totalSessions}</Text>
                    <Text style={tw`text-xs text-gray-600`}>Sessions</Text>
                </View>
                <View style={tw`items-center`}>
                    <Text style={tw`text-2xl font-bold text-amber-600`}>{stats.totalTime}</Text>
                    <Text style={tw`text-xs text-gray-600`}>Minutes</Text>
                </View>
                <View style={tw`items-center`}>
                    <Text style={tw`text-2xl font-bold text-amber-600`}>{stats.totalPages}</Text>
                    <Text style={tw`text-xs text-gray-600`}>Pages</Text>
                </View>
            </View>
        </View>
    );
};

type FilterChipProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
};

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => {
    return (
        <TouchableOpacity
            style={tw`${selected
                ? 'bg-amber-100 border-amber-300'
                : 'bg-white border-gray-200'
                } px-4 py-2 rounded-full mx-1 border`}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text
                style={tw`${selected ? 'text-amber-800 font-semibold' : 'text-gray-700'
                    } text-sm`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

type FloatingActionButtonProps = {
    icon: string;
    onPress: () => void;
    style?: string;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ icon, onPress, style }) => {
    return (
        <TouchableOpacity
            style={tw.style(
                `absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg 
           justify-center items-center bg-amber-600`,
                style
            )}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* @ts-ignore ype 'string' is not assignable to type '"profile" | "key" | ... */}
            <AntDesign name={icon} size={24} color="white" />

            {/* Simple plus icon if not using an icon library */}
            <View style={tw`w-6 h-0.5 bg-white absolute`} />
            <View style={tw`h-6 w-0.5 bg-white absolute`} />
        </TouchableOpacity>
    );
};


type ReadingLogProps = {
    bookID?: string;
    hideSeeAll?: boolean;
    hideTitle?: boolean;
    apiId: string;
}

const ReadingLogs: React.FC<ReadingLogProps> = ({ bookID, hideSeeAll, apiId, hideTitle }) => {
    const { data: readingLogs, isLoading } = useGetReadingLogs(bookID);
    const [filterFormat, setFilterFormat] = useState<string | null>(null);

    const handleAddNewLog = () => {
        // Navigate to the log form screen
        console.log('Navigate to log form');
    };

    const handleEditLog = (log: BookReadingLog) => {
        // Navigate to the edit log screen
        console.log('Navigate to edit log', log);
    };

    if (isLoading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Loading message="Loading your reading sessions" />
            </View>
        );
    }

    if (!readingLogs) {
        return <Text style={tw`text-center text-gray-500`}>No reading logs available.</Text>;
    }

    console.log({ readingLogs });
    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Optional book header if not hidden */}

            {/* Reading stats summary */}
            <ReadingStatsSummary logs={readingLogs} />

            {/* Filter options */}
            <View
                style={tw`p-2 flex-row`}
            >
                {['All', 'Physical', 'eBook', 'Audio'].map(format => (
                    <FilterChip
                        key={format}
                        label={format}
                        selected={filterFormat === format.toLowerCase() || (filterFormat === null && format === 'All')}
                        onPress={() => setFilterFormat(format === 'All' ? null : format.toLowerCase())}
                    />
                ))}
            </View>

            {/* Reading logs list with improved styling */}
            <ReadingLogsDisplay
                bookReadingLogs={readingLogs.filter((log: BookReadingLog) =>
                    // @ts-ignore Argument of type 'string' is not assignable to parameter of type '"physical" | "ebook" | "audio"'.ts(2345)
                    !filterFormat || (log.format && log.format.includes(filterFormat))
                )}
                onEditLog={handleEditLog}
            />

            {/* Floating action button for adding new log */}
            <FloatingActionButton
                icon="plus"
                onPress={handleAddNewLog}
                style={`bg-amber-600`}
            />
        </View>
    );
};


export default ReadingLogs