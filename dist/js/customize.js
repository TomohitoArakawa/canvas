/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/customize.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/customize.js":
/*!*****************************!*\
  !*** ./src/js/customize.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var counter = 0;\nvar origx = 180;\nvar origy = 180;\nvar rotation = 0;\nvar scalex = 1;\nvar scaley = 1;\nvar uploadImgSrc; // const navTop = document.getElementById('js-nav-top');\n// const navBottom = document.getElementById('js-nav-bottom');\n\nvar file = document.getElementById('js-file');\nvar rotateSlider = document.getElementById('js-range');\nvar wrapper = document.getElementById('js-wrapper');\nvar canvas = document.getElementById('js-canvas');\nvar canvasWrapper = document.getElementById('js-canvas-wrapper');\nvar ctx = canvas.getContext('2d'); //レスポンシブ対応\n\n(function () {\n  sizing();\n\n  function sizing() {\n    wrapper.style.height = window.innerHeight + 'px'; // canvas.style.width = window.innerWidth + 'px'; //canvasWrapper.offsetWidth\n    // canvas.style.height = window.innerHeight + 'px'; //canvasWrapper.offsetHeight\n\n    canvas.width = canvasWrapper.offsetWidth;\n    canvas.height = canvasWrapper.offsetHeight;\n  }\n\n  window.addEventListener('resize', function () {\n    !window.requestAnimationFrame ? setTimeout(sizing, 300) : window.requestAnimationFrame(sizing);\n  }); //TODO: orientationのイベント発火？\n  // window.addEventListener('orientationchange', function() {\n  //   (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);\n  // });\n})(); //Canvas描画\n\n\nfunction showCanvas() {\n  ctx.setTransform(1, 0, 0, 1, 0, 0);\n  ctx.clearRect(0, 0, canvasWrapper.offsetWidth, canvasWrapper.offsetHeight);\n  counter++;\n  var img = new Image();\n  img.src = uploadImgSrc;\n  var angle = Math.PI * rotation / 180;\n  ctx.setTransform(scalex * Math.cos(angle), scalex * Math.sin(angle), -scaley * Math.sin(angle), scaley * Math.cos(angle), origx, origy);\n\n  img.onload = function () {\n    ctx.drawImage(img, 0, 0, img.width, img.height, -img.width / 2, -img.height / 2, img.width, img.height);\n  };\n} // ファイルアップロード\n\n\nfunction loadLocalImage(e) {\n  var fileData = e.target.files[0];\n\n  if (!fileData.type.match('image.*')) {\n    alert('画像を選択してください');\n    return;\n  }\n\n  var reader = new FileReader();\n\n  reader.onload = function () {\n    uploadImgSrc = reader.result;\n    showCanvas();\n  };\n\n  reader.readAsDataURL(fileData);\n}\n\nfile.addEventListener('change', loadLocalImage, false); // レンジスライダー\n\nfunction setVal(which, val) {\n  console.log(which + ',' + val);\n\n  switch (which) {\n    case 'x':\n      origx = parseFloat(val);\n      break;\n\n    case 'y':\n      origy = parseFloat(val);\n      break;\n\n    case 'sx':\n      scalex = parseFloat(val);\n      break;\n\n    case 'sy':\n      scaley = parseFloat(val);\n      break;\n\n    case 'r':\n      rotation = parseFloat(val);\n      break;\n  }\n\n  showCanvas();\n}\n\nrotateSlider.addEventListener('input', function () {\n  setVal('r', this.value);\n}, false);\nrotateSlider.addEventListener('change', function () {\n  setVal('r', this.value);\n}, false); // レンジスライダー開閉\n\n(function () {\n  var rotateToggle = document.getElementById('js-rotate-toggle');\n  var rotateTarget = document.getElementById('js-rotate');\n  var menuTarget = document.getElementById('js-menu');\n  rotateToggle.addEventListener('click', function () {\n    event.preventDefault();\n    rotateTarget.classList.toggle('is-show');\n    menuTarget.classList.toggle('is-show');\n  }, false);\n})(); // ローカル保存・再帰\n\n//# sourceURL=webpack:///./src/js/customize.js?");

/***/ })

/******/ });