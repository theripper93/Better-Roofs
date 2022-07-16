Hooks.on("init", () => {
  libWrapper.register(
    "betterroofs",
    "PrimaryCanvasGroup.prototype._identifyOccludedTiles",
    occlusionLink,
    "WRAPPER"
  );


function occlusionLink(wrapped,...args){
    const occluded = wrapped(...args);
    for(let otile of canvas.tiles.placeables.filter(t => t.document.overhead)){
        const occlusionLinkId = otile.document.flags?.betterroofs?.occlusionLinkId;
        if(!occlusionLinkId) continue;
        let occlusionLink = false;
        for(let tile of canvas.tiles.placeables.filter(t => t.document.overhead)){
            if(_betterRoofs?.isLevels && _levels?.floorContainer?.children.includes(_levels?.floorContainer?.spriteIndex[tile.id])) continue;    
            if(!occluded.has(tile) || tile.id === otile.id) continue;
            const occlusionLinkSource = tile.document.flags?.betterroofs?.occlusionLinkSource;
            const tOcclusionLinkId = tile.document.flags?.betterroofs?.occlusionLinkId;
            if(occlusionLinkSource && tOcclusionLinkId === occlusionLinkId){
                occlusionLink = tile;
                break;
            }
        }
        if(occlusionLink){
            occluded.add(otile);
        }
    }

    return occluded;

}

});