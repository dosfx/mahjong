const SUIT_BALLS = 0;
const SUIT_BAMBOO = 1;
const SUIT_WANS = 2;
const SUIT_EXTRA = 3;

const TILE_HEIGHT = 70;
const TILE_WIDTH = 50;
const TILE_PADDING = 4;

// random int to compare against
const OFFSET = 12345567890;

Vue.prototype.$board = [];
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
                // fill in the board
                this.$board[t.x] = this.$board[t.x] || []
                this.$board[t.x][t.y] = this.$board[t.x][t.y] || []
                this.$board[t.x][t.y][t.z] = t;
            });

            // change the tiles binding to redraw
            this.tiles = shuffle;
        },

        select: function(tile) {
            tile.selected = !tile.selected;
        }
    }
})