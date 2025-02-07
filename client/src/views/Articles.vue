<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      content
      author {
        username
      }
    }
  }
`;

const { result, loading, error } = useQuery(GET_ARTICLES);
const articles = ref<{ id: string; title: string; content: string; author: { username: string } }[]>([]);

onMounted(() => {
  if (result.value) {
    articles.value = result.value.articles;
  }
});
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Liste des Articles</h1>

    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-center text-danger">{{ error }}</div>
    <div v-else>
      <div v-for="article in articles" :key="article.id" class="card my-3">
        <div class="card-body">
          <h5 class="card-title">{{ article.title }}</h5>
          <p class="card-text">{{ article.content }}</p>
          <small class="text-muted">Auteur: {{ article.author.username }}</small>
        </div>
      </div>
    </div>
  </div>
</template>
