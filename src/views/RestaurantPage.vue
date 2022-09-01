<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>{{ storeInfo['store-name'] }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <KakaoMap height="50%" level="3" :center="storeInfo['store-position']" :markerOptions="storeMarkerOptions"
                v-if="storeInfo['store-position']">
            </KakaoMap>
            <ion-list lines="none">
                <ion-item>
                    <ion-label class="ion-text-wrap">
                        <ion-text color="primary">
                            <p>{{ storeInfo['hashtag'] }}</p>
                        </ion-text>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-label class="ion-text-wrap">
                        <h1>주소</h1>
                        <p>{{ storeAddress }}</p>
                    </ion-label>
                    <ion-button fill="clear" :href="wayfinding" target="_blank" v-if="storeInfo['store-position']">
                        <ion-icon :icon="navigate" slot="icon-only"></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonButton,
    IonIcon
} from '@ionic/vue'
import KakaoMap from '@/components/KakaoMap.vue';
import Common from '@/utils/Common';
import GoogleApi from '@/utils/GoogleApi';
import { useRoute } from 'vue-router';
import { navigate } from 'ionicons/icons';

export default defineComponent({
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonText,
        KakaoMap,
        IonButton,
        IonIcon
    },
    setup() {
        const route = useRoute();
        let storeInfo = ref({} as any);

        const storeMarkerOptions = computed(() => {
            if (Common.isNull(storeInfo.value['store-marker-option'])) {
                return [];
            } else {
                return [storeInfo.value['store-marker-option']];
            }
        });

        const storeAddress = computed(() => {
            if (Common.isNull(storeInfo.value['store-address'])) {
                return '조회된 주소가 없습니다';
            } else {
                return storeInfo.value['store-address'];
            }
        });

        const wayfinding = computed(() => {
            if (Common.isNull(storeInfo.value['store-address'])) {
                return undefined;
            } else {
                const { La, Ma } = storeInfo.value['store-position'];
                return `https://map.kakao.com/link/to/${storeInfo.value['store-name']},${Ma},${La}`;
            }
        });

        onMounted(async () => {
            const list = await GoogleApi.getSingleSheetData('맛집정보') as any[];
            const index = list.findIndex(item => item.no == route.params.no);
            storeInfo.value = ref(list[index]).value;

            if (!Common.isNull(storeInfo.value['store-address'])) {
                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(storeInfo.value['store-address'], (result: any, status: any) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        storeInfo.value['store-position'] = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                        storeInfo.value['store-marker-option'] = {
                            position: storeInfo.value['store-position'],
                            image: new window.kakao.maps.MarkerImage(`assets/images/${storeInfo.value['marker-img']}`, new window.kakao.maps.Size(22, 22), { offset: new window.kakao.maps.Point(11, 11) }),
                            title: storeInfo.value['no'],
                            content: `<div class="name-tag">${storeInfo.value['store-name']}</div>`,
                            yAnchor: -0.75
                        }
                    }
                });
            }
        });

        return {
            storeInfo,
            storeMarkerOptions,
            storeAddress,
            navigate,
            wayfinding
        }
    }
})
</script>

<style scoped>
ion-card {
    min-height: 130px;
}

.store-icon {
    position: absolute;
    width: 140px;
    right: -30px;
    bottom: -30px;
    opacity: 0.25;
}

.hashtag {
    color: var(--ion-color-primary);
}
</style>