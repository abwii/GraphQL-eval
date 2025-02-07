<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

const route = useRoute();
const articleId = route.params.id as string;

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
const article = ref<{ id: string; title: string; content: string; likes: number; author: { username: string }; comments: { id: string; content: string; author: { username: string } }[] } | null>(null);

watchEffect(() => {
  if (result.value) {
    article.value = result.value.article;
  }
});
</script>

<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-center text-danger">{{ error }}</div>
    <div v-else-if="article">
      <h1 class="text-center">{{ article.title }}</h1>
      <p class="text-muted text-center">Auteur : {{ article.author.username }}</p>
      <p class="lead">{{ article.content }}</p>

      <div class="mt-4">
        <strong>👍 {{ article.likes?.toString() || "0" }} Likes</strong>
      </div>

      <hr />

      <h3>Commentaires</h3>
      <div v-if="article.comments.length > 0">
        <div v-for="comment in article.comments" :key="comment.id" class="border p-3 my-2">
          <p><strong>{{ comment.author.username }}</strong>: {{ comment.content }}</p>
        </div>
      </div>
      <div v-else class="text-muted">Aucun commentaire pour cet article.</div>
    </div>
  </div>
</template>
