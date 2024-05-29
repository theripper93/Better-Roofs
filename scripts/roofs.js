/***********************************************************************************
 * BETTERROOFS CLASS, CONTAINS THE DATA NEEDED FOR FASTER SIGHT REFRESH PROCESSING *
 ***********************************************************************************/

class betterRoofs {
    constructor() {
      this.fogRoofContainer
      this.roofs
      this.isLevels = game.modules.get('levels')?.active
      this.DEBUG = false
      this.initializeRoofsDebounced = foundry.utils.debounce(this.initializeRoofs.bind(this),1000)
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
        const oldContainer = canvas.masks.vision.children.find(c => c.name == "fogRoofContainer")
        if(oldContainer) canvas.masks.vision.removeChild(oldContainer)
        canvas.masks.vision.addChild(this.fogRoofContainer);
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
        if(!canvas.tiles?.placeables) return;
        canvas.tiles.placeables.forEach((t) => {
            if(t.document.getFlag("betterroofs","brMode") && t.document.getFlag("betterroofs","brMode") != 0){
              this.roofs.push(t)
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