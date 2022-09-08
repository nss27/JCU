<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>경기결과</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <template v-if="gameInfo">
        <ion-card
          v-for="(player, index) in players"
          :key="index"
          :color="player.gameResult"
        >
          <div class="flex-box ion-align-items-center">
            <div class="character-box">
              <img
                :src="`${NeopleApi.cyCharactersUrl}/${player.playInfo.characterId}`"
                class="character-img"
              />
              <img
                :src="`${NeopleApi.getPositionImage(player.position.name)}`"
                class="character-position"
              />
            </div>
            <div class="character-info-box">
              <h5 class="ion-no-margin">
                <strong>{{ player.nickname }}</strong>
              </h5>
              <h5 class="ion-no-margin">
                [{{ randomText(player.playInfo.random) }}]
                {{ player.playInfo.characterName }} Lv.{{
                  player.playInfo.level
                }}
              </h5>
            </div>
          </div>
        </ion-card>
      </template>
      <template v-else>
        <NoData></NoData>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  loadingController,
  alertController,
} from "@ionic/vue";
import NeopleApi from "@/utils/NeopleApi";
import { useRoute } from "vue-router";
import Common from "@/utils/Common";
import NoData from "@/components/NoData.vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    NoData,
  },
  setup() {
    const gameInfo = ref();

    const route = useRoute();

    const randomText = (random: boolean) => (random ? "랜덤" : "선택");

    const players = computed(() => {
      let result = [] as any[];

      if (!Common.isNull(gameInfo.value)) {
        (gameInfo.value.teams as any[]).forEach((team) => {
          (team.players as string[]).forEach((playerId) => {
            result.push({
              gameResult: team.result,
              ...(gameInfo.value.players as any[]).filter(
                (info) => info.playerId === playerId
              )[0],
            });
          });
        });
      }

      return result.sort((a) => (a.gameResult === "win" ? -1 : 1));
    });

    onMounted(async () => {
      const loading = await loadingController.create({
        message: "데이터 조회중",
        mode: "ios",
      });
      loading.present();

      try {
        gameInfo.value = await NeopleApi.cyPlayerMatchesInfo({
          matchId: route.params.matchId as string,
        });
      } catch (error) {
        const alert = await alertController.create({
          header: "오류 발생",
          subHeader: `${error}`,
          buttons: ["OK"],
          mode: "ios",
        });

        await alert.present();
      } finally {
        loading.dismiss();
      }
    });

    return {
      gameInfo,
      NeopleApi,
      randomText,
      players,
    };
  },
});
</script>

<style scoped>
.flex-box {
  display: flex;
}

.character-box {
  position: relative;
  margin: 10px;
  margin-right: 20px;
}

.character-img {
  --size: 56px;

  width: var(--size);
  height: var(--size);
}

.character-position {
  --size: 36px;

  position: absolute;
  width: var(--size);
  height: var(--size);
  bottom: -10px;
  right: -16px;
}

.character-info-box {
  margin: 10px;
}
</style>
