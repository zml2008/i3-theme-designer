"use strict";

// element declarations
var colorData = {};
var configOutputElement = document.getElementById("config-output-insert").firstElementChild;
var knobsElement = document.getElementById("knobs");


// color management functions
function updateConfig() {
    configOutputElement.innerHTML = "";
    for (var name of Object.keys(colorData)) {
        var data = colorData[name];
        configOutputElement.innerHTML += "set $" + name + " " + data.color + "</br>";
        data.update(data.color)
    }
}

// String String (hex color) (hex color) -> void
function registerColor(name, configKey, defaultValue, updateFunc) {
    colorData[configKey] = {color: defaultValue,
        name: name,
        update: updateFunc
    };
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
    
}

function forEachElWithClass(className, func) {
    for (var el of document.getElementsByClassName(className)) {
        func(el);
    }
}

// initialize color pickers
registerColor("Focused Window Foreground", "focused_fg", "#222222", 
        col => forEachElWithClass("focused", el => el.style.color = col));
registerColor("Focused Window Background", "focused_bg", "#eeeeee", 
        col => forEachElWithClass("focused", el => el.style.backgroundColor = col));
registerColor("Focused Inactive Window Foreground", "focused_inactive_fg", "#222222", 
        col => forEachElWithClass("focused-inactive", el => el.style.color = col));
registerColor("Focused Inactive Window Background", "focused_inactive_bg", "#dddddd", 
        col => forEachElWithClass("focused-inactive", el => el.style.backgroundColor = col));
registerColor("Unfocused Window Foreground", "unfocused_fg", "#999999", 
        col => forEachElWithClass("unfocused", el => el.style.color = col));
registerColor("Unfocused Window Background", "unfocused_bg", "#333333", 
        col => forEachElWithClass("unfocused", el => el.style.backgroundColor = col));
registerColor("Urgent Window Foreground", "urgent_fg", "#ffffff", 
        col => forEachElWithClass("urgent", el => el.style.color = col));
registerColor("Urgent Window Background", "urgent_bg", "#901010", 
        col => forEachElWithClass("urgent", el => el.style.backgroundColor = col));
registerColor("Bar Background", "bar_bg", "#111111", 
        col => document.getElementById("bar").style.backgroundColor = col);


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
