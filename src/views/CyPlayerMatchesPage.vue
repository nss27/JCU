<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>경기결과</ion-title>
        <ion-buttons slot="end">
          <web-share-button-vue></web-share-button-vue>
          <home-button-vue></home-button-vue>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="showType">
          <ion-segment-button value="briefly">간략히</ion-segment-button>
          <ion-segment-button value="details">자세히</ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list v-if="!Common.isNull(players)" lines="none">
        <template v-for="(player, index) in players" :key="index">
          <ion-item :color="player.playInfo.gameResult" :id="player.playerId" button
            :router-link="`/playerInfo/${encodeURI(player.nickname)}`">
            <ion-thumbnail slot="start">
              <img :src="NeopleApi.getCharacterImage(player.playInfo.characterId)" />
              <img :src="NeopleApi.getPositionImage(player.position.name)" class="position-icon" />
            </ion-thumbnail>
            <ion-label>
              <h1 class="ion-no-margin">
                <strong>{{ player.nickname }}</strong>
              </h1>
              <div>
                [{{ player.playInfo.playTypes.join('/') }}] {{ player.playInfo.characterName }} Lv.{{
                player.playInfo.level }}
              </div>
            </ion-label>
          </ion-item>

          <ion-item v-if="!Common.isNull(player.playInfo.partyData) && player.isDetail"
            :color="player.playInfo.gameResult">
            <div>
              <ion-chip v-for="(partyInfo, index) in player.playInfo.partyData" :key="index" color="dark"
                @click="moveToId(partyInfo.playerId)">
                <ion-avatar>
                  <img :src="NeopleApi.getCharacterImage(partyInfo.playInfo.characterId)">
                </ion-avatar>
                <ion-label>{{partyInfo.nickname}}</ion-label>
              </ion-chip>
            </div>
          </ion-item>

          <ion-item lines="inset">
            <ion-grid>
              <ion-row class="ion-align-items-center">
                <ion-col>
                  K: {{ player.playInfo.killCount }}
                </ion-col>
                <ion-col>
                  D: {{ player.playInfo.deathCount }}
                </ion-col>
                <ion-col>
                  A: {{ player.playInfo.assistCount }}
                </ion-col>
                <ion-col size="5">
                  KDA: {{ player.playInfo.kda }}
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>

          <ion-item lines="inset">
            <ion-grid>
              <ion-row class="ion-align-items-center">
                <ion-col>
                  <ion-text color="medium">공격량</ion-text>
                </ion-col>
                <ion-col>
                  {{ Common.commaFormat(player.playInfo.attackPoint) }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">피해량</ion-text>
                </ion-col>
                <ion-col>
                  {{ Common.commaFormat(player.playInfo.damagePoint) }}
                </ion-col>
              </ion-row>

              <ion-row class="ion-align-items-center">
                <ion-col>
                  <ion-text color="medium">전투참여</ion-text>
                </ion-col>
                <ion-col>
                  {{ player.playInfo.battlePoint }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">시야확보</ion-text>
                </ion-col>
                <ion-col>
                  {{ player.playInfo.sightPoint }}
                </ion-col>
              </ion-row>

              <ion-row v-if="player.isDetail" class="ion-align-items-center">
                <ion-col>
                  <ion-text color="medium">힐량</ion-text>
                </ion-col>
                <ion-col>
                  {{ Common.commaFormat(player.playInfo.healAmount) }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">타워공격</ion-text>
                </ion-col>
                <ion-col>
                  {{ Common.commaFormat(player.playInfo.towerAttackPoint) }}
                </ion-col>
              </ion-row>

              <ion-row v-if="player.isDetail" class="ion-align-items-center">
                <ion-col>
                  <ion-text color="medium">획득코인</ion-text>
                </ion-col>
                <ion-col>
                  {{ Common.commaFormat(player.playInfo.getCoin) }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">도핑코인</ion-text>
                </ion-col>
                <ion-col>
                  {{ Common.commaFormat(player.playInfo.spendConsumablesCoin) }}
                </ion-col>
              </ion-row>

              <ion-row v-if="player.isDetail" class="ion-align-items-center">
                <ion-col>
                  <ion-text color="medium">총 CS</ion-text>
                </ion-col>
                <ion-col>
                  {{ player.playInfo.totalCSCount }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">분당 CS</ion-text>
                </ion-col>
                <ion-col>
                  {{ player.playInfo.minuteCSCount }}
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>

          <ion-item v-if="player.isDetail" lines="inset">
            <ion-label>
              <ion-text color="medium">특성</ion-text>
              <div class="position-box">
                <img v-for="(position, index) in player.position.attribute" :key="index"
                  :src="`${NeopleApi.cyPositionAttributesUrl}/${position.id}`" @click="getPositionInfo(position.id)">
              </div>
            </ion-label>
          </ion-item>

          <ion-item v-if="player.isDetail">
            <ion-label>
              <ion-text color="medium">아이템</ion-text>
              <div class="item-box">
                <div v-for="(item, index) in player.items" :key="index" :class="item.cssClass"
                  @click="getItemInfo(item.itemId)">
                  <img v-if="!Common.isNull(item.itemId)" :src="`${NeopleApi.cyitemsUrl}/${item.itemId}`">
                  <img v-else :src="`/assets/images/cyphers/item-slot/${item.equipSlotCode}.png`">
                </div>
              </div>
            </ion-label>
          </ion-item>

          <ion-item class="ion-text-center" button :detail="false" @click="showTypeChange(player)">
            <ion-label color="medium">
              {{showTypeText(player)}}
              <ion-icon :icon="showTypeIcon(player)"></ion-icon>
            </ion-label>
          </ion-item>
        </template>
      </ion-list>
      <no-data-vue v-else></no-data-vue>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
  IonText,
  IonSegment,
  IonSegmentButton,
  IonIcon
} from "@ionic/vue";
import NeopleApi from "@/utils/NeopleApi";
import { useRoute, useRouter } from "vue-router";
import Common from "@/utils/Common";
import NoDataVue from "@/components/NoData.vue";
import HomeButtonVue from "@/components/HomeButton.vue";
import { chevronDown, chevronUp } from "ionicons/icons";
import WebShareButtonVue from "@/components/WebShareButton.vue";

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
    IonChip,
    IonAvatar,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    NoDataVue,
    HomeButtonVue,
    WebShareButtonVue
  },
  setup() {
    const abortController = new AbortController();
    const route = useRoute();
    const router = useRouter();

    const gameInfo = ref();
    const showType = ref('briefly');

    const equipSlotCodeInfo: { [key: number]: string } = {
      101: '손(공격)',
      102: '머리(치명)',
      103: '가슴(체력)',
      104: '허리(회피)',
      105: '다리(방어)',
      106: '발(이동)',
      202: '장신구1',
      203: '장신구2',
      301: '회복킷',
      302: '가속킷',
      303: '공격킷',
      304: '방어킷',
      305: '특수킷',
      107: '목',
      204: '장신구3',
      205: '장신구4'
    };

    const errorHanbler = async (err: Error) => {
      if (err.name !== 'AbortError') {
        const alert = await alertController.create({
          header: '오류 발생',
          subHeader: `${err.message}`,
          buttons: ['ok'],
          mode: 'ios'
        })

        await alert.present();
      }
    }

    const players = computed(() => {
      const result = [] as any[];

      if (!Common.isNull(gameInfo.value)) {
        (gameInfo.value.teams as any[]).forEach((team) => {
          (team.players as string[]).forEach((playerId) => {
            const playerData = (gameInfo.value.players as any[]).filter((info) => info.playerId === playerId)[0];

            if ((16 - playerData.items.length) > 0) {
              let equipSlotCodeKeyStr = Object.keys(equipSlotCodeInfo).join(' ');
              const useItems = [...playerData.items].map(item => item.equipSlotCode);

              useItems.forEach(equipSlotCode => {
                equipSlotCodeKeyStr = equipSlotCodeKeyStr.replace(equipSlotCode, '');
              });

              const defaultItems = equipSlotCodeKeyStr.split(' ').filter(slotCode => !Common.isNull(slotCode)).map(slotCode => Number(slotCode));

              for (let i = 0; i < defaultItems.length; i++) {
                const slotCode = defaultItems[i];

                (playerData.items as any[]).push({
                  itemId: null,
                  itemName: "기본",
                  slotCode: slotCode,
                  slotName: equipSlotCodeInfo[slotCode],
                  rarityCode: "101",
                  rarityName: "커먼",
                  equipSlotCode: slotCode,
                  equipSlotName: equipSlotCodeInfo[slotCode]
                });
              }
            }

            (playerData.items as any[]).map(item => {
              item.cssClass = [`item-${item.equipSlotCode}`, getSeason(item.itemName), getItemColor(item.rarityName)];
              return item;
            });

            playerData.playInfo.totalCSCount = playerData.playInfo.sentinelKillCount + playerData.playInfo.demolisherKillCount;
            playerData.playInfo.minuteCSCount = Math.round(((playerData.playInfo.sentinelKillCount + playerData.playInfo.demolisherKillCount) / (playerData.playInfo.playTime / 60)) * 10) / 10;
            playerData.playInfo.playTimeMinute = Math.floor(playerData.playInfo.playTime / 60);
            playerData.playInfo.playTimeSecond = playerData.playInfo.playTime % 60;
            playerData.playInfo.playTypes = getPlayTypes(playerData);
            playerData.playInfo.gameResult = team.result;
            playerData.playInfo.partyData = getParty(playerData);
            playerData.playInfo.kda = getKDA(playerData);
            playerData.isDetail = false;

            result.push(playerData);
          });
        });

        return result.sort((a) => (a.playInfo.gameResult === "win" ? -1 : 1));
      } else {
        return result;
      }
    });

    const getParty = (data: { playerId: string, playInfo: { partyUserCount: number, partyId: string } }) => {
      let players = [];

      if (data.playInfo.partyUserCount > 0) {
        players = (gameInfo.value.players as any[]).filter(player => player.playInfo.partyId === data.playInfo.partyId && player.playerId !== data.playerId);
      }

      return players;
    }

    const getKDA = (data: { playInfo: { killCount: number, deathCount: number, assistCount: number } }) => {
      if (data.playInfo.deathCount > 0) {
        return Math.round(((data.playInfo.killCount + data.playInfo.assistCount) / data.playInfo.deathCount) * 100) / 100;
      } else {
        return "PERFECT";
      }
    };

    const getSeason = (itemName: string) => {
      let season = itemName.substring(0, 2).trim();
      if (['E', 'S'].includes(season)) {
        return `season-${season}`;
      } else {
        return null;
      }
    };

    const getItemColor = (rarityName: '커먼' | '언커먼' | '레어' | '유니크') => {
      let color = '';

      switch (rarityName) {
        case '유니크':
          color = 'unique';
          break;

        case '레어':
          color = 'rare';
          break;

        case '언커먼':
          color = 'primary';
          break;

        default:
          color = 'medium';
          break;
      }

      return `border-${color}`;
    }

    const getPlayTypes = (data: { playInfo: { random: boolean, playTypeName: '정상' | '난입' | '재입장' } }) => {
      const result: string[] = [];
      result.push(data.playInfo.random ? '랜덤' : '선택');
      if (data.playInfo.playTypeName !== '정상') result.push(data.playInfo.playTypeName);
      return result;
    }

    const getItemInfo = async (itemId: string) => {
      if (!Common.isNull(itemId)) {
        router.push({
          path: `/itemInfo/${itemId}`
        });
      }
    }

    const getPositionInfo = (attributeId: string) => {
      router.push({
        path: `/positionInfo/${attributeId}`
      });
    }

    const moveToId = (playerId: string) => {
      router.replace({
        hash: `#${playerId}`
      })
    }

    const showTypeChange = (data: any) => {
      data.isDetail = !data.isDetail;
    }

    const showTypeText = (data: any) => {
      return data.isDetail ? '간략히보기' : '자세히보기';
    }

    const showTypeIcon = (data: any) => {
      return data.isDetail ? chevronUp : chevronDown;
    }

    onMounted(async () => {
      const loading = await loadingController.create({
        message: "데이터 조회중",
        mode: "ios",
      });

      await loading.present();

      try {
        gameInfo.value = await NeopleApi.cyPlayerMatchesInfo({ matchId: route.params.matchId as string }, { signal: abortController.signal });
      } catch (err: any) {
        errorHanbler(err);
      } finally {
        await loading.dismiss();
      }
    });

    watch(showType, async () => {
      const loading = await loadingController.create({
        message: '처리중',
        mode: 'ios'
      });

      await loading.present();

      players.value.map(player => {
        player.isDetail = showType.value === 'details';
        return player;
      });

      await loading.dismiss();
    })

    onBeforeUnmount(() => {
      abortController.abort();
    })

    return {
      Common,
      NeopleApi,
      players,
      showType,
      getItemInfo,
      getPositionInfo,
      moveToId,
      showTypeChange,
      showTypeText,
      showTypeIcon
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
  margin-top: 10px;
}

.item-box {
  display: grid;
  grid-template-areas:
    'slot-101 slot-102 slot-103 slot-104 slot-105 slot-106 slot-202 slot-203'
    'slot-301 slot-302 slot-303 slot-304 slot-305 slot-107 slot-204 slot-205';
  width: fit-content;
}

.item-box>div>img {
  width: 64px;
}

.item-box .item-101 {
  grid-area: slot-101;
}

.item-box .item-102 {
  grid-area: slot-102;
}

.item-box .item-103 {
  grid-area: slot-103;
}

.item-box .item-104 {
  grid-area: slot-104;
}

.item-box .item-105 {
  grid-area: slot-105;
}

.item-box .item-106 {
  grid-area: slot-106;
}

.item-box .item-202 {
  grid-area: slot-202;
}

.item-box .item-203 {
  grid-area: slot-203;
}

.item-box .item-301 {
  grid-area: slot-301;
}

.item-box .item-302 {
  grid-area: slot-302;
}

.item-box .item-303 {
  grid-area: slot-303;
}

.item-box .item-304 {
  grid-area: slot-304;
}

.item-box .item-305 {
  grid-area: slot-305;
}

.item-box .item-107 {
  grid-area: slot-107;
}

.item-box .item-204 {
  grid-area: slot-204;
}

.item-box .item-205 {
  grid-area: slot-205;
}

.position-box {
  display: flex;
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
  color: #ffffff;
}

.border-medium {
  border: solid 2px var(--ion-color-medium);
}

.border-primary {
  border: solid 2px var(--ion-color-primary);
}

.border-rare {
  border: solid 2px var(--ion-color-rare);
}

.border-unique {
  border: solid 2px var(--ion-color-unique);
}
</style>
