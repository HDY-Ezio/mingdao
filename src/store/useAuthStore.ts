/**
 * Auth Store - 用户状态管理
 * 使用 Zustand
 */
import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  signOut: () => set({ user: null, isAuthenticated: false }),
}))

// Path: /app/data/所有对话/主对话/mingdao/src/store/useAuthStore.ts
