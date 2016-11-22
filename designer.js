"use strict";

// element declarations
var colorData = {};
var configOutputElement = document.getElementById("config-output-insert");
var knobsElement = document.getElementById("knobs");
var varSetRe = /set \$([^ ]+) (#[0-9A-Fa-f]{6})/;
var suppressUpdates = false;


// color management functions
function updateConfig() {
    if (suppressUpdates) {
        return;
    }
    configOutputElement.value = "";
    for (var name of Object.keys(colorData)) {
        var data = colorData[name];
        configOutputElement.value += "set $" + name + " " + data.color + "\n";
        data.update(data.color)
    }
}

// String String (hex color) (hex color) -> void
function registerColor(name, configKey, defaultValue, updateFunc) {
    var inputEl = document.createElement("input");
    inputEl.id=configKey;
    inputEl.classList.add("color");
    inputEl.value = defaultValue;
    var labelEl = document.createElement("label");
    labelEl.htmlFor = inputEl.id;
    labelEl.innerHTML = name;
    var containerEl = document.createElement("div");
    containerEl.appendChild(labelEl);
    containerEl.appendChild(inputEl);
    knobsElement.appendChild(containerEl);

    colorData[configKey] = {color: defaultValue,
        name: name,
        update: updateFunc,
        element: inputEl
    };
}

function forEachElWithClass(className, func) {
    for (var el of document.getElementsByClassName(className)) {
        func(el);
    }
}

// Update color data from config paste
function parseColorData(configText) {
    suppressUpdates = true;
    try {
        configText.split("\n").forEach(line => {
            var reMatch = varSetRe.exec(line);
            if (reMatch !== null) {
                var param = reMatch[1];
                var color = reMatch[2];
                if (colorData[param]) {
                    var data = colorData[param];
                    data.color = color;
                    data.update(data.color);
                    data.element.value = data.color;
                }
            } else if (line != "") { // the last line is empty so never matches
                console.log("Line " + line + " was not a valid variable line!");
            }
        });
    } finally {
        suppressUpdates = false;
    }
}
configOutputElement.oninput = ev => parseColorData(ev.srcElement.value)




// initialize color pickers
registerColor("Focused Window Foreground", "focused_fg", "#ffffff", 
        col => forEachElWithClass("focused", el => el.style.color = col));
registerColor("Focused Window Background", "focused_bg", "#285577", 
        col => forEachElWithClass("focused", el => el.style.backgroundColor = col));
registerColor("Focused Inactive Window Foreground", "focused_inactive_fg", "#ffffff", 
        col => forEachElWithClass("focused-inactive", el => el.style.color = col));
registerColor("Focused Inactive Window Background", "focused_inactive_bg", "#5f676a", 
        col => forEachElWithClass("focused-inactive", el => el.style.backgroundColor = col));
registerColor("Unfocused Window Foreground", "unfocused_fg", "#888888", 
        col => forEachElWithClass("unfocused", el => el.style.color = col));
registerColor("Unfocused Window Background", "unfocused_bg", "#222222", 
        col => forEachElWithClass("unfocused", el => el.style.backgroundColor = col));
registerColor("Urgent Window Foreground", "urgent_fg", "#ffffff", 
        col => forEachElWithClass("urgent", el => el.style.color = col));
registerColor("Urgent Window Background", "urgent_bg", "#900000", 
        col => forEachElWithClass("urgent", el => el.style.backgroundColor = col));
registerColor("Bar Background", "bar_bg", "#000000", 
        col => document.getElementById("bar").style.backgroundColor = col);
registerColor("Bar Foreground", "bar_fg", "#FFFFFF", 
        col => document.getElementById("bar").style.color = col);


// color picker init
var colors = jsColorPicker('input.color', {
    customBG: '#222',
    readOnly: false,
    // patch: false,
    init: function(elm, colors) { // colors is a different instance (not connected to colorPicker)
        elm.style.backgroundColor = elm.value;
        elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd';
        colorData[elm.id].color = "#" + colors.HEX;
        updateConfig();
    },
    displayCallback: function(colors, mode, options) {
        var elm = options.input;
        colorData[elm.id].color = "#" + colors.HEX;
        updateConfig();
    }
});
