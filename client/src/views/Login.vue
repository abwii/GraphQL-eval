<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import gql from "graphql-tag";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const email = ref("");
const password = ref("");
const loginMutation = useMutation(LOGIN_MUTATION);

const handleLogin = async () => {
  try {
    const result = await loginMutation.mutate({
      email: email.value,
      password: password.value,
    });

    if (result && result.data) {
      alert("Connexion réussie !");
      localStorage.setItem("token", result.data.login);
      window.location.href = "/";
    } else {
      alert("Erreur lors de la connexion.");
    }
  } catch (error) {
    alert("Erreur : " + (error as Error).message);
  }
};

</script>

<template>
  <div class="container">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
button {
  background-color: green;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
