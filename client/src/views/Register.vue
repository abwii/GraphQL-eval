<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import gql from "graphql-tag";

const REGISTER_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const username = ref("");
const email = ref("");
const password = ref("");
const registerMutation = useMutation(REGISTER_MUTATION);

const handleRegister = async () => {
  try {
    const result = await registerMutation.mutate({
      username: username.value,
      email: email.value,
      password: password.value,
    });

    if (result && result.data) {
      alert("Inscription réussie ! Token: " + result.data.register);
    } else {
      alert("Erreur lors de l'inscription.");
    }
  } catch (error) {
    alert("Erreur : " + (error as Error).message);
  }
};

</script>

<template>
  <div class="container">
    <h2>Inscription</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="username" placeholder="Nom d'utilisateur" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">S'inscrire</button>
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
  background-color: blue;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
