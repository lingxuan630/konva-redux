const { createStore, combineReducers } = require("redux");

import Konva from "konva";

const defaultReduers = (state = { position: {} }, action) => {
  switch (action.type) {
    case "CHANGE_POSITION":
      return {
        ...state,
        ...action.payload
      };
  }
  return state;
};

const store = createStore(
  combineReducers({
    demo: defaultReduers
  }),
  {}
);

store.subscribe(() => {
  const state = store.getState();
  const demoData = state.demo;
  const ids = Object.keys(demoData);
  ids.map(id => {
    stage.find(`#${id}`).setAttrs(demoData[id]);
  });
  // star.setAttrs(state.demo.position);
});

var stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth,
  height: window.innerHeight
});

const wWidth = window.innerWidth;
const wHeight = window.innerHeight;

const layerCollection = [];
function produceStar(layer, index) {
  const eleX = Math.round(wWidth * Math.random());
  const eleY = Math.round(wHeight * Math.random());

  var star = new Konva.Star({
    id: `star${index}`,
    x: eleX,
    y: eleY,
    numPoints: 6,
    innerRadius: 40,
    outerRadius: 70,
    fill: "yellow",
    stroke: "black",
    strokeWidth: 4
  });

  var rect = new Konva.Rect({
    x: eleX - 50,
    y: eleY - 50,
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: "transparent",
    strokeWidth: 4,
    draggable: true
  });

  store.dispatch({
    type: "CHANGE_POSITION",
    payload: {
      [`star${index}`]: {
        x: eleX,
        y: eleY
      }
    }
  });

  rect.on("dragmove", e => {
    const { target } = e;
    const { x, y } = target.attrs;
    // star.setAttrs({
    //   x: x + 50,
    //   y: y + 50
    // });
    store.dispatch({
      type: "CHANGE_POSITION",
      payload: {
        [`star${index}`]: {
          x: x + 50,
          y: y + 50
        }
      }
    });
  });

  // add the shape to the layer
  layer.add(star);
  layer.add(rect);

  star.cache();
  rect.cache();

  return layer;
}

let layerNodeLimit = 80;
let layerNodeCount = 0;
let layer = new Konva.Layer();

for (let i = 0; i < 1000; i++) {
  layerNodeCount++;
  if (layerNodeCount >= layerNodeLimit) {
    layerNodeCount = 0;
    stage.add(layer);
    layer = new Konva.Layer();
  }

  produceStar(layer, i);
}

// stage.add(layer);
// add the layer to the stage
