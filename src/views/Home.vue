<template>
    <div class="home"></div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { main } from './game/index'
// import { main } from './game/draging'

export default defineComponent({
    name: 'Home',
    setup() {
        onMounted(() => {
            main()
        })
    }
});
</script>

<style lang="scss" scoped>
</style>
