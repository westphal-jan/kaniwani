<template>
  <div class="container">
    <h5>
      Hello {{ username }} (Level: {{ level }}) | Kanas:
      {{ numKanasToVocabulary }}
    </h5>
    <div class="row justify-content-center mb-3">
      <h2>{{ kana }}</h2>
    </div>
    <div v-show="isAnswering">
      <form @submit.prevent="submitAnswers">
        <div v-for="(answer, idx) in givenAnswers" :key="idx" class="row mb-3">
          <div class="col-1"></div>
          <div class="col-10 justify-content-center col-auto">
            <input
              ref="answerField"
              v-model="answer.value"
              class="form-control form-control-lg"
              style="text-align: center;"
              placeholder="Enter a translation ..."
              required
            />
          </div>
          <div class="col-1">
            <button
              type="button"
              class="btn btn-block btn-lg btn-danger"
              @click="removeAnswer(idx)"
            >
              <i class="fas fa-trash" />
            </button>
          </div>
        </div>
        <hr />
        <div class="row justify-content-center">
          <div class="col-2 mr-5">
            <button type="button" class="btn btn-block btn-lg btn-primary" @click="addAnswer">
              <i class="fas fa-plus" />
            </button>
          </div>
          <div class="col-2 ml-5">
            <button type="submit" class="btn btn-block btn-lg btn-success">
              <i class="fas fa-arrow-right" />
            </button>
          </div>
        </div>
      </form>
    </div>
    <div v-show="!isAnswering">
      <div v-for="(answer, idx) in validatedAnswers" :key="idx" class="mb-3">
        <div class="row justify-content-center mb-2">
          <div class="col-10">
            <input
              v-model="givenAnswers[idx].value"
              class="form-control form-control-lg"
              style="text-align: center;"
              :style="{ borderColor: answer.hasValidAnswer ? 'green' : 'red' }"
              disabled
            />
          </div>
        </div>
        <div v-show="answer.hasValidAnswer">
          <h6>
            Characters:
            {{ answer.hasValidAnswer ? answer.vocabulary.data.characters : "" }}
          </h6>
          <h6>
            Meaning:
            {{
            answer.hasValidAnswer
            ? getMeaningsWithAcceptedAnswers(answer.vocabulary).join(
            ", "
            )
            : ""
            }}
          </h6>
          <h6>
            Other readings:
            {{ answer.hasValidAnswer ? getOtherReadings(answer.vocabulary) : "" }}
          </h6>
        </div>
      </div>
      <hr />
      <div v-show="additionalAnswers.length > 0">
        <p>
          <u>Answers not given:</u>
        </p>
        <div v-for="(vocabulary, idx) in additionalAnswers" :key="idx">
          <h6>Characters: {{ vocabulary.data.characters }}</h6>
          <h6>Meaning: {{ getMeaningsWithAcceptedAnswers(vocabulary).join(", ") }}</h6>
          <h6>
            Other readings:
            {{ getOtherReadings(vocabulary) }}
          </h6>
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
  </div>
</template>

<script>
import { getUserData } from "../api";
import { mapMutations } from "vuex";

export default {
  name: "Study",
  data() {
    return {
      isAnswering: true,
      kana: "",
      validVocabulary: [],
      givenAnswers: [{ value: "" }],
      validatedAnswers: [],
      additionalAnswers: [],
    };
  },
  computed: {
    canAnswer: function () {
      return true;
    },
    username: function () {
      return this.$store.state.username;
    },
    level: function () {
      return this.$store.state.level;
    },
    numKanasToVocabulary: function () {
      return this.$store.getters.getNumKanaToVocabulary;
    },
  },
  mounted() {
    if (
      !this.$store.state.accessToken &&
      process.env.NODE_ENV === "production"
    ) {
      this.$router.push({ path: "/kaniwani" });
      return;
    }
    getUserData(this.$store.state.accessToken).then((userData) => {
      this.setUserData(userData.data);
      this.reset();
    });
    window.addEventListener("keypress", (e) => {
      // When 'enter' is clicked
      if (!this.isAnswering && e.keyCode === 13) {
        this.finishReviewing();
      }
    });
  },
  methods: {
    newQuestion: function () {
      if (this.$store.getters.getNumKanaToVocabulary > 0) {
        const kanas = Object.keys(this.$store.state.kanaToVocabulary);
        const randomKana = kanas[(kanas.length * Math.random()) << 0];
        this.validVocabulary = this.$store.state.kanaToVocabulary[randomKana];
        this.kana = randomKana;
      }
    },
    reset: function () {
      this.isAnswering = true;
      this.givenAnswers = [{ value: "" }];
      this.validatedAnswers = [];
      this.additionalAnswers = [];
      this.newQuestion();
    },
    addAnswer: function () {
      this.givenAnswers.push({ value: "" });
    },
    removeAnswer: function (idx) {
      if (this.givenAnswers.length === 1) {
        this.givenAnswers[0].value = "";
      } else {
        this.givenAnswers.splice(idx, 1);
      }
    },
    submitAnswers: function () {
      this.isAnswering = false;

      var vocabularyCopy = [...this.validVocabulary];
      this.givenAnswers.forEach(({ value }) => {
        for (var i = 0; i < vocabularyCopy.length; i++) {
          const vocabulary = vocabularyCopy[i];
          const meanings = vocabulary.data.meanings;
          const bestMeaning = meanings.find((meaning) => {
            if (!meaning.accepted_answer) {
              return false;
            }
            // TODO: use string-similarity to find similar match instead of total match
            return meaning.meaning.toLowerCase() === value.toLowerCase();
          });
          const hasValidAnswer = bestMeaning !== undefined;
          if (hasValidAnswer) {
            this.validatedAnswers.push({ vocabulary, hasValidAnswer });
          } else {
            this.additionalAnswers.push(vocabulary);
            this.validatedAnswers.push({ hasValidAnswer });
          }
        }
      });
    },
    finishReviewing: function () {
      this.reset();
      if (this.$refs.answerField.length > 0) {
        this.$nextTick(() => this.$refs.answerField[0].focus());
      }
    },
    getMeaningsWithAcceptedAnswers: function (vocabulary) {
      return vocabulary.data.meanings
        .filter((meaning) => meaning.accepted_answer)
        .map((meaning) => meaning.meaning);
    },
    getOtherReadings: function (vocabulary) {
      const otherReadings = vocabulary.data.readings
        .filter((reading) => reading.accepted_answer && reading.reading !== this.kana)
        .map((reading) => reading.reading);
      return otherReadings.length === 0 ? "None" : otherReadings.join();
    },
    ...mapMutations(["setUserData"]),
  },
};
</script>
