import Konva from 'konva';

var counter=0;
var origx=180;
var origy=180;
var rotation=0;
var scaleX=1;
var scaleY=1;
var uploadImg;
var uploadImgSrc;
const navTop = document.getElementById('js-nav-top');
const navBottom = document.getElementById('js-nav-bottom');
const file = document.getElementById('js-file');
const removeCanvas = document.getElementById('js-remove');
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

//** Konva.js | Start **//

// first we need to create a stage
var stage = new Konva.Stage({ 
  container: 'js-canvas-wrapper',// id of container <div> 
  width: window.innerWidth,
  height: window.innerHeight - 140
});

// then create layer
var guide = new Konva.Layer();
var overLay = new Konva.Layer();
var layer = new Konva.Layer();
var template = new Konva.Layer();

// OverLay
function overLayCanvas( templateImgPath ) {
	var overLayImg = new Image();
	overLayImg.onload = () => {

		// OverLayGroup
		var overLayGroup = new Konva.Group({
			clipFunc: (ctx) => {
				ctx.fillStyle = '#000';
				ctx.fillRect( 0 , 0 , window.innerWidth , window.innerHeight - 140 );
				ctx.globalCompositeOperation = 'xor';
				ctx.beginPath();
				ctx.fillStyle = '#000';
				ctx.fillRect( stage.width() / 2 - 125 , stage.height() / 2 - 250 / overLayImg.width * overLayImg.height / 2 , 250 , 250 / overLayImg.width * overLayImg.height );
				ctx.fill();
			}
		});

		overLay.add(overLayGroup);
		stage.add(overLay);

	};
	overLayImg.src = templateImgPath;
}
overLayCanvas('../img/temp_iphone_x_xs.png');

// Guide 
function guideCanvas( guideImgPath ) {
	var guideImg = new Image();
	guideImg.onload = () => {

		// GuideImage
		var guideImgObj = new Konva.Image({
			x: stage.width() / 2 - 125,
			y: stage.height() / 2 - 250 / guideImg.width * guideImg.height / 2,
		  image: guideImg,
		  width: 250,
		  height: 250 / guideImg.width * guideImg.height,
		  draggable: false
		});

		// OverLayGroup
		// var overLayGroup = new Konva.Group({
		// 	clipFunc: (ctx) => {
		// 		ctx.fillStyle = '#000';
		// 		ctx.fillRect( 0 , 0 , window.innerWidth , window.innerHeight - 140 );
		// 		ctx.globalCompositeOperation = 'xor';
		// 		ctx.beginPath();
		// 		ctx.fillStyle = '#000';
		// 		ctx.fillRect( stage.width() / 2 - 125 , stage.height() / 2 - 250 / guideImg.width * guideImg.height / 2 , 250 , 250 / guideImg.width * guideImg.height );
		// 		ctx.fill();
		// 	},
		// 	draggable: false,

		// });

		// guide.add(overLayGroup);

		guide.add(guideImgObj);
		stage.add(guide);

	};
	guideImg.src = guideImgPath;
}
guideCanvas('../img/guide_iphone_x_xs.png');

// Template
function templateCanvas( templateImgPath ) {
	var templateImg = new Image();
	templateImg.onload = () => {

		var templateImgObj = new Konva.Image({
			x: stage.width() / 2 - 125,
			y: stage.height() / 2 - 250 / templateImg.width * templateImg.height / 2,
		  image: templateImg,
		  width: 250,
		  height: 250 / templateImg.width * templateImg.height,
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
      	x: stage.width() / 2 - 125,
      	y: stage.height() / 2 - 250 / img.width * img.height / 2,
        image: img,
        width: 250 * scaleX,
        height: 250 / img.width * img.height * scaleY,
        draggable: true
      });

      var transForm = new Konva.Transformer({
        node: uploadImg,
        keepRatio: true,
        centeredScaling: true,
        enabledAnchors: [],
        rotateEnabled: true,
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

	// location.reload();
  layer.destroy();

},false);



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