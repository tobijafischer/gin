<template>
    <transition>
        <div class="gin-page-wrapper" v-if="dataFetched">
            <a @click="$router.go(-1)">back</a>
            <gin-single :ginData="currentGin"></gin-single>
        </div>
        <loader v-else/>
    </transition>
</template>
<script>
import sanity from '@/sanity.js';
import Loader from '@/components/Loader.vue';
import GinSingle from '@/components/GinSingle.vue';

const query = `*[_type == "gin"]{
  'title': name,
  'key': _id,
  'link': link,
  'slug': slug.current,
  'country': country,
  'size': size,
  'percentage': percentage,
  'status': status,
  'usage': usage,
  'degu': degustationNotice,
  'details': description,
  'image': image.asset->url
} | order(country, status)`;

export default {
    name: 'Ginview',
    data() {
        return {
            currentGin: {},
            dataFetched: false
        }
    },
    components: {
        GinSingle,
        Loader
    },
    created() {
        const currentRouteParam = this.$route.params;
        this.fetchGinData(currentRouteParam);
    },
    methods: {
        fetchGinData(route) {
            sanity.fetch(query).then( json => {
                json.map( gin => {
                    if ( gin.slug === route.slug) {
                        this.currentGin = gin;
                    }
                });
            })
            .then( () => {
                this.dataFetched = true;
            });
        }
    }
}
</script>