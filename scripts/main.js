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
  if (!controlledToken || !controlledToken.data.vision) return;
  _betterRoofs.roofs.forEach((tile) => {
    let { brMode, overrideHide } = getTileFlags(tile);
    if((brMode==3 && game.settings.get("betterroofs", "forceFallback"))) brMode=2
    
      if (brMode == 3) {
        computeMask(tile, controlledToken);
      }
      if (brMode == 2 && !tile.occluded) {
        overrideHide = computeHide(controlledToken, tile, overrideHide);
      }
      computeShowHideTile(tile, overrideHide, controlledToken, brMode);
    });
});

/***********************************************************************************
 * CLEAN UP MASKS AND FIX VISIBILITY OF TILES WHEN A TOKEN IS RELEASE FROM CONTROL *
 ***********************************************************************************/

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