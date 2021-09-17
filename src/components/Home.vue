<template>
	<div>
		<div class="section">
	<md-card md-with-hover>
      <md-card-header>
        <div class="md-title">Profile</div>
      </md-card-header>

      <md-card-content>
        Hello, <span class="profile">{{profilename}}</span>
      </md-card-content>

      <md-card-actions>
        
      </md-card-actions>
    </md-card>

	<md-card md-with-hover @click="navigate('devices')">
      <md-card-header>
        <div class="md-title">Devices</div>
      </md-card-header>

      <md-card-content>
        <span v-if="active==0">Devices are offline</span>
		<span v-else-if="inactive==0">Devices are online</span>
		<span v-else>{{active}} are online, and {{inactive}} are offline</span>
      </md-card-content>

      <md-card-actions>
        
      </md-card-actions>
    </md-card>

	
		</div>
	<div class="section">
		<md-card md-with-hover @click="navigate('devices')">
      <md-card-header>
        <div class="md-title">Calendar</div>
      </md-card-header>
		
      <md-card-content>
        <Calendar :min-date='new Date()' :attributes='attributes'/>
		
      </md-card-content>

      <md-card-actions>
        
      </md-card-actions>
    </md-card>

	</div>
	</div>
	
</template>

<script>
import {FireDb,FirebaseAuth,userId} from "@/firebase";
import {get_data_from_allroomdb,get_rooms,get_data_fromroomdb} from "@/mod_data/get_data";
import {  Calendar } from 'v-calendar';
	export default {
		name: "Home",
		data: () => ({
			selectedMovies: [],
			selectedDate: null,
			boolean: false,
			active:0,
			inactive:0,
			devices:{},
			events:[],
			date: new Date(),
			
		}),
		components:{
			
    		Calendar,
		},
		computed: {
			firstDayOfAWeek: {
				get() {
					return this.$material.locale.firstDayOfAWeek;
				},
				set(val) {
					this.$material.locale.firstDayOfAWeek = val;
				},
				
			},
			dateFormat: {
				get() {
					return this.$material.locale.dateFormat;
				},
				set(val) {
					this.$material.locale.dateFormat = val;
				}
			},
			profilename()
			{
				return FirebaseAuth.currentUser.displayName;
			},
			attributes() {
				return this.events.map(t => ({
					key: `events.${t.id}`,
					dot: {
					backgroundColor: "red",
					},
					dates: t.contact_date,
					customData: t.contact_name,
      }));
			}
			
		},
		mounted()
		{
			console.log(FirebaseAuth.currentUser);
			this.get_name();
			this.events=get_data_from_allroomdb("events");
			//console.log(this.$route)
		},
		methods: {
			showSuccess: function () {
				this.$noty.success("Success!");
			},
			showError: function () {
				this.$noty.error("Error :(", {
					killer: true,
					timeout: 1500,
				});
			},
			get_name()
			{
				//this.profilename=;
				console.log(FirebaseAuth);
			},
			navigate(k)
			{
			console.log("try to navigate");
			this.$route.push(`/${k}`)
			},
	get_active_devices(index)
    {
    this.devices=get_data_fromroomdb(index,"devices");
     let k;

      this.devices.forEach(element => {
        console.log(element.data.lastonline);
        k=Date.now()-Date(element.data.lastonline);
        if(k<120)
        {
          this.active++;
        }
        else
        {
          this.inactive++;
        }
       
       // console.log(k);
      });
      
    },
		},
		
	}
</script>

<style scoped>
.md-card {
    width: 320px;
    margin: 15px;
	padding: 15px;
    display: inline-block;
    vertical-align: top;
  }
  .profile{
	  font-weight: bold;
  }

</style>