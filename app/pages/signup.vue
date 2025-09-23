<template>
  <main class="grid grid-cols-1 md:grid-cols-2 min-h-screen">
    <!-- Left side -->
    <div
      class="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white p-12 rounded-br-3xl border"
    >
      <h1 class="text-4xl font-bold mb-4">Welcome to Postify</h1>
      <p class="text-center text-lg max-w-md">
        A place to share your wonderful moments and connect with others
      </p>
    </div>

    <!-- signup Form -->
    <div class="flex items-center justify-center p-12">
      <div class="w-full max-w-md">
        <div class="flex justify-center itmes-center">
          <img src="/images/Logo.png" alt="logo" class="h-32" />
        </div>
        <el-form
          ref="loginForm"
          label-position="top"
          class="space-y-4"
          @submit.prevent="signup"
          ><el-form-item prop="name">
            <template #label>
              <span class="text-lg font-semibold text-gray-700">Name</span>
            </template>
            <el-input v-model="name" placeholder="Enter your name" />
          </el-form-item>

          <el-form-item prop="email">
            <template #label>
              <span class="text-lg font-semibold text-gray-700">Email</span>
            </template>
            <el-input v-model="email" placeholder="Enter your email" />
          </el-form-item>

          <el-form-item prop="password">
            <template #label>
              <span class="text-lg font-semibold text-gray-700">Password</span>
            </template>
            <el-input
              v-model="password"
              type="password"
              show-password
              placeholder="Enter your password"
            />
          </el-form-item>

          <el-button
            type="primary"
            native-type="submit"
            class="w-full !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !border-0"
          >
            Sign up
          </el-button>
        </el-form>
        <p class="flex justify-center font-semibold text-gray-700 mt-4">
          Already have an account?
          <NuxtLink :to="`/login`" class="text-[#A22CCC] ml-1">
            sign In</NuxtLink
          >
        </p>
      </div>
    </div>
  </main>
</template>



<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "~~/utils/api";
import { useAuthStore } from "~~/stores/Auth";

const router = useRouter();
const authStore = useAuthStore();
const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);

const signup = async () => {
  try {
    console.log("signup function called");
    loading.value = true;

    const response = await api.post("/api/v1/auth/sign-up", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    const { token, user } = response.data.data;

    authStore.setAuth(token, user);

    console.log("Signup Success:", response.data.data);

    navigateTo("/");
  } catch (error) {
    console.error(
      "Sign-up Failed:",
      error.response?.data.data || error.message
    );
  } finally {
    loading.value = false;
  }
};
</script>

