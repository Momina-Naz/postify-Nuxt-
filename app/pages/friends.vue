<template>
  <main class="flex justify-center">
    <el-card class="w-[950px] rounded-2xl" shadow="never">
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
        <!-- Friends / Following -->
        <el-tab-pane label="Following" name="friends">
          <el-scrollbar height="500px">
            <el-empty
              v-if="!friends || friends.length === 0"
              description="You are not following anyone"
            />

            <div v-else class="grid grid-cols-1 gap-4">
              <el-card
                shadow="never"
                v-for="friend in friends"
                :key="friend._id"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <el-avatar
                      :size="40"
                      :src="friend.avatar || ''"
                      style="background-color: black; font-size: 14px"
                    >
                      {{ friend.name?.charAt(0).toUpperCase() }}
                    </el-avatar>
                    <div>
                      <p class="font-semibold text-gray-800 text-lg">
                        {{ friend.name }}
                      </p>
                      <p class="text-gray-500 flex items-center gap-1">
                        <Icon name="mdi:location" />
                        {{ friend.location || "Global" }}
                      </p>
                    </div>
                  </div>

                  <el-button size="large" @click="follow(friend._id)">
                    <Icon name="mdi:account-minus" class="w-6 h-6 text-black" />
                    <span class="text-gray-500 ml-1"> UnFollow </span>
                  </el-button>
                </div>
              </el-card>
            </div>
          </el-scrollbar>
        </el-tab-pane>

        <!-- Find People -->
        <el-tab-pane label="Find People" name="people">
          <el-scrollbar height="500px">
            <el-empty
              v-if="!people || people.length === 0"
              description="No people to show"
            />

            <div v-else class="grid grid-cols-1 gap-4">
              <el-card
                shadow="never"
                v-for="person in filteredPeople"
                :key="person._id"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <el-avatar
                      :size="40"
                      :src="person.avatar || ''"
                      style="background-color: black; font-size: 14px"
                    >
                      {{ person.name?.charAt(0).toUpperCase() }}
                    </el-avatar>
                    <div>
                      <p class="font-semibold text-gray-800 text-lg">
                        {{ person.name }}
                      </p>
                      <p class="text-gray-500 flex items-center gap-1">
                        <Icon name="mdi:location" />
                        {{ person.location || "Global" }}
                      </p>
                    </div>
                  </div>

                  <el-button
                    size="large"
                    :autofocus="false"
                    @click="follow(person._id)"
                  >
                    <Icon name="mdi:account-plus" class="w-6 h-6 text-black" />
                    <span class="text-gray-500 ml-1"> Follow </span>
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

definePageMeta({
  layout: "home",
});

const auth = useAuthStore();
const friendsStore = useFriendsStore();
const socialStore = useSocialMediaStore();

const userName = computed(() => auth.user?.name || "Guest");
const activeTab = ref("friends");

// Fetch friends and people on mount
onMounted(async () => {
  await friendsStore.fetchfriends();
  await friendsStore.fetchPeople();
});

// Computed properties for reactivity
const friends = computed(() => friendsStore.friends);
const people = computed(() => friendsStore.people);

// Filter out people who are already friends
const filteredPeople = computed(() => {
  return people.value.filter(
    (p) => !friends.value.some((f) => f._id === p._id)
  );
});

// Follow a person and update friends list
const follow = async (userId) => {
  // Call follow API
  await socialStore.followPost(userId);

  // Find the person in people and add to friends
  const newFriend = people.value.find((p) => p._id === userId);
  if (newFriend) {
    friendsStore.friends.push(newFriend); // reactive push
  }
  console.log("friends", friends.value);
};

// Debuging
console.log("friends", friends.value);
console.log("filtered people", filteredPeople.value);
</script>

<style scoped>
/*  Active tab text color */
:deep(.custom-tabs .el-tabs__item.is-active) {
  color: #b326c2;
  font-weight: 600;
}

/*  Active bar (underline) color */
:deep(.custom-tabs .el-tabs__active-bar) {
  background-color: #b326c2;
}
</style>