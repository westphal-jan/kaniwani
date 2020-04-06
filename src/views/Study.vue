<template>
  <div class="container">
    <form @submit="giveAnswer">
      <div class="row justify-content-center mb-3">
        <h2>Vocabulary</h2>
      </div>
      <div v-for="(answer, idx) in answers" class="row justify-content-center mb-3" v-bind:key="idx">
        <div class="col-5 col-auto">
          <input v-model="answer.value" class="form-control form-control-lg" placeholder="Enter a translation ..." required>
        </div>
        <div class="col-1">
          <button type="button" class="btn btn-block btn-lg btn-danger" @click="removeAnswer(idx)"><i class="fas fa-trash"/></button>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-2 mr-5">
          <button type="button" class="btn btn-block btn-lg btn-primary" @click="addAnswer"><i class="fas fa-plus"/></button>
        </div>
        <div class="col-2 ml-5">
          <button type="submit" class="btn btn-block btn-lg btn-success"><i class="fas fa-check"/></button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Study',
  data () {
    return {
      answers: [
        { value: '' }
      ]
    }
  },
  mounted () {
    if (!this.$store.state.accessToken && process.env.NODE_ENV === 'production') {
      this.$router.push({ path: '/kaniwani' })
    }
  },
  computed: {
    canAnswer: function () {
      return true
    }
  },
  methods: {
    addAnswer: function () {
      this.answers.push({ value: '' })
    },
    removeAnswer: function (idx) {
      if (this.answers.length === 1) {
        this.answers[0].value = ''
      } else {
        this.answers.splice(idx, 1)
      }
    },
    giveAnswer: function () {
      console.log('Answering')
    }
  }
}
</script>
