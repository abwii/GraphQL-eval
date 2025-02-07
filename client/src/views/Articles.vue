<template>
  <div class="container mt-5">
    <h1 class="text-center">Liste des Articles</h1>

    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-center text-danger">{{ error }}</div>
    <div v-else>
      <div v-for="article in articles" :key="article.id" class="card my-3">
        <div class="card-body">
          <router-link :to="'/article/' + article.id" class="text-decoration-none">
            <h5 class="card-title">{{ article.title }}</h5>
          </router-link>
          <p class="card-text">{{ article.content }}</p>
          <small class="text-muted">
            Auteur : {{ article.author.username }} <br />
            <span 
              class="like-button" 
              @click="likeArticle(article)"
              :class="{ 'text-primary': loadingLike === article.id }"
              style="cursor: pointer;"
            >
              👍 {{ article.likes?.toString() || "0" }}
            </span> Likes
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

// 🎯 Requête pour récupérer les articles
const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      likes
      content
      author {
        username
      }
    }
  }
`;

// 🚀 Mutation pour liker un article
const LIKE_ARTICLE = gql`
  mutation LikeArticle($articleId: ID!) {
    likeArticle(articleId: $articleId) {
      id
      likes
    }
  }
`;

const { result, loading, error } = useQuery(GET_ARTICLES);
const articles = ref<{ id: string; title: string; content: string; likes: number; author: { username: string } }[]>([]);
const { mutate: likeArticleMutation } = useMutation(LIKE_ARTICLE);
const loadingLike = ref<string | null>(null);

// ✅ Met à jour la liste des articles automatiquement
watchEffect(() => {
  if (result.value) {
    articles.value = result.value.articles;
  }
});

const likeArticle = async (article: { id: string; likes: number }) => {
  if (loadingLike.value) return; // Empêche de liker plusieurs fois rapidement

  try {
    loadingLike.value = article.id;
    const response = await likeArticleMutation({ articleId: article.id });

    if (response.data) {
      article.likes = response.data.likeArticle.likes; // Mise à jour locale immédiate
    }
  } catch (err) {
    console.error("Erreur lors du like :", err);
  } finally {
    loadingLike.value = null;
  }
};
</script>