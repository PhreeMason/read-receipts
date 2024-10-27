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
};

const AuthContext = createContext<AuthData>({
    isLoading: false,
    session: null,
    profile: null,
    signOut: async () => { },
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
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as AuthError };
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

    const providerValue = {
        session,
        isLoading,
        profile,
        signOut,
        signIn
    };
    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
