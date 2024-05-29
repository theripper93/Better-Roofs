Hooks.on("init", () => {
  libWrapper.register(
    "betterroofs",
    "CanvasOcclusionMask.prototype._identifyOccludedObjects",
    occlusionLink,
    "WRAPPER"
  );


function occlusionLink(wrapped,...args){
    const occluded = wrapped(...args);
    for(let otile of canvas.tiles.placeables){
        const occlusionLinkId = otile.document.flags?.betterroofs?.occlusionLinkId;
        if(!occlusionLinkId) continue;
        if(_betterRoofs?.isLevels && CONFIG.Levels.currentToken?.document?.elevation >= otile.document.elevation) continue;
        let occlusionLink = false;
        for(let tile of canvas.tiles.placeables){
            if(_betterRoofs?.isLevels && CONFIG.Levels.currentToken?.document?.elevation >= tile.document.elevation) continue;    
            if(!occluded.has(tile.mesh) || tile.id === otile.id) continue;
            const occlusionLinkSource = tile.document.flags?.betterroofs?.occlusionLinkSource;
            const tOcclusionLinkId = tile.document.flags?.betterroofs?.occlusionLinkId;
            if(occlusionLinkSource && tOcclusionLinkId === occlusionLinkId){
                occlusionLink = tile;
                break;
            }
        }
        if(occlusionLink){
            occluded.add(otile.mesh);
        }
    }

    canvas.tiles.placeables.forEach((t) => {
        if (occluded.has(t.mesh)) _betterRoofsHelpers.hideTileThroughFog(t);
    });

    return occluded;

}

});