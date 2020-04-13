<template>
  <div>
    <status />
    <div v-for="(answer, idx) in givenAnswers" :key="idx" class="mb-3">
      <div class="row justify-content-center mb-2">
        <div class="col-10">
          <input
            :value="answer"
            class="form-control form-control-lg"
            style="text-align: center;"
            :style="{ borderColor: getVocabulary(answer).length > 0 ? 'green' : 'red' }"
            disabled
          />
        </div>
      </div>
      <div v-for="(vocabulary, idx2) in getVocabulary(answer)" :key="idx2">
        <answer :current-kana="currentKana" :vocabulary="vocabulary" />
        <hr width="50%" />
      </div>
    </div>

    <hr />
    <div v-show="unansweredVocabulary.length > 0">
      <p>
        <u>Answers not given:</u>
      </p>
      <div v-for="(vocabulary, idx) in unansweredVocabulary" :key="idx">
        <answer :current-kana="currentKana" :vocabulary="vocabulary" />
        <hr width="50%" />
      </div>
      <hr />
    </div>
    <div class="row justify-content-center">
      <div class="col-2">
        <button class="btn btn-block btn-lg btn-success" @click="finishReviewing">
          <i class="fas fa-arrow-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Answer from "../components/Answer";
import Status from "../components/Status";
import { mapMutations } from 'vuex';

export default {
  name: "Review",
  components: {
    "answer": Answer,
    "status": Status,
  },
  computed: {
    currentKana: function() {
      return this.$store.state.currentKana;
    },
    givenAnswers: function () {
      return Object.keys(this.$store.state.givenAnswersToValidVocabulary);
    },
    givenAnswersToValidVocabulary: function () {
      return this.$store.state.givenAnswersToValidVocabulary;
    },
    unansweredVocabulary: function () {
      return this.$store.state.unansweredVocabulary;
    },
  },
  mounted () {
    window.addEventListener("keypress", (e) => {
      // When 'enter' is clicked
      if (e.keyCode === 13) {
        this.finishReviewing();
      }
    });
  },
  methods: {
    ...mapMutations(["newKana"]),
    getVocabulary: function (answer) {
      return this.$store.state.givenAnswersToValidVocabulary[answer];
    },
    finishReviewing: function () {
      this.newKana();
      this.$router.push("/kaniwani/study").catch(error => {
        if (error.name != "NavigationDuplicated") {
          throw error;
        }
      });
    },
  }
}
</script>
