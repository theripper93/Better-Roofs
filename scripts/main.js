
/******************************************
 * COMPUTE THE MAIN SIGHTREFRESH FUNCTION *
 ******************************************/

Hooks.on("sightRefresh", () => {
  if(!_betterRoofs) return;
  let controlledToken = canvas.tokens.controlled[0];
  if (!controlledToken || !controlledToken.document.sight.enabled) return

  let perfStart
  let perfEnd
  if(_betterRoofs.DEBUG) perfStart = performance.now()

  _betterRoofs.roofs.forEach((tile) => {
    let { brMode, overrideHide } = _betterRoofsHelpers.getTileFlags(tile);
      _betterRoofsHelpers.computeShowHideTile(tile, overrideHide, controlledToken, brMode);
    });

    if(_betterRoofs.DEBUG){
      perfEnd = performance.now()
      console.log(`Better Roofs compute took ${perfEnd-perfStart} ms, FPS:${Math.round(canvas.app.ticker.FPS)}`)
    } 
});

/***********************************************************************************
 * CLEAN UP MASKS AND FIX VISIBILITY OF TILES WHEN A TOKEN IS RELEASED FROM CONTROL *
 ***********************************************************************************/

Hooks.on("controlToken", (token, controlled) => {
  if (!controlled)
    _betterRoofs.roofs.forEach((tile) => {
      tile.mesh.mask = null;
      if (_betterRoofs.foregroundSightMaskContainers[tile.id])
        _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
        _betterRoofsHelpers.hideTileThroughFog(tile);
        tile.alpha=1;
        tile.refresh()
    });
});

Hooks.on("levelsReady", ()=>{
  _betterRoofs.roofs.forEach((tile) => {
    tile.mesh.mask = null;
    const maskSprite = tile.children.find((c) => c.name == tile.id);
    if(maskSprite) tile.removeChild(maskSprite);
    if (_betterRoofs.foregroundSightMaskContainers[tile.id])
      _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
      _betterRoofsHelpers.hideTileThroughFog(tile);
      tile.alpha=1;
      tile.refresh()
  });
  //canvas.sight.refresh();
})