// src/components/reader/EpubReader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Reader, Themes } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from './Header';
import { Footer } from './Footer';
import { BookmarksList } from './BookmarksList';
import { SearchList } from './SearchList';
import { TableOfContents } from './TableOfContents';
import { COLORS } from './AnnotationForm';
import { AnnotationsList } from './AnnotationsList';
import { Loading } from '../shared/Loading';
import { useEpubReader } from '@/hooks/useEpubReader';
import { ReaderErrorBoundary } from './ReaderErrorBoundary';
import tw from 'twrnc';

interface Props {
    bookId: string;
}

function EpubReader({ bookId }: Props) {
    const insets = useSafeAreaInsets();
    const {
        // Destructure all needed values from the hook
        book,
        error,
        isLoading,
        isFullScreen,
        bookFileUri,
        currentFontSize,
        theme,
        annotations,
        tempMark,
        selection,
        selectedAnnotation,
        annotationsData,
        width,
        height,
        bookmarksListRef,
        searchListRef,
        tableOfContentsRef,
        annotationsListRef,
        setIsFullScreen,
        setTempMark,
        setSelection,
        setSelectedAnnotation,
        handleIncreaseFontSize,
        handleDecreaseFontSize,
        handleSwitchTheme,
        handleSwitchFontFamily,
        handleOpenBookmarks,
        handleOpenSearch,
        handleOpenTableOfContents,
        handleOpenAnnotations,
        goToLocation,
        addAnnotation,
        removeAnnotation,
        deleteAnnotation,
        reloadBook,
        createAnnotation,
        saveCurrentLocation
    } = useEpubReader(bookId);

    if (isLoading) {
        return <Loading message="Fetching book" />;
    }

    if (error || !book) {
        return (
            <View style={tw`flex-1 items-center justify-center p-4`}>
                <Text style={tw`text-red-500`}>Error loading book: {error?.message}</Text>
            </View>
        );
    }

    const lastPosition = book?.userDetails?.[0]?.last_position ?? '';

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
            <ReaderErrorBoundary onRetry={reloadBook}>
                {!isFullScreen && (
                    <Header
                        currentFontSize={currentFontSize}
                        increaseFontSize={handleIncreaseFontSize}
                        decreaseFontSize={handleDecreaseFontSize}
                        switchTheme={handleSwitchTheme}
                        switchFontFamily={handleSwitchFontFamily}
                        onPressSearch={handleOpenSearch}
                        onOpenBookmarksList={handleOpenBookmarks}
                        onOpenTableOfContents={handleOpenTableOfContents}
                        onOpenAnnotationsList={handleOpenAnnotations}
                    />
                )}

                {bookFileUri && (
                    <Reader
                        src={bookFileUri}
                        onLocationChange={(_, currentLocation) => {
                            if (!currentLocation || currentLocation.start.location === -1) return;
                            saveCurrentLocation(currentLocation);
                        }}
                        width={width}
                        height={!isFullScreen ? height * 0.75 : height}
                        fileSystem={useFileSystem}
                        defaultTheme={Themes.DARK}
                        waitForLocationsReady
                        initialLocation={lastPosition}
                        initialAnnotations={annotationsData}
                        onAddAnnotation={(annotation) => {
                            if (annotation.type === 'highlight' && annotation.data?.isTemp) {
                                setTempMark(annotation);
                                return;
                            }
                            createAnnotation({ annotation, bookId });
                        }}
                        onPressAnnotation={(annotation) => {
                            setSelectedAnnotation(annotation);
                            annotationsListRef.current?.present();
                        }}
                        menuItems={[
                            {
                                label: '🟡',
                                action: (cfiRange) => {
                                    addAnnotation('highlight', cfiRange, undefined, { color: COLORS[2] });
                                    return true;
                                },
                            },
                            {
                                label: '🔴',
                                action: (cfiRange) => {
                                    addAnnotation('highlight', cfiRange, undefined, { color: COLORS[0] });
                                    return true;
                                },
                            },
                            {
                                label: '🟢',
                                action: (cfiRange) => {
                                    addAnnotation('highlight', cfiRange, undefined, { color: COLORS[3] });
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
                        onDoubleTap={() => setIsFullScreen((prev) => !prev)}
                    />
                )}

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
                    deleteAnnotation={deleteAnnotation}
                    onClose={() => {
                        setTempMark(null);
                        setSelection(null);
                        setSelectedAnnotation(undefined);
                        if (tempMark) removeAnnotation(tempMark);
                        annotationsListRef.current?.dismiss();
                    }}
                />

                {!isFullScreen && <Footer />}
            </ReaderErrorBoundary>
        </GestureHandlerRootView>
    );
}

export default EpubReader;