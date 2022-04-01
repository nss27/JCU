import * as com from '../../utils/common.js'

export default class JcuGps extends HTMLElement {
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
        const html = await (await fetch(`${com.rootPath()}/views/jcu-gps/jcu-gps.html`)).text()
        const css = await (await fetch(`${com.rootPath()}/views/jcu-gps/jcu-gps.css`)).text()

        this.shadowRoot.innerHTML = html

        const style = document.createElement('style')
        style.textContent = css
        this.shadowRoot.appendChild(style)
    }
}