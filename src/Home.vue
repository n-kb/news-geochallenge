<template>
  <div>
    <section class="section section-home">
      <div class="container">
        <div class="content">
          <div class="columns is-hidden-tablet">
            <div class="column has-text-centered">
              <p class="big-title">{{ texts.title }}</p>
              <p class="sub-title" v-html="texts.subtitle"></p>
            </div>
            <div class="column has-text-centered">
              <div class="field">
                <label class="label">{{ texts.difficulty }}</label>
               <div class="control has-text-centered">
                <div class="select">
                  <select v-model="difficulty">
                    <option v-for="difficulty_level in difficulty_levels" :value="difficulty_level.slug"> {{ difficulty_level.name }} </option>
                  </select>
                </div>
              </div>
              </div>
            </div>
            <div class="column has-text-centered">
              <a class="button is-primary" @click="play()">{{ texts.play }}</a>
            </div>
          </div>
          <div class="columns is-hidden-mobile">
            <div class="column">
              <p class="big-title-desktop">{{ texts.title }}</p>
              <p class="sub-title-desktop" v-html="texts.subtitle"></p>
              <p>
                You will be shown headlines from the past month. Click on the map where the most important location of the story was. Harder difficulty levels bring in more points.
              </p>
              <p>
                New articles are added every hour!
              </p>
            </div>
            <div class="column is-4 has-text-centered">
              <p>{{ texts.difficulty }}</p>
              <div v-for="difficulty_level in difficulty_levels"> 
                <a class="button is-link button-desktop" @click="difficulty = difficulty_level.slug" :class="{'is-outlined': difficulty != difficulty_level.slug}">{{ difficulty_level.name }}</a>
              </div>
              <div class="play-desktop">
                <a class="button is-primary is-large is-fullwidth" @click="play()">{{ texts.play }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          A game by <a href="http://nkb.fr" target="_blank">Nicolas Kayser-Bril</a> using data from <a href="http://eventregistry.org" target="_blank">EventRegistry</a>.
        </p>
        <p>
          <a href="https://github.com/n-kb/news-geochallenge/" target="_blank">Still ♥ Github</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      difficulty: "very-easy",
      difficulty_levels: [
      {
        name: "Very easy",
        slug: "very-easy"
      },
      {
        name: "Easy",
        slug: "easy"
      },
      {
        name: "Medium",
        slug: "medium"
      },
      {
        name: "Hard",
        slug: "hard"
      }
      ],
      texts: {
        title: "Geo.News Challenge",
        play: "Play",
        subtitle: "You follow the news. But can you <b>locate</b> it?",
        difficulty: "Difficulty level"
      }
    }
  },
  methods: {
    play () {
      this.$router.push({ name: 'play', params: {difficulty: this.difficulty}})
    }
  }
}
</script>

<style lang="sass">

.button-desktop
  margin: 5px

.play-desktop
  border-top: 2px solid #bbccdd
  margin-top: 20px
  padding: 20px

.big-title
  color: #fff
  font-size: 2rem
  font-weight: 200
  text-transform: uppercase
  letter-spacing: -.05rem
  border-bottom: 2px #bbccdd solid

.big-title-desktop
  color: #fff
  font-size: 3rem
  font-weight: 200
  text-transform: uppercase
  letter-spacing: -.05rem

.sub-title
  color: darken(#fff, 10%)
  border-radius: .5rem
  padding: .5rem
  background-color: darken(#6699aa, 10%)

.sub-title-desktop
  color: darken(#fff, 10%)
  font-size: 1.5rem

.section-home
  background-color: #6699aa

</style>
