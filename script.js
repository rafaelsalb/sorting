let amt_bars;
let canvas;
let bars = [];
let idx = 1;
let bar_width = 0;
let bar_height = 0;
let run = false;
let iterations = 0;
let loops = 0;


function start() {
    canvas = createCanvas(Utils.elementWidth(parent_div), 600);
    canvas.parent("canvas");
    amt_bars = parseInt(document.getElementById("length").value);
    amt_bars = constrain(amt_bars, 1, 20000);
    bar_width = width / amt_bars;
    bar_height = height / amt_bars;
    bars = [];
    iterations = 0;
    loops = 0;
    idx = 0;

    for (let i = 1; i <= amt_bars; ++i) {
        bars.push(lerp(0, amt_bars, i / amt_bars));
    }

    let _case = document.getElementById("case").value;

    switch (_case) {
        case "random":
            bars = Utils.fisher_yates(bars);
            break;
        case "worst":
            bars = bars.reverse();
            break;
        case "best":
            break;
    }

    run = true;
    loop();
    // stop_timer();
    // start_timer();
    // document.getElementById("estimated-iterations").innerText = 2 + ((amt_bars) * (amt_bars - 1) / 2);
}

function setup() {
    parent_div = document.getElementById("canvas");
    frameRate(60);
    noStroke();
    console.log(Utils.elementWidth(parent_div));
    canvas = createCanvas(Utils.elementWidth(parent_div), 600);
    canvas.parent("canvas");
    noLoop();
}

function draw() {
    background(0);
    fill(255);

    if (run) {
        Utils.draw_bars(bars, height, bar_width, bar_height, (i) => { return ['#ff0000', i === idx] });
        [bars[idx - 1], bars[idx]] = swap_if_greater(bars[idx - 1], bars[idx]);
        // reached sorted portion
        if (idx === bars.length - 1 - loops) {
            next_pivot();
        }
        idx++;
        if (Utils.is_sorted(bars)) {
            noLoop();
            stop_timer();
            draw_finished();
        }
    }
}

function swap_if_greater(a, b) {
    return a > b ? [b, a] : [a, b];
}

function next_pivot() {
    idx = 0;
    loops++;
}

function draw_finished() {
    background(0);
    Utils.draw_bars(bars, height, bar_width, bar_height, (_) => { return ['#00ff00', true] });
}