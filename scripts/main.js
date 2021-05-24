Hooks.on("sightRefresh", () => {
  let controlledToken = canvas.tokens.controlled[0];
  if (!controlledToken || !controlledToken.data.vision) return;
  let fallback = controlledToken.data.dimSight == 0 && controlledToken.data.brightSight == 0 ? true : false;
  _betterRoofs.roofs.forEach((tile) => {
    let { brMode, overrideHide, tolerance } = getTileFlags(tile);
    if (!fallback) {
      if (brMode == 3) {
        computeMask(tile, controlledToken);
      }
      if (brMode == 2 && !tile.occluded) {
        overrideHide = computeHide(controlledToken, tile, tolerance, overrideHide);
      }
      computeShowHideTile(tile, overrideHide, controlledToken, tolerance, brMode);
    } else {
      if (brMode == 2 || brMode == 3) {
        overrideHide = computeHide(controlledToken, tile, tolerance, overrideHide);
        if (canvas.scene.data.globalLight) {
          computeShowHideTile(tile, overrideHide, controlledToken, tolerance, brMode, 60)
        }
      }
    }
  });
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