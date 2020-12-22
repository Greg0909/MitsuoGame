let xCubePosition = 50;
let yCubePosition = 0;
let lastWasLeft = true;
let xMouseCoordinates = 40;
let yMouseCoordinates = 40;
let pusheenHtml ;
let coordinatesHtml;
let cepilloHtml;

document.onmousemove = onMouseMove;

document.addEventListener('keydown', (event)=>{
    console.log("Pressed KeyCode:", event.keyCode);
    if(event.keyCode == 37) // Left Arrow
    {
        xCubePosition -= 2;
        console.log("Se presiono Izquierda");
        lastWasLeft=true;
    }
    else if(event.keyCode == 39) // Right Arrow
    {
        xCubePosition += 2;
        console.log("Se presiono Derecha");
        lastWasLeft=false;
    }
    
    if(event.keyCode == 40) // Down Arrow
    {
        yCubePosition += 2;
        console.log("Se presiono Abajo");
    }
    else if(event.keyCode == 38) // Up Arrow
    {
        yCubePosition -= 2;
        console.log("Se presiono Arriba");
    }

    updatePusheen();
})

function onMouseMove(event){
     xMouseCoordinates = event.clientX;
     yMouseCoordinates = event.clientY;
    updateMouseCoordinates()
};

function updateMouseCoordinates(){
    coordinatesHtml = (
        <div>
            <p>Coordinada x: {xMouseCoordinates}</p>
            <p>Coordinada y: {yMouseCoordinates}</p>
        </div>
    );
    const cepilloStyle={
        height:"auto",
        width:"6%",
        top:yMouseCoordinates,
        left:xMouseCoordinates,
        //transformOrigin:"center center",
        position:"absolute"
    };
    cepilloHtml = (
            <img src="./Sprites/Cepillo.png" style={cepilloStyle}></img>
    );

    renderGame();
}

function updatePusheen(){
    const positionType="relative"
     
    let style = {
        //backgroundColor: "red",
        width: "13%",
        height: "auto",
        position: positionType,
        left: xCubePosition+"%",
        top: yCubePosition+"%"
    };
    
    pusheenHtml = (
        <img style={style} src={lastWasLeft?"./Sprites/Pusheen_the_Cat.png":"./Sprites/Pusheen_the_Cat_2.png"}></img>
    );
    renderGame();
}

function renderGame(){
    const AllHtml = (
        <div style={{height:"90%"}}>
            {coordinatesHtml}
            {pusheenHtml}
            {cepilloHtml}
        </div>
    );
    ReactDOM.render(AllHtml, document.getElementById("app"));
};

function updateAll(){
    updatePusheen();
    updateMouseCoordinates();
}

updateAll();
renderGame();