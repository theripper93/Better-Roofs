/***************************************
 * INITIALIZE THE BETTER ROOF INSTANCE *
 ***************************************/

let _betterRoofs, _betterRoofsHelpers

Hooks.on("canvasReady", () => {
  _betterRoofsHelpers = new betterRoofsHelpers()
  _betterRoofs = betterRoofs.get();
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});

/**************************
 * REGISTER GAME SETTINGS *
 **************************/

Hooks.on("init", () => {
    game.settings.register("betterroofs", "fogVisibility", {
      name: game.i18n.localize("betterroofs.settings.fogVisibility.name"),
      hint: game.i18n.localize("betterroofs.settings.fogVisibility.hint"),
      scope: "world",
      config: true,
      type: Number,
      range: {
        min: 0.1,
        max: 1,
        step: 0.05,
      },
      default: 0.9,
    });

    game.settings.register("betterroofs", "forceFallback", {
      name: game.i18n.localize("betterroofs.settings.forceFallback.name"),
      hint: game.i18n.localize("betterroofs.settings.forceFallback.hint"),
      scope: "client",
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register("betterroofs", "roomPreview", {
      name: game.i18n.localize("betterroofs.settings.roomPreview.name"),
      hint: game.i18n.localize("betterroofs.settings.roomPreview.hint"),
      scope: "world",
      config: true,
      type: Boolean,
      default: false,
    });
})

/****************************************************
 * ADD BETTER ROOF CONFIGURATION TO THE TILE CONFIG *
 ****************************************************/

Hooks.on("renderTileConfig", (app, html, data) => {
  let tile = canvas.foreground.get(app.object.id)
  if(game.settings.get("betterroofs", "roomPreview") && game.user.isGM && canvas.foreground.children.filter(c => c.tileId == app.object.id).length == 0){
  if(tile)_betterRoofsHelpers.getRoomPoly(tile,true)
}
    let brMode = app.object.getFlag(
      "betterroofs",
      "brMode"
    ) || 0;

  let newHtml = `
<div class="form-group">
          <label>${game.i18n.localize("betterroofs.tileConfig.brMode.name")}</label>
          <div class="form-fields">
              <select name="br.mode" data-dtype="Number">
              <option value="0">${game.i18n.localize("betterroofs.tileConfig.brMode.option0")}</option><option value="1">${game.i18n.localize("betterroofs.tileConfig.brMode.option1")}</option><option value="2">${game.i18n.localize("betterroofs.tileConfig.brMode.option2")}</option><option value="3">${game.i18n.localize("betterroofs.tileConfig.brMode.option3")}</option>
              </select>
          </div>
      </div>

`;
  const overh = html.find('input[name="overhead"]');
  const formGroup = overh.closest(".form-group");
  formGroup.after(newHtml);
  html.find("select[name ='br.mode']")[0].value = brMode
  html.find($('button[name="submit"]')).click(app.object,_betterRoofsHelpers.saveTileConfig)
})

/***********************************************
 * REMOVE DEBUG POLYGONS FROM FOREGROUND LAYER *
 ***********************************************/

Hooks.on("closeTileConfig",  (app, html, data) => {
  for(let c of canvas.foreground.children){
    if(c.tileId == app.object.id) c.destroy()
  }
})

/****************************************************
 * INJECT CUSTOM BUTTONS TO THE SCENE WALL CONTROLS *
 ****************************************************/

Hooks.on("getSceneControlButtons", (controls,b,c) => {
  if (game.user.isGM) {
    controls.find((t) => t["name"] == "walls").tools.push(
      {
        icon: "fas fa-border-style",
        name: "walledges",
        title: game.i18n.localize("betterroofs.scenecontrols.walledges"),
        onClick: async () => {
          if(await _betterRoofsHelpers.yesNoPrompt(game.i18n.localize("betterroofs.yesnodialog.title"),game.i18n.localize("betterroofs.yesnodialog.desc"))) buildEdgeWalls()
        },
      }
    )
  }



})

