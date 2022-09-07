<template>
    <div ref="div" class="kakao-map-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, toRefs, ref } from 'vue'
import Common from '@/utils/Common';

export default defineComponent({
    props: ['width', 'height', 'center', 'level', 'markerOptions'],
    setup(props, { emit }) {
        const {
            width,
            height,
            center,
            level,
            markerOptions
        } = toRefs(props);
        const div = ref();
        const markers = ref<any[]>([]);

        let map = null as any;

        const setWidth = (width: string) => {
            if (!Common.isNull(width) && !Common.isNull(div.value)) div.value.style.width = width;
        };

        const setHeight = (height: string) => {
            if (!Common.isNull(height) && !Common.isNull(div.value)) div.value.style.height = height;
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

                        markers.value.push(markerInfo);

                        window.kakao.maps.event.addListener(markerInfo.marker, 'click', () => emit('markerClick', markerInfo));
                    })
            }
        };

        const delMarkers = () => {
            if (!Common.isNull(markers.value)) {
                markers.value.forEach(({ marker, overlay }) => {
                    marker.setMap(null);
                    overlay.setMap(null);
                });
                markers.value = [];
            }
        };

        watch(width, () => setWidth(width.value));
        watch(height, () => setHeight(height.value));
        watch(center, () => setCenter(center.value));
        watch(level, () => setLevel(level.value));
        watch(markerOptions, () => setMarkers(markerOptions.value));

        onMounted(() => {
            setWidth(width.value);
            setHeight(height.value);

            const options = {
                center: new window.kakao.maps.LatLng(35.821490634185395, 127.12554435309835),
                level: 8
            };

            map = new window.kakao.maps.Map(div.value, options);

            setCenter(center.value);
            setLevel(level.value);
            setMarkers(markerOptions.value);
        });

        return {
            div
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