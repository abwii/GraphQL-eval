<template>
  <div class="container mt-5">
    <h2>Créer un Article</h2>
    <form @submit.prevent="handleCreateArticle">
      <input v-model="title" placeholder="Titre" class="form-control mb-3" required />
      <textarea v-model="content" placeholder="Contenu" class="form-control mb-3" required></textarea>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        {{ loading ? "Publication..." : "Publier" }}
      </button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const CREATE_ARTICLE = gql`
  mutation CreateArticle($title: String!, $content: String!) {
    createArticle(title: $title, content: $content) {
      id
    }
  }
`;

const title = ref("");
const content = ref("");
const { mutate: createArticle, loading, error } = useMutation(CREATE_ARTICLE);

const handleCreateArticle = async () => {
  await createArticle({ title: title.value, content: content.value });
  title.value = "";
  content.value = "";
};
</script>