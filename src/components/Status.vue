<template>
  <div>
    <h5>
      Hello {{ username }} (Level: {{ level }}) | Kanas:
      {{ numKanasToVocabulary }} | Answered: {{ numAnswered }}
    </h5>
    <div class="row justify-content-center mb-3">
      <h2>{{ currentKana }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Status",
  computed: {
    username: function () {
      return this.$store.state.username;
    },
    level: function () {
      return this.$store.state.level;
    },
    numKanasToVocabulary: function () {
      return this.$store.getters.getNumKanaToVocabulary;
    },
    numAnswered: function () {
      return this.$store.state.numAnswered;
    },
    currentKana: function () {
      return this.$store.state.currentKana;
    },
  },
}
</script>