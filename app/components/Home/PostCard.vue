<template>
  <main class="flex flex-col items-center justify-center gap-12">
    <div v-for="post in posts" :key="post._id" class="w-full max-w-[550px]">
      <el-card class="w-full shadow-none" shadow="never">
        <!-- card header -->
        <template #header>
          <div class="card-header flex justify-between items-center">
            <div class="flex items-center gap-3 cursor-pointer">
              <el-avatar
                :size="50"
                :style="{
                  backgroundColor: 'black',
                  color: 'white',
                  fontSize: '20px',
                }"
              >
                {{ post.userId.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="flex flex-col justify-center gap-1">
                <p class="font-bold text-gray-700 text-lg">
                  {{ post.userId.name }}
                </p>
                <p class="text-gray-500 text-sm cursor-none">
                  {{ formatDate(post.createdAt) }}
                </p>
              </div>
            </div>
            <!-- follow -->
            <!-- follow button -->
            <button
              class="flex items-center gap-1"
              @click="follow(post.userId._id)"
              v-if="post.userId._id !== currentUserId && !post.isFollowed"
            >
              <Icon name="mdi:account-plus" class="w-6 h-6 text-gray-600" />
              <span class="text-gray-500"> Follow </span>
            </button>
            <!-- already following -->
            <button
              class="flex items-center gap-1"
              @click="follow(post.userId._id)"
              v-else
            >
              <Icon name="mdi:account-check" class="w-6 h-6 text-black" />
              <span class="text-gray-500"> Follwing </span>
            </button>
          </div>
        </template>

        <!-- card data -->
        <div class="flex flex-col gap-2 p-1">
          <img
            v-for="(img, index) in post.mediaUrls"
            :key="index"
            :src="img"
            alt="post image"
            class="max-h-[400px] object-fill"
          />
          <p>
            {{
              isExpanded[post._id] ? post.content : trimmedContent(post.content)
            }}
            <button
              v-if="post.content.length > maxLength"
              @click="toggleExpand(post._id)"
              class="text-blue-500 ml-1 underline"
            >
              {{ isExpanded[post._id] ? "See less" : "See more" }}
            </button>
          </p>
        </div>

        <!-- card footer -->
        <template #footer>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between mx-1">
              <p class="flex gap-1 text-gray-500">
                <span>{{ post.likesCount }}</span> Likes
              </p>
              <p class="flex gap-1 text-gray-500">
                <span>{{ post.commentsCount }}</span> Comments
              </p>
              <p class="flex gap-1 text-gray-500">
                <span>{{ post.sharesCount }}</span> Repost
              </p>
            </div>

            <div class="flex flex-col gap-6 md:flex-row md:justify-between">
              <!-- like post -->
              <div class="flex justify-between gap-16">
                <!--  -->
                <button class="flex items-center gap-1" @click="like(post._id)">
                  <Icon
                    name="mdi:heart"
                    :class="[
                      'w-6 h-6 transition-colors duration-300 ',
                      post.likedByUser ? 'text-red-700' : 'text-gray-500',
                    ]"
                  />
                  <span class="text-gray-600 hover:text-black">Like</span>
                </button>

                <!-- open comment modal -->
                <button
                  class="flex items-center gap-1 hover:text-black"
                  @click="openComments(post)"
                >
                  <Icon
                    name="mdi:comment-outline"
                    class="w-6 h-5 text-gray-500 hover:text-black"
                  />
                  Comment
                </button>
              </div>
              <div class="flex justify-between gap-16">
                <!-- repost -->
                <button
                  class="flex items-center gap-1"
                  @click="repost(post._id)"
                  v-if="!post.repostedByUser"
                >
                  <Icon
                    name="mdi:repeat-variant"
                    class="w-7 h-7 transition-colors duration-300 text-gray-500"
                  />
                  <span class="text-gray-600 hover:text-black">Repost</span>
                </button>
                <!-- reposted button -->
                <button
                  class="flex items-center gap-1"
                  v-if="post.repostedByUser"
                >
                  <Icon
                    name="mdi:repeat-variant"
                    class="w-7 h-7 transition-colors duration-300 text-black"
                  />
                  <span class="black">Reposted</span>
                </button>

                <!-- share button -->
                <button
                  class="flex items-center gap-1 hover:text-black"
                  @click="openShare(post._id)"
                >
                  <Icon
                    name="mdi:share-variant"
                    class="w-6 h-5 text-gray-500 hover:text-black"
                  />
                  Share
                </button>
              </div>
            </div>
          </div>
        </template>
      </el-card>
    </div>

    <!-- Comment Modal -->
    <el-dialog
      v-model="showCommentModal"
      :title="'Comments'"
      width="500px"
      :close-on-click-modal="true"
      @close="closeComments"
    >
      <div
        class="flex flex-col gap-3 max-h-96 overflow-y-auto"
        @click="showPicker = false"
      >
        <el-empty
          v-if="!currentComments || currentComments.length === 0"
          description="No comments found"
        />
        <div
          v-for="comment in currentComments"
          :key="comment._id"
          class="p-2 border-b flex justify-between items-start gap-2"
        >
          <div class="flex gap-2 items-start">
            <el-avatar
              :size="35"
              :style="{
                backgroundColor: '#6b7280',
                color: 'white',
                fontSize: '16px',
              }"
            >
              {{ comment.userId.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="flex flex-col">
              <p class="font-semibold text-gray-700">
                {{ comment.userId.name }}
              </p>
              <p class="text-gray-600">{{ comment.content }}</p>
              <p class="text-gray-400 text-xs">
                {{ formatDate(comment.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Comment Section -->
      <div class="mt-4 flex gap-2 items-center relative">
        <!-- emoji toggle -->
        <div class="relative">
          <button
            @click="showPicker = !showPicker"
            class="py-2 rounded hover:bg-gray-100"
          >
            <Icon
              name="mdi:emoticon-outline"
              class="w-6 h-6 text-gray-600 flex items-baseline"
            />
          </button>

          <div
            v-if="showPicker"
            class="absolute bottom-8 left-0 z-50 bg-white shadow-lg rounded-lg"
          >
            <vue3-emoji-picker @select="addEmoji" />
          </div>
        </div>

        <input
          type="text"
          v-model="commentInput"
          placeholder="Add a comment..."
          class="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-gray-600"
        />
        <button
          @click="submitComment"
          class="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </el-dialog>
    <!-- Share Modal -->
    <el-dialog
      v-model="showShareModal"
      title="Share this post"
      width="400px"
      :close-on-click-modal="true"
      @close="closeShare"
    >
      <div class="flex flex-col items-center gap-4">
        <p class="text-gray-600">Choose a platform to share:</p>
        <div class="flex gap-6">
          <!-- WhatsApp -->
          <button
            class="flex flex-col items-center hover:scale-110 transition"
            @click="share('whatsapp')"
          >
            <Icon name="mdi:whatsapp" class="w-10 h-10 text-green-500" />
            <span class="text-sm mt-1 text-gray-700">WhatsApp</span>
          </button>

          <!-- LinkedIn -->
          <button
            class="flex flex-col items-center hover:scale-110 transition"
            @click="share('linkedin')"
          >
            <Icon name="mdi:linkedin" class="w-10 h-10 text-blue-600" />
            <span class="text-sm mt-1 text-gray-700">LinkedIn</span>
          </button>
        </div>
      </div>
    </el-dialog>

    <!-- close emoji picker on outside click -->
    <div
      v-if="showPicker"
      class="fixed inset-0 z-40"
      @click="showPicker = false"
    />
  </main>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useSocialMediaStore } from "~~/stores/socialMedia";
import { useAuthStore } from "~~/stores/Auth";
import Vue3EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import { storeToRefs } from "pinia";

const store = useSocialMediaStore();
const posts = computed(() => store.posts);
// Get Authstore
const auth = useAuthStore();
const { user } = storeToRefs(auth); // reactive reference
const maxLength = 150;
const isExpanded = ref({});
const showPicker = ref(false);
const commentInput = ref("");
const showCommentModal = ref(false);
const currentPost = ref(null);
const currentComments = ref([]);

const showShareModal = ref(false);
const sharePostId = ref(null);
// Safe userid
const currentUserId = computed(() => user.value?.id || null);

onMounted(() => {
  store.fetchPosts();
  auth.loadAuthFromStorage();
});

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function toggleExpand(postId) {
  isExpanded.value[postId] = !isExpanded.value[postId];
}

function trimmedContent(content) {
  return content.length > maxLength
    ? content.slice(0, maxLength) + "..."
    : content;
}

function like(postId) {
  store.likePost(postId);
}
// repost
function repost(postId) {
  store.repostPost(postId);
}
// follow
function follow(userId) {
  store.followPost(userId);
}
// Open comment modal
async function openComments(post) {
  currentPost.value = post;
  showCommentModal.value = true;
  await store.fetchComments(post._id);
  currentComments.value = store.comments[post._id] ?? [];
}

// Close modal
function closeComments() {
  showCommentModal.value = false;
  currentPost.value = null;
  currentComments.value = [];
  commentInput.value = "";
  showPicker.value = false;
}

// Add emoji
function addEmoji(emoji) {
  commentInput.value += emoji.i;
}

// Submit comment
async function submitComment() {
  if (!commentInput.value.trim()) return;

  await store.addComment(currentPost.value._id, commentInput.value);
  ElMessage({
    message: "Comment added successfully",
    type: "success",
    duration: 2000, // 2 seconds
  });
  commentInput.value = "";
  showPicker.value = false;
}

// Open share modal
function openShare(postId) {
  sharePostId.value = postId;
  showShareModal.value = true;
}

// Close modal
function closeShare() {
  showShareModal.value = false;
  sharePostId.value = null;
}

// Share action
function share(platform) {
  if (!sharePostId.value) return;
  store.sharePost(sharePostId.value, platform);
  showShareModal.value = false;
}
</script>  