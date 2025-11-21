<template>
  <main class="flex justify-center">
    <el-card class="w-[948px] rounded-2xl" shadow="never">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <el-avatar :size="50" style="font-size: 18px; background-color: black">
          {{ userName ? userName.charAt(0).toUpperCase() : "U" }}
        </el-avatar>

        <p class="font-bold text-xl text-gray-700">
          {{ userName || "You" }}'s Connections
        </p>
      </div>

      <!-- Tabs -->
      <el-tabs v-model="activeTab" class="custom-tabs">
        <!-- Following Tab -->
        <el-tab-pane label="Following" name="following">
          <el-scrollbar height="500px">
            <el-empty
              v-if="following.length === 0"
              description="You are not following anyone"
            />

            <div v-else class="grid grid-cols-1 gap-4">
              <el-card v-for="user in following" :key="user._id" shadow="never">
                <div class="flex justify-between items-center gap-2">
                  <div class="flex items-center gap-3">
                    <el-avatar
                      :size="40"
                      :src="user.avatar || ''"
                      style="background-color: black; font-size: 14px"
                    >
                      {{ user.name?.charAt(0).toUpperCase() }}
                    </el-avatar>

                    <div>
                      <p
                        class="font-semibold text-gray-800 text-lg min-w-[100px]"
                      >
                        {{ user.name }}
                      </p>
                      <p class="text-gray-500 flex items-center gap-1">
                        <Icon name="mdi:location" />
                        {{ user.location || "Global" }}
                      </p>
                    </div>
                  </div>

                  <el-button size="large" @click="unfollow(user._id)">
                    <Icon name="mdi:account-minus" class="w-6 h-6 text-black" />
                    <span class="text-gray-500 ml-1 hidden sm:block"
                      >Unfollow</span
                    >
                  </el-button>
                </div>
              </el-card>
            </div>
          </el-scrollbar>
        </el-tab-pane>

        <!-- Find People Tab -->
        <el-tab-pane label="Find People" name="people">
          <el-scrollbar height="500px">
            <el-empty
              v-if="filteredPeople.length === 0"
              description="No people to show"
            />

            <div v-else class="grid grid-cols-1 gap-4">
              <el-card
                shadow="never"
                v-for="person in filteredPeople"
                :key="person._id"
              >
                <div class="flex justify-between items-center gap-2">
                  <div class="flex items-center gap-3">
                    <el-avatar
                      :size="40"
                      :src="person.avatar || ''"
                      style="background-color: black; font-size: 14px"
                    >
                      {{ person.name?.charAt(0).toUpperCase() }}
                    </el-avatar>

                    <div>
                      <p
                        class="font-semibold text-gray-800 text-lg min-w-[100px]"
                      >
                        {{ person.name }}
                      </p>
                      <p class="text-gray-500 flex items-center gap-1">
                        <Icon name="mdi:location" />
                        {{ person.location || "Global" }}
                      </p>
                    </div>
                  </div>

                  <el-button size="large" @click="follow(person._id)">
                    <Icon name="mdi:account-plus" class="w-6 h-6 text-black" />
                    <span class="text-gray-500 ml-1 hidden sm:block"
                      >Follow</span
                    >
                  </el-button>
                </div>
              </el-card>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </main>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useFriendsStore } from "~~/stores/Friends";
import { useSocialMediaStore } from "~~/stores/socialMedia";
import { useAuthStore } from "~~/stores/Auth";

definePageMeta({ layout: "home" });

const auth = useAuthStore();
const friendsStore = useFriendsStore();
const socialStore = useSocialMediaStore();

const activeTab = ref("following");

const userName = computed(() => auth.user?.name || "Guest");

// --- Load data on mount ---
onMounted(async () => {
  await Promise.all([
    friendsStore.fetchFollowing(),
    friendsStore.fetchFollowers(),
    friendsStore.fetchPeople(),
  ]);
});

// Reactive getters
const following = computed(() => friendsStore.following);
const people = computed(() => friendsStore.people);

// Filter People (hide already followed users)
const filteredPeople = computed(() => {
  return people.value.filter(
    (p) => !following.value.some((f) => f._id === p._id)
  );
});

// FOLLOW
const follow = async (userId) => {
  await socialStore.followPost(userId);
  await friendsStore.fetchFollowing(); // refresh instantly
};

// UNFOLLOW
const unfollow = async (userId) => {
  await socialStore.followPost(userId);
  await friendsStore.fetchFollowing(); // refresh instantly
};
</script>

<style scoped>
:deep(.custom-tabs .el-tabs__item.is-active) {
  color: #b326c2;
  font-weight: 600;
}
:deep(.custom-tabs .el-tabs__active-bar) {
  background-color: #b326c2;
}
</style>
