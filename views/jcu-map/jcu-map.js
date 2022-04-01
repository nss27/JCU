import * as com from '../../utils/common.js'

export default class JcuMap extends HTMLElement {
    map = null

    constructor() {
        super()

        this.attachShadow({mode: 'open'})
    }

    static get observedAttributes() {
        // 모니터링 할 속성 이름
        return []
    }

    connectedCallback() {
        // DOM에 추가되었다. 렌더링 등의 처리를 하자.
        this.render()
    }

    disconnectedCallback() {
        // DOM에서 제거되었다. 엘리먼트를 정리하는 일을 하자.
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        // 속성이 추가/제거/변경되었다.
        this[attrName] = newVal
    }

    async render() {
        const html = await (await fetch(`${com.rootPath()}/views/jcu-map/jcu-map.html`)).text()
        const css = await (await fetch(`${com.rootPath()}/views/jcu-map/jcu-map.css`)).text()

        this.shadowRoot.innerHTML = html

        const style = document.createElement('style')
        style.textContent = css
        this.shadowRoot.appendChild(style)

        this.map = await this.createMap()
    }

    // 지도 생성
    createMap = async () => {
        const container = this.shadowRoot.querySelector('#map')
        const options = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 7
        }

        return new kakao.maps.Map(container, options)
    }

    // 주소 -> 좌표 변환
    addressToGoordinate = list => {
        // 주소-좌표 변환 객체
        const geocoder = new kakao.maps.services.Geocoder()

        list = list.map(data => {
            if(data[3]) {
                geocoder.addressSearch(data[3], (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const marker = {
                            map: this.map,
                            position: new kakao.maps.LatLng(result[0].y, result[0].x)
                        }

                        if(!com.isNull(data[5])) marker.image = new kakao.maps.MarkerImage(`${com.rootPath()}/images/${data[5]}`, new kakao.maps.Size(22, 22), {offset: new kakao.maps.Point(11, 11)})

                        data.push(
                            new kakao.maps.Marker(marker)
                        )
                    }
                })
            }

            return data
        })

        return list
    }

    setGps(gps) {
        this.map.setCenter(new kakao.maps.LatLng(gps.lat, gps.lng))
    }

    move(gps) {
        this.map.panTo(new kakao.maps.LatLng(gps.lat, gps.lng))
    }
}