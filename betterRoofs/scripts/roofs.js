class betterRoofs {
    constructor() {
      this.fogRoofContainer
      this.foregroundSightMaskContainer
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
        this.foregroundSightMaskContainer = new PIXI.Container();
        this.foregroundSightMaskContainer.name = "foregroundSightMaskContainer";
        canvas.sight.addChild(this.fogRoofContainer);
        canvas.foreground.addChild(this.foregroundSightMaskContainer);
        canvas.foreground.mask = this.foregroundSightMaskContainer;
    }

    initializeRoofs(){
        this.roofs = []
        canvas.foreground.placeables.forEach((t) => {
            if(t.isRoof)this.roofs.push(t)
        })
    }

  }