<template>
    <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Common from '@/utils/Common';

export default defineComponent({
    name: 'KakaoMap',
    props: ['storeList', 'width', 'height', 'center', 'level'],
    data() {
        return {
            map: {} as any,
            markers: [] as any[],
            div: {} as HTMLDivElement
        }
    },
    mounted() {
        setTimeout(() => {
            this.div = document.querySelector('#map') as HTMLDivElement;

            if (!Common.isNull(this.width)) this.div.style.width = this.width;
            if (!Common.isNull(this.height)) this.div.style.height = this.height;

            const options = {
                center: new window.kakao.maps.LatLng(35.821490634185395, 127.12554435309835),
                level: 8
            };

            this.map = new window.kakao.maps.Map(this.div, options);

            this.setAddressList(this.storeList);
            this.setCenter(this.center);
            this.setLevel(this.level);
        }, 500);
    },
    methods: {
        setAddressList(storeList: any[]) {
            this.removeMarkers();

            if (!Common.isNull(storeList)) {
                const geocoder = new window.kakao.maps.services.Geocoder();

                storeList.forEach(store => {
                    if (!Common.isNull(store['store-address'])) {
                        geocoder.addressSearch(store['store-address'], (result: any, status: any) => {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                                const marker = new window.kakao.maps.Marker({
                                    map: this.map,
                                    position: coords,
                                    image: new window.kakao.maps.MarkerImage(`assets/images/${store['marker-img']}`, new window.kakao.maps.Size(22, 22), { offset: new window.kakao.maps.Point(11, 11) })
                                });
                                this.markers.push(marker);
                            }
                        });
                    }
                });
            }
        },
        removeMarkers() {
            if (!Common.isNull(this.markers)) {
                this.markers.map(marker => marker.setMap(null));
                this.markers = [];
            }
        },
        setCenter(position: number[]) {
            if (!Common.isNull(position)) this.map.setCenter(new window.kakao.maps.LatLng(...position));
        },
        setLevel(level: number) {
            if (!Common.isNull(level)) this.map.setLevel(level);
        }
    },
    watch: {
        storeList() {
            this.setAddressList(this.storeList);
        }
    }
})
</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}
</style>