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
            :style="{ borderColor: getVocabulary(answer) ? 'green' : 'red' }"
            disabled
          />
        </div>
      </div>
      <div v-for="(vocabulary, idx2) in getVocabulary(answer)" :key="idx2">
        <answer :kana="kana" :vocabulary="vocabulary" />
      </div>
    </div>

    <hr />
    <!-- <div v-show="additionalAnswers.length > 0">
      <p>
        <u>Answers not given:</u>
      </p>
      <div v-for="(vocabulary, idx) in additionalAnswers" :key="idx">
        <answer :kana="kana" :vocabulary="vocabulary" />
      </div>
      <hr />
    </div>-->
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

export default {
  name: "Review",
  components: {
    "answer": Answer,
    "status": Status,
  },
  computed: {
    kana: function() {
      return this.$store.state.kana;
    },
    givenAnswers: function () {
      return Object.keys(this.$store.state.givenAnswersToValidVocabulary);
    },
    givenAnswersToValidVocabulary: function () {
      return this.$store.state.givenAnswersToValidVocabulary;
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
    getVocabulary: function (answer) {
      return this.$store.state.givenAnswersToValidVocabulary[answer];
    },
    finishReviewing: function () {
      this.$router.push("/kaniwani/study");
      // this.reset();
      // if (this.$refs.answerField.length > 0) {
      //   this.$nextTick(() => this.$refs.answerField[0].focus());
      // }
    },
  }
}
</script>
