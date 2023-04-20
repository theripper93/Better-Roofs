
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
  if (!_betterRoofs.roofs) _betterRoofs.initializeRoofs();
  canvas.masks.vision.addChild(_betterRoofs.fogRoofContainer);
  _betterRoofs.roofs.forEach((tile) => {
    let { brMode, overrideHide } = _betterRoofsHelpers.getTileFlags(tile);
      _betterRoofsHelpers.computeShowHideTile(tile, overrideHide, controlledToken, brMode);
    });

    if(_betterRoofs.DEBUG){
      perfEnd = performance.now()
      console.log(`Better Roofs compute took ${perfEnd-perfStart} ms, FPS:${Math.round(canvas.app.ticker.FPS)}`)
    } 
});





