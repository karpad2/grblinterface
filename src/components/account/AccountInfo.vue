<template>
	<div id="account-info-container">
		<div v-if="!loading" class="center">
			<p><b>Email:</b> {{email}}</p>
			
			<div>
				
			</div>
			<p>
				<router-link to="/">Home page</router-link>
			</p>
			<md-button class="md-raised md-primary" @click="logout">Logout</md-button>
		</div>
	</div>
</template>

<script>
	import {FirebaseAuth} from "@/firebase";
	
	export default {
		name: "AccountInfo",
		data() {
			return {
				loading: true,
				email: "",
				themeSwitch: false, // false = 'default'; true = 'dark'
			}
		},
		mounted() {
			if (localStorage.userTheme === "dark") {
				this.themeSwitch = true;
			}
			let _this = this;
			FirebaseAuth.onAuthStateChanged((user) => {
				//console.log(user);
				if (user) {
					_this.email = user.email;
					_this.loading = false;
				} else this.$router.replace('/account/login').catch(() => {
				}); // User not logged
			});
		},
		methods: {
			
			logout: function () {
				this.loading = true;
				let _this = this;
				FirebaseAuth.signOut().then(() => {
					// Automatic redirect to login (onAuthStateChanged)
					_this.$noty.success("Logout confirmed", {
						killer: true,
						timeout: 1500,
					});
				}).catch((error) => {
					console.log("signOut()", error);
					_this.$noty.error("Logout error, please refresh the page.");
				});
			}
		}
	}
</script>

<style lang="scss">
	#account-info-container {
		.center {
			text-align: center;
		}
	}
</style>
