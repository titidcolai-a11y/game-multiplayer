import * as THREE from "https://unpkg.com/three@0.180.0/build/three.module.js";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import { joystick } from "./joystick.js";

const socket = io();


// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);


// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);


// CAHAYA
const light = new THREE.DirectionalLight(0xffffff, 2);
light.castShadow = true;

light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;

light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;

light.shadow.camera.near = 1;
light.shadow.camera.far = 100;
light.position.set(5,10,5);
scene.add(light);
scene.add(light.target);

const ambient = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambient);


// TANAH
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(5000,5000),
    new THREE.MeshStandardMaterial({
        color:0x228B22
    })
);

ground.rotation.x = -Math.PI/2;
scene.add(ground);
ground.receiveShadow = true;
// Rumput 3D
function createGrass(x, z) {

    const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(0.15, 0.45),
        new THREE.MeshStandardMaterial({
            color: 0x3cb043,
            side: THREE.DoubleSide
        })
    );

    grass.position.set(x, 0.22, z);

    grass.rotation.y = Math.random() * Math.PI;

    scene.add(grass);
}

// Sebar rumput
for (let i = 0; i < 3000; i++) {

    createGrass(
        (Math.random() - 0.5) * 180,
        (Math.random() - 0.5) * 180
    );

}
// POHON
function createTree(x, z){

    const tree = new THREE.Group();

    // Tinggi batang acak
    const trunkHeight = 3 + Math.random() * 4;

    const trunk = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, trunkHeight, 0.8),
        new THREE.MeshStandardMaterial({
            color: 0x6b4f2a
        })
    );

    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // Daun acak
    const leafSize = 2 + Math.random() * 2;

    const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x228B22
});

const leafPos = [
    [0, 0, 0],
    [1, 0, 0],
    [-1, 0, 0],
    [0, 0, 1],
    [0, 0, -1],
    [0, 1, 0],
    [0, -1, 0]
];

leafPos.forEach(p => {

    const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(2,2,2),
        leafMaterial
    );

    leaf.position.set(
        p[0],
        trunkHeight + 2 + p[1],
        p[2]
    );

    leaf.castShadow = true;
    leaf.receiveShadow = true;

    tree.add(leaf);

});

    tree.position.set(x,0,z);

console.log("POHON DIBUAT", x, z);

    tree.scale.set(5,5,5);
scene.add(tree);

}

// Sebar pohon
for(let i = 0; i < 10; i++){

    createTree(
        (Math.random() - 0.5) * 450,
        (Math.random() - 0.5) * 450
    );

}

createTree(5,5);

// PLAYER SENDIRI (Mirip Steve)

const player = new THREE.Group();


// Kepala
const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.8,0.8,0.8),
    new THREE.MeshStandardMaterial({
        color:0xffd8b1
    })
);

head.position.y = 2.4;
player.add(head);

// Mata kiri
const eyeLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.08,0.08,0.02),
    new THREE.MeshStandardMaterial({ color:0x000000 })
);
eyeLeft.position.set(-0.15,2.45,0.41);
player.add(eyeLeft);

// Mata kanan
const eyeRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.08,0.08,0.02),
    new THREE.MeshStandardMaterial({ color:0x000000 })
);
eyeRight.position.set(0.15,2.45,0.41);
player.add(eyeRight);

// Hidung
const nose = new THREE.Mesh(
    new THREE.BoxGeometry(0.05,0.08,0.03),
    new THREE.MeshStandardMaterial({ color:0xf2c19b })
);
nose.position.set(0,2.32,0.42);
player.add(nose);

// Mulut
const mouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.18,0.03,0.02),
    new THREE.MeshStandardMaterial({ color:0x552222 })
);
mouth.position.set(0,2.15,0.41);
player.add(mouth);

// Rambut
const hair = new THREE.Mesh(
    new THREE.BoxGeometry(0.88,0.24,0.88),
    new THREE.MeshStandardMaterial({
        color:0x3b2a1a
    })
);

hair.position.y = 2.72;
player.add(hair);


// Badan
const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.9,1.2,0.5),
    new THREE.MeshStandardMaterial({
        color:0x3b7cff
    })
);

body.position.y = 1.45;
player.add(body);


// Tangan kiri
const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.28,1.1,0.28),
    new THREE.MeshStandardMaterial({
        color:0xffd8b1
    })
);

leftArm.position.set(-0.6,1.45,0);
player.add(leftArm);


// Tangan kanan
const rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.28,1.1,0.28),
    new THREE.MeshStandardMaterial({
        color:0xffd8b1
    })
);

rightArm.position.set(0.6,1.45,0);
player.add(rightArm);


// Kaki kiri
const leftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.32,1.15,0.32),
    new THREE.MeshStandardMaterial({
        color:0x1b2cff
    })
);

leftLeg.position.set(-0.2,0.45,0);
player.add(leftLeg);


// Kaki kanan
const rightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.32,1.15,0.32),
    new THREE.MeshStandardMaterial({
        color:0x1b2cff
    })
);

rightLeg.position.set(0.2,0.45,0);
player.add(rightLeg);


player.position.set(0,0,0);

scene.add(player);

player.traverse((obj) => {
    if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
    }
});

// PLAYER LAIN
const players = {};

function createPlayer(id,pos){

    const other = new THREE.Mesh(
        new THREE.BoxGeometry(1,2,1),
        new THREE.MeshStandardMaterial({
            color:0x0000ff
        })
    );

    other.position.set(
        pos.x,
        pos.y,
        pos.z
    );

    scene.add(other);

    players[id] = other;
}


// TERIMA PLAYER
socket.on("currentPlayers",(data)=>{

    for(let id in data){

        if(id !== socket.id){

            createPlayer(id,data[id]);

        }

    }

});


// PLAYER BARU MASUK
socket.on("newPlayer",(data)=>{

    createPlayer(
        data.id,
        data.position
    );

});


// GERAK PLAYER LAIN
socket.on("playerMove",(data)=>{

    if(players[data.id]){

        players[data.id].position.set(
            data.position.x,
            data.position.y,
            data.position.z
        );

    }

});


// PLAYER KELUAR
socket.on("playerRemove",(id)=>{

    if(players[id]){

        scene.remove(players[id]);
        delete players[id];

    }

});


// GERAK
let speed = 0.05;
let camAngle = 0;
let camDistance = 8;

let rotateCamera = false;
let lastTouchX = 0;

let velocityY = 0;
let gravity = -0.015;
let jumpPower = 0.25;
let onGround = true;


// LOOP GAME
function animate(){

    requestAnimationFrame(animate);


    // JOYSTICK
player.position.x -= joystick.x * speed;
player.position.z -= joystick.y * speed;
light.position.set(
    player.position.x + 5,
    10,
    player.position.z + 5
);

light.target.position.set(
    player.position.x,
    0,
    player.position.z
);

// Animasi jalan
const moving =
    Math.abs(joystick.x) > 0.05 ||
    Math.abs(joystick.y) > 0.05;

if (moving) {

    const walk = Math.sin(Date.now() * 0.01) * 0.7;

    leftArm.rotation.x = walk;
    rightArm.rotation.x = -walk;

    leftLeg.rotation.x = -walk;
    rightLeg.rotation.x = walk;

    head.rotation.y = Math.sin(Date.now() * 0.003) * 0.08;

} else {

    leftArm.rotation.x = 0;
    rightArm.rotation.x = 0;

    leftLeg.rotation.x = 0;
    rightLeg.rotation.x = 0;

    head.rotation.y = 0;

}

// Mata berkedip
const blink = Math.sin(Date.now() * 0.004);

if (blink > 0.98) {
    eyeLeft.scale.y = 0.1;
    eyeRight.scale.y = 0.1;
} else {
    eyeLeft.scale.y = 1;
    eyeRight.scale.y = 1;
}

// Gravitasi
velocityY += gravity;
player.position.y += velocityY;

if (player.position.y <= 1) {
    player.position.y = 0;
    velocityY = 0;
    onGround = true;
}

    // KIRIM POSISI
    socket.emit("move",{

        x: player.position.x,
        y: player.position.y,
        z: player.position.z

    });


    // KAMERA
camera.position.x =
player.position.x + Math.sin(camAngle) * camDistance;

camera.position.z =
player.position.z + Math.cos(camAngle) * camDistance;

camera.position.y = 5;
ground.position.x = player.position.x;
ground.position.z = player.position.z;
camera.lookAt(
    player.position.x,
    player.position.y + 1.5,
    player.position.z
);

    renderer.render(
        scene,
        camera
    );

}


animate();

window.addEventListener("touchstart", () => {

    if (onGround) {
        velocityY = jumpPower;
        onGround = false;
    }

});

window.addEventListener("touchstart", (e) => {

    if (e.touches.length >= 1) {

    const touch = e.touches[e.touches.length - 1];

    if (touch.clientX > window.innerWidth / 2) {

        rotateCamera = true;
        lastTouchX = touch.clientX;

    }

}

});


window.addEventListener("touchmove", (e) => {

    if (rotateCamera) {

    const touch = e.touches[e.touches.length - 1];

    const dx = touch.clientX - lastTouchX;

    camAngle -= dx * 0.01;

    lastTouchX = touch.clientX;

}

});


window.addEventListener("touchend", () => {

    rotateCamera = false;

});

// RESIZE
window.addEventListener("resize",()=>{

    camera.aspect =
    window.innerWidth /
    window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
