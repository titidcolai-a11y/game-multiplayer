export const joystick = {
    x: 0,
    y: 0
};

const area = document.createElement("div");

area.style.position = "fixed";
area.style.left = "30px";
area.style.bottom = "30px";
area.style.width = "180px";
area.style.height = "120px";
area.style.borderRadius = "50%";
area.style.background = "rgba(255,255,255,0.2)";
area.style.touchAction = "none";

document.body.appendChild(area);


let startX = 0;
let startY = 0;


area.addEventListener("touchstart",(e)=>{

    const touch = e.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;

});


area.addEventListener("touchmove",(e)=>{

    const touch = e.touches[0];

    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;


    joystick.x = dx / 50;
    joystick.y = dy / 50;


    if(joystick.x > 1) joystick.x = 1;
    if(joystick.x < -1) joystick.x = -1;

    if(joystick.y > 1) joystick.y = 1;
    if(joystick.y < -1) joystick.y = -1;

});


area.addEventListener("touchend",()=>{

    joystick.x = 0;
    joystick.y = 0;

});
