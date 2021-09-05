import Vue from "vue";
import Vuex from "vuex";
import { firebase, auth } from "../services/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {},
  actions: {
    // Firebase Auth
    async loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      if (result.user) {
        const { displayName, photoURL, uid } = result.user;
        if (!displayName || !photoURL) {
          throw new Error("missing information from Google account");
        }
        this.state.user = {
          id: uid,
          name: displayName,
          avatar: photoURL,
        };
      }
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.state.user = null;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  modules: {},
});
