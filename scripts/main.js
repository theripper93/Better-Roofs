/***************************************************************
 *                     BETTERROOFS MODES:                      *
 *                                                             *
 *0: NONE                                                      *
 *1: ONLY HIDE/SHOW THROUGH FOG                                *
 *2: HIDE A ROOF WHEN THE TOKEN HAS SIGHT INSIDE THE BUILDING  *
 *3: MASK OUT THE PART OF THE TILE THAT IS WITHIN THE LOS      *
 ***************************************************************/

/******************************************
 * COMPUTE THE MAIN SIGHTREFRESH FUNCTION *
 ******************************************/

Hooks.on("sightRefresh", () => {
  let controlledToken = canvas.tokens.controlled[0];
  if (!controlledToken || !controlledToken.data.vision) return

  let perfStart
  let perfEnd
  if(_betterRoofs.DEBUG) perfStart = performance.now()

  _betterRoofs.roofs.forEach((tile) => {
    let { brMode, overrideHide } = _betterRoofsHelpers.getTileFlags(tile);
    if((brMode==3 && game.settings.get("betterroofs", "forceFallback"))) brMode=2
    
      if (brMode == 3) {
        _betterRoofsHelpers.computeMask(tile, controlledToken);
      }
      if (brMode == 2 && !tile.occluded) {
        overrideHide = _betterRoofsHelpers.computeHide(controlledToken, tile, overrideHide);
      }
      _betterRoofsHelpers.computeShowHideTile(tile, overrideHide, controlledToken, brMode);
    });

    if(game.settings.get("betterroofs", "wbIntegration") && game.modules.get("weatherblock")?.active) refreshWheatherBlockingMask(true)

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
      tile.mask = null;
      if (_betterRoofs.foregroundSightMaskContainers[tile.id])
        _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
        _betterRoofsHelpers.hideTileThroughFog(tile);
      if (!tile.occluded) {
        tile.alpha=1;
        tile.refresh()
      }//alpha =  game.user.isGM? 0.5 : 1;
    });
});