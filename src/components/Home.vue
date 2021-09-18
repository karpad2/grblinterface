<template>
	<div>
		<div class="section">

      <positions :apositions="positions"/>
	  <md-card>
      <md-card-header>
        <div class="md-title">Actions</div>
      </md-card-header>

      <md-card-content>
        <md-button class="md-raised md-secondary"  @click="send_zero">Zero the Machine (G92)</md-button>
		<md-button class="md-raised md-secondary"  @click="reset_device">RESET (ctrl-x)</md-button>
		<md-button class="md-raised md-secondary"  @click="send_settings">settings ($$)</md-button>
		<md-button class="md-raised md-secondary"  @click="send_pause">Pause</md-button>
		<md-button class="md-raised md-secondary"  @click="clear_queue">Clear Queue</md-button>

		
       
	</md-card-content>
 </md-card> 
  <md-card> 
 <md-card-header>
        <div class="md-title">Jogs</div>
      </md-card-header>

      <md-card-content>
        <b-select v-bind="jog_speed">
			<b-select-option v-for="jg in jog_speeds" :key="jg" :value="jg">Feed Rate {{jg}}</b-select-option>
		</b-select>

		<b-select v-bind="jog_size">
			<b-select-option v-for="jg in jog_sizes" :key="jg" :value="jg">Distance: {{jg}}</b-select-option>
		</b-select> 
      </md-card-content>
 </md-card> 

  <md-card> 
 <md-card-header>
        <div class="md-title">CAM</div>
      </md-card-header>

      <md-card-content>
        <renderarea/>
      </md-card-content>
 </md-card>
		
		

		
	
		</div>
		<div class="section">
			<md-card> 
 <md-card-header>
        <div class="md-title">G-code textarea:</div>
      </md-card-header>

      <md-card-content>
        <gcodetextarea style="width:400px" />
      </md-card-content>
 </md-card>
 <md-card> 
 <md-card-header>
        <div class="md-title">Console:</div>
      </md-card-header>

      <md-card-content>
        <console style="width:400px"/>
      </md-card-content>
 </md-card>
		
		
		</div>
	
	</div>
	
</template>

<script>
import {FireDb,FirebaseAuth,userId} from "@/firebase";
import {get_data_from_allroomdb,get_rooms,get_data_fromroomdb} from "@/mod_data/get_data";
import Positions from './parts/positions.vue';
import renderarea from './parts/renderarea.vue';
import gcodetextarea from './parts/gcodetextarea.vue';
import console from './parts/console.vue';
/*


		*/ 


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
			jog_speed:1000,
			jog_speeds:[1500,1000,500,100,5],
			jog_sizes:[0.1,0.5,1,2,5,10,30],
			jog_size:0.5,
			positions:{x:0,y:0,z:0},
			command:""
			
			
		}),
		components:{
		Positions,
		renderarea,
		gcodetextarea,
		console	
    		
		},

		
Consolecomputed: {
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
			this.file_upload();
			//console.log(this.$route)
		},
		methods: {
			showSuccess: function () {
				this.$noty.success("Success!");
			},
			send_zero()
			{

			},
			reset_device()
			{

			},
			clear_queue()
			{

			},
			send_pause()
			{

			},
			send_settings()
			{

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
			file_upload()
			{
				var fileInput = document.getElementById('fileInput');
		fileInput.addEventListener('change', function(e) {
			reader.onloadend = function (ev) {
				this.command = this.result;
				//openGCodeFromText();
			};
			reader.readAsText (fileInput.files[0]);
		});
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
  .md-button{
	  margin:10px;
  }

</style>