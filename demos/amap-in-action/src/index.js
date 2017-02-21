const map = new AMap.Map('container', {
  resizeEnable: true,
  zoom: 11,
  center: [116, 39]
})

// const marker = new AMap.Marker({
//   position: [116.48, 39.989],
//   content: '@',
//   draggable: true,
// })
//
// marker.setMap(map)
//
// const circle = new AMap.Circle({
//   center: [116.48, 39.989],
//   raius: 100,
//   fillOpacity: 0.2,
//   strokeWeight: 1,
// })
// circle.setMap(map)
//
// map.setFitView()
//
// const info = new AMap.InfoWindow({
//   content: "信息窗体<br>这里是方恒科技大厦",
//   offset: new AMap.Pixel(0, -28)
// })

// AMap.event.addListener(marker, 'click', (e) => {
//   info.open(map, marker.getPosition())
// })

// const lnglats = [
//   [116.368904,39.923423],[116.382122,39.921176],
//   [116.387271,39.922501],[116.398258,39.914600]
// ]
// const infoWin = new AMap.InfoWindow()
// for (var i = 0, marker; i < lnglats.length; i++) {
//   marker = new AMap.Marker({
//     position: lnglats[i],
//     map: map,
//   })
//   marker.content = `我是第${i}个信息窗体的内容`
//   marker.on('click', markerClick)
// }
// map.setFitView()
//
// function markerClick(e) {
//   infoWin.setContent(e.target.content)
//   infoWin.open(map, e.target.getPosition())
// }
//
//
// const canvas = document.createElement('canvas')
// canvas.width = map.getSize().width
// canvas.height = map.getSize().height
// const customLayer = new AMap.CustomerLayer(canvas, {
//   zooms:[3,8],
//   zIndex: 12,
// })
// customerLayer.setMap(map)


// AMap.service('AMap.PlaceSearch', () => {
//   const placesearch = new AMap.PlaceSearch({
//     type: '风景名胜',
//     city: '010',
//     map: map,
//   })
//   placesearch.search('', (status, result) => {
//     console.log(result)
//   })
// })

AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'], () => {
  var autoOptions = {
    city: '',
    input: "input"
  }
  const placeSearch = new AMap.PlaceSearch({
    city: '',
    map: map,
  })
  const autocomplete = new AMap.Autocomplete(autoOptions)
  AMap.event.addListener(autocomplete, 'select', (e) => {
    console.log('trying to search', e.poi.name)
    placeSearch.search(e.poi.name)
  })
})

AMap.service('AMap.Driving', () => {
  const driving = new AMap.Driving({
    map: map,
  })
  driving.search([{keyword: '方恒国际',city: '北京'},{keyword:'壶口瀑布'}])
})
