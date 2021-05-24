function showTileThroughFog(tile) {
  let oldSprite = _betterRoofs.fogRoofContainer.children.find(
    (c) => c.name == tile.id
  );
  let tileImg = tile.children[0];
  if (!tileImg || oldSprite || !tileImg.texture.baseTexture) return;
  let sprite = new PIXI.Sprite.from(tileImg.texture);
  sprite.tint = 0xffffff;
  sprite.isSprite = true;
  sprite.width = tile.data.width;
  sprite.height = tile.data.height;
  sprite.position = tile.position;
  sprite.position.x += tileImg.x;
  sprite.position.y += tileImg.y;
  sprite.anchor = tileImg.anchor;
  sprite.angle = tileImg.angle;
  sprite.blendMode = 26;
  sprite.name = tile.id;
  _betterRoofs.fogRoofContainer.spriteIndex[tile.id] = sprite;
  _betterRoofs.fogRoofContainer.addChild(sprite);
}

function hideTileThroughFog(tile) {
  let sprite = _betterRoofs.fogRoofContainer.children.find(
    (c) => c.name == tile.id
  );
  if (sprite) _betterRoofs.fogRoofContainer.removeChild(sprite);
}

function getSightPoints(token, precision) {
  let points = [];
  let sceneSize = canvas.scene.dimensions.size;
  let sceneDist = canvas.scene.dimensions.distance;
  let origin = token.center;
  let radius =
    token.data.dimSight < token.data.brightSight
      ? (token.data.brightSight * sceneSize) / sceneDist
      : (token.data.dimSight * sceneSize) / sceneDist;
  for (let r = 0; r <= radius; r += radius / precision) {
    for (
      let radTick = 0;
      radTick < Math.PI * 2;
      radTick += Math.PI / precision
    ) {
        let point = {
            x: Math.cos(radTick) * r + origin.x,
            y: Math.sin(radTick) * r + origin.y,
          }
      points.push(point);
    }
  }

  return points;
}

function checkIfInSight(points, tile, tol = 0) {
  for (let pt of points) {
    if (
      pt.x > tile.x + tol &&
      pt.x < tile.x + tile.width - tol &&
      pt.y > tile.y + tol &&
      pt.y < tile.y + tile.height - tol
    ) {
      return true;
    }
  }
  return false;
}

function checkIfInSightPointArray(points, tile, tol = 0) {
  for (let i = 0; i < points.length; i += 2) {
    let pt = { x: points[i], y: points[i + 1] };
    if (
      pt.x > tile.x + tol &&
      pt.x < tile.x + tile.width - tol &&
      pt.y > tile.y + tol &&
      pt.y < tile.y + tile.height - tol
    ) {
      return true;
    }
  }
  return false;
}

function drawSightPoli(token) {
  let sightPoli = new PIXI.Graphics();
  let polipoints = canvas.sight.sources.get(`Token.${token.id}`).fov.points;
  sightPoli
    .beginFill(0xffffff)
    .drawRect(0, 0, canvas.dimensions.width, canvas.dimensions.height)
    .endFill();
  sightPoli.beginHole().drawPolygon(polipoints).endHole();
  sightPoli.isMask = true;
  return sightPoli;
}
