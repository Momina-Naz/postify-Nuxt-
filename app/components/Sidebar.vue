<template>
  <aside class="w-72 bg-white flex flex-col relative shadow-md px-2">
    <!-- Sidebar Menu -->
    <nav class="mt-10 flex flex-col gap-4 px-6">
      <NuxtLink
        :to="`/`"
        class="flex items-center gap-3 text-gray-700 px-3 py-2 rounded-lg border border-white hover:bg-[#F3E8FF] hover:border hover:border-[#A22CCC] hover:text-[#A22CCC]"
      >
        <Icon name="mdi:home-outline" class="w-6 h-6" />
        <span>Home</span>
      </NuxtLink>
      <NuxtLink
        :to="`/addPost`"
        class="flex items-center gap-3 text-gray-700 px-3 py-2 rounded-lg border border-white hover:bg-[#F3E8FF] hover:border hover:border-[#A22CCC] hover:text-[#A22CCC]"
      >
        <Icon name="mdi:plus-circle-outline" class="w-6 h-6" />
        <span>Create</span>
      </NuxtLink>
      <NuxtLink
        :to="`/friends`"
        class="flex items-center gap-3 text-gray-700 px-3 py-2 rounded-lg border border-white hover:bg-[#F3E8FF] hover:border hover:border-[#A22CCC] hover:text-[#A22CCC]"
      >
        <Icon name="mdi:account-multiple-outline" class="w-6 h-6" />
        <span>Friends</span>
      </NuxtLink>
    </nav>
  </aside>
</template>


<script setup>
import { onMounted } from "vue";

import { useAuthStore } from "~~/stores/Auth";

// Get store
const store = useAuthStore();

onMounted(() => {
  store.loadAuthFromStorage();
});
</script>



