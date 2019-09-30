import Konva from 'konva';
import Store from 'store';

const konvaWrapper = document.getElementById('js-konva-wrapper');

// first we need to create a stage
var stage = new Konva.Stage({ 
  container: 'js-konva-wrapper',// id of container <div> 
  width: window.innerWidth,
  height: window.innerHeight - 140
});