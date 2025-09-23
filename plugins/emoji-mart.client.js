import { defineNuxtPlugin } from "nuxt/app";
import Picker from "emoji-mart-vue-fast/src/components/Picker";
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("EmojiPicker", Picker);
  nuxtApp.provide("emojiData", data);
});
