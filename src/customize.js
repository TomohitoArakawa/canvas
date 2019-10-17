import Konva from 'konva';
import Store from 'store';

var initOrigx = 0;
var initOrigy = 0;
var initAngle = 0;
var initScalex = 1;
var initScaley = 1;

var origx = 0;
var origy = 0;
var angle = 0;
var scalex = 1;
var scaley = 1;

var windowWidth;
var windowHeight;

const store = require('store');

const file = document.getElementById('js-file');
const removeCanvas = document.getElementById('js-remove');
const rotateSlider = document.getElementById('js-range');
const confirm = document.getElementById('js-confirm');

const head = document.getElementById('js-head');
const foot = document.getElementById('js-foot');
const wrapper = document.getElementById('js-wrapper');
const canvasWrapper = document.getElementById('js-canvas-wrapper');
const konvaOverLay = document.getElementById('js-konva-overlay');
const konvaEdit = document.getElementById('js-konva-edit');
const toggleWrapper = document.querySelectorAll('.js-toggle-wrapper');

// const overLayCtx = canvasOverLay.getContext('2d');

var uploadImg;
var uploadImgObj;
var uploadImgSrc;

var guideImg;
var guideImgObj;

var templateImg;
var templateImgObj;

var overLayImg;
var overLayGroup;

var template;
var guide;
var overLay;
var edit;

var stageForEdit;
var stageForGuide;
var stageForOverlay;

var transFormForEdit;

//レスポンシブ対応
// body読み込み時に一度だけbodyサイズを設定
document.body.onload = ()=>{

  wrapper.style.minHeight = window.innerHeight + 'px';
  canvasWrapper.style.minHeight = window.innerHeight - 140 + 'px';

}

// リサイズを停止して500ms後にbodyサイズを設定
let timeoutId;

window.addEventListener( 'resize' , () => {

  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {

      wrapper.style.minHeight = window.innerHeight + 'px';
      canvasWrapper.style.minHeight = window.innerHeight - 140 + 'px';

      createStageLayer();

      guideImgObj
      .x( stageForEdit.width() / 2 - 75 )
      .y( stageForEdit.height() / 2 - 150 / templateImg.width * templateImg.height / 2 );
      guide.add( guideImgObj );
      guide.batchDraw();
      stageForGuide.add( guide );

      overLayGroup
      .x( 0 )
      .y( 0 );
      overLay.batchDraw();
			overLay.add( overLayGroup );
			stageForOverlay.add( overLay );

      templateImgObj
      .x( stageForEdit.width() / 2 - 75 )
      .y( stageForEdit.height() / 2 - 150 / templateImg.width * templateImg.height / 2 );
      template.batchDraw();
			template.add( templateImgObj );
			stageForEdit.add( template );

			if ( !file.value == '' || !file.value == null ) {

				uploadImgObj
				.x( origx )
				.y( origy )
				.scaleX( scalex )
				.scaleY( scaley )
				.rotation( angle );

	      edit.batchDraw();
				edit.add( uploadImgObj );
				stageForEdit.add( edit );

				console.log( uploadImgObj.x() );
				console.log( uploadImgObj.y() );
				console.log( uploadImgObj.scaleX() );
				console.log( uploadImgObj.scaleY() );
				console.log( uploadImgObj.rotation() );

			}

			pinchInOut();

  }, 50);
});

//** Konva.js | Start **//

// first we need to create a stage
function createStageLayer() {
	stageForGuide = new Konva.Stage({ 
	  container: 'js-konva-guide',// id of container <div> 
	  width: window.innerWidth,
	  height: window.innerHeight - 140
	});

	stageForOverlay = new Konva.Stage({ 
	  container: 'js-konva-overlay',// id of container <div> 
	  width: window.innerWidth,
	  height: window.innerHeight - 140
	});

	stageForEdit = new Konva.Stage({ 
	  container: 'js-konva-edit',// id of container <div> 
	  width: window.innerWidth,
	  height: window.innerHeight - 140
	});
}
createStageLayer();

var startOrigX = stageForEdit.width() / 2;
var startOrigY = stageForEdit.height() / 2;

console.log(startOrigX);
console.log(startOrigY);

console.log(stageForEdit);


// then create layer
template = new Konva.Layer();
guide = new Konva.Layer();
overLay = new Konva.Layer();
edit = new Konva.Layer();


// Template
function templateCanvas( templateImgPath ) {
	templateImg = new Image();
	templateImg.onload = () => {

		templateImgObj = new Konva.Image({
			x: stageForEdit.width() / 2 - 75,
			y: stageForEdit.height() / 2 - 150 / templateImg.width * templateImg.height / 2,
		  image: templateImg,
		  width: 150,
		  height: 150 / templateImg.width * templateImg.height,
		  draggable: false
		});

		template.add(templateImgObj);
		stageForEdit.add(template);

	};
	templateImg.src = templateImgPath;
}
templateCanvas('../img/temp_iphone_x_xs.png');


function overLayCanvas( guideImgPath ) {

	overLayImg = new Image();
	overLayImg.src = guideImgPath;
	overLayImg.onload = () => {

		// OverLayGroup
		overLayGroup = new Konva.Group({
			x: 0,
			y: 0,
			clipFunc: (ctx) => {
				ctx.fillStyle = '#000';
				ctx.fillRect( 0 , 0 , stageForOverlay.width() , stageForOverlay.height() );
				ctx.globalCompositeOperation = 'xor';
				ctx.beginPath();
				ctx.fillStyle = '#000';
				drawRect({
				    ctx : ctx,
				    x : stageForOverlay.width() / 2 - 75,
				    y : stageForOverlay.height() / 2 - 150 / overLayImg.width * overLayImg.height / 2,
				    width: 150,
				    height: 150 / overLayImg.width * overLayImg.height,
				    radius: 22,
				    color: 'rgba(0, 0, 0, 0)'
				});
				ctx.fill();
			},
			draggable: false
		});

		overLay.add(overLayGroup);
		stageForOverlay.add(overLay);

	};

}
overLayCanvas('../img/guide_iphone_x_xs.png');


// Guide 
function guideCanvas( guideImgPath ) {
	guideImg = new Image();
	guideImg.onload = () => {

		// GuideImage
		guideImgObj = new Konva.Image({
			x: stageForGuide.width() / 2 - 75,
			y: stageForGuide.height() / 2 - 150 / guideImg.width * guideImg.height / 2,
		  image: guideImg,
		  width: 150,
		  height: 150 / guideImg.width * guideImg.height,
		  draggable: false
		});

		guide.add(guideImgObj);
		stageForGuide.add(guide);

	};
	guideImg.src = guideImgPath;
}
guideCanvas('../img/guide_iphone_x_xs.png');

// fileUpload
function loadLocalImage(e) {
	var fileData = e.target.files[0];
	if ( !fileData.type.match( 'image.*' ) ) {

		alert('画像を選択してください');
		return;

	}	else if ( fileData.type === undefined ) {

		alert('undefined');
		return;

	}

	var reader = new FileReader();
	reader.readAsDataURL(fileData);
	reader.onload = () => {
		uploadImgSrc = reader.result;

    uploadImg = new Image();
    uploadImg.src = uploadImgSrc;
    uploadImg.onload = () => {

      uploadImgObj = new Konva.Image({
      	name: 'uploadImg',
      	x: stageForEdit.width() / 2 - 75,
      	y: stageForEdit.height() / 2 - 150 / uploadImg.width * uploadImg.height / 2,
        image: uploadImg,
        width: 150,
        height: 150 / uploadImg.width * uploadImg.height,
        draggable: true
      });

      transFormForEdit = new Konva.Transformer({
        node: uploadImgObj,
        keepRatio: true,
        centeredScaling: true,
        enabledAnchors: [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ],
        rotateEnabled: false,
        resizeEnabled: true,
        rotateAnchorOffset: 0
      });

      // add the image to the edit
      edit.add(uploadImgObj);
      edit.batchDraw();

      edit.add(transFormForEdit);
      transFormForEdit.attachTo(uploadImgObj);
      edit.draw();

      stageForEdit.add(edit);

	    	origx = uploadImgObj.x();
	    	origy = uploadImgObj.y();
		    console.log( origx );
		    console.log( origy );

	    	initOrigx = uploadImgObj.x();
	    	initOrigy = uploadImgObj.y();
		    console.log( initOrigx );
		    console.log( initOrigx );

		    console.log(uploadImgObj);

		    console.log(file.value);

      uploadImgObj.on( 'transformend' , () => {

		    scalex = uploadImgObj.scaleX();
		    scaley = uploadImgObj.scaleY();
		    console.log(scalex);
		    console.log(scaley);

      });

      uploadImgObj.on( 'dragend' , () => {

      	origx = uploadImgObj.x();
      	origy = uploadImgObj.y();
		    console.log( origx );
		    console.log( origy );

      });
      
    };

	}

}
file.addEventListener('change', loadLocalImage, false);


// Pinch In Out
function pinchInOut() {

	var lastDist = 0;
	var startScale = 1;
	var activeImg = null;

	function getDistance(p1, p2) {
	  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
	}

  stageForEdit.on( 'tap' , ( evt ) => {
    // set active imgObj
    var img = evt.target;
    activeImg =
      activeImg && activeImg.getName() === img.getName()
        ? null
        : img;

    // sync scene graph
    uploadImgObj.setAttrs({
      stroke:
        activeImg && activeImg.getName() === img.getName()
          ? 'yellow'
          : 'transparent'
    });

    edit.draw();
  });

	stageForEdit.getContent().addEventListener(
	  'touchmove',
	  function(evt) {
	    var touch1 = evt.touches[0];
	    var touch2 = evt.touches[1];

	    if (touch1 && touch2 && activeImg) {
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

	      var scale = (uploadImgObj.scaleX() * dist) / lastDist;

	      uploadImgObj.scaleX(scale);
	      uploadImgObj.scaleY(scale);
	      edit.draw();
	      lastDist = dist;

	    }

	  },

	  false

	);

	stageForEdit.getContent().addEventListener( 'touchend' , function() {

	    lastDist = 0;

	    scalex = uploadImgObj.scaleX();
	    scaley = uploadImgObj.scaleY();
	    console.log(scalex);
	    console.log(scaley);
	  
	  },
	  
	  false

	);

}
pinchInOut();


// 削除
removeCanvas.addEventListener('click', () => {

	event.preventDefault();

	edit.destroy();
	uploadImgObj.clearCache();

	file.value = null;
	console.log(file.value);

} , false );

// 確定画面へ
confirm.addEventListener('click', () => {

	event.preventDefault();

	showCanvas();
	// historyToggle();

	window.history.pushState( null , null , 'preview.html' );

} , false );


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
			x: -( stageForEdit.width() / 2 - 75 ),
			y: -( stageForEdit.height() / 2 - 150 / templateImg.width * templateImg.height / 2 ),
      clipFunc: function(ctx) {
				  drawRect({
				    ctx : ctx,
				    x : stageForEdit.width() / 2 - 75,
				    y : stageForEdit.height() / 2 - 150 / guideImg.width * guideImg.height / 2,
				    width: 150,
				    height: 150 / guideImg.width * guideImg.height,
				    radius: 22,
				    color: "rgba(0, 0, 0, 0)"
				});
      },
      draggable: false
	});

	var cloneGuide = guideImgObj.clone();
	var cloneTemplate = templateImgObj.clone();
	var cloneUploadImg = uploadImgObj.clone();

	previewGroup.add(cloneGuide);
  previewGroup.add(cloneTemplate);
  previewGroup.add(cloneUploadImgObj);
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

// 	// then create edit
// 	crop = new Konva.Layer({
// 		x: -( stageForEdit.width() / 2 - 75 ),
// 		y: -( stageForEdit.height() / 2 - 150 / templateImg.width * templateImg.height / 2 ),
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
// 		uploadImgObjSrc = reader.result;
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