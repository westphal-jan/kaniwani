<template>
  <div class="container">
    <status />
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
          <button type="button" class="btn btn-block btn-lg btn-danger" @click="removeAnswer(idx)">
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
</template>

<script>
import Status from "../components/Status";
import { mapMutations } from 'vuex';

export default {
  name: "Study",
  components: {
    "status": Status,
  },
  data() {
    return {
      givenAnswers: [{ value: "" }],
    };
  },
  mounted() {
    if (this.$refs.answerField.length > 0) {
      this.$nextTick(() => this.$refs.answerField[0].focus());
    }
  },
  methods: {
    ...mapMutations(["giveAnswers"]),
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
      this.giveAnswers(this.givenAnswers.map((answer) => answer.value));
      this.$router.push("/kaniwani/review").catch(error => {
        if (error.name != "NavigationDuplicated") {
          throw error;
        }
      });
    },
  },
};
</script>
