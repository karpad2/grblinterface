<template>
<div>
<h2>Working Position</h2>

<div id="wPosition" style="align-content: center">
<div id="wX" class="wposition">X: {{tofixed(position.x)}}</div>
<div id="wY" class="wposition">Y: {{tofixed(position.y)}}</div>
<div id="wZ" class="wposition">Z: {{tofixed(position.z)}}</div>
</div>
</div>
</template>

<script>
export default {
    props:{apositions:{x:0,y:0,z:0}},
   data: () => ({
    
       position:this.apositions
    }),
    methods:{
        tofixed(a)
        {
            
            return parseFloat(a).toFixed(3);
        }
    }

}
</script>

<style>
.wposition
{
    text-align: left; padding-left: 15px; margin: 4px; font-size: 30px; width: 190px; border: 1px solid #aaa; font-weight: bold;
}
</style>