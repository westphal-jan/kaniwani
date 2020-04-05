<template>
  <div>
    <!-- Masthead -->
    <header class="masthead text-white text-center">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-xl-9 mx-auto">
            <h1 class="mb-5">Study Japanese given Hiragana with the help of <a href="https://www.wanikani.com" target="_blank">WaniKani</a></h1>
          </div>
          <div class="col-md-10 col-lg-8 col-xl-7 mx-auto">
            <form v-on:submit.prevent="validateAccessToken">
              <div class="form-row">
                <div class="col-12 col-md-9 mb-2 mb-md-0">
                  <input v-model="accessToken" class="form-control form-control-lg" placeholder="Enter your personal access token...">
                </div>
                <div class="col-12 col-md-3">
                  <button type="submit" class="btn btn-block btn-lg btn-primary" v-bind:disabled="disabledButton">Let's go!</button>
                </div>
              </div>
              <div class="col-xl-12 mx-auto">
                <p class="mt-3">You can find your personal access token <a href="https://www.wanikani.com/settings/personal_access_tokens" target="_blank">here</a>.</p>
                <p>Make sure to use the one for API version 2 (The one with the dashes).</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      accessToken: '',
      disabledButton: true
    }
  },
  watch: {
    accessToken: function (newValue) {
      const isValidAccessToken = newValue.match('[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}') !== null
      this.disabledButton = !isValidAccessToken
    }
  },
  methods: {
    validateAccessToken: function () {
      const headers = {
        Authorization: 'Bearer ' + this.accessToken
      }
      axios.get('https://api.wanikani.com/v2/user', { headers })
        .then(response => {
          console.log('Hello', response.data.data.username)
        })
        .catch(error => console.log(error))
    }
  }
}
</script>
