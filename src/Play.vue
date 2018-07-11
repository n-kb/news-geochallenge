<template>
  <div>
    <div class="columns is-centered content is-fullheight no-overflow">
      <div class="column">
        <quizmap :questions="questions" :difficulty="difficulty" :token="token"></quizmap>
      </div>
    </div>
  </div>
</template>

<script>

import quizmap from './Map.vue'

export default {
  name: 'app',
  data () {
    return {
      questions: [],
      token: ""
    }
  },
  computed: {
    difficulty () {
      return this.$route.params.difficulty
    }
  },
  created () {
    window.instance.get("get_questions/" + this.difficulty).then(response => {
          this.token = response.data.token;
          this.questions = response.data.questions;
        });
  },
  components: { quizmap }
}
</script>

<style lang="sass">
.no-overflow
  overflow: hidden
</style>
