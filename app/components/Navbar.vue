<template>
  <nav class="flex justify-between items-center px-6 relative shadow-sm">
    <!-- Logo -->
    <div class="flex items-center">
      <NuxtLink :to="`/`" style="height: 90px">
        <img src="/images/Logo.png" alt="logo" class="h-full w-auto" />
      </NuxtLink>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-6">
      <ul class="flex gap-6 items-center mr-4">
        <li>
          <div
            class="border border-gray-300 shadow-sm rounded-full cursor-pointer"
            @click="menuOpen = !menuOpen"
          >
            <Icon name="mdi:person" class="h-8 w-9" />
          </div>
        </li>
      </ul>
    </div>
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-50"
      @click.self="menuOpen = false"
    >
      <!-- Dropdown Menu -->
      <div
        class="absolute top-16 right-4 bg-white border rounded-lg shadow-lg w-40 z-50 mt-2"
      >
        <ul class="flex flex-col text-gray-700">
          <NuxtLink :to="`/profile`">
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Profile
            </li></NuxtLink
          >

          <li
            class="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
            @click="logOut"
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/Auth";
const menuOpen = ref(false);
// Get store
const store = useAuthStore();
const { user } = storeToRefs(store);

// Safe username
const userName = computed(() => {
  return user.value?.name || "Guest";
});
onMounted(() => {
  store.loadAuthFromStorage();
});
// logout
const logOut = () => {
  store.logout();
  navigateTo("/login");
};
</script>


