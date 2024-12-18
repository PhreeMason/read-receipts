// src/components/reader/EpubReader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useWindowDimensions, View, Text } from 'react-native';
import {
    Reader,
    useReader,
    Themes,
    Annotation,
    Section,
} from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/reader/Header';
import { Footer } from '@/components/reader/Footer';
import { MAX_FONT_SIZE, MIN_FONT_SIZE, availableFonts, themes } from '@/components/reader/utils';
import { BookmarksList } from '@/components/reader/BookmarksList';
import { SearchList } from '@/components/reader/SearchList';
import { TableOfContents } from '@/components/reader/TableOfContents';
import { COLORS } from '@/components/reader/AnnotationForm';
import { AnnotationsList } from '@/components/reader/AnnotationsList';
import { useSaveCurrentLocation, useBookDetails } from '@/hooks/useBooks';
import { Loading } from '../shared/Loading';
import { useEndSession, useStartSession } from '@/hooks/useReadingSession';

interface Props {
    bookId: string;
}

type FileInfo = { uri: string | null; mimeType: string | null; }

function EpubReader({ bookId }: Props) {
    const { width, height } = useWindowDimensions();
    const {
        data: book,
        error,
        isLoading
    } = useBookDetails(bookId);

    const epub_url = book?.epub_url!;
    const {
        downloadFile,
        getFileInfo,
        size: fileSize,
        progress: downloadProgress,
        success: downloadSuccess,
        error: downloadError,
        documentDirectory
    } = useFileSystem();


    const insets = useSafeAreaInsets();

    const {
        theme,
        annotations,
        changeFontSize,
        changeFontFamily,
        changeTheme,
        goToLocation,
        addAnnotation,
        removeAnnotation,
        currentLocation,
        isLoading: isReaderLoading,
    } = useReader();

    const { mutate: endSession } = useEndSession();
    const { mutate: startSession } = useStartSession(bookId);

    const bookmarksListRef = useRef<BottomSheetModal>(null);
    const searchListRef = useRef<BottomSheetModal>(null);
    const tableOfContentsRef = useRef<BottomSheetModal>(null);
    const annotationsListRef = useRef<BottomSheetModal>(null);
    const locationRef = useRef(currentLocation);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [readingSessionId, setReadingSessionId] = useState<string | null>(null);
    const [bookFileUri, setBookFileUri] = useState<string | null>(null);
    const [currentFontSize, setCurrentFontSize] = useState(14);
    const [currentFontFamily, setCurrentFontFamily] = useState(availableFonts[0]);
    const [tempMark, setTempMark] = useState<Annotation | null>(null);
    const [selection, setSelection] = useState<{
        cfiRange: string;
        text: string;
    } | null>(null);
    const [selectedAnnotation, setSelectedAnnotation] = useState<
        Annotation | undefined
    >(undefined);

    const { mutate: saveCurrentLocation } = useSaveCurrentLocation(bookId);
    const lastPosition = book?.userDetails ? book.userDetails[0]?.last_position : '';

    useEffect(() => {
        const cachebook = async () => {
            // sample epub url https://nevezioullmxffvdlgyq.supabase.co/storage/v1/object/public/books/epubs/1730420518570-The%20Blade%20Itself%20(Joe%20Aberc_%20(Z-Library).epub

            if (epub_url && documentDirectory) {
                const fileName = epub_url.split('/').pop();
                if (!fileName) return;
                const fileInfo = await getFileInfo(`${documentDirectory}${fileName}`);

                if (fileInfo && fileInfo.exists) {
                    console.log('file exists *********************');
                    setBookFileUri(fileInfo.uri);
                    return;
                }
                const bookFileUri = await downloadFile(epub_url, fileName);
                setBookFileUri(bookFileUri.uri);
            }
        }

        cachebook();
    }, [documentDirectory, epub_url]);

    useEffect(() => {
        locationRef.current = currentLocation;
    }, [currentLocation]);

    useEffect(() => {
        return () => {
            console.log('ending session from reader');
            readingSessionId && locationRef.current && endSession({
                location: locationRef.current,
                sessionId: readingSessionId
            });
        };
    }, [readingSessionId]);

    const increaseFontSize = () => {
        if (currentFontSize < MAX_FONT_SIZE) {
            setCurrentFontSize(currentFontSize + 1);
            changeFontSize(`${currentFontSize + 1}px`);
        }
    };

    const decreaseFontSize = () => {
        if (currentFontSize > MIN_FONT_SIZE) {
            setCurrentFontSize(currentFontSize - 1);
            changeFontSize(`${currentFontSize - 1}px`);
        }
    };
    const switchTheme = () => {
        const index = Object.values(themes).indexOf(theme);
        const nextTheme =
            Object.values(themes)[(index + 1) % Object.values(themes).length];

        changeTheme(nextTheme);
    };

    const switchFontFamily = () => {
        const index = availableFonts.indexOf(currentFontFamily);
        const nextFontFamily = availableFonts[(index + 1) % availableFonts.length];

        setCurrentFontFamily(nextFontFamily);
        changeFontFamily(nextFontFamily);
    };

    if (isLoading) {
        return <Loading message='Fetching book' />
    }

    if (error || !book) {
        return <View><Text>Error loading book: {error?.message}</Text></View>;
    }

    console.log(JSON.stringify({
        fileSize,
        downloadProgress,
        downloadSuccess,
        downloadError,
        documentDirectory,
        bookFileUri
    }, null, 2))

    return (
        <GestureHandlerRootView
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: theme.body.background,
            }}
        >
            {!isFullScreen && (
                <Header
                    currentFontSize={currentFontSize}
                    increaseFontSize={increaseFontSize}
                    decreaseFontSize={decreaseFontSize}
                    switchTheme={switchTheme}
                    switchFontFamily={switchFontFamily}
                    onPressSearch={() => searchListRef.current?.present()}
                    onOpenBookmarksList={() => bookmarksListRef.current?.present()}
                    onOpenTableOfContents={() => tableOfContentsRef.current?.present()}
                    onOpenAnnotationsList={() => annotationsListRef.current?.present()}
                />
            )}
            {bookFileUri ?
                <Reader
                    src={bookFileUri}
                    onLocationChange={(_, currentLocation) => {
                        if (!currentLocation || currentLocation.start.location === -1) return;
                        saveCurrentLocation(currentLocation)

                        if (readingSessionId) return;
                        console.log('start session');
                    }}
                    width={width}
                    height={!isFullScreen ? height * 0.75 : height}
                    fileSystem={useFileSystem}
                    defaultTheme={Themes.DARK}

                    waitForLocationsReady
                    initialLocation={lastPosition ? lastPosition : ''}
                    initialAnnotations={[]}
                    onAddAnnotation={(annotation) => {
                        if (annotation.type === 'highlight' && annotation.data?.isTemp) {
                            setTempMark(annotation);
                        }
                    }}
                    onPressAnnotation={(annotation) => {
                        setSelectedAnnotation(annotation);
                        annotationsListRef.current?.present();
                    }}
                    menuItems={[
                        {
                            label: '🟡',
                            action: (cfiRange) => {
                                addAnnotation('highlight', cfiRange, undefined, {
                                    color: COLORS[2],
                                });
                                return true;
                            },
                        },
                        {
                            label: '🔴',
                            action: (cfiRange) => {
                                addAnnotation('highlight', cfiRange, undefined, {
                                    color: COLORS[0],
                                });
                                return true;
                            },
                        },
                        {
                            label: '🟢',
                            action: (cfiRange) => {
                                addAnnotation('highlight', cfiRange, undefined, {
                                    color: COLORS[3],
                                });
                                return true;
                            },
                        },
                        {
                            label: 'Add Note',
                            action: (cfiRange, text) => {
                                setSelection({ cfiRange, text });
                                addAnnotation('highlight', cfiRange, { isTemp: true });
                                annotationsListRef.current?.present();
                                return true;
                            },
                        },
                    ]}
                    onDoubleTap={() => setIsFullScreen((oldState) => !oldState)}
                />
                : null}

            <BookmarksList
                ref={bookmarksListRef}
                onClose={() => bookmarksListRef.current?.dismiss()}
            />

            <SearchList
                ref={searchListRef}
                onClose={() => searchListRef.current?.dismiss()}
            />

            <TableOfContents
                ref={tableOfContentsRef}
                onClose={() => tableOfContentsRef.current?.dismiss()}
                onPressSection={(selectedSection) => {
                    goToLocation(selectedSection.href.split('/')[1]);
                    tableOfContentsRef.current?.dismiss();
                }}
            />

            <AnnotationsList
                ref={annotationsListRef}
                selection={selection}
                selectedAnnotation={selectedAnnotation}
                annotations={annotations}
                onClose={() => {
                    setTempMark(null);
                    setSelection(null);
                    setSelectedAnnotation(undefined);
                    if (tempMark) removeAnnotation(tempMark);
                    annotationsListRef.current?.dismiss();
                }}
            />

            {!isFullScreen && <Footer />}
        </GestureHandlerRootView>
    );
}

export default EpubReader;