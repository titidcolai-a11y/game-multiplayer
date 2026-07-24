const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    console.log("Player masuk:", socket.id);

    players[socket.id] = {
        x: 0,
        y: 1,
        z: 0
    };

    socket.emit("currentPlayers", players);

    socket.broadcast.emit("newPlayer", {
        id: socket.id,
        position: players[socket.id]
    });


    socket.on("move", (position) => {

        players[socket.id] = position;

        socket.broadcast.emit("playerMove", {
            id: socket.id,
            position: position
        });

    });


    socket.on("disconnect", () => {

        delete players[socket.id];

        io.emit("playerRemove", socket.id);

        console.log("Player keluar:", socket.id);
    });

});


server.listen(8080, () => {
    console.log("Server multiplayer aktif :8080");
});
