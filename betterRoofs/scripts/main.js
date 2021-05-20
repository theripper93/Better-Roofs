let _betterRoofs
Hooks.on("canvasReady", () => {
    _betterRoofs = betterRoofs.get()
    _betterRoofs.initializePIXIcontainers()
    _betterRoofs.initializeRoofs()
})

Hooks.on("sightRefresh", () => {
    let controlledToken = canvas.tokens.controlled[0]
    if(!controlledToken) return
    _betterRoofs.foregroundSightMaskContainer.removeChildren()
    _betterRoofs.foregroundSightMaskContainer.addChild(drawSightPoli(controlledToken))
    
    _betterRoofs.roofs.forEach((tile) => {
        if(!tile.occluded && checkIfInSight(getSightPoints(controlledToken,5),tile)){
            showTileThroughFog(tile)
        }else{
            hideTileThroughFog(tile)
        }
    })
})

Hooks.on("tileUpdate"), () => {
    _betterRoofs.initializePIXIcontainers()
    _betterRoofs.initializeRoofs()
}