<template>
    <div class="container mt-5">
      <h1 class="text-center">Bienvenue sur 𝕏²</h1>
  
      <div class="text-center mt-4">
        <router-link v-if="!isAuthenticated" to="/login" class="btn btn-primary mx-2">Connexion</router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-secondary mx-2">Inscription</router-link>
        <router-link v-if="isAuthenticated" to="/articles" class="btn btn-success mx-2">Voir les Articles</router-link>
        <router-link v-if="isAuthenticated" to="/articles/create" class="btn btn-primary mx-2">Créer Un Article</router-link>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const token = ref(localStorage.getItem("token"));
  
  const isAuthenticated = computed(() => !!token.value);
  
  const logout = () => {
    localStorage.removeItem("token");
    token.value = null;
    router.push("/");
  };
  </script>
  