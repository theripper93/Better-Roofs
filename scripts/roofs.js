class betterRoofs {
    constructor() {
      this.fogRoofContainer
      this.foregroundSightMaskContainers = {}
      this.roofs
    }
  
  /**********************************************
   * INITIALIZE THE ROOFS FOR THE FIRST TIME *
   **********************************************/
  
    static get() {
        betterRoofs._instance = new betterRoofs();
        return betterRoofs._instance;
    }

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

    initializeRoofs(){
        this.roofs = []
        canvas.foreground.placeables.forEach((t) => {
            if(t.document.getFlag(
                "betterroofs",
                "brMode"
              ) != 0) this.roofs.push(t)
        })
    }

}

Hooks.on("updateTile", () => {
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});

Hooks.on("deleteTile", () => {
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});