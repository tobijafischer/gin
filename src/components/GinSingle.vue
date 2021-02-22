<template>
    <div class="gin-single" v-view="logElementInView">
      <h2>{{ ginData.title }}</h2>
      <img :src="ginData.image" :alt="ginData.title">
      <h3>{{ ginData.title }}</h3>
      <h4>{{ginData.country}}</h4>
      <span class="quickfacts">
        <p title="Grösse">{{ginData.size}}cl</p>
        <p title="Prozente">{{ginData.percentage}}%</p>
        <p title="Status">{{ginData.status}}</p>
      </span>
      <router-link :to="routerLink" class="external-link">Mehr erfahren</router-link>
    </div>
</template>
<script>
export default {
    name: 'GinSingle',
    props: {
        ginData: Object,
    },
    mounted() {
        this.scrollTranslation(this);
        window.addEventListener('scroll', () => {
            this.scrollTranslation(this);
        });
    },
    computed: {
        routerLink: function() {
            const fullLinkRoute = '/gin/' + this.ginData.slug;
            return fullLinkRoute;
        }
    },
    methods: {
        scrollTranslation: (element) => {
            const viewportHeight = window.innerHeight;
            const windowScrollState = window.pageYOffset;
            if ( element.$el.classList.contains('view-in') ) {
                const bigTextBg = element.$el.childNodes[0];
                const translateWidth = bigTextBg.scrollWidth - window.innerWidth;
                const parallaxHeight = viewportHeight + element.$el.clientHeight;
                const startHeight = element.$el.offsetTop - viewportHeight;
                const endHeight = startHeight + parallaxHeight;

                if ( startHeight < windowScrollState && windowScrollState < endHeight ) {
                    const currentRelativeOffset = windowScrollState - startHeight;
                    const scrollPastFactor = currentRelativeOffset / parallaxHeight;
                    // this.$el.style.transform = 'translateX(' + ((window.innerWidth / 4) * scrollPastFactor - (window.innerWidth / 8)) + 'px)';
                    bigTextBg.style.transform = 'translateX(-' + (translateWidth * scrollPastFactor) + 'px)';
                }
            }
        },
        logElementInView: (e) => {
            if ( e.type == 'enter' ) {
                // console.log(e.target.element);
                console.log('');
            }
        }
    }
}
</script>
<style scoped>
@import url("https://use.typekit.net/aqb8lqo.css");
div {
    text-align: center;
    max-width: 100vw;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8vh 0;
    cursor: pointer;
}
div:hover > img {
    transition: transform .2s linear;
    transform: scale(1.1);
}
h2 {
    font-family: kaneda-gothic, sans-serif;
    font-weight: 900;
    font-style: normal;
    font-size: 400px;
    text-transform: uppercase;
    -webkit-text-stroke: 1px #cfcfcf;
    -webkit-text-fill-color: transparent;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    position: absolute;
    left: 0;
    transform: translateX(0);
}
h3, h4 {
    position: absolute;
    top: 50px;
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 3px;
}
h3 {
    text-align: left;
    left: 4%;
}
h4 {
    text-align: right;
    right: 4%;
}
span.quickfacts {
    position: absolute;
    left: 4%;
    bottom: 50px;
    display: flex;
}
span.quickfacts > p {
    margin-right: 15px;
}
.external-link {
    position: absolute;
    right: 4%;
    bottom: 50px;
}
img {
    max-width: 100%;
    max-height: 480px;
    position: relative;
    top: 0;
    mix-blend-mode: darken;
    transition: transform .3s linear;
}
div.gin-single.view-in--gt-half img {
    transform: scale(1.1);
}
div.gin-single.view-in--full img {
    transform: scale(1.2);
}
div.gin-single {
    transition: filter 0.4s ease-in-out;
}
div.gin-single.view-in {
    filter: blur(0px);
}
div.gin-single:not(.view-in),
div.gin-single.view-in.view-in--gt-third {
    filter: blur(3px);
}
</style>