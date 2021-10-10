Hooks.on("init", () => {
  libWrapper.register(
    "betterroofs",
    "ForegroundLayer.prototype.updateOcclusion",
    occlusionLink,
    "WRAPPER"
  );

function occlusionLink(wrapped,...args){
    wrapped(...args);
    for(let otile of canvas.foreground.placeables){
        if(_betterRoofs?.isLevels && _levels?.floorContainer?.children.includes(_levels?.floorContainer?.spriteIndex[otile.id])) continue;       
        const occlusionLinkId = otile.data.flags?.betterroofs?.occlusionLinkId;
        if(!occlusionLinkId) continue;
        let occlusionLink = false;
        for(let tile of canvas.foreground.placeables){
            if(_betterRoofs?.isLevels && _levels?.floorContainer?.children.includes(_levels?.floorContainer?.spriteIndex[tile.id])) continue;    
            if(!tile.occluded || tile.id === otile.id) continue;
            const occlusionLinkSource = tile.data.flags?.betterroofs?.occlusionLinkSource;
            const tOcclusionLinkId = tile.data.flags?.betterroofs?.occlusionLinkId;
            if(occlusionLinkSource && tOcclusionLinkId === occlusionLinkId){
                occlusionLink = tile;
                break;
            }
        }
        if(occlusionLink){
            otile.occluded = occlusionLink.occluded;
            otile.tile.alpha = otile.data.occlusion.alpha;
            otile.wasOccluded = true;
        }else{
            if(otile.wasOccluded && !otile.occluded){
                otile.wasOccluded = false;
                otile.refresh();
            }
        }
    }

}

});