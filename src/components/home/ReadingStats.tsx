import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import StatCard from '@/components/shared/StatCard';
import { useBooksByStatus, useUserBook } from '@/hooks/useBooks';

const mockData = {
    "user": {
      "id": "usr_123",
      "name": "Sarah Chen",
      "avatarUrl": "https://picsum.photos/200",
      "readingStreak": 5,
      "joinedDate": "2024-01-15T08:00:00Z"
    },
    "readingStats": {
      "booksCurrentlyReading": 2,
      "totalBooksInLibrary": 24,
      "pagesReadThisWeek": 145,
      "readingStreak": {
        "current": 5,
        "longest": 14,
        "lastReadDate": "2024-03-19T15:30:00Z"
      }
    },
    "currentlyReading": [
      {
        "id": "book_789",
        "title": "The Psychology of Money",
        "author": "Morgan Housel",
        "coverUrl": "https://picsum.photos/200/300",
        "progress": {
          "percentage": 45,
          "currentPage": 156,
          "totalPages": 346,
          "lastReadAt": "2024-03-19T15:30:00Z",
          "currentChapter": "Chapter 7: Freedom",
          "estimatedTimeLeft": "3 hours 45 minutes"
        },
        "status": "reading"
      },
      {
        "id": "book_456",
        "title": "Atomic Habits",
        "author": "James Clear",
        "coverUrl": "https://picsum.photos/200/300",
        "progress": {
          "percentage": 23,
          "currentPage": 89,
          "totalPages": 387,
          "lastReadAt": "2024-03-18T20:15:00Z",
          "currentChapter": "Chapter 4: Make It Easy",
          "estimatedTimeLeft": "5 hours 30 minutes"
        },
        "status": "reading"
      }
    ],
    "recentlyAdded": [
      {
        "id": "book_234",
        "title": "Deep Work",
        "author": "Cal Newport",
        "coverUrl": "https://picsum.photos/200/300",
        "addedAt": "2024-03-17T10:00:00Z",
        "status": "to-read"
      },
      {
        "id": "book_567",
        "title": "Think Again",
        "author": "Adam Grant",
        "coverUrl": "https://picsum.photos/200/300",
        "addedAt": "2024-03-16T14:20:00Z",
        "status": "to-read"
      }
    ]
  };
  
const ReadingStats = () => {
    const { data: currentlyReading } = useBooksByStatus('reading');
    const { data: userBooks }= useUserBook();

    const booksCurrentlyReading = currentlyReading?.length || 0;
    const booksInLibrary = userBooks?.length || 0;
  return (
    <View style={tw`flex-row px-4 mt-6`}>
          <StatCard
            label="Reading Streak"
            value={`${mockData.readingStats.readingStreak.current} days`}
          />
          <StatCard
            label="Currently Reading"
            value={booksCurrentlyReading}
          />
          <StatCard
            label="Books in Library"
            value={booksInLibrary}
          />
        </View>
  )
}

export default ReadingStats