import Konva from 'konva';

var counter=0;
var origx=180;
var origy=180;
var rotation=0;
var scalex=1;
var scaley=1;
var uploadImgSrc;
const navTop = document.getElementById('js-nav-top');
const navBottom = document.getElementById('js-nav-bottom');
const file = document.getElementById('js-file');
const rotateSlider = document.getElementById('js-range');
const wrapper = document.getElementById('js-wrapper');
const canvasWrapper = document.getElementById('js-canvas-wrapper');
// const canvas = document.getElementById('js-canvas');
// const ctx = canvas.getContext('2d');

//レスポンシブ対応
// body読み込み時に一度だけbodyサイズを設定
document.body.onload = ()=>{
  wrapper.style.minHeight = window.innerHeight + 'px';
  canvasWrapper.style.minHeight = window.innerHeight - 140 + 'px';
  // canvas.style.minHeight = window.innerHeight - 140 + 'px';
}

// リサイズを停止して500ms後にbodyサイズを設定
let timeoutId;
window.addEventListener("resize", () => {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
      wrapper.style.minHeight = window.innerHeight + 'px';
      canvasWrapper.style.minHeight = window.innerHeight - 140 + 'px';
      // canvas.style.minHeight = window.innerHeight - 140 + 'px';
  }, 100);
});

// fileUpload
function loadLocalImage(e) {
	var fileData = e.target.files[0];
	if(!fileData.type.match('image.*')) {
		alert('画像を選択してください');
		return;
	}	
	var reader = new FileReader();
	reader.readAsDataURL(fileData);
	reader.onload = () => {
		uploadImgSrc = reader.result;

    var img = new Image();
    img.src = uploadImgSrc;
    img.onload = () => {

			//** Konva.js | Start **//

			// first we need to create a stage
			var stage = new Konva.Stage({ 
			  container: 'js-canvas-wrapper',// id of container <div> 
			  width: window.innerWidth,
			  height: window.innerHeight - 140
			});

			// then create layer
			var layer = new Konva.Layer();

    	// Konva
      var uploadImg = new Konva.Image({
      	x: stage.width() / 2 - 125,
      	y: stage.height() / 2 - 250 / img.width * img.height / 2,
        image: img,
        width: 250,
        height: 250 / img.width * img.height,
        draggable: true
      });
      console.log(stage.width() / 2 - 125);
      console.log(stage.height() / 2 - 250 / img.width * img.height / 2);

      // Konva
      // add the shape to the layer
      layer.add(uploadImg);
      layer.batchDraw();
      stage.add(layer);

      //** Konva.js | End **//
      
    };
	}
}
file.addEventListener('change', loadLocalImage, false);

// // ファイルアップロード
// function loadLocalImage(e) {
// 	var fileData = e.target.files[0];
// 	if(!fileData.type.match('image.*')) {
// 		alert('画像を選択してください');
// 		return;
// 	}	
// 	var reader = new FileReader();
// 	reader.readAsDataURL(fileData);
// 	reader.onload = function() {
// 		uploadImgSrc = reader.result;
// 		// showCanvas();

// 		customImg = document.getElementById('canvas-image');
// 		customImg.src = uploadImgSrc;

// 		customImg.style.top = '50%';
// 		customImg.style.left = '50%';
// 		customImg.style.marginTop = -customImg.height / 2 + 'px';
// 		customImg.style.marginLeft = -customImg.width / 2 + 'px';

// 		console.log(customImg.width);
// 		console.log(customImg.height);

// 	}
// }
// file.addEventListener('change', loadLocalImage, false);

// // レンジスライダー
// function setVal(which , val) {
// 	console.log( which+ ',' + val)
// 	switch(which) {
// 		case 'x':origx=parseFloat(val);
// 		break;
// 		case 'y':origy=parseFloat(val);
// 		break;
// 		case 'sx':scalex=parseFloat(val);
// 		break;
// 		case 'sy':scaley=parseFloat(val);
// 		break;  
// 		case 'r':rotation=parseFloat(val);
// 		break;      
// 	}
// 	showCanvas();
// }
// rotateSlider.addEventListener('input', function() {
// 	setVal('r' , this.value);
// }, false);
// rotateSlider.addEventListener('change', function() {
// 	setVal('r' , this.value);
// }, false);

// //Canvas描画
// function showCanvas() {
// 	ctx.setTransform(1 , 0 , 0 , 1 , 0 , 0);
// 	ctx.clearRect(0 , 0, canvasWrapper.offsetWidth , canvasWrapper.offsetHeight);
// 	counter++;
// 	var img = new Image();
// 	img.src = uploadImgSrc;
// 	var angle = Math.PI * rotation / 180;
// 	ctx.setTransform(
// 		scalex * Math.cos(angle),
// 		scalex * Math.sin(angle),
// 		-scaley * Math.sin(angle),
// 		scaley * Math.cos(angle),
// 		origx,
// 		origy);
// 	img.onload = function() {
// 		ctx.drawImage(img, 0 , 0 , img.width , img.height , -img.width / 2 , -img.height / 2 , img.width , img.height);
// 	}
// }