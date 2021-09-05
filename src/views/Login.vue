<template>
  <v-app>
    <v-main>
      <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <v-btn @click="loginWithGoogle">Login with Google</v-btn>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  methods: {
    async loginWithGoogle() {
      await this.$store.dispatch("loginWithGoogle");

      await this.$router.push({ name: "Home" });
    },
  },
};
</script>
