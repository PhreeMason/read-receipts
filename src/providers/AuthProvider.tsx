import supabase from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import {
    PropsWithChildren,
    createContext,
    useEffect,
    useState,
    useContext,
} from 'react';
import { Profile } from '@/types/index';

type AuthData = {
    session: Session | null;
    loading: boolean;
    profile: Profile | null;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthData>({
    loading: false,
    session: null,
    profile: null,
    signOut: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

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

        supabase.auth.onAuthStateChange((_event, authSession) => {
            setSession(authSession);
        });
    }, []);
    const providerValue = {
        session,
        loading,
        profile,
        signOut: async () => {
            try {
                await supabase.auth.signOut();
                setSession(null);
                setProfile(null);
            } catch (error) {
                console.log('error signing out', error);
            }
        },
    };
    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
