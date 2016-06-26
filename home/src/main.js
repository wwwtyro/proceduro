"use strict";

var path = require('path');

function render() {
    var body = document.body;
    body.innerHTML = "";
    var count = Object.keys(proceduro.builtins).length;
    var width = '100%';
    var height = Math.max(window.innerHeight/count, 256);
    for (var key in proceduro.builtins) {
        let metadata = proceduro.builtins[key];
        var screenshot = path.join(metadata.path, 'metadata', metadata.screenshot);
        var style = `
            background-image: url("${screenshot}");
            width: ${width};
            height: ${height}px;
        `;
        body.innerHTML += `
            <div class='panel' style='${style}' onclick='proceduro.setApp("${key}")'>
                <div class='text'>
                    <h1>${metadata.title}</h1>
                    <p>${metadata.description}</p>
                </div>
            </div>
        `;
    }
    
}

window.addEventListener('resize', function() {
    render();
});

window.onload = function() {
    render();
}
