import supabase from '@/lib/supabase';
import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js';
import {
    PropsWithChildren,
    createContext,
    useEffect,
    useState,
    useContext,
} from 'react';
import { Profile } from '@/types/auth';
import { router, useSegments } from 'expo-router';

type AuthData = {
    session: Session | null;
    isLoading: boolean;
    profile: Profile | null;
    signOut: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signUp: (email: string, password: string, username: string, avatarBase64?: string) => Promise<AuthResponse>;
    updateProfile: (updates: Partial<Profile>) => Promise<AuthResponse | { data: null; error: Error }>;
};

const AuthContext = createContext<AuthData>({
    isLoading: false,
    session: null,
    profile: null,
    signOut: async () => { },
    signIn: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    updateProfile: async () => ({ data: { user: null, session: null }, error: null }),
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const segments = useSegments();

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            const sess = data.session;
            setSession(sess);
            if (sess) {
                // fetch profile
                const response = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sess.user.id)
                    .single();
                setProfile(response.data || null);
            }

            setLoading(false);
        };
        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, authSession) => {
            setSession(authSession ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!isLoading) {
          const inAuthGroup = segments[0] === '(auth)';
          
          if (!session && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace('/login');
          } else if (session && inAuthGroup) {
            // Redirect to home if already authenticated
            router.replace('/');
          }
        }
      }, [session, segments, isLoading]);

      const signIn = async (email: string, password: string) => {
        try {
            const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
                email,
                password,
            });
    
            if (error) throw error;
            return { data: { user: data.user, session: data.session }, error: null };
        } catch (error) {
            return { data: { user: null, session: null }, error: error as AuthError };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const signUp = async (email: string, password: string, username: string, avatarBase64?: string) => {
        try {
            const { data, error }: AuthResponse = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        avatar: avatarBase64
                    }
                }
            });
    
            if (error) throw error;
            return { data: { user: data.user, session: data.session }, error: null };
        } catch (error) {
            return { data: { user: null, session: null }, error: error as AuthError };
        }
    }

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!profile?.id) {
          return { data: null, error: new Error('Profile not found') };
        };
    
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id)
            .select()
            .single();
    
          if (error) throw error;
          setProfile(data);
          return { data, error: null };
        } catch (err) {
          return { data: null, error: err as Error };
        }
      };

    const providerValue = {
        session,
        isLoading,
        profile,
        signOut,
        signIn,
        signUp,
        updateProfile
    };
    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
