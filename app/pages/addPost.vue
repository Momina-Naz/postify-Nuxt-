<template>
  <div class="flex justify-center mt-10">
    <el-card class="w-[900px] rounded-2xl" shadow="never">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <el-avatar :size="50" style="font-size: 18px; background-color: black"
          >M
          <!-- {{ userName.charAt(0).toUpperCase() }} -->
        </el-avatar>

        <div>
          <p class="font-bold text-lg text-gray-700">
            {{ (user && user.name) || "You" }}
          </p>
          <small class="text-gray-500">Share your thoughts</small>
        </div>
      </div>

      <!-- Post Content -->
      <el-input
        type="textarea"
        v-model="content"
        placeholder="What's on your mind?"
        :rows="4"
        class="mb-3"
      />

      <!-- Image Preview -->
      <div v-if="mediaPreview" class="relative mb-3">
        <img
          :src="mediaPreview"
          alt="preview"
          class="rounded-xl max-h-64 w-full object-contain"
        />
        <el-button
          type="danger"
          size="small"
          class="absolute top-2 right-2"
          circle
          @click="removeImage"
        >
          <Icon name="mdi:close" width="20" height="20" />
        </el-button>
      </div>

      <!-- Upload + Visibility -->
      <div class="flex items-center justify-between mb-4">
        <label
          class="flex items-center gap-2 cursor-pointer text-purple-700 hover:text-purple-800"
        >
          <i class="el-icon-picture"></i>
          <span class="font-semibold">Add Photo</span>
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </label>

        <!-- Submit -->
        <el-button
          style="background-color: black; color: white"
          :loading="loading"
          @click="handleSubmit"
          round
        >
          Post
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSocialMediaStore } from "~~/stores/socialMedia";
import { useRoute } from "vue-router";
definePageMeta({ layout: "home" });

const store = useSocialMediaStore();
const router = useRouter();
// state
const content = ref("");
const mediaFile = ref(null);
const mediaPreview = ref(null);

const loading = ref(false);

const user = ref(null);
onMounted(() => {
  try {
    const raw = localStorage.getItem("user");
    user.value = raw ? JSON.parse(raw) : null;
  } catch {
    user.value = null;
  }
});

// file change
const handleFileChange = (e) => {
  const file = e.target.files && e.target.files[0];
  mediaFile.value = file || null;
  mediaPreview.value = file ? URL.createObjectURL(file) : null;
};

// remove selected image
const removeImage = () => {
  mediaFile.value = null;
  mediaPreview.value = null;
};

// submit
const handleSubmit = async () => {
  if (!content.value.trim() && !mediaFile.value) {
    ElMessage.warning("Please add content or upload a file.");
    return;
  }

  loading.value = true;

  const newPost = await store.createPost({
    content: content.value,
    mediaFile: mediaFile.value,
  });

  loading.value = false;

  if (newPost) {
    content.value = "";
    removeImage();
    ElMessage.success("Your post has been created!");
    router.push("/");
  }
};
</script>

