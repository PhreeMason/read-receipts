import { View, Text, FlatList, TouchableOpacity, Animated } from 'react-native';
import tw from 'twrnc';
import React, { useState } from 'react'
import { useGetReadingLogs } from '@/hooks/useBooks';
import { BookReadingLog } from '@/types/book';
import { Loading } from '@/components/shared/Loading';
import { StarRating } from '@/components/books/AddToLibraryDetails/BookHeader';
import FormatDisplay from '@/components/books/shared/FormatDisplay';

const feelsWithEmoji = {
    'swooning': '😍',
    'butterflies': '🦋',
    'hot & bothered': '🔥',
    'intrigued': '🤔',
    'mind-blown': '🤯',
    'tense': '😬',
    'teary-eyed': '😢',
    'worried': '😟',
    'reflective': '🤔',
    'bored': '😴',
    'thrilled': '😃',
    'irritated': '😠',
}

const renderEmotionalStates = (log: BookReadingLog) => {
    if (!log.emotional_state || log.emotional_state.length === 0) {
        return null;
    }

    return (
        <View style={tw`my-1 flex-row flex-wrap`}>
            <Text style={tw`pt-2 text-sm font-semibold text-gray-700 mr-2`}>How you felt:</Text>
            <View style={tw`flex-row flex-wrap `}>
                {log.emotional_state.map((emotion, index) => {
                    // @ts-ignore
                    const emotionObj = feelsWithEmoji[emotion];
                    return (
                        <View
                            key={index}
                            style={tw`bg-gray-50 mr-2`}
                        >
                            <Text style={tw`text-xl text-gray-700`}>
                                {emotionObj ? emotionObj : emotion}
                            </Text>
                        </View>
                    )
                })}
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

const calculateMinsListened = (
    { audio_start_time, audio_end_time }:
        Pick<BookReadingLog, 'audio_start_time' | 'audio_end_time'>
) => {
    // start time can be 0 same for end time in addition to being null
    if (audio_start_time === null || audio_end_time === null) {
        return 0;
    }

    const durationInMins = audio_end_time - audio_start_time;
    const hours = Math.floor(durationInMins / 60)
    const hoursFormat = hours ? `${hours} hrs` : '';
    const mins = durationInMins % 60
    const minsFormat = mins ? `${mins} mins` : '';
    const formatDuration = `${hoursFormat} ${minsFormat}`.trim();
    return formatDuration
}


const renderProgressSection = (log: BookReadingLog) => {
    const { start_page, end_page, audio_start_time, audio_end_time, current_percentage } = log;

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
                        +{end_page - start_page} pages
                    </Text>
                </View>
                <View style={tw`flex-row justify-end mb-1`}>
                    <Text style={tw`text-green-600 font-semibold`}>
                        + {calculateMinsListened({ audio_end_time, audio_start_time })}
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
            style={tw`bg-white rounded-xl my-2 shadow-sm border border-gray-200 overflow-hidden`}
            onPress={() => onPress(log)}
            activeOpacity={0.9} // Micro-interaction feedback
        >
            <View style={tw`p-4`}>
                {/* Header with date and duration */}
                <View style={tw`flex-row justify-between items-center mb-3`}>
                    <View style={tw`flex-1 flex-row justify-between`}>
                        <Text style={tw`text-lg font-semibold text-gray-800`}>
                            {log.date && formatDate(log.date)}
                        </Text>
                        <View style={tw`flex-row items-center gap-3`}>
                            {log.format && log.format.length ?
                                <FormatDisplay format={log.format} />
                                : null
                            }
                            <Text style={tw`text-lg font-semibold text-gray-800`}>
                                {log.rating ? <StarRating rating={log.rating} sizeMultiplier={1.2} /> : null}
                            </Text>
                        </View>
                    </View>
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

                {/* Collapsible sections for emotional states and notes */}
                {renderEmotionalStates(log)}
                {renderNotes(log)}
            </View>
        </TouchableOpacity>
    );
};

// Main component
export const ReadingLogsDisplay = (
    { bookReadingLogs, onEditLog }:
        { bookReadingLogs: BookReadingLog[]; onEditLog: (log: BookReadingLog) => void }
) => {
    return (
        <View style={tw`flex-1 bg-white`}>
            <FlatList
                data={bookReadingLogs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ReadingLogItem log={item} onPress={onEditLog} />
                )}
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
            // Calculate minutes from audio timestamps
            const timeListened = log.audio_end_time && log.audio_start_time ?
                log.audio_end_time - log.audio_start_time : 0;

            // Calculate pages read from page values
            const pagesRead = log.end_page && log.start_page ?
                log.end_page - log.start_page : 0;

            return {
                totalSessions: stats.totalSessions + 1,
                totalTime: stats.totalTime + timeListened,
                totalPages: stats.totalPages + pagesRead
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




type ReadingLogProps = {
    bookID?: string;
    hideSeeAll?: boolean;
    hideTitle?: boolean;
    apiId: string;
}

const ReadingLogs: React.FC<ReadingLogProps> = ({ bookID, hideSeeAll, apiId, hideTitle }) => {
    const { data: readingLogs, isLoading } = useGetReadingLogs(bookID);
    const [filterFormat, setFilterFormat] = useState<string | null>(null);

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
        </View>
    );
};


export default ReadingLogs