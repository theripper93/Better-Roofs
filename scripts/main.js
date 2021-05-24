let _betterRoofs;

Hooks.on("canvasReady", () => {
  _betterRoofs = betterRoofs.get();
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});

Hooks.on("sightRefresh", () => {
  let controlledToken = canvas.tokens.controlled[0];
  if (!controlledToken) return
  let fallback = false
  if (
    !controlledToken ||
    !controlledToken.data.vision ||
    (controlledToken.data.dimSight == 0 &&
      controlledToken.data.brightSight == 0)
  )
    fallback = true
  _betterRoofs.roofs.forEach((tile) => {
    let overrideHide = false;
    let tolerance = parseInt(tile.document.getFlag("betterroofs","brTolerance")) || 0
    let brMode = tile.document.getFlag("betterroofs", "brMode");
if(!fallback){
  if (brMode == 3) {
    _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
    if (!tile.occluded) {
      if (!tile.mask)
        tile.mask = _betterRoofs.foregroundSightMaskContainers[tile.id];
      _betterRoofs.foregroundSightMaskContainers[tile.id].addChild(
        drawSightPoli(controlledToken)
      );
    } else {
      tile.mask = null;
    }
  }
  if (brMode == 2 && !tile.occluded) {
    if (
      checkIfInSightPointArray(canvas.sight.sources.get(`Token.${controlledToken.id}`).fov.points, tile,tolerance+30)
    ) {
      tile.alpha = tile.data.occlusion.alpha;
      hideTileThroughFog(tile);
      overrideHide = true;
    } else {
      tile.alpha = 1;
    }
  }
  if (
    !tile.occluded &&
    !overrideHide &&
    checkIfInSight(getSightPoints(controlledToken, 5), tile,tolerance)
  ) {
    showTileThroughFog(tile);
  } else {
      if (brMode == 2 && _betterRoofs.foregroundSightMaskContainers[tile.id]){
          _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
          tile.mask = null
      }
    hideTileThroughFog(tile);
  }
}else{
  if(brMode == 2 || brMode == 3){
    if (
      checkIfInSightPointArray(canvas.sight.sources.get(`Token.${controlledToken.id}`).los.points, tile,tolerance+30)
    ) {
      tile.alpha = tile.data.occlusion.alpha;
      hideTileThroughFog(tile);
      overrideHide = true;
    } else {
      tile.alpha = 1;
    }
  }
}

  });
});

Hooks.on("deleteTile", () => {
    _betterRoofs.initializeRoofs();
    _betterRoofs.initializePIXIcontainers();
});


Hooks.on("controlToken", (token, controlled) => {
  if (!controlled)
    _betterRoofs.roofs.forEach((tile) => {
      tile.mask = null;
      if (_betterRoofs.foregroundSightMaskContainers[tile.id])
        _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
      hideTileThroughFog(tile);
      if (!tile.occluded) tile.alpha =  game.user.isGM? 0.5 : 1;
    });
});

Hooks.on("init", () => {
  game.settings.register("betterroofs", "fogVisibility", {
    name: "Visibility of tiles through fog",
    hint: "How visible (or how perceptibly bright) are the tiles shown through the fog",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    default: 0.9,
  });
})