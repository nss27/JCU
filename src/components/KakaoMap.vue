<template>
    <div :id="selector" class="kakao-map-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, toRefs } from 'vue'
import Common from '@/utils/Common';

export default defineComponent({
    props: {
        width: String,
        height: String,
        center: Array,
        level: Number,
        delay: Number,
        markerOptions: Array
    },
    setup(props, { emit }) {
        const selector = `map${Date.now()}`;
        const {
            width,
            height,
            center,
            delay,
            level,
            markerOptions
        } = toRefs(props);
        let map = null as any,
            div = {} as HTMLDivElement,
            markers = [] as any[];

        const setWidth = (width: string) => {
            if (!Common.isNull(width)) div.style.width = width;
        };

        const setHeight = (height: string) => {
            if (!Common.isNull(height)) div.style.height = height;
        };

        const setCenter = (position: any) => {
            if (!Common.isNull(position)) map.setCenter(position);
        };

        const setLevel = (level: number) => {
            if (!Common.isNull(level)) map.setLevel(level);
        };

        const setMarkers = (options: any[]) => {
            delMarkers();

            if (!Common.isNull(options)) {
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

        watch(width, () => setWidth(width.value as string));

        watch(height, () => setHeight(height.value as string));

        watch(center, () => setCenter(center.value));

        watch(level, () => setLevel(level.value as number));

        watch(markerOptions, () => setMarkers(markerOptions.value as any[]));

        onMounted(() => {
            setTimeout(() => {
                div = document.querySelector(`#${selector}`) as HTMLDivElement;

                setWidth(width.value as string);
                setHeight(height.value as string);

                const options = {
                    center: new window.kakao.maps.LatLng(35.821490634185395, 127.12554435309835),
                    level: 8
                };

                map = new window.kakao.maps.Map(div, options);

                setCenter(center.value);
                setLevel(level.value as number);
                setMarkers(markerOptions.value as any[]);
            }, delay.value)
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