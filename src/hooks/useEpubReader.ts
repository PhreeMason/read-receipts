// src/hooks/useEpubReader.ts
import { useState, useRef, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useReader, Annotation } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { useSaveCurrentLocation, useBookDetails } from '@/hooks/useBooks';
import { useEndSession, useStartSession } from '@/hooks/useReadingSession';
import { useFetchAnnotations, useCreateAnnotation } from '@/hooks/useAnnotations';
import { MAX_FONT_SIZE, MIN_FONT_SIZE, availableFonts, themes } from '@/components/reader/utils';

export const useEpubReader = (bookId: string) => {
  const { width, height } = useWindowDimensions();
  const {
    data: book,
    error,
    isLoading
  } = useBookDetails(bookId);
  
  const {
    downloadFile,
    getFileInfo,
    documentDirectory
  } = useFileSystem();

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

  // Modal refs
  const bookmarksListRef = useRef<BottomSheetModal>(null);
  const searchListRef = useRef<BottomSheetModal>(null);
  const tableOfContentsRef = useRef<BottomSheetModal>(null);
  const annotationsListRef = useRef<BottomSheetModal>(null);

  // State
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
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | undefined>(undefined);

  // Mutations
  const { mutate: endSession } = useEndSession();
  const { mutate: startSession } = useStartSession(bookId);
  const { mutate: createAnnotation } = useCreateAnnotation();
  const { mutate: saveCurrentLocation } = useSaveCurrentLocation(bookId);
  const { data: annotationsData } = useFetchAnnotations(bookId);

  // File caching effect
  useEffect(() => {
    const cacheBook = async () => {
      if (!book?.epub_url || !documentDirectory) return;
      
      const fileName = book.epub_url.split('/').pop();
      if (!fileName) return;
      
      const fileInfo = await getFileInfo(`${documentDirectory}${fileName}`);
      if (fileInfo?.exists) {
        setBookFileUri(fileInfo.uri);
        return;
      }

      const bookFile = await downloadFile(book.epub_url, fileName);
      setBookFileUri(bookFile.uri);
    };

    cacheBook();
  }, [documentDirectory, book?.epub_url]);

  // Session cleanup effect
  useEffect(() => {
    return () => {
      if (currentLocation && readingSessionId) {
        endSession({ location: currentLocation, sessionId: readingSessionId });
      }
    };
  }, [currentLocation, readingSessionId]);

  // Font size handlers
  const handleIncreaseFontSize = () => {
    if (currentFontSize < MAX_FONT_SIZE) {
      setCurrentFontSize(currentFontSize + 1);
      changeFontSize(`${currentFontSize + 1}px`);
    }
  };

  const handleDecreaseFontSize = () => {
    if (currentFontSize > MIN_FONT_SIZE) {
      setCurrentFontSize(currentFontSize - 1);
      changeFontSize(`${currentFontSize - 1}px`);
    }
  };

  // Theme and font handlers
  const handleSwitchTheme = () => {
    const index = Object.values(themes).indexOf(theme);
    const nextTheme = Object.values(themes)[(index + 1) % Object.values(themes).length];
    changeTheme(nextTheme);
  };

  const handleSwitchFontFamily = () => {
    const index = availableFonts.indexOf(currentFontFamily);
    const nextFontFamily = availableFonts[(index + 1) % availableFonts.length];
    setCurrentFontFamily(nextFontFamily);
    changeFontFamily(nextFontFamily);
  };

  // Modal handlers
  const closeAllModals = () => {
    bookmarksListRef.current?.dismiss();
    searchListRef.current?.dismiss();
    tableOfContentsRef.current?.dismiss();
    annotationsListRef.current?.dismiss();
  };

  const handleOpenBookmarks = () => {
    closeAllModals();
    bookmarksListRef.current?.present();
  };

  const handleOpenSearch = () => {
    closeAllModals();
    searchListRef.current?.present();
  };

  const handleOpenTableOfContents = () => {
    closeAllModals();
    tableOfContentsRef.current?.present();
  };

  const handleOpenAnnotations = () => {
    closeAllModals();
    annotationsListRef.current?.present();
  };

  return {
    // State
    book,
    error,
    isLoading,
    isFullScreen,
    bookFileUri,
    currentFontSize,
    currentFontFamily,
    theme,
    annotations,
    tempMark,
    selection,
    selectedAnnotation,
    annotationsData,
    
    // Refs
    bookmarksListRef,
    searchListRef,
    tableOfContentsRef,
    annotationsListRef,
    
    // Dimensions
    width,
    height,
    
    // Handlers
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
    closeAllModals,
    
    // Reader functions
    goToLocation,
    addAnnotation,
    removeAnnotation,
    
    // Mutations
    createAnnotation,
    saveCurrentLocation
  };
};