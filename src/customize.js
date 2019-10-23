import Konva from 'konva';
import Store from 'store';

let initOrigX = 0;
let initOrigY = 0;
let initAngle = 0;
let initScaleX = 1;
let initScaleY = 1;
let initGuideWidth = 150;
let initGuideHeight = 303;

let initGuideWidthForSm = 150;
let initGuideHeightForSm = 303;
let initGuideWidthForPc = 200;
let initGuideHeightForPc = 405;

let origX = 0;
let origY = 0;
let angle = 0;
let scaleX = 1;
let scaleY = 1;

let initWindowWidth = window.innerWidth;
let initWindowHeight = window.innerHeight;
let startWindowWidth = window.innerWidth;
let startWindowHeight = window.innerHeight;
let resizeWindowWidth;
let resizeWindowHeight;

const store = require( 'store' );

// save value
let saveValues = new Object;

// submit value
let submitValues = new Object;

// trigger
const fileUpload = document.getElementById( 'js-file' );
const removeCanvas = document.getElementById( 'js-remove' );
const rotateRange = document.getElementById( 'js-range' );
const confirm = document.getElementById( 'js-confirm' );

// target
const head = document.getElementById( 'js-head' );
const foot = document.getElementById( 'js-foot' );
const wrapper = document.getElementById( 'js-wrapper' );
const canvasWrapper = document.getElementById( 'js-canvas-wrapper' );
const canvasQuality = document.getElementById( 'js-canvas-quality' );
const konvaOverLay = document.getElementById( 'js-konva-overlay' );
const konvaEdit = document.getElementById( 'js-konva-edit' );
const customizeElement = document.querySelectorAll( '.js-customize-element' );

// const overLayCtx = canvasOverLay.getContext( '2d' );

let uploadImg;
let uploadImgObj;
let uploadImgSrc;
let uploadImgWidth;
let uploadImgHeight;

let guideImg;
let guideImgObj;

let templateImg;
let templateImgObj;

let overLayImg;
let overLayGroup;

let previewImgSrc;

let template;
let guide;
let overLay;
let edit;

let stageForEdit;
let stageForGuide;
let stageForOverlay;
let stageForTemplate;

let transFormForEdit;

const trafficURL = document.referrer;


//ユーザーエージェント
const getDevice = (() => {

    let ua = navigator.userAgent;

    if ( ua.indexOf( 'iPhone' ) > 0 || ua.indexOf( 'iPod' ) > 0 || ua.indexOf( 'Android' ) > 0 && ua.indexOf( 'Mobile' ) > 0 ) {

        return 'smartphone';

    } else if ( ua.indexOf( 'iPad' ) > 0 || ua.indexOf( 'Android' ) > 0 ) {

        return 'tablet';

    } else {

        return 'pc';
    }
})();


// if ( getDevice == 'smartphone' ) {

// 	initGuideWidth = initGuideWidthForSm;
// 	initGuideHeight = initGuideHeightForSm;

// } else if ( getDevice == 'talet' || getDevice == 'pc' ) {

// 	initGuideWidth = initGuideWidthForPc;
// 	initGuideHeight = initGuideHeightForPc;

// }

// if ( getDevice == 'smartphone' ) {



// } else if ( getDevice == 'tablet' || getDevice == 'pc' ) {



// }




//レスポンシブ対応
// body読み込み時に一度だけbodyサイズを設定
document.body.onload = ()=>{

  wrapper.style.minHeight = window.innerHeight + 'px';
  canvasWrapper.style.minHeight = window.innerHeight - 140 + 'px';

}

// リサイズを停止して1ms後にbodyサイズを設定
let timeoutId;

window.addEventListener( 'resize' , () => {

  clearTimeout( timeoutId );

  timeoutId = setTimeout(() => {

  	resizeWindowWidth = window.innerWidth;
  	resizeWindowHeight = window.innerHeight;

    wrapper.style.minHeight = window.innerHeight + 'px';
    canvasWrapper.style.minHeight = window.innerHeight - 140 + 'px';

    createStageLayer();

    guideImgObj
    .x( stageForEdit.width() / 2 - initGuideWidth / 2 )
    .y( stageForEdit.height() / 2 - initGuideWidth / templateImg.width * templateImg.height / 2 );
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
    .x( stageForEdit.width() / 2 - initGuideWidth / 2 )
    .y( stageForEdit.height() / 2 - initGuideWidth / templateImg.width * templateImg.height / 2 );
    template.batchDraw();
		template.add( templateImgObj );
		stageForEdit.add( template );

		if ( canvasQuality.classList.contains( 'is-show' ) ) {

			uploadImgObj
			.x( uploadImgObj.x() + ( resizeWindowWidth - startWindowWidth ) / 2 )
			.y( uploadImgObj.y() + ( resizeWindowHeight - startWindowHeight ) / 2 )
			.scaleX( scaleX )
			.scaleY( scaleY )
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

		startWindowWidth = resizeWindowWidth;
		startWindowHeight = resizeWindowHeight;

  }, 100);

});


// first we need to create a stage
function createStageLayer() {

	if ( getDevice == 'smartphone' ) {

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
		  height: window.innerHeight - 140,
		});

		stageForTemplate = new Konva.Stage({ 
		  container: 'js-konva-template',// id of container <div> 
		  width: window.innerWidth,
		  height: window.innerHeight - 140
		});

	} else if ( getDevice == 'tablet' || getDevice == 'pc' ) {

		stageForGuide = new Konva.Stage({ 
		  container: 'js-konva-guide',// id of container <div> 
		  width: window.innerWidth,
		  height: window.innerHeight - 140,
		  // scale: { x: 1.3333 , y: 1.3333 },
		  // offsetX: - ( ( window.innerWidth - window.innerWidth * 1.3333 ) / 2 )
		});

		stageForOverlay = new Konva.Stage({ 
		  container: 'js-konva-overlay',// id of container <div> 
		  width: window.innerWidth,
		  height: window.innerHeight - 140,
		  // scale: { x: 1.3333 , y: 1.3333 },
		  // offsetX: - ( ( window.innerWidth - window.innerWidth * 1.3333 ) / 2 )
		});

		stageForEdit = new Konva.Stage({ 
		  container: 'js-konva-edit',// id of container <div> 
		  width: window.innerWidth,
		  height: window.innerHeight - 140,
		  // scale: { x: 1.3333 , y: 1.3333 },
		  // offsetX: - ( ( window.innerWidth - window.innerWidth * 1.3333 ) / 2 )
		});

		stageForTemplate = new Konva.Stage({ 
		  container: 'js-konva-template',// id of container <div> 
		  width: window.innerWidth,
		  height: window.innerHeight - 140,
		  // scale: { x: 1.3333 , y: 1.3333 },
		  // offsetX: - ( ( window.innerWidth - window.innerWidth * 1.3333 ) / 2 )
		});

	}

}
createStageLayer();


// then create layer
guide = new Konva.Layer();
overLay = new Konva.Layer();
edit = new Konva.Layer();
template = new Konva.Layer();


// Template
function templateCanvas( templateImgPath ) {
	templateImg = new Image();
	templateImg.onload = () => {

		// if ( getDevice == 'smartphone' ) {

		// 	templateImgObj = new Konva.Image({
	 //    	id: 'templateImgObj',
		// 		x: stageForTemplate.width() / 2 - initGuideWidth / 2,
		// 		y: stageForTemplate.height() / 2 - initGuideWidth / templateImg.width * templateImg.height / 2,
		// 	  image: templateImg,
		// 	  width: initGuideWidth,
		// 	  height: initGuideWidth / templateImg.width * templateImg.height,
		// 	  draggable: false
		// 	});

		// } else if ( getDevice == 'tablet' || getDevice == 'pc' ) {

		// 	templateImgObj = new Konva.Image({
	 //    	id: 'templateImgObj',
		// 		x: stageForTemplate.width() / 2 - initGuideWidth * 1.3333 / 2,
		// 		y: stageForTemplate.height() / 2 - initGuideWidth / templateImg.width * templateImg.height * 1.3333 / 2,
		// 	  image: templateImg,
		// 	  width: initGuideWidth * 1.3333,
		// 	  height: initGuideWidth / templateImg.width * templateImg.height * 1.3333,
		// 	  draggable: false,
		// 	});

		// }

		templateImgObj = new Konva.Image({
    	id: 'templateImgObj',
			x: stageForTemplate.width() / 2 - initGuideWidth / 2,
			y: stageForTemplate.height() / 2 - initGuideWidth / templateImg.width * templateImg.height / 2,
		  image: templateImg,
		  width: initGuideWidth,
		  height: initGuideWidth / templateImg.width * templateImg.height,
		  draggable: false
		});

		template.add( templateImgObj );
		stageForTemplate.add( template );

	};
	templateImg.src = templateImgPath;
}
templateCanvas( '../img/temp_iphone_x_xs.png' );


function overLayCanvas( guideImgPath ) {

	overLayImg = new Image();
	overLayImg.src = guideImgPath;
	overLayImg.onload = () => {

		// OverLayGroup
		overLayGroup = new Konva.Group({
			x: 0,
			y: 0,
			clipFunc: ( ctx ) => {
				ctx.fillStyle = '#000';
				ctx.fillRect( 0 , 0 , stageForOverlay.width() , stageForOverlay.height() );
				ctx.globalCompositeOperation = 'xor';
				ctx.beginPath();
				ctx.fillStyle = '#000';

				// if ( getDevice == 'smartphone' ) {

				// 	drawRect({
				// 			ctx : ctx,
				// 	    x : stageForOverlay.width() / 2 - initGuideWidth / 2,
				// 	    y : stageForOverlay.height() / 2 - initGuideWidth / overLayImg.width * overLayImg.height / 2,
				// 	    width: initGuideWidth,
				// 	    height: initGuideWidth / overLayImg.width * overLayImg.height,
				// 	    radius: 22,
				// 	    color: 'rgba(0, 0, 0, 0)'
				// 	});

				// } else if ( getDevice == 'tablet' || getDevice == 'pc' ) {

				// 	drawRect({
				// 			ctx : ctx,
				// 	    x : stageForOverlay.width() / 2 - initGuideWidth * 1.3333 / 2,
				// 	    y : stageForOverlay.height() / 2 - initGuideWidth / overLayImg.width * overLayImg.height * 1.3333 / 2,
				// 	    width: initGuideWidth * 1.3333,
				// 	    height: initGuideWidth / overLayImg.width * overLayImg.height * 1.3333,
				// 	    radius: 22,
				// 	    color: 'rgba(0, 0, 0, 0)'
				// 	});

				// }

				drawRect({
						ctx : ctx,
				    x : stageForOverlay.width() / 2 - initGuideWidth / 2,
				    y : stageForOverlay.height() / 2 - initGuideWidth / overLayImg.width * overLayImg.height / 2,
				    width: initGuideWidth,
				    height: initGuideWidth / overLayImg.width * overLayImg.height,
				    radius: 22,
				    color: 'rgba(0, 0, 0, 0)'
				});
				ctx.fill();
			},
			draggable: false
		});

		overLay.add( overLayGroup );
		stageForOverlay.add( overLay );

	};

}
overLayCanvas( '../img/guide_iphone_x_xs.png' );


// Guide 
function guideCanvas( guideImgPath ) {
	guideImg = new Image();
	guideImg.onload = () => {

		// if ( getDevice == 'smartphone' ) {

		// 	guideImgObj = new Konva.Image({
	 //    	id: 'guideImgObj',
		// 		x: stageForGuide.width() / 2 - initGuideWidth / 2,
		// 		y: stageForGuide.height() / 2 - initGuideWidth / guideImg.width * guideImg.height / 2,
		// 	  image: guideImg,
		// 	  width: initGuideWidth,
		// 	  height: initGuideWidth / guideImg.width * guideImg.height,
		// 	  draggable: false
		// 	});

		// } else if ( getDevice == 'tablet' || getDevice == 'pc' ) {

		// 	guideImgObj = new Konva.Image({
	 //    	id: 'guideImgObj',
		// 		x: stageForGuide.width() / 2 - initGuideWidth * 1.3333 / 2,
		// 		y: stageForGuide.height() / 2 - initGuideWidth / guideImg.width * guideImg.height * 1.3333 / 2,
		// 	  image: guideImg,
		// 	  width: initGuideWidth * 1.3333,
		// 	  height: initGuideWidth / guideImg.width * guideImg.height * 1.3333,
		// 	  draggable: false,
		// 	});

		// }

		// GuideImage
		guideImgObj = new Konva.Image({
    	id: 'guideImgObj',
			x: stageForGuide.width() / 2 - initGuideWidth / 2,
			y: stageForGuide.height() / 2 - initGuideWidth / guideImg.width * guideImg.height / 2,
		  image: guideImg,
		  width: initGuideWidth,
		  height: initGuideWidth / guideImg.width * guideImg.height,
		  draggable: false
		});

		guide.add( guideImgObj );
		stageForGuide.add( guide );

	};
	guideImg.src = guideImgPath;
}
guideCanvas( '../img/guide_iphone_x_xs.png' );


// fileUpload
function loadLocalImage( e ) {

  const getOrientation = buffer => {
    const dv = new DataView( buffer )
    if ( dv.getUint16( 2 ) !== 65505 ) {
      return 0
    }
    const littleEndian = dv.getUint8( 12 ) === 73
    const count = dv.getUint16( 20, littleEndian )
    for ( let i = 0; i < count; i++ ) {
      const start = 22 + i * 12
      const tag = dv.getUint16( start, littleEndian )
      if ( tag === 274 ) {
        const value = dv.getUint16( start + 8, littleEndian )
        return value
      }
    }
    return 0
  }

  const arrayBufferToDataURL = arrBuf => {
    const blob = new Blob([arrBuf], { type: 'image/jpeg' })
    return window.URL.createObjectURL( blob )
  }

  const embedImageTag = dataURL => {
    const img = new Image()
    img.src = dataURL
    return img
  }

  const createTransformedCanvas = ( orientation, img ) => {
    const canvas = document.createElement( 'canvas' )
    const ctx = canvas.getContext( '2d' )
    if ( [ 5 , 6 , 7 , 8 ].indexOf( orientation ) > -1 ) {
      canvas.width = img.height
      canvas.height = img.width
    } else {
      canvas.width = img.width
      canvas.height = img.height
    }
    switch ( orientation ) {
      case 2: ctx.transform( -1, 0, 0, 1, img.width, 0 ); break
      case 3: ctx.transform( -1, 0, 0, -1, img.width, img.height ); break
      case 4: ctx.transform( 1, 0, 0, -1, 0, img.height ); break
      case 5: ctx.transform( 0, 1, 1, 0, 0, 0 ); break
      case 6: ctx.transform( 0, 1, -1, 0, img.height, 0 ); break
      case 7: ctx.transform( 0, -1, -1, 0, img.height, img.width ); break
      case 8: ctx.transform( 0, -1, 1, 0, 0, img.width ); break
      default: break;
    }
    ctx.drawImage( img, 0, 0 )
    return canvas
  }

  const fileData = e.target.files[ 0 ]
  const reader = new FileReader()

  reader.addEventListener( 'load', () => {

  	const orientation = getOrientation( reader.result )
  	const img = new Image()

    img.src = arrayBufferToDataURL( reader.result )

    img.addEventListener( 'load', () => {

      const canvas = createTransformedCanvas( orientation, img )
      window.URL.revokeObjectURL( img.src )
      embedImageTag( canvas.toDataURL( 'image/jpeg' ) )

      uploadImgSrc = canvas.toDataURL( 'image/jpeg' )

      optimisationImg( uploadImgSrc );

    })

  })

  reader.readAsArrayBuffer( fileData )

}
fileUpload.addEventListener( 'change', loadLocalImage, false);


// 
function optimisationImg( uploadImgSrc ) {

    uploadImg = new Image();
    uploadImg.src = uploadImgSrc;
    uploadImg.onload = () => {

     //  if ( getDevice == 'smartphone' ) {

			  // uploadImgObj = new Konva.Image({
		   //  	name: 'uploadImgObj',
		   //  	x: stageForEdit.width() / 2 - initGuideWidth / 2,
		   //  	y: stageForEdit.height() / 2 - initGuideWidth / uploadImg.width * uploadImg.height / 2,
		   //    image: uploadImg,
		   //    width: initGuideWidth,
		   //    height: initGuideWidth / uploadImg.width * uploadImg.height,
		   //    draggable: true,
		   //  });

     //  } else if ( getDevice == 'tablet' || getDevice == 'pc' ) {

			  // uploadImgObj = new Konva.Image({
		   //  	name: 'uploadImgObj',
		   //  	x: stageForEdit.width() / 2 - initGuideWidth * 1.3333 / 2,
		   //  	y: stageForEdit.height() / 2 - initGuideWidth / uploadImg.width * uploadImg.height * 1.3333 / 2,
		   //    image: uploadImg,
		   //    width: initGuideWidth * 1.3333,
		   //    height: initGuideWidth / uploadImg.width * uploadImg.height * 1.3333,
		   //    draggable: true,
		   //  });

     //  }

		  uploadImgObj = new Konva.Image({
	    	name: 'uploadImgObj',
	    	x: stageForEdit.width() / 2 - initGuideWidth / 2,
	    	y: stageForEdit.height() / 2 - initGuideWidth / uploadImg.width * uploadImg.height / 2,
	      image: uploadImg,
	      width: initGuideWidth,
	      height: initGuideWidth / uploadImg.width * uploadImg.height,
	      // width: initGuideWidth * 1.3333,
	      // height: initGuideWidth / uploadImg.width * uploadImg.height * 1.3333,
	      draggable: true
	    });

    transFormForEdit = new Konva.Transformer({
      node: uploadImgObj,
      keepRatio: true,
      centeredScaling: true,
      enabledAnchors: [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ],
      rotateEnabled: false,
      resizeEnabled: true,
      rotateAnchorOffset: 0,
      anchorSize: 20,
      anchorStroke: 'black',
      anchorStrokeWidth: 1,
      anchorFill: 'white',
      borderStrokeWidth: 0
    });

    // add the image to the edit
    edit.add( uploadImgObj) ;
    edit.batchDraw();

    edit.add( transFormForEdit );
    transFormForEdit.attachTo( uploadImgObj );
    edit.draw();

    stageForEdit.add( edit );

    uploadImgWidth = uploadImgObj.width();
    uploadImgHeight = uploadImgObj.height();
  	origX = uploadImgObj.x();
  	origY = uploadImgObj.y();
  	initOrigX = uploadImgObj.x();
  	initOrigY = uploadImgObj.y();

    console.log( uploadImgWidth );
    console.log( uploadImgHeight );
    console.log( origX );
    console.log( origY );
    console.log( initOrigX );
    console.log( initOrigX );
    console.log( uploadImgSrc );
    console.log( fileUpload.value );

    uploadImgObj.on( 'transformend' , () => {

	    scaleX = uploadImgObj.scaleX();
	    scaleY = uploadImgObj.scaleY();
			origX = uploadImgObj.x();
			origY = uploadImgObj.y();
	    // uploadImgWidth = uploadImgObj.width() * scaleX;
	    // uploadImgHeight = uploadImgObj.height() * scaleY;
	    console.log( scaleX );
	    console.log( scaleY );
	    console.log( origX );
	    console.log( origY );
	    console.log( uploadImgWidth );
	    console.log( uploadImgHeight );

    });

    uploadImgObj.on( 'dragend' , () => {

    	origX = uploadImgObj.x();
    	origY = uploadImgObj.y();
	    console.log( origX );
	    console.log( origY );

    });
      
  }

  canvasQuality.classList.add( 'is-show' );

}


// 回転軸を中心に
const rotatePoint = ( { x, y } , rad ) => {

  const rcos = Math.cos( rad );
  const rsin = Math.sin( rad );
  return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };

};


// will work for shapes with top-left origin, like rectangle
function rotateAroundCenter( target , angle ) {

  //current angle origin (0, 0) relative to desired origin - center (target.width()/2, target.height()/2)
  const topLeft = { x: - target.width() * scaleX / 2, y: - target.height() * scaleY / 2 };
  const current = rotatePoint( topLeft , Konva.getAngle( target.rotation() ) );
  const rotated = rotatePoint( topLeft, Konva.getAngle( Number( angle ) ) );
  const dx = rotated.x - current.x,
        dy = rotated.y - current.y;

  target.rotation( Number( angle ) );
  target.x( target.x() + dx );
  target.y( target.y() + dy );

}


// TODO:回転スライダー
function rotateSlider( angle ) {

	rotateAroundCenter( uploadImgObj , angle );

	uploadImgObj
	.rotation( Number( angle ) );

  edit.batchDraw();
	edit.add( uploadImgObj );
	stageForEdit.add( edit );

}

rotateRange.addEventListener( 'input', function() {

	rotateSlider( Number( this.value ) );

	angle = Number( this.value );
	origX = uploadImgObj.x();
	origY = uploadImgObj.y();

	console.log( angle );
	console.log( origX );
	console.log( origY );

}, false);

rotateRange.addEventListener( 'change', function() {

	rotateSlider( Number( this.value ) );

	angle = Number( this.value );
	origX = uploadImgObj.x();
	origY = uploadImgObj.y();

	console.log( angle );
	console.log( origX );
	console.log( origY );

}, false);


// Pinch In Out
function pinchInOut() {

	let lastDist = 0;
	let startScale = 1;
	// let activeImg = null;

	function getDistance( p1, p2 ) {

	  return Math.sqrt( Math.pow( p2.x - p1.x, 2 ) + Math.pow( p2.y - p1.y, 2 ) );
	
	}

  // stageForEdit.on( 'tap' , ( evt ) => {
  //   // set active imgObj
  //   let img = evt.target;
  //   activeImg =
  //     activeImg && activeImg.getName() === img.getName()
  //       ? null
  //       : img;

  //   // sync scene graph
  //   uploadImgObj.setAttrs({
  //     stroke:
  //       activeImg && activeImg.getName() === img.getName()
  //         ? 'yellow'
  //         : 'transparent'
  //   });

  //   edit.draw();
  // });

	stageForEdit.getContent().addEventListener(
	  'touchmove',
	  function( evt ) {
	    let touch1 = evt.touches[ 0 ];
	    let touch2 = evt.touches[ 1 ];

	    if ( touch1 && touch2 ) {
	      let dist = getDistance(
	        {
	          x: touch1.clientX,
	          y: touch1.clientY
	        },
	        {
	          x: touch2.clientX,
	          y: touch2.clientY
	        }
	      );

	      if ( !lastDist ) {
	        lastDist = dist;
	      }

	      let scale = ( uploadImgObj.scaleX() * dist ) / lastDist;

	      // rotateAroundCenter(uploadImgObj , uploadImgObj.rotation() )
	      uploadImgObj.scaleX( scale );
	      uploadImgObj.scaleY( scale );
	      edit.draw();
	      lastDist = dist;

	    }

	  },

	  false

	);

	stageForEdit.getContent().addEventListener( 'touchend' , function() {

	    lastDist = 0;

	    scaleX = uploadImgObj.scaleX();
	    scaleY = uploadImgObj.scaleY();
	    console.log( scaleX );
	    console.log( scaleY );
	  
	  },
	  
	  false

	);

}

pinchInOut();


// 削除
removeCanvas.addEventListener( 'click', () => {

	event.preventDefault();

	edit.destroy();
	uploadImgObj.clearCache();

	fileUpload.value = null;
	console.log( fileUpload.value );

  canvasQuality.classList.remove( 'is-show' );

} , false );


// 確定画面へ
confirm.addEventListener( 'click', () => {

	event.preventDefault();

	showPreview();

	window.history.pushState( null , null , 'preview.html' );

	saveValues.uploadImgSrc = uploadImgSrc;
	// saveValues.previewImgSrc = previewImgSrc;
	saveValues.origX = origX;
	saveValues.origY = origY;
	saveValues.scaleX = scaleX;
	saveValues.scaleY = scaleY;
	saveValues.angle = angle;
	saveValues.saveWindowWidth = startWindowWidth;
	saveValues.saveWindowHeight = startWindowHeight;
	saveValues.saveGuideWidth = initGuideWidth;
	saveValues.saveGuideHeight = initGuideHeight;
	saveValues.uploadImgWidth = uploadImgWidth;
	saveValues.uploadImgHeight = uploadImgHeight;

	console.log( saveValues );

} , false );


// トリミング
function showPreview() {

	// first we need to create a stage
	let stageForPreview = new Konva.Stage({ 
	  container: 'js-konva-preview',// id of container <div> 
	  width: initGuideWidth,
	  height: initGuideWidth / guideImg.width * guideImg.height + 2
	});

	// then create layer
	let preview = new Konva.Layer();

	let previewGroup = new Konva.Group({
			x: -( stageForEdit.width() / 2 - initGuideWidth / 2 ),
			y: -( stageForEdit.height() / 2 - initGuideWidth / guideImg.width * guideImg.height / 2 ),
      clipFunc: function( ctx ) {
				  drawRect({
				    ctx : ctx,
				    x : stageForEdit.width() / 2 - initGuideWidth / 2,
				    y : stageForEdit.height() / 2 - initGuideWidth / guideImg.width * guideImg.height / 2,
				    width: initGuideWidth,
				    height: initGuideWidth / guideImg.width * guideImg.height,
				    radius: 22,
				    color: "rgba(0, 0, 0, 0)"
				});
      },
      draggable: false
	});

	let cloneGuide = guideImgObj.clone();
	let cloneTemplate = templateImgObj.clone();
	let cloneUploadImg = uploadImgObj.clone();

	previewGroup.add( cloneGuide );
  previewGroup.add( cloneTemplate );
  previewGroup.add( cloneUploadImg );
  cloneGuide.moveToTop();
  cloneTemplate.moveToBottom();
  preview.draw();

  preview.add( previewGroup );
  stageForPreview.add( preview );

  previewImgSrc = stageForPreview.toDataURL( { mimetype: 'image/jpeg' } );

  console.log( previewImgSrc );

}

// 角丸長方形生成
function drawRect( param ) {

  let ctx = param.ctx;
  let x = param.x;
  let y =param.y;
  let width = param.width;
  let height = param.height;
  let radius = param.radius || 0;
  let color = param.color;
  
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo( x + radius, y );
  ctx.lineTo( x + width - radius, y );
  ctx.arc( x + width - radius, y + radius, radius, Math.PI * 1.5, 0, false );
  ctx.lineTo( x + width, y + height - radius);
  ctx.arc( x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5, false );
  ctx.lineTo( x + radius, y + height );
  ctx.arc( x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI, false );
  ctx.lineTo( x, y + radius );
  ctx.arc( x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false );
  ctx.closePath();
  ctx.fill();
  ctx.restore();

}

 // 保存一覧からの再描画 

console.log( trafficURL );

window.addEventListener( 'load' , () => {

	if ( trafficURL.match( /save_data/ ) ) {

	optimisationImg( reDrawValues.uploadImgSrc );

	 setTimeout(() => {

		// let testWidth = ( uploadImgWidth * reDrawValues.scaleX ) - ( reDrawValues.saveGuideWidth * reDrawValues.scaleX );
		// let testHeight = ( uploadImgHeight * reDrawValues.scaleY ) - ( reDrawValues.saveGuideWidth / uploadImg.width * uploadImg.height * reDrawValues.scaleY );
		// let testWidth = ( uploadImgWidth * reDrawValues.scaleX ) - ( reDrawValues.uploadImgWidth * reDrawValues.scaleX );
		// let testHeight = ( uploadImgHeight * reDrawValues.scaleY ) - ( reDrawValues.uploadImgHeight * reDrawValues.scaleY );

		// console.log( testWidth );
		// console.log( testHeight );
		// console.log( uploadImgWidth );
		// console.log( uploadImgHeight );
		// console.log( initGuideWidth - reDrawValues.saveGuideWidth )

		let testWidth = initGuideWidth * reDrawValues.scaleX - reDrawValues.uploadImgWidth;
		let testHeight = initGuideWidth / uploadImg.width * uploadImg.height * reDrawValues.scaleY - reDrawValues.uploadImgHeight;

		console.log( testWidth );
		console.log( testHeight );

		rotateAroundCenter( uploadImgObj , reDrawValues.angle );

		 uploadImgObj
		 // .width( uploadImgObj.width() / ( initGuideWidth / reDrawValues.saveGuideWidth ) )
		 // .height( uploadImgObj.height() / ( initGuideHeight / reDrawValues.saveGuideHeight ) )
		 // .x( reDrawValues.origX + ( initWindowWidth - reDrawValues.saveWindowWidth ) / 2 + ( initGuideWidth - reDrawValues.saveGuideWidth ) / 2 )
		 // .y( reDrawValues.origY + ( initWindowHeight - reDrawValues.saveWindowHeight ) / 2 + ( initGuideHeight - reDrawValues.saveGuideHeight ) / 2 )
		 // .x( ( reDrawValues.origX + ( initWindowWidth - reDrawValues.saveWindowWidth ) / 2 ) * ( ( initGuideWidth / reDrawValues.saveGuideWidth ) / 2 ) )
		 // .y( ( reDrawValues.origY + ( initWindowHeight - reDrawValues.saveWindowHeight ) / 2 ) * ( ( initGuideHeight / reDrawValues.saveGuideHeight ) / 2 ) )
		 // .x( reDrawValues.origX + ( initWindowWidth - reDrawValues.saveWindowWidth ) / 2 - ( initGuideWidth - reDrawValues.saveGuideWidth ) )
		 // .y( reDrawValues.origY + ( initWindowHeight - reDrawValues.saveWindowHeight ) / 2 - ( initGuideHeight - reDrawValues.saveGuideHeight ) )
		 // .x( reDrawValues.origX + ( initWindowWidth - reDrawValues.saveWindowWidth ) / 2 - ( ( initGuideWidth - reDrawValues.saveGuideWidth ) / 2 ) )
		 // .y( reDrawValues.origY + ( initWindowHeight - reDrawValues.saveWindowHeight ) / 2 - ( ( initGuideHeight - reDrawValues.saveGuideHeight ) / 2 ) )
		 .x( reDrawValues.origX + ( initWindowWidth - reDrawValues.saveWindowWidth ) / 2 )
		 .y( reDrawValues.origY + ( initWindowHeight - reDrawValues.saveWindowHeight ) / 2 )
		 .scaleX( reDrawValues.scaleX )
		 .scaleY( reDrawValues.scaleY )
		 // .rotation( reDrawValues.angle )

      edit.batchDraw();
			edit.add( uploadImgObj );
			stageForEdit.add( edit );

			initOrigX = reDrawValues.origX;
			initOrigY = reDrawValues.origY;
			initAngle = reDrawValues.angle;
			initScaleX = reDrawValues.scaleX;
			initScaleY = reDrawValues.scaleY;

			origX = initOrigX;
			origY = initOrigY;
			angle = initAngle;
			scaleX = initScaleX;
			scaleY = initScaleY;

			// rotateSlider( reDrawValues.angle );
			rotateRange.value = angle;

			console.log( reDrawValues );
			console.log( initGuideWidth - reDrawValues.saveGuideWidth );
			console.log( initGuideHeight - reDrawValues.saveGuideHeight );
			console.log( uploadImgWidth * reDrawValues.scaleX - reDrawValues.uploadImgWidth );
			console.log( uploadImgHeight * reDrawValues.scaleY - reDrawValues.uploadImgHeight );
			console.log( 'origX:' + uploadImgObj.x() );
			console.log( 'origY:' + uploadImgObj.y() );
			console.log( 'scaleX:' + uploadImgObj.scaleX() );
			console.log( 'scaleY:' + uploadImgObj.scaleY() );
			console.log( 'angle:' + uploadImgObj.rotation() );

	 	}, 100);

	}

}, false);