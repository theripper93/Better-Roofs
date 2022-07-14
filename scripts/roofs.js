/***********************************************************************************
 * BETTERROOFS CLASS, CONTAINS THE DATA NEEDED FOR FASTER SIGHT REFRESH PROCESSING *
 ***********************************************************************************/

class betterRoofs {
    constructor() {
      this.fogRoofContainer
      this.foregroundSightMaskContainers = {}
      this.roofs
      this.isLevels = game.modules.get('levels')?.active
      this.DEBUG = false
      this.isV9 = game.version >= 9
      this.isLightspeed = this.isV9 || game.modules.get("lichtgeschwindigkeit")?.active
      this.isWallHeight = game.modules.get("wall-height")?.active
      this.initializeRoofsDebounced = debounce(this.initializeRoofs.bind(this),1000)
    }
  
/**********************************************
 * INITIALIZE THE ROOFS FOR THE FIRST TIME *
 **********************************************/
  
    static get() {
        betterRoofs._instance = new betterRoofs();
        return betterRoofs._instance;
    }

/************************************************************
 * INITIALIZE OR RESET THE PIXI CONTAINERS USED FOR MASKING *
 ************************************************************/

    initializePIXIcontainers(){
        this.fogRoofContainer = new PIXI.Container();
        this.fogRoofContainer.name = "fogRoofContainer";
        this.fogRoofContainer.spriteIndex = {}
        const oldContainer = canvas.effects.visibility.revealed.children.find(c => c.name == "fogRoofContainer")
        if(oldContainer) canvas.effects.visibility.revealed.removeChild(oldContainer)
        canvas.effects.visibility.revealed.addChild(this.fogRoofContainer);
        //canvas.effects.visibility.filter.enabled = false
        this.roofs.forEach((t) => {
            if(this.foregroundSightMaskContainers[t.id])t.removeChild(this.foregroundSightMaskContainers[t.id])
            t.mesh.mask = null
          })
        this.foregroundSightMaskContainers = {}
        this.roofs.forEach((t) => {
            if(t.document.getFlag(
              "betterroofs",
              "brMode"
            ) == 3){
              t.removeChild(this.foregroundSightMaskContainers[t.id])
              this.foregroundSightMaskContainers[t.id] = new PIXI.Container();
              this.foregroundSightMaskContainers[t.id].name = t.id;
              this.foregroundSightMaskContainers[t.id].x -= t.x
              this.foregroundSightMaskContainers[t.id].y -= t.y
              t.addChild(this.foregroundSightMaskContainers[t.id]);
            }
            
        })
        
        //canvas.sight.refresh()
    }

/******************************************************************************************
 * BUILD OR REFRESH THE ROOF ARRAY AND ASSIGN A BUILDING POLYGON TO EACH BETTER ROOF TILE *
 ******************************************************************************************/

    initializeRoofs(){
      if(game.Levels3DPreview?._active && game.Levels3DPreview?.object3dSight) {
        this.roofs = []
        return;
      }
        this.roofs = []
        canvas.tiles.placeables.filter(t => t.document.overhead).forEach((t) => {
            if(t.document.getFlag("betterroofs","brMode") && t.document.getFlag("betterroofs","brMode") != 0){
              this.roofs.push(t)
              t.roomPoly = _betterRoofsHelpers.getRoomPoly(t,false)
            } 
        })

        console.log("Roofs initialized")


    }

    static debouncedInitializeRoofs(){
      _betterRoofs.initializeRoofsDebounced()
    }

}

/******************************************************************************
 * REBUILD THE BETTERROOFS ARRAY AND PIXI CONTAINERS UNDER CERTAIN CONDITIONS *
 ******************************************************************************/

Hooks.on("updateTile", () => {
  betterRoofs.debouncedInitializeRoofs()
});

Hooks.on("createTile", () => {
  betterRoofs.debouncedInitializeRoofs()
});

Hooks.on("deleteTile", () => {
  betterRoofs.debouncedInitializeRoofs()
});

Hooks.on("deleteWall", () => {
  betterRoofs.debouncedInitializeRoofs()
})

Hooks.on("updateWall", (wall,updates) => {
  if("ds" in updates) return
  betterRoofs.debouncedInitializeRoofs()
})