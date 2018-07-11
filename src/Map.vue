<template>
  <div>
    <div class="hero">
      <img :src="question.img" :class="{'main-image': !mobile_view, 'main-image-mobile': mobile_view}" />
      <div class="columns main-details">
        <div class="column">
          <span class="main-title-question">What's the main location in this story?</span><br>
          <span class="main-title">{{ question.title }}</span>
          <span class="story-from">({{ question.date | formatDate }})</span>
        </div>
      </div>
    </div>
    <div class="columns is-mobile hero-bottom">
      <div class="main-small column is-narrow score"> Score: <span class="score-detail">{{ score }} pts</span></div>
      <div class="main-small column helper">
        <span v-if="difficulty == 'very-easy'"> Click on <strong>{{ question.location }}</strong></span>
        <span v-if="difficulty != 'very-easy' && previous_location">Previous location was {{ previous_location }}</strong></span>
      </div>
    </div>
    <div id="map" :class="{'svg-container': !mobile_view, 'svg-container-mobile': mobile_view}">
    </div>
  </div>
</template>

<script>

  import * as d3 from 'd3'
  import geojson from './assets/countries.geo.json'

  export default {
    name: 'quizmap',
    props: { 
      questions: {
        default: [],
        type: Array
      },
      difficulty: {
        default: "very-easy",
        type: String
      },
      token: {
        default: "",
        type: String
      }
    },
    data() {
      return {
        question: {},
        mobile_view: true,
        score: 0,
        geojson,
        previous_location: false
      }
    },
    watch: {
      questions () {

        function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
          var R = 6371; // Radius of the earth in km
          var dLat = deg2rad(lat2-lat1);  // deg2rad below
          var dLon = deg2rad(lon2-lon1); 
          var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          var d = R * c; // Distance in km
          return d;
        }

        function deg2rad(deg) {
          return deg * (Math.PI/180)
        }

        var question_num = 0

        var score_multiplier = .1
        if (this.difficulty == "easy") {score_multiplier = .4}
        else if (this.difficulty == "medium") {score_multiplier = .6}
        else if (this.difficulty == "hard") {score_multiplier = .8}

        var question = this.questions[question_num]
        this.question = question

        var viewport_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var viewport_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        this.mobile_view = (viewport_w > viewport_h) ? false : true

        var width = viewport_w;
        var height = viewport_h;

        var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("class","svg-content")

        // Instantiate the projection object
        var projection = (this.mobile_view) ? d3.geoAzimuthalEqualArea() : d3.geoEquirectangular();
        var center = this.mobile_view ?  [0,0] : [0,0];
        var scale = this.mobile_view ?  width/4 : width/7;

        projection.center(center)
                  .scale(scale)
                  .translate([width / 2, height / 2]);

        var map = d3.map();

        // Assign the projection to a path
        var path = d3.geoPath().projection(projection);

        // Adds background
        svg.append("g")
              .attr("class", "countries")
              .selectAll("path")
              .data(geojson.features)
              .enter().append("path")
              .attr("fill", "#eee")
              .attr("stroke", "#bbccdd")
              .style("stroke-width", 3)
              .attr("d", path);

        // Adds countries
        svg.append("g")
              .attr("class", "countries")
              .selectAll("path")
              .data(geojson.features)
              .enter().append("path")
              .attr("fill", "#ddeeee")
              .attr("stroke", "#6699aa")
              .style("stroke-width", .5)
              .attr("d", path);

        var self = this;

        d3.select("svg").on("mousedown.log", function() {
          var x = d3.mouse(this)[0],
          y = d3.mouse(this)[1],
          lat_user = projection.invert([x, y])[1],
          lon_user = projection.invert([x, y])[0];

          var distance = getDistanceFromLatLonInKm(lat_user, lon_user, question.lat, question.lon)

          svg.append("text")
            .text("🔻")
            .attr("font-size", "15px")
            .attr("x", x - 5)
            .attr("y", y);

          var line = svg.append("line")
              .style("stroke", "black")
              .attr("x1", x)   
              .attr("y1", y)    
              .attr("x2", x)   
              .attr("y2", y);

          svg.append("text")
            .text(Math.floor(distance) + " km away")
            .attr("font-size", "15px")
            .attr("x", x + 5)
            .attr("y", y + 5)
            .transition()
            .duration(1000)
            .style("fill-opacity", 0)
            .remove();

          line.transition()
              .duration(200)
              .style("stroke", "#cc5533")
              .attr("x1", projection([question.lon, question.lat])[0])   
              .attr("y1", projection([question.lon, question.lat])[1]); 

          svg.append("circle")
             .attr("r", 4)
             .style("fill", "#667777")
             .attr("transform", "translate(" + projection([ question.lon, question.lat ]) + ")")

          var addition_score = (distance > 10000) ? 0 : 10000 - distance
          self.score += Math.floor(addition_score * score_multiplier)
          self.previous_location = question.location

          if (question_num != self.questions.length - 1){
            question_num++
            question = self.questions[question_num]
            self.question = question
          } else {
            setTimeout(function (){
              window.instance.post("send_score", {points: self.score, token: self.token}).then(response => {
                self.$router.push({ name: 'ranking', 
                                    params: {
                                      questions: self.questions,
                                      score: self.score,
                                      difficulty: self.difficulty, 
                                      score_id: response.data.score_id, 
                                      position_today: response.data.position_today, 
                                      position_alltime: response.data.position_alltime }})
              });
            }, 1500);
          }
        });

      }
    }
  }


</script>

<style lang="sass">

.svg-container
  width: 100%
  position: fixed
  overflow: hidden
  top: 8%
  left: 0
  padding-bottom: 80%;
  vertical-align: top;
  overflow: hidden;

.svg-container-mobile
  width: 100%
  position: fixed
  overflow: hidden
  top: 0
  left: 0
  padding-bottom: 150%;
  vertical-align: top;
  overflow: hidden;

.svg-content
    display: inline-block
    position: absolute
    top: 0
    left: 0

.main-image
  width: 100%
  margin-top: 3%

.main-image-mobile
  min-width: 200%
  margin-left: -50%
  margin-top: 10%

.main-title-question
  font-size: .8em
  color: #667777

.main-title
  font-size: 1em
  font-variant: small-caps
  font-weight: bold

.story-from
  font-size: .8em

.main-small
  font-size: .8em

.main-details
  position: absolute
  width: 100%
  margin: 0
  background: #F7F7F7
  border-bottom: 3px solid #bbccdd
  padding: 0 10px 0
  font-family: Arial, Helvetica, sans

.hero-bottom
  position: fixed
  width: 100%
  bottom: 0
  left: 0
  z-index: 3
  padding: 0 10px 10px
  margin: 0
  font-family: Arial, Helvetica, sans

.score
  background: #cc5533
  color: #fff
  border: 2px #bbccdd solid

.score-detail
  font-weight: bold

.helper
  border: 2px #bbccdd solid
  border-left: 0
  background: #bbccdd

.hero
  width: 100%
  margin: auto

.hero::after
  display: block
  position: fixed
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #fff 60%)
  margin-top: 0
  top: 0
  left: 0
  min-height: 100%
  width: 100%
  content: ''

</style>
