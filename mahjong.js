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
var mahjong = new Vue({
    el: "#mahjong",
    data: {
        tiles: []
    },
    mounted: function() {
        this.deal();
    },
    methods: {
        deal: function() {
            // make a list of shuffled tiles
            let shuffle = []
            for (let suit = 0; suit < 4; suit++) {
                for (let num = 0; num < 9; num ++) {
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

            // fill the board
            shuffle.forEach((t, i) => {
                t.selected = false;
                t.x = i % 16;
                t.y = Math.floor(i / 16);
                t.z = 0;
                t.style = {
                    backgroundPosition: (t.num * -TILE_WIDTH) + "px " + (t.suit * -TILE_HEIGHT) + "px",
                    left: ((t.x * (TILE_WIDTH + TILE_PADDING)) + TILE_PADDING) + "px",
                    top: ((t.y * (TILE_HEIGHT + TILE_PADDING)) + TILE_PADDING) + "px"
                }
            });

            // change the tiles binding to redraw
            this.tiles = shuffle;
        },

        select: function(tile) {
            if (tile === this.$firstTile) {
                this.$firstTile = null;
                tile.selected = false;
            } else if (this.tiles.filter(t => 
                (t.x === tile.x - 1 && t.y === tile.y) ||
                (t.x === tile.x + 1 && t.y === tile.y)).length !== 2) {
                
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
        }
    }
})