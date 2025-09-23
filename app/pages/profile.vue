<template>
  <div class="flex flex-col max-w-4xl mx-auto">
    <!-- cover photo -->
    <div class="relative w-full">
      <img :src="coverUrl" alt="cover img" class="h-80 w-full object-fill" />

      <!-- camera icon -->
      <el-upload
        ref="uploadRef"
        class="absolute top-2 right-2"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleFileChange"
      >
        <template #trigger>
          <Icon
            name="mdi:camera"
            class="w-8 h-8 p-1 bg-gray-700 rounded-full shadow cursor-pointer"
          />
        </template>
      </el-upload>
    </div>

    <!-- profile info -->
    <div
      class="relative -mt-14 flex flex-row items-start max-w-4xl w-full px-6"
    >
      <div class="relative">
        <el-avatar
          :size="130"
          :style="{ backgroundColor: '#374151', fontSize: '30px' }"
        >
          {{ userName ? userName.charAt(0).toUpperCase() : "Guest" }}
        </el-avatar>
      </div>
    </div>

    <!-- user info -->
    <div class="flex flex-col gap-2 m-1">
      <p class="font-bold text-3xl text-gray-700">{{ userName }}</p>
      <p class="text-lg text-gray-600">{{ bio }}</p>
      <div class="flex gap-5">
        <p class="text-lg text-gray-600">{{ address }}</p>
        <p class="text-lg text-gray-600">
          <span><Icon name="mdi:location" class="mx-2 h-5 w-5" /></span
          >{{ location }}
        </p>
      </div>
      <div class="flex gap-5 mt-4">
        <p class="text-lg text-gray-600 hover:border-b border-gray-600">
          All posts
          <span>{{ totalPosts }}</span>
        </p>
      </div>
    </div>

    <!-- posts list -->
    <div class="flex flex-col gap-4 mt-6 max-w-[650px] items-center mx-auto">
      <el-card
        shadow="never"
        v-for="post in posts"
        :key="post._id"
        class="w-full p-4 shadow-md"
      >
        <div v-if="post.mediaUrls && post.mediaUrls.length">
          <img
            v-for="(url, index) in post.mediaUrls"
            :key="index"
            :src="url"
            alt="post img"
            class="max-h-[300px] object-fill w-full"
          />
        </div>
        <p class="mb-2 text-gray-600">{{ post.content }}</p>
        <div class="flex gap-4 text-gray-600 mt-2">
          <p class="text-gray-700 font-semibol">Likes: {{ post.likesCount }}</p>
          <p class="text-gray-700 font-semibol">
            Comments: {{ post.commentsCount }}
          </p>
          <p class="text-gray-700 font-semibol">
            Reposts: {{ post.sharesCount }}
          </p>
        </div>
        <button @click="deletePost(post._id)" class="mt-4">
          <Icon
            name="mdi:trash"
            class="text-black hover:text-red-700 h-6 w-6"
          />
        </button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "~~/stores/User";
import { useAuthStore } from "~~/stores/Auth";
definePageMeta({ layout: "home" });

const store = useAuthStore();
const userStore = useUserStore();

const userName = computed(() => store.user?.name);
const bio = ref("Bio of the user");
const location = ref("Global");
const address = ref("@bcfou23hw810199");

const coverUrl = computed(() => userStore.coverUrl);
const uploadRef = ref("");

const posts = computed(() => userStore.posts || []);

// total posts
const totalPosts = computed(() => posts.value.length);
onMounted(() => {
  userStore.fetchPosts();
  store.loadAuthFromStorage();
});
const handleFileChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    userStore.setCover(e.target.result);
  };
  reader.readAsDataURL(file.raw);
};
// delete post
const deletePost = (postId) => {
  userStore.deletePost(postId);
};
</script>




      







