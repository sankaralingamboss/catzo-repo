import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, handleSupabaseError } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      // Demo mode - check localStorage
      const demoUser = localStorage.getItem('demo-user');
      if (demoUser) {
        const userData = JSON.parse(demoUser);
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name
        });
      }
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    if (!supabase) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const newProfile = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User'
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', handleSupabaseError(createError));
          setLoading(false);
          return;
        }

        setUser({
          id: createdProfile.id,
          email: createdProfile.email,
          name: createdProfile.name,
          phone: createdProfile.phone || undefined,
          address: createdProfile.address || undefined
        });
      } else if (error) {
        console.error('Error fetching profile:', handleSupabaseError(error));
      } else if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          phone: profile.phone || undefined,
          address: profile.address || undefined
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', handleSupabaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) return { error: new Error('Supabase not initialized') };

    // Also clear demo user
    localStorage.removeItem('demo-user');
    localStorage.removeItem('demo-cart');
    localStorage.removeItem('demo-orders');
    setUser(null);

    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setUser({
        ...user,
        ...updates
      });
    }

    return { data, error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };
};