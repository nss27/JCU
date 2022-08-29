<template>
    <div :id="selector" class="kakao-map-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, toRefs } from 'vue'
import Common from '@/utils/Common';

export default defineComponent({
    props: ['width', 'height', 'center', 'level', 'delay', 'markerOptions'],
    setup(props, { emit }) {
        const selector = `map${Date.now()}`;
        const {
            width,
            height,
            center,
            level,
            delay,
            markerOptions
        } = toRefs(props);
        let map = null as any,
            div = {} as HTMLDivElement,
            markers = [] as any[];

        const setWidth = (width: string) => {
            if (!Common.isNull(width) && !Common.isNull(div)) div.style.width = width;
        };

        const setHeight = (height: string) => {
            if (!Common.isNull(height) && !Common.isNull(div)) div.style.height = height;
        };

        const setCenter = (position: any) => {
            if (!Common.isNull(position) && !Common.isNull(map)) map.setCenter(position);
        };

        const setLevel = (level: number) => {
            if (!Common.isNull(level) && !Common.isNull(map)) map.setLevel(level);
        };

        const setMarkers = (options: any[]) => {
            delMarkers();

            if (!Common.isNull(options) && !Common.isNull(map)) {
                options
                    .map(option => {
                        option.map = map;
                        return option;
                    })
                    .forEach(option => {
                        const markerInfo = {
                            marker: new window.kakao.maps.Marker(option),
                            overlay: new window.kakao.maps.CustomOverlay(option)
                        };

                        markers.push(markerInfo);

                        window.kakao.maps.event.addListener(markerInfo.marker, 'click', () => emit('markerClick', markerInfo));
                    })
            }
        };

        const delMarkers = () => {
            if (!Common.isNull(markers)) {
                markers.forEach(({ marker, overlay }) => {
                    marker.setMap(null);
                    overlay.setMap(null);
                });
                markers = [];
            }
        };

        watch(width, () => setWidth(width.value));
        watch(height, () => setHeight(height.value));
        watch(center, () => setCenter(center.value));
        watch(level, () => setLevel(level.value));
        watch(markerOptions, () => setMarkers(markerOptions.value));

        onMounted(() => {
            setTimeout(() => {
                div = document.querySelector(`#${selector}`) as HTMLDivElement;

                setWidth(width.value);
                setHeight(height.value);

                const options = {
                    center: new window.kakao.maps.LatLng(35.821490634185395, 127.12554435309835),
                    level: 8
                };

                map = new window.kakao.maps.Map(div, options);

                setCenter(center.value);
                setLevel(level.value);
                setMarkers(markerOptions.value);
            }, Common.isNull(delay.value) ? 0 : delay.value);
        });

        return {
            selector
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