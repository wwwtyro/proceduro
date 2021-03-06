"use strict";

const Scene = require("./src/space-2d.js");

proceduro.appendMenu(['File', 'Save as...'], function() {
    proceduro.dialog.showSaveDialog({
        defaultPath: 'space2d.png',
    }, function(path) {
        if (!path) {
            return;
        }
        proceduro.saveCanvasToPNG(path, document.getElementById('render-canvas'));
    })
});

window.onload = function() {

    var ControlsMenu = function() {
        this.seed = generateRandomSeed();
        this.randomize = function() {
            this.seed = "" + generateRandomSeed();
            render();
        };
        this.pointStars = true;
        this.stars = true;
        this.sun = true;
        this.nebulae = true;
        this.shortScale = false;
        this.width = 1024;
        this.height = 512;
        this.render = function() {
            render();
        };
    };

    var menu = new ControlsMenu();
    var gui = new dat.GUI({
        autoPlace: false,
        width: 320
    });
    gui.add(menu, 'seed').name("Seed").listen().onFinishChange(render);
    gui.add(menu, 'randomize').name("Randomize seed");
    gui.add(menu, 'pointStars').name("Point stars").onChange(render);
    gui.add(menu, 'stars').name("Stars").onChange(render);
    gui.add(menu, 'sun').name("Sun").onChange(render);
    gui.add(menu, 'nebulae').name("Nebulae").onChange(render);
    gui.add(menu, 'shortScale').name("Short scale").onChange(render);
    gui.add(menu, 'width').name("Width").onFinishChange(render);
    gui.add(menu, 'height').name("Height").onFinishChange(render);
    gui.add(menu, 'render').name("Render");
    document.body.appendChild(gui.domElement);
    gui.domElement.style.position = "fixed";
    gui.domElement.style.left = "16px";
    gui.domElement.style.top = "16px";

    var canvas = document.getElementById("render-canvas");

    var scene = new Scene(canvas);

    render();

    function reflow() {
        var ratio = canvas.width / canvas.height;
        var hspace = window.innerWidth - 368;
        var vspace = window.innerHeight - 32;
        var sratio = hspace/vspace;
        var cwidth = -1;
        var cheight = -1;
        var cleft = -1;
        if (ratio >= 1 && sratio < ratio) {
            cwidth = hspace;
            cheight = cwidth/ratio;
            cleft = 352;
        } else {
            cheight = vspace;
            cwidth = cheight * ratio;
            cleft = 352 + (hspace - cwidth) / 2.0;
        }
        canvas.style.width = Math.round(cwidth) + "px";
        canvas.style.height = Math.round(cheight) + "px";
        canvas.style.left = cleft + "px";
        canvas.style.display = "block";
    }

    function render() {
        canvas.width = menu.width;
        canvas.height = menu.height;
        reflow();
        scene.render({
            seed: menu.seed,
            pointStars: menu.pointStars,
            stars: menu.stars,
            sun: menu.sun,
            nebulae: menu.nebulae,
            shortScale: menu.shortScale
        });
    }

    window.onresize = reflow;
}

function generateRandomSeed() {
    return (Math.random() * 1000000000000000000).toString(36);
}
