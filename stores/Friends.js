import { defineStore } from "pinia";
import api from "~~/utils/api";

export const useFriendsStore = defineStore("Friends", {
  state: () => ({
    friends: [],
    people: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Fetch friends from API
    async fetchfriends() {
      this.loading = true;
      this.error = null;
      console.log("Fetching friends...");

      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/v1/follows/following", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("API response:", response.data.data);
        this.friends = response.data.data;
        console.log("friends after assignment:", this.friends);
      } catch (err) {
        this.error = err.message || "Failed to fetch friends";
        console.error("Error fetching friends:", this.error);
      } finally {
        this.loading = false;
        console.log("Fetching finished. Loading =", this.loading);
      }
    },
    // Fetch friends from API
    async fetchPeople() {
      this.loading = true;
      this.error = null;
      console.log("Fetching people...");

      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/v1/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("API response:", response.data.data);
        this.people = response.data.data;
        console.log("people after assignment:", this.people);
      } catch (err) {
        this.error = err.message || "Failed to fetch people";
        console.error("Error fetching people:", this.error);
      } finally {
        this.loading = false;
        console.log("Fetching finished. Loading =", this.loading);
      }
    },
  },
});
