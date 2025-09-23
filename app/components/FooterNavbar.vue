<template>
  <footer
    class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-between items-center px-4 py-2 z-50"
  >
    <!-- Navigation Links -->
    <nav class="flex-1 flex justify-around">
      <NuxtLink
        :to="`/`"
        class="flex flex-col items-center text-sm text-gray-600 hover:text-[#A22CCC]"
      >
        <Icon name="mdi:home-outline" class="w-6 h-6" />
        <span>Home</span>
      </NuxtLink>

      <NuxtLink
        :to="`/addPost`"
        class="flex flex-col items-center text-sm text-gray-600 hover:text-[#A22CCC]"
      >
        <Icon name="mdi:plus-circle-outline" class="w-6 h-6" />
        <span>Create</span>
      </NuxtLink>

      <NuxtLink
        :to="`/friends`"
        class="flex flex-col items-center text-sm text-gray-600 hover:text-[#A22CCC]"
      >
        <Icon name="mdi:account-multiple-outline" class="w-6 h-6" />
        <span>Friends</span>
      </NuxtLink>
      <!-- Profile Avatar with dropdown -->
      <div class="relative">
        <button @click="avatarMenuOpen = !avatarMenuOpen" class="relative">
          <div class="flex flex-col justify-center items-center">
            <Icon name="mdi:account-outline" class="h-7 w-7" />
            <p class="text-sm text-gray-600">Profile</p>
          </div>
        </button>

        <!-- Overlay to detect outside click -->
        <div
          v-if="avatarMenuOpen"
          class="fixed inset-0 z-40"
          @click="avatarMenuOpen = false"
        ></div>

        <!-- Dropdown Menu -->
        <div
          v-if="avatarMenuOpen"
          class="absolute bottom-12 right-0 bg-white border rounded-lg shadow-lg w-36 z-50"
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
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~~/stores/Auth";
const store = useAuthStore();
const avatarMenuOpen = ref(false);
onMounted(() => {
  store.loadAuthFromStorage();
});
const logOut = () => {
  store.logout();
  navigateTo("/login");
};
</script>
