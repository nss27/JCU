var list = []
var map = null

var isNull = (data) => {
	return data == '' || data == null || data == undefined
}

// 현재 위치 조회
var getLocation = () => new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition((position) => {
		resolve({
			lat: position.coords.latitude,
			long: position.coords.longitude
		})
	})
})

// 구글 시트 데이터 조회
var getData = async () => {
	var spreadsheetId = '1fPWASjJ-DSsDFv-ctdQecYb3PFk716L7E6BYCZt6r1Q'
	var range = '맛집정보!a2:z50'
	var key = 'AIzaSyD9oysquqycaA0YLekjnbLwF26-YKJ807o'

	return await $.ajax({
		type: 'get',
		url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`,
		dataType: 'json'
	})
}

// 지도 생성
var createMap = async () => {
	var gps = await getLocation()
	var container = $('#map')[0]
	var options = {
		center: new kakao.maps.LatLng(gps.lat, gps.long),
		level: 7
	}

	return new kakao.maps.Map(container, options)
}

$(() => {
	createMap().then(m => map = m)

	var addressToGoordinate = async () => {
		// 주소-좌표 변환 객체
		var geocoder = new kakao.maps.services.Geocoder()

		// 주소로 좌표 검색
		list = (await getData()).values

		list = list.map((el) => {
			if(el[3]) {
				geocoder.addressSearch(el[3], (result, status) => {
					if (status === kakao.maps.services.Status.OK) {
						var coords = new kakao.maps.LatLng(result[0].y, result[0].x)
				
						el.push(
								new kakao.maps.Marker({
									map: map,
									position: coords
								})
						)
					}
				})
			}

			return el
		})
	}

	addressToGoordinate()
})

$('#search').on('click', 'ion-icon', () => {
	var text = $('#search').find('input').val()

	if(isNull(text)) {
		list.forEach(el => {
			if(el[5]) el[5].setMap(map)
		})
	} else {
		var showList = list.filter(el => {
			return el[1].includes(text)
		})

		var hideList = list.filter(el => {
			return !el[1].includes(text)
		})

		if(showList.length > 0) map.panTo(showList[0][5].getPosition())

		if(hideList.length > 0) {
			hideList.forEach(el => {
				if(el[5]) el[5].setMap(null)
			})
		}
	}
})

$('#gps').on('click', async () => {
	var gps = await getLocation()
	map.panTo(new kakao.maps.LatLng(gps.lat, gps.long))
})