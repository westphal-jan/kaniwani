<template>
  <div>
    <h1>Let's Study</h1>
  </div>
</template>

<script>
export default {
  name: 'Study',
  mounted () {
    if (!this.$store.state.accessToken) {
      this.$router.push({ path: '/kaniwani' })
    }
  }
}
</script>
