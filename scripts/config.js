/***************************************
 * INITIALIZE THE BETTER ROOF INSTANCE *
 ***************************************/

let _betterRoofs, _betterRoofsHelpers;

Hooks.on("canvasReady", () => {
  _betterRoofsHelpers = new betterRoofsHelpers();
  _betterRoofs = betterRoofs.get();
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
  Hooks.callAll("betterRoofsReady");
});

Hooks.once("levelsReady", () => {
  _betterRoofsHelpers = new betterRoofsHelpers();
  _betterRoofs = betterRoofs.get();
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
  Hooks.callAll("betterRoofsReady");
})

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


  game.settings.register("betterroofs", "roomPreview", {
    name: game.i18n.localize("betterroofs.settings.roomPreview.name"),
    hint: game.i18n.localize("betterroofs.settings.roomPreview.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("betterroofs", "wbIntegration", {
    name: game.i18n.localize("betterroofs.settings.wbIntegration.name"),
    hint: game.i18n.localize("betterroofs.settings.wbIntegration.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
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
  <label>${game.i18n.localize("betterroofs.tileConfig.showInFog")}</label>
  <div class="form-fields">
      <input type="checkbox" name="flags.betterroofs.brMode" ${brMode ? "checked" : ""}>
  </div>
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

  const overh = html.find('input[name="overhead"]');
  const formGroup = overh.closest(".form-group");
  html.find(`select[name="occlusion.mode"]`).closest(".form-group").after(newHtml);

});
