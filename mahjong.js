const SUIT_BALLS = 0;
const SUIT_BAMBOO = 1;
const SUIT_WANS = 2;
const SUIT_EXTRA = 3;

const TILE_HEIGHT = 70;
const TILE_WIDTH = 50;
const TILE_PADDING = 4;

// random int to compare against
const OFFSET = 12345567890;

Vue.prototype.$firstTile = null;
Vue.prototype.$layouts = {
    classic: function () {
        return Array.prototype.concat(
            // bottom layer, row by row
            Array.from({ length: 12 }, function (_v, i) { return [i + 1, 0, 0]; }),
            Array.from({ length: 8 }, function (_v, i) { return [i + 3, 1, 0]; }),
            Array.from({ length: 10 }, function (_v, i) { return [i + 2, 2, 0]; }),
            [[0, 3.5, 0]],
            Array.from({ length: 12 }, function (_v, i) { return [i + 1, 3, 0]; }),
            Array.from({ length: 12 }, function (_v, i) { return [i + 1, 4, 0]; }),
            [[13, 3.5, 0], [14, 3.5, 0]],
            Array.from({ length: 10 }, function (_v, i) { return [i + 2, 5, 0]; }),
            Array.from({ length: 8 }, function (_v, i) { return [i + 3, 6, 0]; }),
            Array.from({ length: 12 }, function (_v, i) { return [i + 1, 7, 0]; }),
            // second layer square
            Array.from({ length: 36 }, function (_v, i) { return [(i % 6) + 4, Math.floor(i / 6) + 1, 1]; }),
            // third layer square
            Array.from({ length: 16 }, function (_v, i) { return [(i % 4) + 5, Math.floor(i / 4) + 2, 2]; }),
            // forth layer square
            Array.from({ length: 4 }, function (_v, i) { return [(i % 2) + 6, Math.floor(i / 2) + 3, 3]; }),
            [[6.5, 3.5, 4]]
        );
    },
    flat: function () {
        return Array.from({ length: 144 }, function (_v, i) { return [i % 16, Math.floor(i / 16), 0]; });
    }
};

var mahjong = new Vue({
    el: "#mahjong",
    data: {
        tiles: []
    },
    mounted: function () {
        this.deal();
    },
    methods: {
        deal: function () {
            // make a list of shuffled tiles
            let shuffle = []
            for (let suit = 0; suit < 4; suit++) {
                for (let num = 0; num < 9; num++) {
                    for (let i = 0; i < 4; i++) {
                        let rand = Math.floor(Math.random() * shuffle.length)
                        shuffle.push(shuffle[rand]);
                        shuffle[rand] = {
                            suit: suit,
                            num: num
                        };
                    }
                }
            }

            // get the layout
            let layout = this.$layouts.classic();
            // fill the board
            shuffle.forEach(function (t, i) {
                t.x = layout[i][0];
                t.y = layout[i][1];
                t.z = layout[i][2];

                t.selected = false;
                t.style = {
                    backgroundPosition: (t.num * -TILE_WIDTH) + "px " + (t.suit * -TILE_HEIGHT) + "px",
                    left: ((t.x * (TILE_WIDTH + TILE_PADDING)) + TILE_PADDING - (t.z * 3)) + "px",
                    top: ((t.y * (TILE_HEIGHT + TILE_PADDING)) + TILE_PADDING - (t.z * 6)) + "px",
                    zIndex: t.z
                }
            });

            // change the tiles binding to redraw
            this.tiles = shuffle;
        },

        select: function (tile) {
            if (tile === this.$firstTile) {
                this.$firstTile = null;
                tile.selected = false;
            } else if (this.tileOpen(tile)) {
                if (this.$firstTile) {
                    if (this.$firstTile.suit === tile.suit && this.$firstTile.num === tile.num) {
                        this.tiles.splice(this.tiles.indexOf(tile), 1);
                        this.tiles.splice(this.tiles.indexOf(this.$firstTile), 1);
                        this.$firstTile = null;
                    }
                } else {
                    this.$firstTile = tile;
                    tile.selected = true;
                }
            }
        },

        tileOpen: function (tile) {
            let above = 0;
            let left = 0;
            let right = 0;
            this.tiles.forEach(function (t) {
                // overlap in y
                if (tile.y - 1 < t.y && t.y < tile.y + 1) {
                    // in same z plane
                    if (t.z === tile.z) {
                        if (t.x === tile.x - 1) {
                            left++;
                        } else if (t.x === tile.x + 1) {
                            right++;
                        }
                    } else if (t.z === tile.z + 1) { // above
                        if (tile.x - 1 < t.x && t.x < tile.x + 1) {
                            above++;
                        }
                    }
                }
            });

            return above === 0 && (left === 0 || right === 0);
        }
    }
});