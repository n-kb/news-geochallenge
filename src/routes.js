import VueRouter from 'vue-router';

let routes = [
	{
		path: '/',
		component: require('./Home.vue').default
	},
	{
		path: '/play',
		name: 'play',
		component: require('./Play.vue').default
	},
	{
		path: '/rankings',
		name: 'ranking',
		component: require('./Ranking.vue').default
	}
]

export default new VueRouter ({
	routes
});