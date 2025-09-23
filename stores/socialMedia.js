import { defineStore } from "pinia";
import api from "~~/utils/api";
export const useSocialMediaStore = defineStore("socialMedia", {
  state: () => ({
    posts: [],
    loading: false,
    error: null,
    comments: {}, // store comments per postId
  }),
  actions: {
    // Fetch posts from API
    async fetchPosts() {
      this.loading = true;
      this.error = null;
      console.log("Fetching posts...");

      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/v1/posts", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("API response:", response.data.data.posts);
        this.posts = response.data.data.posts;
        console.log("Posts after assignment:", this.posts);
      } catch (err) {
        this.error = err.message || "Failed to fetch posts";
        console.error("Error fetching posts:", this.error);
      } finally {
        this.loading = false;
        console.log("Fetching finished. Loading =", this.loading);
      }
    },

    // Like a post
    async likePost(postId) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User must be logged in.");
          return;
        }

        const post = this.posts.find((p) => p._id === postId);
        if (!post) return;

        const action = post.likedByUser ? "unlike" : "like";
        await api.post(
          `/api/v1/likes/${postId}`,
          { action },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (action === "like") {
          post.likesCount = post.likesCount ? post.likesCount + 1 : 1;
          post.likedByUser = true;
        } else {
          post.likesCount = post.likesCount > 0 ? post.likesCount - 1 : 0;
          post.likedByUser = false;
        }

        console.log(`Post ${action}d successfully`);
      } catch (err) {
        console.error("Failed to toggle like:", err.message);
      }
    },
    //  repost

    async repostPost(postId) {
      try {
        const token = localStorage.getItem("token");
        const response = await api.post(
          `/api/v1/shares/${postId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const repostedPost = response.data.data;

        // update global feed count
        const post = this.posts.find((p) => p._id === postId);
        if (post) {
          post.sharesCount = (post.sharesCount || 0) + 1;
          post.repostedByUser = true;
        }

        return repostedPost;
      } catch (err) {
        console.error("Failed to repost:", err.message);
        throw err;
      }
    },
    // follow / unfollow user
    async followPost(userId) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User not authenticated.");
          return;
        }

        //  Toggle post follow status in UI instantly
        this.posts = this.posts.map((p) => {
          if (p.userId._id === userId) {
            const isCurrentlyFollowed = p.isFollowed || false;
            const isFollowed = !isCurrentlyFollowed; // toggle
            return {
              ...p,
              isFollowed,
              followersCount: isFollowed
                ? (p.followersCount || 0) + 1
                : Math.max((p.followersCount || 1) - 1, 0),
            };
          }
          return p;
        });

        this.posts = [...this.posts]; // force reactivity

        //  Call API (after updating UI for instant effect)
        await api.post(
          `/api/v1/follows/${userId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Toggled follow for user:", userId);
      } catch (err) {
        console.error("Failed to toggle follow:", err.message);
      }
    },

    // create post
    async createPost({ content, mediaFile, isPublic }) {
      try {
        let mediaUrls = [];

        if (mediaFile) {
          const formData = new FormData();
          formData.append("image", mediaFile);

          const uploadRes = await api.post("/api/v1/upload/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const imageUrl = uploadRes.data?.data?.url;
          if (!imageUrl) {
            throw new Error(
              "Image upload failed: " + JSON.stringify(uploadRes.data)
            );
          }

          mediaUrls.push(imageUrl);
        }

        const token = localStorage.getItem("token");
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const payload = {
          content: content.trim(),
          mediaUrls,
          isPublic,
        };

        const response = await api.post("/api/v1/posts", payload, { headers });
        const newPost = response.data.data;

        this.posts.unshift(newPost);
        return newPost;
      } catch (err) {
        console.error(
          "Failed to create post:",
          err.response?.data || err.message
        );
        return null;
      }
    },

    // fetch all comments
    async fetchComments(postId) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User must be logged in.");
          return;
        }

        const response = await api.get(`/api/v1/comments/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.comments[postId] = response.data.data || [];

        console.log(` Comments for post ${postId}:`, this.comments[postId]);
      } catch (err) {
        console.error(" Failed to fetch comments:", err.message);
        this.comments[postId] = [];
      }
    },

    // Add a comment to a post
    async addComment(postId, content) {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // current user
        if (!token || !user) return null;

        if (!content.trim()) return null;

        const response = await api.post(
          `/api/v1/comments/${postId}`,
          { content },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Use the whole comment object (not just the content string)
        const newComment = response.data.data;

        // Attach user info for immediate display (optional: adjust according to backend schema)
        newComment.userId = user;

        if (!this.comments[postId]) this.comments[postId] = [];
        this.comments[postId].unshift(newComment); // add on top

        const post = this.posts.find((p) => p._id === postId);
        if (post) post.commentsCount = (post.commentsCount || 0) + 1;

        return newComment;
      } catch (err) {
        console.error("Failed to add comment:", err.message);
        return null;
      }
    },
    // Share a post
    async sharePost(postId, platform) {
      try {
        const token = localStorage.getItem("token");

        //  First save the share in your backend
        await api.post(
          `/api/v1/shares/${postId}`,
          { sharedContent: `Shared via ${platform}` },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        //  Ask for confirmation before opening external share
        await ElMessageBox.confirm(
          `Do you want to share this post on ${platform}?`,
          "Confirm Share",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: "info",
          }
        );

        // If user clicks Yes → open the external share
        const postUrl = `${window.location.origin}/post/${postId}`;
        if (platform === "whatsapp") {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              "Check this out: " + postUrl
            )}`,
            "_blank"
          );
        } else if (platform === "linkedin") {
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              postUrl
            )}`,
            "_blank"
          );
        }

        ElMessage.success("Post shared successfully!");
      } catch (err) {
        if (err === "cancel") {
          ElMessage.info("Share cancelled");
        } else {
          console.error("Failed to share post:", err.message);
          ElMessage.error("Failed to share post!");
        }
      }
    },
  },
});
