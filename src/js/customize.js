var counter=0;
var origx=180;
var origy=180;
var rotation=0;
var scalex=1;
var scaley=1;
var uploadImgSrc;
// const navTop = document.getElementById('js-nav-top');
// const navBottom = document.getElementById('js-nav-bottom');
const file = document.getElementById('js-file');
const rotateSlider = document.getElementById('js-range');
const wrapper = document.getElementById('js-wrapper');
const canvas = document.getElementById('js-canvas');
const canvasWrapper = document.getElementById('js-canvas-wrapper');
const ctx = canvas.getContext('2d');

//レスポンシブ対応
(function() {
  sizing();

  function sizing() {
  	wrapper.style.height = window.innerHeight + 'px';
    // canvas.style.width = window.innerWidth + 'px'; //canvasWrapper.offsetWidth
    // canvas.style.height = window.innerHeight + 'px'; //canvasWrapper.offsetHeight
    canvas.width = canvasWrapper.offsetWidth;
    canvas.height = canvasWrapper.offsetHeight;
  }

  window.addEventListener('resize', function() {
    (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);
  });
  //TODO: orientationのイベント発火？
  // window.addEventListener('orientationchange', function() {
  //   (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);
  // });
})();

//Canvas描画
function showCanvas() {
	ctx.setTransform(1 , 0 , 0 , 1 , 0 , 0);
	ctx.clearRect(0 , 0, canvasWrapper.offsetWidth , canvasWrapper.offsetHeight);
	counter++;
	var img = new Image();
	img.src = uploadImgSrc;
	var angle = Math.PI * rotation / 180;
	ctx.setTransform(
		scalex * Math.cos(angle),
		scalex * Math.sin(angle),
		-scaley * Math.sin(angle),
		scaley * Math.cos(angle),
		origx,
		origy);
	img.onload = function() {
		ctx.drawImage(img, 0 , 0 , img.width , img.height , -img.width / 2 , -img.height / 2 , img.width , img.height);
	}
}

// ファイルアップロード
function loadLocalImage(e) {
	var fileData = e.target.files[0];
	if(!fileData.type.match('image.*')) {
		alert('画像を選択してください');
		return;
	}	
	var reader = new FileReader();
	reader.onload = function() {
		uploadImgSrc = reader.result;
		showCanvas();
	}
	reader.readAsDataURL(fileData);
}
file.addEventListener('change', loadLocalImage, false);

// レンジスライダー
function setVal(which , val) {
	console.log( which+ ',' + val)
	switch(which) {
		case 'x':origx=parseFloat(val);
		break;
		case 'y':origy=parseFloat(val);
		break;
		case 'sx':scalex=parseFloat(val);
		break;
		case 'sy':scaley=parseFloat(val);
		break;  
		case 'r':rotation=parseFloat(val);
		break;      
	}
	showCanvas();
}
rotateSlider.addEventListener('input', function() {
	setVal('r' , this.value);
}, false);
rotateSlider.addEventListener('change', function() {
	setVal('r' , this.value);
}, false);

// レンジスライダー開閉
(function () {
	const rotateToggle = document.getElementById('js-rotate-toggle');
	const rotateTarget = document.getElementById('js-rotate');
	const menuTarget = document.getElementById('js-menu');
	rotateToggle.addEventListener('click', function() {
		event.preventDefault();
		rotateTarget.classList.toggle('is-show');
		menuTarget.classList.toggle('is-show');
	}, false);
})();

// ローカル保存・再帰