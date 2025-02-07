<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="#">GraphQL Social</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/articles">Articles</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <button class="btn btn-danger" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view />
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

<style>
body {
  font-family: Arial, sans-serif;
}
</style>