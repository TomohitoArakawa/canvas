import Konva from 'konva';
import Store from 'store';

var origx = 0;
var origy = 0;
var rotation = 0;
var scaleX = 1;
var scaleY = 1;

const store = require('store');

const file = document.getElementById('js-file');
const removeCanvas = document.getElementById('js-remove');
const rotateSlider = document.getElementById('js-range');
const confirm = document.getElementById('js-confirm');

const head = document.getElementById('js-head');
const foot = document.getElementById('js-foot');
const wrapper = document.getElementById('js-wrapper');
const canvasWrapper = document.getElementById('js-canvas-wrapper');
const konvaWrapper = document.getElementById('js-konva-wrapper');
const konvaPreview = document.getElementById('js-konva-preview');

var uploadImg;
var uploadImgSrc;

var guideImg;
var guideImgObj;

var templateImg;
var templateImgObj;

//レスポンシブ対応
// body読み込み時に一度だけbodyサイズを設定
document.body.onload = ()=>{
  wrapper.style.minHeight = window.innerHeight + 'px';
  konvaWrapper.style.minHeight = window.innerHeight - 140 + 'px';
  // canvas.style.minHeight = window.innerHeight - 140 + 'px';
}

// リサイズを停止して500ms後にbodyサイズを設定
let timeoutId;
window.addEventListener("resize", () => {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
      wrapper.style.minHeight = window.innerHeight + 'px';
      konvaWrapper.style.minHeight = window.innerHeight - 140 + 'px';
      // canvas.style.minHeight = window.innerHeight - 140 + 'px';
  }, 100);
});

//** Konva.js | Start **//

// first we need to create a stage
var stage = new Konva.Stage({ 
  container: 'js-konva-wrapper',// id of container <div> 
  width: window.innerWidth,
  height: window.innerHeight - 140
});

// then create layer
var template = new Konva.Layer();
var guide = new Konva.Layer();
var layer = new Konva.Layer();


// Guide 
function guideCanvas( guideImgPath ) {
	guideImg = new Image();
	guideImg.onload = () => {

		// GuideImage
		guideImgObj = new Konva.Image({
			x: stage.width() / 2 - 75,
			y: stage.height() / 2 - 150 / guideImg.width * guideImg.height / 2,
		  image: guideImg,
		  width: 150,
		  height: 150 / guideImg.width * guideImg.height,
		  draggable: false
		});

		guide.add(guideImgObj);
		stage.add(guide);

	};
	guideImg.src = guideImgPath;
}
guideCanvas('../img/guide_iphone_x_xs.png');

// Template
function templateCanvas( templateImgPath ) {
	templateImg = new Image();
	templateImg.onload = () => {

		templateImgObj = new Konva.Image({
			x: stage.width() / 2 - 75,
			y: stage.height() / 2 - 150 / templateImg.width * templateImg.height / 2,
		  image: templateImg,
		  width: 150,
		  height: 150 / templateImg.width * templateImg.height,
		  draggable: false
		});

		template.add(templateImgObj);
		stage.add(template);

	};
	templateImg.src = templateImgPath;
}
templateCanvas('../img/temp_iphone_x_xs.png');

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

      uploadImg = new Konva.Image({
      	x: stage.width() / 2 - 75,
      	y: stage.height() / 2 - 150 / img.width * img.height / 2,
        image: img,
        width: 150 * scaleX,
        height: 150 / img.width * img.height * scaleY,
        draggable: true
      });

      var transForm = new Konva.Transformer({
        node: uploadImg,
        keepRatio: true,
        centeredScaling: true,
        enabledAnchors: [],
        rotateEnabled: false,
        rotateAnchorOffset: 0
      });

      layer.add(transForm);
      transForm.attachTo(uploadImg);
      layer.draw();

      // add the image to the layer
      layer.add(uploadImg);
      layer.batchDraw();
      stage.add(layer);

			// Pinch In Out
			var lastDist = 0;
			var startScale = 1;

			function getDistance(p1, p2) {
			  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
			}

			stage.getContent().addEventListener(
			  'touchmove',
			  function(evt) {
			    var touch1 = evt.touches[0];
			    var touch2 = evt.touches[1];

			    if (touch1 && touch2) {
			      var dist = getDistance(
			        {
			          x: touch1.clientX,
			          y: touch1.clientY
			        },
			        {
			          x: touch2.clientX,
			          y: touch2.clientY
			        }
			      );

			      if (!lastDist) {
			        lastDist = dist;
			      }

			      var scale = (uploadImg.scaleX() * dist) / lastDist;

			      uploadImg.scaleX(scale);
			      uploadImg.scaleY(scale);
			      layer.draw();
			      lastDist = dist;
			    }
			  },
			  false
			);

			stage.getContent().addEventListener('touchend', function() {
			    lastDist = 0;
			  },
			  false
			);
      
    };
	}
}
file.addEventListener('change', loadLocalImage, false);

// Remove
removeCanvas.addEventListener('click', () => {

	event.preventDefault();

	layer.destroy();
	uploadImg.clearCache();

	file.value = null;

},false);

// 確定画面へ
confirm.addEventListener('click', () => {

	event.preventDefault();

	showCanvas();
	// cropCanvas();

	document.location.href = './preview.html'

},false);

// トリミング
function showCanvas() {

	// first we need to create a stage
	let stageForPreview = new Konva.Stage({ 
	  container: 'js-konva-preview',// id of container <div> 
	  width: 150,
	  height: 150 / guideImg.width * guideImg.height + 2
	});

	// then create layer
	let preview = new Konva.Layer();

	let previewGroup = new Konva.Group({
			x: -( stage.width() / 2 - 75 ),
			y: -( stage.height() / 2 - 150 / templateImg.width * templateImg.height / 2 ),
      clipFunc: function(ctx) {
				  drawRect({
				    ctx : ctx,
				    x : stage.width() / 2 - 75,
				    y : stage.height() / 2 - 150 / guideImg.width * guideImg.height / 2,
				    width: 150,
				    height: 150 / guideImg.width * guideImg.height,
				    radius: 21,
				    color: "rgba(0, 0, 0, 0)"
				});
        // ctx.rect(stage.width() / 2 - 75 , stage.height() / 2 - 150 / guideImg.width * guideImg.height / 2 , 150 , 150 / guideImg.width * guideImg.height);
      },
      draggable: false
	});

	var cloneGuide = guideImgObj.clone();
	var cloneTemplate = templateImgObj.clone();
	var cloneUploadImg = uploadImg.clone();

	previewGroup.add(cloneGuide);
  previewGroup.add(cloneTemplate);
  previewGroup.add(cloneUploadImg);
  cloneGuide.moveToTop();
  cloneTemplate.moveToBottom();
  preview.draw();

  preview.add(previewGroup);
  stageForPreview.add(preview);

  let cropData = stageForPreview.toDataURL();

  console.log(cropData);

  store.set('mobicul', {
  	cropData: cropData
  });

  // var previewData = preview.toDataURL();

 //  var resizeCanvas = document.getElementById('js-trim-canvas');
 //  var ctx = resizeCanvas.getContext('2d');

 //  resizeCanvas.width = 150;
 //  resizeCanvas.height = 150 / guideImg.width * guideImg.height;

	// var previewImg = new Image();
	// previewImg.src = previewData;
	// previewImg.onload = () => {

	// 	ctx.drawImage( previewImg , 
	// 		         stage.width() / 2 - 75 ,
	// 		         stage.height() / 2 - 150 / guideImg.width * guideImg.height / 2 ,
	// 		         150 , 
	// 		         150 / guideImg.width * guideImg.height , 
	// 		         0 , 
	// 		         0 ,
	// 		         150 , 
	// 		         150 / guideImg.width * guideImg.height
	// 						);

	// };

	// console.log( previewData );

}

// 角丸長方形生成
function drawRect(param) {
    var ctx = param.ctx;
    var x = param.x;
    var y =param.y;
    var width = param.width;
    var height = param.height;
    var radius = param.radius || 0;
    var color = param.color;
    
    ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, 0, false);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5, false);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI, false);
            ctx.lineTo(x, y + radius);
            ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
        ctx.closePath();
        ctx.fill();
    ctx.restore();
}


// function cropCanvas() {

// 	// first we need to create a stage
// 	stageForCrop = new Konva.Stage({ 
// 	  container: 'js-konva-crop',// id of container <div> 
// 	  width: 150,
// 	  height: 150 / guideImg.width * guideImg.height
// 	});

// 	// then create layer
// 	crop = new Konva.Layer({
// 		x: -( stage.width() / 2 - 75 ),
// 		y: -( stage.height() / 2 - 150 / templateImg.width * templateImg.height / 2 ),
// 	});

//   crop.add(previewGroup);
//   stageForCrop.add(crop);

//   let cropData = stageForCrop.toDataURL();

//   store.set('mobicul', {
//   	cropData: cropData
//   });

// }


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