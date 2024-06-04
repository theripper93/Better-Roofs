/***************************************
 * INITIALIZE THE BETTER ROOF INSTANCE *
 ***************************************/

let _betterRoofs, _betterRoofsHelpers;

Hooks.on("canvasReady", () => {
  _betterRoofs.initializePIXIcontainers();
  _betterRoofs.initializeRoofs();
})

/**************************
 * REGISTER GAME SETTINGS *
 **************************/

Hooks.on("init", () => {
  Hooks.on(game.modules.get("levels")?.active ? "levelsAdvancedFogInit" : "drawCanvasVisibility", () => {
    _betterRoofsHelpers = new betterRoofsHelpers();
    _betterRoofs = betterRoofs.get();
    _betterRoofs.initializePIXIcontainers();
    Hooks.callAll("betterRoofsReady");
  });
});

/****************************************************
 * ADD BETTER ROOF CONFIGURATION TO THE TILE CONFIG *
 ****************************************************/

Hooks.on("renderTileConfig", (app, html, data) => {
  const isInjected = html.find(`input[name="flags.betterroofs.occlusionLinkId"]`).length > 0;
  if(isInjected) return;

  let brMode = app.object.getFlag("betterroofs", "brMode");

  if(!(brMode instanceof Boolean)){
    if(brMode == 1 || brMode == 3){
      brMode = true;
    }else{
      brMode = false;
    }
  }

  let occlusionLinkSource = app.object.getFlag("betterroofs", "occlusionLinkSource") || false;

  let occlusionLinkId = app.object.getFlag("betterroofs", "occlusionLinkId") || "";

  const newHtml = `

  <div class="form-group">
  <label>${game.i18n.localize("betterroofs.tileConfig.showInFog.name")}</label>
  <div class="form-fields">
      <input type="checkbox" name="flags.betterroofs.brMode" ${brMode ? "checked" : ""}>
  </div>
  <p class="notes">${game.i18n.localize("betterroofs.tileConfig.showInFog.hint")}</p>
  </div>


  <div class="form-group">
  <label for="occlusionLinkId">${game.i18n.localize("betterroofs.tileConfig.occlusionLinkId")}</label>
  <div class="form-fields">
      <input type="text" name="flags.betterroofs.occlusionLinkId" value="${occlusionLinkId}">
  </div>
  <p class="notes">${game.i18n.localize("betterroofs.tileConfig.occlusionLinkIdHint")}</p>
</div>

<div class="form-group">
            <label>${game.i18n.localize("betterroofs.tileConfig.occlusionLinkSource")}</label>
            <div class="form-fields">
                <input type="checkbox" name="flags.betterroofs.occlusionLinkSource" ${occlusionLinkSource ? "checked" : ""}>
            </div>
        </div>
  `
  
  html.find(`select[name="occlusion.mode"]`).closest(".form-group").after(newHtml);
  app.setPosition({height: "auto"});
});
