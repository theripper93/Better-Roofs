let _betterRoofs;

Hooks.on("canvasReady", () => {
  _betterRoofs = betterRoofs.get();
  _betterRoofs.initializeRoofs();
  _betterRoofs.initializePIXIcontainers();
});

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
})

Hooks.on("renderTileConfig", (app, html, data) => {

    let brMode = app.object.getFlag(
      "betterroofs",
      "brMode"
    ) || 0;

    let brTolerance = app.object.getFlag(
      "betterroofs",
      "brTolerance"
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

      <div class="form-group">
      <label>${game.i18n.localize("betterroofs.tileConfig.brTolerance.name")} <span class="units">(Pixels)</span></label>
      <div class="form-fields">
          <input type="number" name="br.tolerance" value="${brTolerance}" step="1">
      </div>
  </div>

`;
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
  await event.data.setFlag(
    "betterroofs",
    "brTolerance",
    html.querySelectorAll("input[name ='br.tolerance']")[0].value
  );
  _betterRoofs.initializeRoofs()
  _betterRoofs.initializePIXIcontainers()
}