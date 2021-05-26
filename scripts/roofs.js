/***********************************************************************************
 * BETTERROOFS CLASS, CONTAINS THE DATA NEEDED FOR FASTER SIGHT REFRESH PROCESSING *
 ***********************************************************************************/

class betterRoofs {
    constructor() {
      this.fogRoofContainer
      this.foregroundSightMaskContainers = {}
      this.roofs
      this.DEBUG = false
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
        canvas.sight.addChild(this.fogRoofContainer);
        this.roofs.forEach((t) => {
            if(this.foregroundSightMaskContainers[t.id])t.removeChild(this.foregroundSightMaskContainers[t.id])
            t.mask = null
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
        

    }

/******************************************************************************************
 * BUILD OR REFRESH THE ROOF ARRAY AND ASSIGN A BUILDING POLYGON TO EACH BETTER ROOF TILE *
 ******************************************************************************************/

    initializeRoofs(){
        this.roofs = []
        canvas.foreground.placeables.forEach((t) => {
            if(t.document.getFlag("betterroofs","brMode") && t.document.getFlag("betterroofs","brMode") != 0){
              this.roofs.push(t)
              t.roomPoly = _betterRoofsHelpers.getRoomPoly(t,false)
            } 
        })
    }

}

/******************************************************************************
 * REBUILD THE BETTERROOFS ARRAY AND PIXI CONTAINERS UNDER CERTAIN CONDITIONS *
 ******************************************************************************/

Hooks.on("updateTile", () => {
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});

Hooks.on("deleteTile", () => {
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});

Hooks.on("deleteWall", () => {
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
})

Hooks.on("updateWall", (wall,updates) => {
  if("ds" in updates) return
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
})