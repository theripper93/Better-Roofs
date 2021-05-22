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

Hooks.on("renderTileConfig", (app, html, data) => {

      let brMode = app.object.getFlag(
        "betterroofs",
        "brMode"
      ) || 0;

    let newHtml = `
<div class="form-group">
            <label>Better Roof Mode</label>
            <div class="form-fields">
                <select name="br.mode" data-dtype="Number">
                <option value="0">None (Foundry Default)</option><option value="1">Show (Show Tile Through Fog)</option><option value="2">Hide (Hides Tile on Vision)</option><option value="3">Mask (Cutout Tile on Vision)</option>
                </select>
            </div>
        </div>

`
    const overh = html.find('input[name="overhead"]');
    const formGroup = overh.closest(".form-group");
    formGroup.after(newHtml);
    html.find("select[name ='br.mode']")[0].value = brMode
    html.find($('button[name="submit"]')).click(app.object,saveTileConfig)
  })

async function saveTileConfig(event){
    let html = this.offsetParent
    if(!canvas.background.get(event.data.id) && !canvas.foreground.get(event.data.id)) return
    await event.data.setFlag(
      "betterroofs",
      "brMode",
      html.querySelectorAll("select[name ='br.mode']")[0].value
    );
    _betterRoofs.initializeRoofs()
    _betterRoofs.initializePIXIcontainers()
  }