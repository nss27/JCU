import * as com from '../../utils/common.js'

export default class JcuInfoCard extends HTMLElement {
    data = null

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
        const html = await (await fetch(`${com.rootPath()}/views/jcu-info-card/jcu-info-card.html`)).text()
        const css = await (await fetch(`${com.rootPath()}/views/jcu-info-card/jcu-info-card.css`)).text()

        this.shadowRoot.innerHTML = html

        const style = document.createElement('style')
        style.textContent = css
        this.shadowRoot.appendChild(style)
    }

    setData(data) {
        this.data = data
        this.shadowRoot.querySelector('.name').innerText = data[1]
        this.shadowRoot.querySelector('.addr').innerText = data[3]
        this.shadowRoot.querySelector('.tag').innerText = data[4]
        if(data.length > 6 && !com.isNull(data[5])) {
            const img = document.createElement('img')
            img.setAttribute('src', `${com.rootPath()}/images/${data[5]}`)
            this.shadowRoot.querySelector('.card').appendChild(img)
        }
    }
}