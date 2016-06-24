"use strict";

var path = require('path');

window.onload = function() {
    var container = document.getElementById('container');
    var index = 0;
    for (var key in proceduro.builtins) {
        let metadata = proceduro.builtins[key];
        var screenshot = path.join(metadata.path, 'metadata', metadata.screenshot);
        if (index % 2 === 0) {
            container.innerHTML += `<div class='row top32'>`;
        }
        container.innerHTML += `
            <div class='col-md-3'>
                <img src="${screenshot}" class="img-responsive" alt="${metadata.title}" onclick='proceduro.setApp("${key}")'>
            </div>
            <div class='col-md-3'>
                <h2>${metadata.title}</h2>
                <p>${metadata.description}</p>
            </div>
        `;
        if (index % 2 === 0) {
            container.innerHTML += `</div>`;
        }
        index++;
    }
}

