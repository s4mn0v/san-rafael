import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async fetchUser() {
      const { $supabase } = useNuxtApp();
      const { data: { user }, error } = await $supabase.auth.getUser();
      if (error || !user) {
        this.user = null;
        this.isAuthenticated = false;
        return;
      }
      this.user = user;
      this.isAuthenticated = true;
    },
  },
});