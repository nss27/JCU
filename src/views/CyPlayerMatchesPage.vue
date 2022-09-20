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
      <ion-list v-if="gameInfo" lines="none">
        <template v-for="(player, index) in players" :key="index">
          <ion-item :color="player.gameResult">
            <ion-thumbnail slot="start">
              <img :src="`${NeopleApi.cyCharactersUrl}/${player.playInfo.characterId}`" />
              <img :src="NeopleApi.getPositionImage(player.position.name)" class="position-icon" />
            </ion-thumbnail>
            <ion-label>
              <h1 class="ion-no-margin">
                <strong>{{ player.nickname }}</strong>
              </h1>
              <div>
                [{{ randomText(player.playInfo.random) }}] {{ player.playInfo.characterName }} Lv.{{
                player.playInfo.level }}
              </div>
            </ion-label>
          </ion-item>

          <ion-item :color="player.gameResult" v-if="player.playInfo.partyUserCount > 0">
            <div>
              <ion-chip v-for="(partyInfo, index) in getParty({...player.playInfo, playerId: player.playerId})"
                :key="index" color="white">
                <ion-avatar>
                  <img :src="`${NeopleApi.cyCharactersUrl}/${partyInfo.playInfo.characterId}`">
                </ion-avatar>
                <ion-label>{{partyInfo.nickname}}</ion-label>
              </ion-chip>
            </div>
          </ion-item>

          <ion-item :color="player.gameResult">
            <ion-grid>
              <ion-row>
                <ion-col size="2">
                  K: {{ player.playInfo.killCount }}
                </ion-col>
                <ion-col size="2">
                  D: {{ player.playInfo.deathCount }}
                </ion-col>
                <ion-col size="2">
                  A: {{ player.playInfo.assistCount }}
                </ion-col>
                <ion-col size="6">
                  KDA: {{ gameKDA(player.playInfo.killCount, player.playInfo.deathCount, player.playInfo.assistCount) }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col>
                  공격량
                </ion-col>
                <ion-col>
                  {{ player.playInfo.attackPoint }}
                </ion-col>
                <ion-col>
                  피해량
                </ion-col>
                <ion-col>
                  {{ player.playInfo.damagePoint }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col>
                  전투참여
                </ion-col>
                <ion-col>
                  {{ player.playInfo.battlePoint }}
                </ion-col>
                <ion-col>
                  시야확보
                </ion-col>
                <ion-col>
                  {{ player.playInfo.sightPoint }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col>
                  힐량
                </ion-col>
                <ion-col>
                  {{ player.playInfo.healAmount }}
                </ion-col>
                <ion-col>
                  타워공격
                </ion-col>
                <ion-col>
                  {{ player.playInfo.towerAttackPoint }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="3">
                  획득코인
                </ion-col>
                <ion-col>
                  {{ player.playInfo.getCoin }}
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>

          <ion-item :color="player.gameResult">
            <div class="position-box">
              <img v-for="(position, index) in player.position.attribute" :key="index"
                :src="`${NeopleApi.cyPositionAttributesUrl}/${position.id}`" :class="`position-${position.level}`"
                @click="getPositionInfo(position.id)">
            </div>
          </ion-item>

          <ion-item :color="player.gameResult" lines="full">
            <div class="item-box">
              <div v-for="(item, index) in player.items" :key="index"
                :class="[`item-${item.slotCode}`, getSeason(item.itemName)]" @click="getItemInfo(item.itemId)">
                <img :src="`${NeopleApi.cyitemsUrl}/${item.itemId}`">
              </div>
            </div>
          </ion-item>
        </template>
      </ion-list>
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
  loadingController,
  alertController,
  IonList,
  IonItem,
  IonChip,
  IonAvatar,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
  modalController
} from "@ionic/vue";
import NeopleApi from "@/utils/NeopleApi";
import { useRoute } from "vue-router";
import Common from "@/utils/Common";
import NoData from "@/components/NoData.vue";
import itemInfoVue from "@/components/itemInfo.vue";
import positionInfoVue from "@/components/positionInfo.vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    NoData,
    IonList,
    IonItem,
    IonChip,
    IonAvatar,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail
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

    const getItemInfo = async (itemId: string) => {
      const loading = await loadingController.create({
        message: "데이터 조회중",
        mode: "ios",
      });

      loading.present();

      try {
        const modal = await modalController.create({
          component: itemInfoVue,
          componentProps: {
            itemId: itemId
          },
          mode: 'ios',
          cssClass: ['popup']
        });

        await modal.present();
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
    }

    const getParty = (data: { partyUserCount: number, partyId: string, playerId: string }) => {
      let players = [];

      if (data.partyUserCount > 0) {
        players = [...gameInfo.value.players].filter(player => player.playInfo.partyId === data.partyId && player.playerId !== data.playerId);
      }

      return players;
    }

    const gameKDA = (
      killCount: number,
      deathCount: number,
      assistCount: number
    ) => {
      if (deathCount > 0) {
        return Math.round(((killCount + assistCount) / deathCount) * 100) / 100;
      } else {
        return "PERFECT";
      }
    };

    const getSeason = (itemName: string) => {
      let season = itemName.substring(0, 1);
      if (['E', 'S'].includes(season)) {
        return `season-${season}`;
      } else {
        return null;
      }
    };

    const getPositionInfo = async (attributeId: string) => {
      const loading = await loadingController.create({
        message: "데이터 조회중",
        mode: "ios",
      });

      loading.present();

      try {
        const modal = await modalController.create({
          component: positionInfoVue,
          componentProps: {
            attributeId: attributeId
          },
          mode: 'ios',
          cssClass: ['popup']
        });

        await modal.present();
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
    }

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
      getItemInfo,
      getParty,
      gameKDA,
      getSeason,
      getPositionInfo
    };
  },
});
</script>

<style scoped>
ion-thumbnail {
  position: relative;
}

.position-icon {
  --size: 36px;

  position: absolute;
  width: var(--size);
  height: var(--size);
  bottom: -10px;
  right: -16px;
}

.item-box,
.position-box {
  padding: 5px;
}

.item-box {
  display: grid;
  grid-template-areas:
    '101 102 103 104 105 106 202 203'
    '301 302 303 304 305 107 204 205';
}

.item-box>div {
  margin-bottom: -4px;
}

.item-box .item-101 {
  grid-area: '101';
}

.item-box .item-102 {
  grid-area: '102';
}

.item-box .item-103 {
  grid-area: '103';
}

.item-box .item-104 {
  grid-area: '104';
}

.item-box .item-105 {
  grid-area: '105';
}

.item-box .item-106 {
  grid-area: '106';
}

.item-box .item-202 {
  grid-area: '202';
}

.item-box .item-203 {
  grid-area: '203';
}

.item-box .item-301 {
  grid-area: '301';
}

.item-box .item-302 {
  grid-area: '302';
}

.item-box .item-303 {
  grid-area: '303';
}

.item-box .item-304 {
  grid-area: '304';
}

.item-box .item-305 {
  grid-area: '305';
}

.item-box .item-107 {
  grid-area: '107';
}

.item-box .item-204 {
  grid-area: '204';
}

.item-box .item-205 {
  grid-area: '205';
}

.position-box {
  display: grid;
  grid-template-areas: '1 2 3';
}

.position-box .position-1 {
  grid-area: '1';
}

.position-box .position-2 {
  grid-area: '2';
}

.position-box .position-3 {
  grid-area: '3';
}

.season-E::before {
  content: 'E';
}

.season-S::before {
  content: 'S';
}

.season-E::before,
.season-S::before {
  position: absolute;
  padding: 0 5px;
  background-color: #000000;
}

.popup {
  height: 50%;
}
</style>
