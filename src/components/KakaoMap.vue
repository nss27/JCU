<template>
    <div :id="selector" class="kakao-map-container"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Common from '@/utils/Common';

export default defineComponent({
    name: 'KakaoMap',
    props: ['width', 'height', 'center', 'level', 'delay', 'markerOptions'],
    data() {
        return {
            map: {} as any,
            div: {} as HTMLDivElement,
            markers: [] as any[],
            selector: `map${Date.now()}`
        }
    },
    mounted() {
        setTimeout(() => {
            this.div = document.querySelector(`#${this.selector}`) as HTMLDivElement;

            this.setWidth(this.width);
            this.setHeight(this.height);

            const options = {
                center: new window.kakao.maps.LatLng(35.821490634185395, 127.12554435309835),
                level: 8
            };

            this.map = new window.kakao.maps.Map(this.div, options);

            this.setCenter(this.center);
            this.setLevel(this.level);
            this.setMarkers(this.markerOptions);
        }, Common.isNull(this.delay) ? 0 : this.delay);
    },
    methods: {
        setWidth(width: string) {
            if (!Common.isNull(width)) this.div.style.width = width;
        },
        setHeight(height: string) {
            if (!Common.isNull(height)) this.div.style.height = height;
        },
        setCenter(position: any) {
            if (!Common.isNull(position)) this.map.setCenter(position);
        },
        setLevel(level: number) {
            if (!Common.isNull(level)) this.map.setLevel(level);
        },
        setMarkers(options: any[]) {
            this.delMarkers();

            if (!Common.isNull(options)) {
                options
                    .map(option => {
                        option.map = this.map;
                        return option;
                    })
                    .forEach(option => {
                        const markerInfo = {
                            marker: new window.kakao.maps.Marker(option),
                            overlay: new window.kakao.maps.CustomOverlay(option)
                        };

                        this.markers.push(markerInfo);

                        window.kakao.maps.event.addListener(markerInfo.marker, 'click', () => this.$emit('markerClick', markerInfo));
                    })
            }
        },
        delMarkers() {
            if (!Common.isNull(this.markers)) {
                this.markers.forEach(({ marker, overlay }) => {
                    marker.setMap(null);
                    overlay.setMap(null);
                });
                this.markers = [];
            }
        }
    },
    watch: {
        width() {
            this.setWidth(this.width);
        },
        height() {
            this.setHeight(this.height);
        },
        center() {
            this.setCenter(this.center);
        },
        level() {
            this.setLevel(this.level);
        },
        markerOptions() {
            this.setMarkers(this.markerOptions);
        }
    }
})
</script>

<style scoped>
.kakao-map-container {
    width: 100%;
    height: 100%;
}
</style>