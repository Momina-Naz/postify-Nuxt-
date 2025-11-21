import { defineStore } from "pinia";
import api from "~~/utils/api";

export const useFriendsStore = defineStore("Friends", {
  state: () => ({
    followers: [],
    following: [],
    people: [],
    loading: false,
    error: null,
  }),

  actions: {
    // USERS I FOLLOW
    async fetchFollowing() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/v1/follows/following", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        this.following = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // USERS WHO FOLLOW ME
    async fetchFollowers() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/v1/follows/followers", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        this.followers = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // ALL USERS
    async fetchPeople() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/v1/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        this.people = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
