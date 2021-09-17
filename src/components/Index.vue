<template>
	<div id="vue-js-index-container">
		<md-app md-waterfall md-mode="fixed" :md-theme="userTheme">
			<md-app-toolbar class="md-primary" md-elevation="5">
				<md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
					<md-icon>menu</md-icon>
				</md-button>
				<router-link class="router-link" to="/home">
					<logo class="bar-logo" />
					<span class="md-title">GRBL Interface</span>
				</router-link>
				<div  class="md-toolbar-section-end">
        			
					<md-avatar  style="z-index:999" >
						<img @click="toggleSidepanel" :src="profile_picture_url" alt="Avatar">
					</md-avatar>
     		 	</div>
				</md-app-toolbar>

			<md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
				<md-toolbar class="md-transparent" md-elevation="3">
					<span>Navigation</span>
					<div class="md-toolbar-section-end">
						<md-button class="md-icon-button md-dense" @click="toggleMenu">
							<md-icon>keyboard_arrow_left</md-icon>
						</md-button>
					</div>
				</md-toolbar>

				<md-list>
					<div v-for="tab in menuTab" :key="tab.title">
						<router-link :to="tab.link">
							<md-list-item v-if="tab.auth" :class="{'active': $route.fullPath.includes(tab.link)}">
								<md-icon class="md-icon">{{tab.icon}}</md-icon>
								<span class="md-list-item-text">{{tab.title}}</span>
							</md-list-item>
							
						</router-link>
					</div>
					<md-list-item v-if="true" v-on:click="changeTheme()">
								<md-icon class="md-icon">settings_brightness</md-icon>
								<span class="md-list-item-text">Color Theme</span>
					</md-list-item>
					<md-list-item v-if="true" v-on:click="logout()">
								<md-icon class="md-icon">logout</md-icon>
								<span class="md-list-item-text">Logout</span>
					</md-list-item>
					<md-divider></md-divider>
					
				</md-list>
			</md-app-drawer>

	<md-drawer class="md-right" :md-active.sync="showSidepanel">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Account</span>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <span class="md-list-item-text">Abbey Christansen</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Alex Nelson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Mary Johnson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon>chat_bubble</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </md-drawer>

			<md-app-content>
				<router-view  v-if="!loading_screen"/>
				<loading v-else />
			</md-app-content>
			
		</md-app>
	</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb} from "@/firebase";
import {ref, set ,onValue,get, child} from "firebase/database";
import loading from "@/components/parts/loading";
import logo from "@/assets/logo";

	export default {
		components: {
		logo,
		loading
		},
		name: 'Index',
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			showSidepanel:false,
			menuVisible: false,
			userTheme: "default",
			loading_screen:false,
			menuTab: [
				{
					icon: 'home',
					title: 'Home',
					link: '/home',
					auth: true,
				},
				{
					icon: 'info',
					title: 'Info',
					link: '/info',
					auth: true,
				},
				{
					icon: 'contact_support',
					title: 'Support & Troubleshooting',
					link: '/support',
					auth: true,
				},
				
				
			
			]
		}),
		mounted() {
			
			this.$router.beforeEach((to,from,next)=>{
				
				this.loading_screen=true;
				next();
			});
			
			this.$router.afterEach(()=>{
				setTimeout(()=>{this.loading_screen=false},300);
			});
			
			try{
			//localStorage.user= FirebaseAuth._currentUser;
			const userId = FirebaseAuth.currentUser.uid;
			this.profile_picture_url=FirebaseAuth.currentUser.photoURL;
			this.profile_name=FirebaseAuth.displayName;
			
			
			//console.log(FirebaseAuth.currentUser);
			get(child(FireDb.once, `users/${userId}/user_profile_color`)).then((snapshot) => {
        if (snapshot.exists()) {
            //this.rooms=snapshot;
			localStorage.userTheme=snapshot.val().user_profile_color;
		}
		else 
		{
			set(ref(FireDb,`users/${userId}/user_profile_color`),"light");
		}});

			console.log("Index");
			}
			catch (e)
			{
				console.warn(e);
			}
			if (localStorage.userTheme === "dark") {
				this.userTheme = "dark";
				}
			if (this.$route.fullPath === '/') {
				this.$router.replace('/home').catch(() => {
				});
			}
		},
		methods: {
			toggleMenu: function() {
				this.menuVisible = !this.menuVisible;
			},
			toggleSidepanel: function()
			{
				this.showSidepanel = !this.showSidepanel;
			},
			themeChanged: function () {
				if (localStorage.userTheme === "dark") this.userTheme = "dark";
				else this.userTheme = "default";
			},
			changeTheme: function () {
				console.log("Change theme");
				change_Theme_Fb("change");
				this.themeChanged();
				
			},
			logout: function () {
				this.loading = true;
				let _this = this;
				signOut(FirebaseAuth).then(() => {
					// Automatic redirect to login (onAuthStateChanged)
					localStorage.clear();
					_this.$noty.success("Logout confirmed", {
						killer: true,
						
						timeout: 1500,
					});
					this.$router.replace('/account/login').catch(() => {}); // User not logged
				}).catch((error) => {
					console.log("signOut()", error);
					_this.$noty.error("Logout error, please refresh the page.");
				});
			}
		}
	}
	/*
	{
					icon: 'person',
					title: 'Account',
					link: '/account',
					auth: true,
				},
	*/
</script>

<style lang="scss">
	@import "../../src/style/variables.scss";

	#vue-js-index-container {
		.md-app {
			height: 100vh;

			.router-link {
				display: flex;
				align-items: center;
			}


			.bar-logo {
				width: 35px !important;
				
			}

			.md-app-drawer {
				max-width: 300px !important;
			}
			.md-primary
			{
				height: 45pt;
			}
			.md-button
			{
				height: 30pt;
			}
			.md-list-item {

				&:hover {
					.md-icon {
						color: $accent;
						opacity: 0.8;
					}

					.md-list-item-text {
						color: $accent;
						transition: color .4s cubic-bezier(.4,0,.2,1);
						opacity: 0.8;
					}
				}

				&.active {
					.md-icon {
						color: $accent;
					}

					.md-list-item-text {
						color: $accent;
					}
				}

				.md-list-item-text {
					font-weight: bold;
				}
			}
		}
		 .md-drawer {
		width: 230px;
		max-width: calc(100vw - 125px);
 		 }
	}
</style>
