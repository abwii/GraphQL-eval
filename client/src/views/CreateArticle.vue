<template>
    <div class="container mt-5">
      <h2 class="text-center">Créer un Article</h2>
      <div class="card p-4">
        <form @submit.prevent="handleCreateArticle">
          <div class="mb-3">
            <label for="title" class="form-label">Titre</label>
            <input v-model="title" type="text" id="title" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="content" class="form-label">Contenu</label>
            <textarea v-model="content" id="content" class="form-control" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? "Publication..." : "Publier" }}
          </button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-3">Article publié avec succès !</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  
  // Définition de la mutation GraphQL
  const CREATE_ARTICLE = gql`
    mutation CreateArticle($title: String!, $content: String!) {
      createArticle(title: $title, content: $content) {
        id
        title
        content
      }
    }
  `;
  
  const title = ref("");
  const content = ref("");
  const success = ref(false);
  const error = ref("");
  
  const { mutate: createArticle, loading } = useMutation(CREATE_ARTICLE, {
    context: {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    },
});

  
  const handleCreateArticle = async () => {
    try {
      error.value = "";
      success.value = false;
  
      await createArticle({
        title: title.value,
        content: content.value,
      });
  
      success.value = true;
      title.value = "";
      content.value = "";
    } catch (err: any) {
      error.value = "Erreur lors de la création de l'article.";
      console.error(err);
    }
  };
  </script>
  