import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/utils/supabase-storage';

export function useAvatar(userId: string | undefined) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchAvatar = async () => {
      try {
        const url = await getAvatarUrl(userId);
        setAvatarUrl(url);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatar();
  }, [userId]);

  return { avatarUrl, isLoading, error };
}
