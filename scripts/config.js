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

  game.settings.register("betterroofs", "occlusionRadius", {
    name: game.i18n.localize("betterroofs.settings.occlusionRadius.name"),
    hint: game.i18n.localize("betterroofs.settings.occlusionRadius.hint"),
    scope: "world",
    config: true,
    type: Number,
    default: 1,
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
  let tile = canvas.foreground.get(app.object.id);
  if (
    game.settings.get("betterroofs", "roomPreview") &&
    game.user.isGM &&
    canvas.foreground.children.filter((c) => c.tileId == app.object.id)
      .length == 0
  ) {
    if (tile) _betterRoofsHelpers.getRoomPoly(tile, true);
  }
  let brMode = app.object.getFlag("betterroofs", "brMode") || 0;

  let manualPoly = app.object.getFlag("betterroofs", "manualPoly") || "";

  let occlusionLinkSource = app.object.getFlag("betterroofs", "occlusionLinkSource") || false;

  let occlusionLinkId = app.object.getFlag("betterroofs", "occlusionLinkId") || "";

  let newHtml = `
<div class="form-group">
          <label>${game.i18n.localize(
            "betterroofs.tileConfig.brMode.name"
          )}</label>
          <div class="form-fields">
              <select name="flags.betterroofs.brMode" data-dtype="Number">
              <option value="0">${game.i18n.localize(
                "betterroofs.tileConfig.brMode.option0"
              )}</option><option value="1">${game.i18n.localize(
    "betterroofs.tileConfig.brMode.option1"
  )}</option><option value="2">${game.i18n.localize(
    "betterroofs.tileConfig.brMode.option2"
  )}</option><option value="3">${game.i18n.localize(
    "betterroofs.tileConfig.brMode.option3"
  )}</option>
              </select>
          </div>
      </div>
      `;

  const occlusionLink = `
  <div class="form-group">
  <label for="occlusionLinkId">${game.i18n.localize("betterroofs.tileConfig.occlusionLinkId")}</label>
  <div class="form-fields">
      <input type="text" name="flags.betterroofs.occlusionLinkId" value="${occlusionLinkId}">
  </div>
</div>

<div class="form-group">
            <label>${game.i18n.localize("betterroofs.tileConfig.occlusionLinkSource")}</label>
            <div class="form-fields">
                <input type="checkbox" name="flags.betterroofs.occlusionLinkSource" ${occlusionLinkSource ? "checked" : ""}>
            </div>
        </div>
  `

  if (game.settings.get("betterroofs", "roomPreview"))
    newHtml += `     <hr>
  <div class="form-group">
  <label for="manualPoly">${game.i18n.localize(
    "betterroofs.tileConfig.manualPoly.name"
  )}</label>
  <div class="form-fields">
      <input type="text" name="flags.betterroofs.manualPoly" value="${manualPoly}">
  </div>
</div>

      <div id="levels-elevator">
<div class="button">
  <button id="definePoly" class="definePoly">${game.i18n.localize(
    "betterroofs.tileConfig.definePoly.name"
  )}</button>
</div>
<div class="button">
  <button id="clearPoly" class="clearPoly">${game.i18n.localize(
    "betterroofs.tileConfig.clearPoly.name"
  )}</button>
</div>
<hr></div>`;

  const overh = html.find('input[name="overhead"]');
  const formGroup = overh.closest(".form-group");
  html.find(`select[name="occlusion.mode"]`).closest(".form-group").after(occlusionLink);
  formGroup.after(newHtml);
  html.find("select[name ='flags.betterroofs.brMode']")[0].value = brMode;
  if (game.settings.get("betterroofs", "roomPreview")) {
    $($(html).find("button[id='definePoly']")[0]).on("click", define);
    $($(html).find("button[id='clearPoly']")[0]).on("click", clear);
  }
  async function define(event) {
    event.preventDefault();
    if (canvas.walls._active) {
      let wallids = "";
      for (let wall of canvas.walls.controlled) {
        await wall.document.setFlag("betterroofs", "externalWall", true);
        wallids += `${wall.id},`;
      }
      html.find("input[name ='flags.betterroofs.manualPoly']")[0].value =
        wallids;
    } else {
      canvas.walls.activate();
      ui.notifications.notify(
        game.i18n.localize("betterroofs.tileConfig.definePoly.notify")
      );
    }
  }
  async function clear(event) {
    event.preventDefault();
    let wallstoclear = html.find(
      "input[name ='flags.betterroofs.manualPoly']"
    )[0].value;
    if (wallstoclear && wallstoclear != "") {
      let idArray = wallstoclear.split(",");
      for (let id of idArray) {
        let wallForId = canvas.walls.get(id);
        if (wallForId)
          await wallForId.document.setFlag(
            "betterroofs",
            "externalWall",
            false
          );
      }

      manualWalls.forEach((wall) => {
        let wallPoints = [
          { x: wall.coords[0], y: wall.coords[1], collides: true },
          { x: wall.coords[2], y: wall.coords[3], collides: true },
        ];
        buildingWalls.push(wallPoints);
      });
    }
    html.find("input[name ='flags.betterroofs.manualPoly']")[0].value = "";
  }
  //html.find($('button[name="submit"]')).click(app.object,_betterRoofsHelpers.saveTileConfig)
});

Hooks.on("renderWallConfig", (app, html, data) => {
  if (game.settings.get("betterroofs", "roomPreview")) {
    let externalWall = app.object.getFlag("betterroofs", "externalWall");
    let checkedbox = externalWall ? ` checked=""` : "";
    let newHtml = `<div class="form-group">
  <label>${game.i18n.localize(
    "betterroofs.wallConfig.externalWall.name"
  )}</label>
  <div class="form-fields">
      <input type="checkbox" name="flags.betterroofs.externalWall"${checkedbox}>
  </div>
</div>`;

    const overh = html.find('select[name="ds"]');
    const formGroup = overh.closest(".form-group");
    formGroup.after(newHtml);
    app.setPosition({ height: "auto" });
  }
});

/***********************************************
 * REMOVE DEBUG POLYGONS FROM FOREGROUND LAYER *
 ***********************************************/

Hooks.on("closeTileConfig", (app, html, data) => {
  for (let c of canvas.foreground.children) {
    if (c.tileId == app.object.id && app.object.id) c.destroy();
  }
});

/****************************************************
 * INJECT CUSTOM BUTTONS TO THE SCENE WALL CONTROLS *
 ****************************************************/

Hooks.on("getSceneControlButtons", (controls, b, c) => {
  if (game.user.isGM) {
    controls
      .find((t) => t["name"] == "walls")
      .tools.push({
        icon: "fas fa-border-style",
        name: "walledges",
        title: game.i18n.localize("betterroofs.scenecontrols.walledges"),
        onClick: async () => {
          if (
            await _betterRoofsHelpers.yesNoPrompt(
              game.i18n.localize("betterroofs.yesnodialog.title"),
              game.i18n.localize("betterroofs.yesnodialog.desc")
            )
          )
            _betterRoofsHelpers.buildEdgeWalls();
        },
      });
  }
});
