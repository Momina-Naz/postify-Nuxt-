// stores/user.js
import { defineStore } from "pinia";
import api from "~~/utils/api";

export const useUserStore = defineStore("User", {
  state: () => ({
    posts: [],
    loading: false,
    coverUrl: "/images/park.png",
    error: null,
  }),
  actions: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        const res = await api.get(`/api/v1/users/me/posts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        this.posts = res.data.data || [];
      } catch (err) {
        this.error = err.message || "Failed to fetch posts";
      } finally {
        this.loading = false;
      }
    },
    // delete post
    async deletePost(postId) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        await api.delete(`/api/v1/posts/${postId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Remove the deleted post locally
        this.posts = this.posts.filter((post) => post._id !== postId);
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || "Failed to delete post";
      } finally {
        this.loading = false;
      }
    },

    // cover url
    setCover(url) {
      this.coverUrl = url;
    },
  },
});
