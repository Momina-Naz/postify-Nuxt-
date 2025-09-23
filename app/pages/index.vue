<template>
  <div class="flex flex-col items-cenetr justify-cenetr">
    <PostCard />
  </div>
</template>
<script setup>
import PostCard from "~/components/Home/PostCard.vue";
definePageMeta({
  layout: "home",
});
</script>