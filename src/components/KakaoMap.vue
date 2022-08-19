<template>
    <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Common from '@/utils/Common';

export default defineComponent({
    name: 'KakaoMap',
    props: ['addressList'],
    data() {
        return {
            map: null
        }
    },
    mounted() {
        const container = document.querySelector('#map');
        const options = {
            center: new window.kakao.maps.LatLng(35.821490634185395, 127.12554435309835),
            level: 8
        };

        this.map = new window.kakao.maps.Map(container, options);
        if(this.addressList.length > 0) this.setAddressList(this.addressList);
    },
    methods: {
        setAddressList(addressList: string[]) {
            const geocoder = new window.kakao.maps.services.Geocoder();

            addressList.forEach(address => {
                if(!Common.isNull(address)) {
                    geocoder.addressSearch(address, (result: any, status: any) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                            const marker = new window.kakao.maps.Marker({
                                map: this.map,
                                position: coords
                            });
                        }
                    });
                }
            })
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