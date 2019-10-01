// import Konva from 'konva';
import Store from 'store';

const store = require('store');

let cropData = store.get('mobicul').cropData;

function showCanvas() {

  var crop = document.getElementById('js-crop-image');

  crop.src = cropData;

}
window.addEventListener('load', showCanvas , false);