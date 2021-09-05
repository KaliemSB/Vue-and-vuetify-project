<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey darken-1" size="64"
          ><img :src="user.avatar" :alt="user.name"
        /></v-avatar>

        <div>{{ user.name }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link @click="signOut">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="10">
                <v-text-field
                  v-model="note"
                  label="Nova nota"
                  autocomplete="false"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  type="submit"
                  @click="handleNewNote(note, user.id, $event)"
                  color="success"
                  block
                  >Adicionar</v-btn
                >
              </v-col>
            </v-row>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Suas notas</th>
                    <th class="text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="note in notes" :key="note.index">
                    <td v-bind:class="{ complete: note.completed }">
                      {{ note.content }}
                    </td>
                    <td>
                      <v-icon small class="mr-2" @click="completeNote(note)">
                        mdi-check
                      </v-icon>
                      <v-icon small @click="deleteNote(note)">
                        mdi-delete
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-container>
        </v-form>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { database } from "../services/firebase";

export default {
  name: "Home",

  data() {
    return {
      user: this.$store.state.user,
      drawer: null,
      note: "",
      notes: "",
    };
  },

  mounted: function () {
    this.$nextTick(function () {
      database
        .ref("notes")
        .orderByChild("author")
        .equalTo(this.user.id)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          const notes = [];

          for (let id in data) {
            notes.push({ id, ...data[id] });
          }

          this.notes = notes;

          console.log(this.notes);
        });
    });
  },

  methods: {
    async signOut() {
      await this.$store.dispatch("signOut");

      await this.$router.push({ name: "Login" });
    },
    async handleNewNote(content, id, event) {
      event.preventDefault();

      if (this.note.trim() === "") {
        return;
      }

      const note = {
        content: content,
        author: id,
        completed: false,
      };

      await database.ref("notes").push(note);

      this.note = "";
    },
    async deleteNote(note) {
      await database.ref("notes").child(note.id).remove();
    },
    async completeNote(note) {
      await database.ref("notes").child(note.id).update({
        completed: !note.completed,
      });
    },
  },
};
</script>

<style scoped>
.complete {
  text-decoration: line-through;
}
</style>
