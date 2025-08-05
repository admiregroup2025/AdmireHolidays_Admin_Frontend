// /src/stores/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { ENV } from '../constants/api';
import { toast } from 'react-toastify';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      role: null,
      username: null,
      token: null,
      loading: false,
      authChecked: false,
      error: null,

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.post('/admin/admin-login', data);
          const { role, username, token, msg } = response.data;

          set({
            isLoggedIn: true,
            role,
            username,
            token,
            loading: false,
            error: null,
            authChecked: true,
          });

          toast.success(msg || 'Login successful');
          return true;
        } catch (error) {
          const errMsg =
            error.response?.data?.message || error.response?.data?.msg || 'Login failed';
          set({ error: errMsg, loading: false, authChecked: true });
          toast.error(errMsg);
          return false;
        }
      },

      logout: () => {
        set({
          isLoggedIn: false,
          role: null,
          username: null,
          token: null,
          error: null,
          authChecked: true,
        });
        toast.success('Logged out successfully');
      },

      checkAuthOnLoad: async () => {
        const token = get().token;
        if (!token) {
          set({ authChecked: true });
          return;
        }

        set({ loading: true });
        try {
          const response = await apiClient.get('/admin/me');
          const { role, userId, msg } = response.data;

          set({
            isLoggedIn: true,
            role,
            username: userId,
            loading: false,
            authChecked: true,
          });

          console.log(msg || 'Session is valid.');
        } catch (err) {
          console.error('Auth check failed:', err?.response?.data?.msg || err.message);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        username: state.username,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

// Token injection stays the same
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default useAuthStore;
