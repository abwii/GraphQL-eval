<template>
    <div class="container mt-5">
      <h1 class="text-center">{{ article.title }}</h1>
      <p class="text-center text-muted">Écrit par {{ article.author.username }}</p>
      <p class="mt-3">{{ article.content }}</p>
  
      <div class="mt-4">
        <h4>👍 {{ article.likes }} Likes</h4>
      </div>
  
      <div class="mt-5">
        <h3>Commentaires ({{ article.comments.length }})</h3>
        <ul class="list-group">
          <li v-for="comment in article.comments" :key="comment.id" class="list-group-item">
            <strong>{{ comment.author.username }}:</strong> {{ comment.content }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useRoute } from "vue-router";
  import { useQuery } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  
  // Récupérer l'ID de l'article depuis l'URL
  const route = useRoute();
  const articleId = route.params.id;
  
  // Définition de la requête GraphQL
  const GET_ARTICLE = gql`
    query GetArticle($id: ID!) {
      article(id: $id) {
        id
        title
        content
        likes
        author {
          username
        }
        comments {
          id
          content
          author {
            username
          }
        }
      }
    }
  `;
  
  const { result, loading, error } = useQuery(GET_ARTICLE, { id: articleId });
  const article = ref(null);
  
  watch(result, (newResult) => {
    if (newResult && newResult.article) {
      article.value = newResult.article;
    }
  });
  </script>
  