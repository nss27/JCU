import JcuSearchBar from './views/jcu-search-bar/jcu-search-bar.js'
import JcuMap from './views/jcu-map/jcu-map.js'
import JcuGps from './views/jcu-gps/jcu-gps.js'
import JcuInfoCard from './views/jcu-info-card/jcu-info-card.js'
import * as com from './utils/common.js'

customElements.define('jcu-search-bar', JcuSearchBar)
customElements.define('jcu-map', JcuMap)
customElements.define('jcu-gps', JcuGps)
customElements.define('jcu-info-card', JcuInfoCard)

// 현재 위치 조회
const getLocation = () => new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition((position) => {
		resolve({
			lat: position.coords.latitude,
			lng: position.coords.longitude
		})
	})
})

// 구글 시트 데이터 조회
const getData = async () => {
	const spreadsheetId = '1fPWASjJ-DSsDFv-ctdQecYb3PFk716L7E6BYCZt6r1Q'
	const range = '맛집정보!a2:z50'
	const key = 'AIzaSyD9oysquqycaA0YLekjnbLwF26-YKJ807o'

	return await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`)).json()
}

const setCardList = data => {
	const card = document.createElement('jcu-info-card')
	cardList.appendChild(card)
	setTimeout(() => card.setData(data), 1000)
}

let list = []

const jcuMap = document.querySelector('jcu-map')
const jcuSearchBar = document.querySelector('jcu-search-bar')
const jcuGps = document.querySelector('jcu-gps')
const cardList = document.querySelector('.card-list')

window.addEventListener('load', async () => {
	list = (await getData()).values
	jcuMap.addressToGoordinate(list)
	jcuMap.setGps(await getLocation())

	jcuSearchBar.shadowRoot.querySelector('ion-icon').addEventListener('click', () => {
		const text = jcuSearchBar.value
		cardList.innerHTML = null
	
		if(com.isNull(text)) {
			getLocation().then(gps => jcuMap.setGps(gps))
			list.forEach(data => {
				if(typeof(data[data.length - 1]) == "object") data[data.length - 1].setMap(jcuMap.map)
				setCardList(data)
			})
		} else {
			const showList = list.filter(data => data[1].includes(text))
			const hideList = list.filter(data => !data[1].includes(text))
	
			if(showList.length > 0) {
				if(!com.isNull(showList[0][3])) jcuMap.map.panTo(showList[0][showList[0].length - 1].getPosition())
				
				showList.forEach(data => {
					if(typeof(data[data.length - 1]) == 'object') data[data.length - 1].setMap(jcuMap.map)
					setCardList(data)
				})
			}
	
			if(hideList.length > 0) {
				hideList.forEach(data => {
					if(typeof(data[data.length - 1]) == 'object') data[data.length - 1].setMap(null)
				})
			}
		}
	})

	jcuGps.addEventListener('click', () => getLocation().then(gps => jcuMap.move(gps)))

	cardList.addEventListener('click', e => {
		const data = e.target.data
		if(!com.isNull(data[3])) {
			if(jcuMap.map.getLevel() != 3) jcuMap.map.setLevel(3)
			jcuMap.map.setCenter(data[data.length - 1].getPosition())
		}
	}, {
		capture: true
	})

	list.forEach(data => setCardList(data))
})
