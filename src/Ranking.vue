<template>
  <section class="section">
    <div class="container">
      <div class="content">
        <div class="columns">
          <div class="column">
            <div class="has-text-centered">
              <a class="button is-primary" @click="play()">Play again</a>
              <router-link to="/" class="button is-outlined">Change difficulty</router-link>
            </div>
          </div>
        </div>
        <div class="columns has-text-centered">
          <div class="column">
            <a class="button is-link is-small" @click='articlesShown = true' v-if="!articlesShown">See the articles you located</a>
            <a class="button is-link is-small" v-if="articlesShown"  @click='articlesShown = false'>Hide the articles you located</a>
            <table class="table is-striped is-fullwidth table-scores" v-if="articlesShown">
              <tr v-for="question in $route.params.questions">
                <td> <a :href="'http://eventregistry.org/event/' + question.uri" target="_blank">{{ question.title }}</a> </td>
                <td> {{ question.location }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="has-text-centered">
              Well done, you ranked {{ $route.params.position_today }}<sup>{{ english_ordinal_suffix($route.params.position_today) }}</sup> with {{ $route.params.score }} points today!
            </div>
          </div>
        </div>
        <div class="columns" v-if="new_high_score">
          <div class="column">
            <div class="field">
              <div class="field-label is-normal">
                <label class="label">Enter your name to save your high score!</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control">
                    <input class="input" type="text" maxlength=100 placeholder="your name" v-model="username" @keyup.enter="change_username()">
                  </p>
                  <div class="control">
                    <a class="button is-info" @click="change_username()">
                      Send
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns" v-if="!new_high_score">
          <div class="column">
            Today's best scores
            <table class="table is-striped is-fullwidth table-scores">
              <tr v-for="score in scores.scores_today">
                <td> {{ score.username }} </td>
                <td> {{ score.score }} </td>
              </tr>
            </table>
          </div>
          <div class="column">
            All times best scores
            <table class="table is-striped is-fullwidth table-scores">
              <tr v-for="score in scores.scores_alltime">
                <td> {{ score.username }} </td>
                <td> {{ score.score }} </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'ranking',
  data () {
    return {
      scores: {},
      username: "",
      articlesShown: false,
      username_changed: false
    }
  },
  mounted () {
    if (this.new_high_score == false) {
      this.get_scores()
    }
  },
  computed: {
    new_high_score () {
      return (this.$route.params.position_today <= 10 && !this.username_changed) ? true : false;
    }
  },
  methods: {
    change_username() {
      window.instance.post("send_username", {username: this.username, score_id: this.$route.params.score_id}).then(response => {
          this.username_changed = true;
          this.get_scores();
      });
    },
    english_ordinal_suffix(n)
    {
      return (n % 10 == 1 && n != 11 ? 'st' : (n % 10 == 2 && n != 12 ? 'nd' : (n % 10 == 3 && n != 13 ? 'rd' : 'th'))); 
    },
    play () {
      this.$router.push({ name: 'play', params: {difficulty: this.$route.params.difficulty}})
    },
    get_scores() {
      window.instance.get("get_scores").then(response => {
          this.scores = response.data;
      });
    }
  }
}
</script>

<style lang="sass">

.table-scores
  font-size: .8em

</style>
