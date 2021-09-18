<template>
    <textarea name="gcodes"  class="writebox col-md-6 col-lg-8" id="command"></textarea>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    data:()=>
    {
        return{
            reader : new FileReader ()
        }
    },
    mounted()
    {
        document.getElementById('command').addEventListener ('dragenter', this.dragEvent, false);
		document.getElementById('command').addEventListener ('dragover', this.dragEvent, false);
		document.getElementById('command').addEventListener ('drop', this.dragEvent, false);


    },
    methods:{
        dragEvent (ev) {
			ev.stopPropagation (); 
			ev.preventDefault ();
			if (ev.type == 'drop') {
				this.reader.onloadend = function (ev) {
					this.command = this.result;
					//openGCodeFromText();
				};
				this.reader.readAsText (ev.dataTransfer.files[0]);
			}  
		},
        file_upload()
		{
		// handle gcode uploads
	if (window.FileReader) {

	

		
		// button
		

	} else {
		alert('your browser is too old to upload files, get the latest Chromium or Firefox');
	}
		}
    }
})
</script>

<style lang="scss" scoped>
.writebox{
height: 300px; width: 500px; overflow: auto; border: 2px solid orange;
}
</style>