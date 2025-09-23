<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar class="w-full border-b sticky top-0 z-50 bg-white" />

    <div class="flex flex-1 min-h-screen">
      <div class="hidden md:flex sticky top-24 h-[calc(100vh-6rem)] z-40">
        <Sidebar />
      </div>

      <main class="flex-1 p-6 pb-24 overflow-y-auto">
        <NuxtPage />
      </main>
    </div>

    <!-- Mobile footer nav fixed at bottom -->
    <MobileFooterNav class="fixed bottom-0 left-0 right-0 z-50 md:hidden" />
  </div>
</template>


<script setup>
import Sidebar from "~/components/Sidebar.vue";
import Navbar from "~/components/Navbar.vue";
import MobileFooterNav from "~/components/FooterNavbar.vue";
</script>


