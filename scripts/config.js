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

  let hoverFadeCached = true;

  game.settings.register("betterroofs", "hoverFade", {
    name: "Hover Fade",
    hint: "When enabled, the roofs will fade out when you hover over them. This is a Core Foundry VTT feature, this setting simply lets you turn it off.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: (value) => {
      hoverFadeCached = value;
      canvas.tiles.placeables.forEach(t=>t.refresh())
    },
  });

  hoverFadeCached = game.settings.get("betterroofs", "hoverFade");


  Hooks.on("refreshTile", (tile) => {
    if(tile?.mesh) tile.mesh.hoverFade = tile.mesh.hoverFade && hoverFadeCached;
  });


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
  const isInjected = html.querySelector(`[name="flags.betterroofs.occlusionLinkId"]`);
  if(isInjected) return;

  let brMode = app.document.getFlag("betterroofs", "brMode");

  if(!(brMode instanceof Boolean)){
    if(brMode == 1 || brMode == 3){
      brMode = true;
    }else{
      brMode = false;
    }
  }

  let occlusionLinkSource = app.document.getFlag("betterroofs", "occlusionLinkSource") || false;

  let occlusionLinkId = app.document.getFlag("betterroofs", "occlusionLinkId") || "";

  const newHtml = `

  <div class="form-group">
  <label>${game.i18n.localize("betterroofs.tileConfig.showInFog.name")}</label>
  <div class="form-fields">
      <input type="checkbox" name="flags.betterroofs.brMode" ${brMode ? "checked" : ""}>
  </div>
  <p class="hint">${game.i18n.localize("betterroofs.tileConfig.showInFog.hint")}</p>
  </div>


  <div class="form-group">
  <label for="occlusionLinkId">${game.i18n.localize("betterroofs.tileConfig.occlusionLinkId")}</label>
  <div class="form-fields">
      <input type="text" name="flags.betterroofs.occlusionLinkId" value="${occlusionLinkId}">
  </div>
  <p class="hint">${game.i18n.localize("betterroofs.tileConfig.occlusionLinkIdHint")}</p>
</div>

<div class="form-group">
            <label>${game.i18n.localize("betterroofs.tileConfig.occlusionLinkSource")}</label>
            <div class="form-fields">
                <input type="checkbox" name="flags.betterroofs.occlusionLinkSource" ${occlusionLinkSource ? "checked" : ""}>
            </div>
        </div>
  `
  
  html.querySelector(`select[name="occlusion.mode"]`).closest(".form-group").insertAdjacentHTML("afterend", newHtml);
  app.setPosition({height: "auto"});
});
