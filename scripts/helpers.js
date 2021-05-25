function showTileThroughFog(tile) {
  tile.alpha = 1
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
  sprite.alpha = game.settings.get("betterroofs", "fogVisibility")
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

function getSightPoints(token, precision,overrideSight) {
  let points = [];
  let sceneSize = canvas.scene.dimensions.size;
  let sceneDist = canvas.scene.dimensions.distance;
  let origin = token.center;
  let radius = overrideSight ? (overrideSight * sceneSize) / sceneDist : (Math.max(token.data.brightSight,token.data.dimSight,token.data.brightLight, token.data.dimLight) * sceneSize) / sceneDist
  
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
    if (tile.roomPoly.contains(pt.x,pt.y)) {
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
  let polipoints = canvas.sight.sources.get(`Token.${token.id}`).los.points;
  sightPoli
    .beginFill(0xffffff)
    .drawRect(0, 0, canvas.dimensions.width, canvas.dimensions.height)
    .endFill();
  sightPoli.beginHole().drawPolygon(polipoints).endHole();
  sightPoli.isMask = true;
  return sightPoli;
}

function computeShowHideTile(tile, overrideHide, controlledToken, tolerance, brMode, overrideRange = false) {
  let pointSource = canvas.scene.data.globalLight ? canvas.sight.sources.get(`Token.${controlledToken.id}`).los.points : canvas.sight.sources.get(`Token.${controlledToken.id}`).fov.points;
  if (!tile.occluded &&
    !overrideHide &&
    checkIfInPoly(
      pointSource,
      tile,
      controlledToken,
      1
    )) {
    showTileThroughFog(tile);
  } else {
    if (brMode == 2 &&
      _betterRoofs.foregroundSightMaskContainers[tile.id]) {
      _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
      tile.mask = null;
    }
    hideTileThroughFog(tile);
  }
}

function computeHide(controlledToken, tile, tolerance, overrideHide) {
  if (checkIfInPoly(
    canvas.sight.sources.get(`Token.${controlledToken.id}`).los.points,
    tile,
    controlledToken,
    -1
  )) {
    tile.alpha = tile.data.occlusion.alpha;
    hideTileThroughFog(tile);
    overrideHide = true;
  } else {
    tile.alpha = 1;
  }
  return overrideHide;
}

function checkIfInPoly(points,tile,token,diff){
  for (let i = 0; i < points.length; i += 2) {
    let pt = bringPointCloser({ x: points[i], y: points[i + 1] },token.center,diff)
    if (tile.roomPoly.contains(pt.x,pt.y)) {
      return true;
    }
  }
  return false;
}

function computeMask(tile, controlledToken) {
  _betterRoofs.foregroundSightMaskContainers[tile.id].removeChildren();
  if (!tile.occluded) {
    if (!tile.mask)
      tile.mask = _betterRoofs.foregroundSightMaskContainers[tile.id];
    _betterRoofs.foregroundSightMaskContainers[tile.id].addChild(
      drawSightPoli(controlledToken)
    );
  } else {
    tile.mask = null;
  }
}

function getTileFlags(tile) {
  let overrideHide = false;
  let tolerance = parseInt(tile.document.getFlag("betterroofs", "brTolerance")) || 0;
  let brMode = tile.document.getFlag("betterroofs", "brMode");
  return { brMode, overrideHide, tolerance };
}

function roomDetection(tile){
  let buildingWalls = []
  let tileCorners = [
    {x: tile.x, y: tile.y}, //tl
    {x: tile.x+tile.width, y: tile.y}, //tr
    {x: tile.x, y: tile.y+tile.height}, //bl
    {x: tile.x+tile.width, y:tile.y+tile.height}, //br
  ]
  canvas.walls.placeables.forEach((wall) => {
    let wallPoints = [{x: wall.coords[0],y: wall.coords[1],collides:true},{x: wall.coords[2],y: wall.coords[3],collides:true}]
    wallPoints.forEach((point) => {
      tileCorners.forEach((c) => {
        if(checkPointInsideTile(point,tile) && !canvas.walls.checkCollision(new Ray(point,c))){
          point.collides = false
        }
      })      
    })  
    if(!wallPoints[0].collides && !wallPoints[1].collides) buildingWalls.push(wallPoints)
  })
  let orderedPoints = []
  if(buildingWalls.length == 0) return
  orderedPoints.push(buildingWalls[0][0])
  orderedPoints.push(buildingWalls[0][1])
  let currentCoord = buildingWalls[0][1]
  buildingWalls.splice(0,1)
  
  while(buildingWalls.length != 0){
    let nextWhile = false
    for(let wallpoints of buildingWalls){
      if(wallpoints[0].x == currentCoord.x && wallpoints[0].y == currentCoord.y){
        currentCoord = wallpoints[1]
        orderedPoints.push(wallpoints[1])
        buildingWalls.splice(buildingWalls.indexOf(wallpoints),1)
        nextWhile = true
        break
      }
      if(wallpoints[1].x == currentCoord.x && wallpoints[1].y == currentCoord.y){
        currentCoord = wallpoints[0]
        orderedPoints.push(wallpoints[0])
        buildingWalls.splice(buildingWalls.indexOf(wallpoints),1)
        nextWhile = true
        break
      }
    }
    if(nextWhile) continue
    let simplifiedArray = []
    for(let wallpoints of buildingWalls){
      simplifiedArray.push({x:wallpoints[0].x,y:wallpoints[0].y,i:buildingWalls.indexOf(wallpoints),ii:0})
      simplifiedArray.push({x:wallpoints[1].x,y:wallpoints[1].y,i:buildingWalls.indexOf(wallpoints),ii:1})
    }
    const reducer = (previousC, currentC) => {
      return getDist(currentC, currentCoord) < getDist(previousC, currentCoord) ? currentC : previousC;
    };
    let closestWall = simplifiedArray.reduce(reducer)
    if(closestWall.ii == 0){
      orderedPoints.push(buildingWalls[closestWall.i][0],buildingWalls[closestWall.i][1])
      currentCoord = buildingWalls[closestWall.i][1]
    }
    if(closestWall.ii == 1){
      orderedPoints.push(buildingWalls[closestWall.i][1],buildingWalls[closestWall.i][0])
      currentCoord = buildingWalls[closestWall.i][0]
    }
    buildingWalls.splice(closestWall.i,1)

  }
  return orderedPoints
}

function checkPointInsideTile(pt,tile,tol=0){
  if (
    pt.x > tile.x + tol &&
    pt.x < tile.x + tile.width - tol &&
    pt.y > tile.y + tol &&
    pt.y < tile.y + tile.height - tol
  ) {
    return true;
  }else{
    return false;
  }
}

function comparePointsBySlope( a, b ) {
  if ( a.slope < b.slope){
    return -1;
  }
  if ( a.slope > b.slope){
    return 1;
  }
  return 0;
}

function sortByDist( a, b ){
  if ( a.dist < b.dist){
    return -1;
  }
  if ( a.dist > b.dist){
    return 1;
  }
  return 0;
}

function getSlope(pt1,pt2){
  return Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
}

function getDist(pt1,pt2){
  return Math.sqrt(Math.pow(pt1.x-pt2.x,2)+Math.pow(pt1.y-pt2.y,2))
}

function getRoomPoly(tile,debug=false){
  let pts = roomDetection(tile)
  if(debug){
  let s = new PIXI.Graphics()
  let poly = new PIXI.Polygon(pts)
  s.lineStyle(2,0x00ff00).beginFill(0xff1100,0.7).drawPolygon(poly)
  s.name = "brDebugPoly"
  canvas.foreground.addChild(s)
  }
  return new PIXI.Polygon(pts)
}

function bringPointCloser(point,center,diff){
  let slope = getSlope(point,center)
  let newL = getDist(point,center)+diff
  let x = -newL*Math.cos(slope)+center.x
  let y = -newL*Math.sin(slope)+center.y
  return {x:x,y:y}
}