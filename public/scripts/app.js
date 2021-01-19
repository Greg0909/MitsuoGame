function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    obj.style.width = obj.contentWindow.document.documentElement.scrollWidth + 'px';
}

function onWindowsResize(){
    let gameContainer = document.getElementById("gameContainer");
    let body = document.getElementById("body");
    
    // console.log("Body height:", body.offsetHeight, "   Container height:", gameContainer.offsetHeight);
    // console.log("Body width:", body.offsetWidth, "   Container width:", gameContainer.offsetWidth);

    let scale = Math.min( (body.offsetHeight/gameContainer.offsetHeight), (body.offsetWidth/gameContainer.offsetWidth) );
    gameContainer.style.transform = "scale(" + scale +")";

}

let iframeDisplay = document.getElementById("game");
let height = iframeDisplay.offsetHeight;

const resizerListener = setInterval( ()=> {
    
    iframeDisplay = document.getElementById("game");

    if(height != iframeDisplay.offsetHeight)
    {
        onWindowsResize();
    }
    else{
        clearInterval(resizerListener);
    }
    height = iframeDisplay.offsetHeight;

}, 100 );



// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// var firebaseConfig = {
//     apiKey: "AIzaSyB8fjITyb2NI_wFsiOUuXB6VmLb51xoP9g",
//     authDomain: "xmasgame-e2449.firebaseapp.com",
//     projectId: "xmasgame-e2449",
//     storageBucket: "xmasgame-e2449.appspot.com",
//     messagingSenderId: "825123495304",
//     appId: "1:825123495304:web:c92fd86e5482290cbbee3d",
//     measurementId: "G-NPEFLH0884"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();