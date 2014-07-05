
function scene(mapname, canvasName) {
  var c = canvasName;
  var renderMap = {
    layers: [],
    renderLayer: function(layer) {
      // data: [array of tiles, 1-based, position of sprite from top-left]
      // height: integer, height in number of sprites
      // name: "string", internal name of layer
      // opacity: integer
      // type: "string", layer type (tile, object)
      // visible: boolean
      // width: integer, width in number of sprites
      // x: integer, starting x position
      // y: integer, starting y position
      if (layer.type !== "tilelayer" || !layer.opacity) { return; }
      var s = c.canvas.cloneNode(),
          size = renderMap.data.tilewidth;
      s = s.getContext("2d");
      if (renderMap.layers.length < renderMap.data.layers.length) {
        layer.data.forEach(function(tile_idx, i) {
          if (!tile_idx) { return; }
          var img_x, img_y, s_x, s_y,
              tile = renderMap.data.tilesets[0];
          tile_idx--;
          img_x = (tile_idx % (tile.imagewidth / size)) * size;
          img_y = ~~(tile_idx / (tile.imagewidth / size)) * size;
          s_x = (i % layer.width) * size;
          s_y = ~~(i / layer.width) * size;
          s.drawImage(renderMap.tileset, img_x, img_y, size, size,
                      s_x, s_y, size, size);
        });
        renderMap.layers.push(s.canvas.toDataURL());
        c.drawImage(s.canvas, 0, 0);
      }
      else {
        renderMap.layers.forEach(function(src) {
          var i = $("<img />", { src: src })[0];
          c.drawImage(i, 0, 0);
        });
      }
    },
    renderLayers: function(layers) {
      layers = $.isArray(layers) ? layers : this.data.layers;
      layers.forEach(this.renderLayer);
    },
    loadTileset: function(json) {
      this.data = json;
      this.tileset = $("<img />", { src: json.tilesets[0].image })[0];
      this.tileset.onload = $.proxy(this.renderLayers, this);
    },
    load: function(name) {
      return this.loadTileset(name);
    }
  }
  renderMap.load(mapname);
}
scene(map, $("canvas")[0].getContext("2d"));
scene(mapForground, $("canvas")[2].getContext("2d"));
