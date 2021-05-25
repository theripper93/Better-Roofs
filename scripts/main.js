Hooks.on("sightRefresh", () => {
  let controlledToken = canvas.tokens.controlled[0];
  if (!controlledToken || !controlledToken.data.vision) return;
  _betterRoofs.roofs.forEach((tile) => {
    let { brMode, overrideHide, tolerance } = getTileFlags(tile);
    if((brMode==3 && game.settings.get("betterroofs", "forceFallback"))) brMode=2
    
      if (brMode == 3) {
        computeMask(tile, controlledToken);
      }
      if (brMode == 2 && !tile.occluded) {
        overrideHide = computeHide(controlledToken, tile, tolerance, overrideHide);
      }
      computeShowHideTile(tile, overrideHide, controlledToken, tolerance, brMode);
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