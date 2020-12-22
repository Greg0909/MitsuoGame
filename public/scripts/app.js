"use strict";

var xCubePosition = 50;
var yCubePosition = 0;
var lastWasLeft = true;
var xMouseCoordinates = 40;
var yMouseCoordinates = 40;
var pusheenHtml = void 0;
var coordinatesHtml = void 0;
var cepilloHtml = void 0;

document.onmousemove = onMouseMove;

document.addEventListener('keydown', function (event) {
    console.log("Pressed KeyCode:", event.keyCode);
    if (event.keyCode == 37) // Left Arrow
        {
            xCubePosition -= 2;
            console.log("Se presiono Izquierda");
            lastWasLeft = true;
        } else if (event.keyCode == 39) // Right Arrow
        {
            xCubePosition += 2;
            console.log("Se presiono Derecha");
            lastWasLeft = false;
        }

    if (event.keyCode == 40) // Down Arrow
        {
            yCubePosition += 2;
            console.log("Se presiono Abajo");
        } else if (event.keyCode == 38) // Up Arrow
        {
            yCubePosition -= 2;
            console.log("Se presiono Arriba");
        }

    updatePusheen();
});

function onMouseMove(event) {
    xMouseCoordinates = event.clientX;
    yMouseCoordinates = event.clientY;
    updateMouseCoordinates();
};

function updateMouseCoordinates() {
    coordinatesHtml = React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            "Coordinada x: ",
            xMouseCoordinates
        ),
        React.createElement(
            "p",
            null,
            "Coordinada y: ",
            yMouseCoordinates
        )
    );
    var cepilloStyle = {
        height: "auto",
        width: "6%",
        top: yMouseCoordinates,
        left: xMouseCoordinates,
        //transformOrigin:"center center",
        position: "absolute"
    };
    cepilloHtml = React.createElement("img", { src: "./Sprites/Cepillo.png", style: cepilloStyle });

    renderGame();
}

function updatePusheen() {
    var positionType = "relative";

    var style = {
        //backgroundColor: "red",
        width: "13%",
        height: "auto",
        position: positionType,
        left: xCubePosition + "%",
        top: yCubePosition + "%"
    };

    pusheenHtml = React.createElement("img", { style: style, src: lastWasLeft ? "./Sprites/Pusheen_the_Cat.png" : "./Sprites/Pusheen_the_Cat_2.png" });
    renderGame();
}

function renderGame() {
    var AllHtml = React.createElement(
        "div",
        { style: { height: "90%" } },
        coordinatesHtml,
        pusheenHtml,
        cepilloHtml
    );
    ReactDOM.render(AllHtml, document.getElementById("app"));
};

function updateAll() {
    updatePusheen();
    updateMouseCoordinates();
}

updateAll();
renderGame();
