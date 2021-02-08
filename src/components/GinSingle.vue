<template>
    <div class="gin-single">
      <h6>{{ginData.country}}</h6>
      <h2>{{ ginData.title }}</h2>
      <p><strong>Grösse: </strong>{{ginData.size}}cl</p>
      <p><strong>Prozente: </strong>{{ginData.percentage}}%</p>
      <p><strong>Status: </strong>{{ginData.status}}</p>
      <img :src="ginData.image" :alt="ginData.title">
    </div>
</template>
<script>
export default {
    name: 'GinSingle',
    props: {
        ginData: Object,
        // ginDataTitle: String,
        // ginDataSize: String,
    },
    created() {
        // console.log(this.ginData);
    }
}
</script>
<style scoped>
div {
    margin: 10px;
    box-shadow: 5px 5px 25px rgb(0 0 0 / 16%);
    padding: 40px;
    text-align: center;
}
img {
    max-width: 100%;
    max-height: 400px;
}
</style>