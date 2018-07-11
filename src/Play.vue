<template>
  <div>
    <div class="modal" :class="{'is-active': isLoading}">
      <div class="modal-background"></div>
      <div class="modal-content has-text-centered">
       <p class="white">
        Loading...
       </p>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
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
      token: "",
      isLoading: true
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
      this.isLoading = false;
    });
  },
  components: { quizmap }
}
</script>

<style lang="sass">

.white
  color: #fff

.no-overflow
  overflow: hidden
</style>
