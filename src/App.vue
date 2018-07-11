<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import axios from 'axios'
if (process.env.NODE_ENV == undefined) {
  window.instance = axios.create({
  baseURL: 'http://127.0.0.1:5003'
});
} else {
  window.instance = axios.create({
  baseURL: 'https://geonewschallenge-api.herokuapp.com'
});
}

export default {
  name: 'layout',
}
</script>

<style lang="sass">
$family-primary: "Arial";
$title-size: 2.5em
$weight-semibold: 200
$body-family: "Arial"
$primary: #cc5533
$info: #6699aa
$link: #667777

@import "~bulma/bulma"
</style>
