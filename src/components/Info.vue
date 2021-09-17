<template>
	<div class="center">
		<p>Latest version:</p>
		App made by <a href="https://karpad2.github.io" class="karpad2" target="_blank">karpad2</a>
		<p><a href="https://karpad2.github.io" target="_blank">GitHub</a></p>
	</div>
</template>

<script>
	export default {
		name: "Info"
	}
</script>

<style scoped>
	.center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		text-align: center;
	}

	.karpad2 {
		font-weight: bold;
	}
</style>