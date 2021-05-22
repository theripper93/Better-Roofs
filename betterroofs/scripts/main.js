let _betterRoofs;

Hooks.on("canvasReady", () => {
  _betterRoofs = betterRoofs.get();
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});

Hooks.on("sightRefresh", () => {
  let controlledToken = canvas.tokens.controlled[0];
  if (
    !controlledToken ||
    !controlledToken.data.vision ||
    (controlledToken.data.dimSight == 0 &&
      controlledToken.data.brightSight == 0)
  )
    return;
  _betterRoofs.roofs.forEach((tile) => {
    let overrideHide = false;
    let brMode = tile.document.getFlag("betterroofs", "brMode");

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
        checkIfInSightPointArray(canvas.sight.sources.get(`Token.${controlledToken.id}`).fov.points, tile,30)
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
      checkIfInSight(getSightPoints(controlledToken, 5), tile)
    ) {
      showTileThroughFog(tile);
    } else {
        if (brMode == 2 && _betterRoofs.foregroundSightMaskContainers[tile.id]){
            _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
            tile.mask = null
        }
      hideTileThroughFog(tile);
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
    });
});
