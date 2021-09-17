<template>
	<div id="error-404-container">
		<md-app md-waterfall md-mode="fixed" :md-theme="userTheme">
			<md-app-toolbar class="md-primary" md-elevation="5">
				<router-link class="router-link" to="/">
					<logo class="img-responsive" height="50pt" color />
					<span class="md-title">Escape Room management</span>
				</router-link>
			</md-app-toolbar>

			<md-app-content>
				<div class="middle-center">
					<logo />
					<h1>Error 404</h1>
				</div>
			</md-app-content>
		</md-app>
	</div>
</template>

<script>
import logo from '@/assets/logo';
	export default {
		components: {
		logo
		},
		name: "Error404",
		data: () => ({
			userTheme: "default",
		}),
		mounted() {
			if (localStorage.userTheme === "dark") {
				this.userTheme = "dark";
			}
		}
	}
</script>

<style lang="scss">
	#error-404-container {
		.md-app {
			height: 100vh;

			.router-link {
				display: flex;
				align-items: center;
			}

			.bar-logo {
				width: 35px !important;
			}

			.middle-center {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 300px;
				transform: translate(-50%, -50%);
				-ms-transform: translate(-50%, -50%);
				text-align: center;
			}

			.logo {
				height: 200px;
				transform: rotate(50deg);
				transition: transform .3s;

				&:hover {
					transform: rotate(0deg);
					transition: transform 1s;
				}
			}
		}
	}
</style>
