import PlayerModel from './PlayerModel';

// in charge of managing game state for player's game
export default class GameManager {
  constructor(io) {
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.playerLocations = [[50, 50], [100, 100]];
    this.chestLocations = {};
    this.monsterLocations = {};
  }

  setup() {
    this.parseMapData();
    this.setupEventListeners();
    this.setupSpawners();
  }

  parseMapData() {}

  setupEventListeners() {
    console.log('are we making it here?1');
    this.io.on('connection', (socket) => {
      // when a player connects
      console.log('player connected to our game');
      console.log(socket.id);
      socket.on('disconnect', (reason) => {
        // delete userdata from server
        delete this.players[socket.id];
        // emit message to remove this player
        this.io.emit('playerDisconnect', socket.id);
        // when a player disconnects
        console.log(`player disconnected from game because: ${reason}`);
        console.log(socket.id);
      });

      socket.on('newPlayer', () => {
        this.spawnPlayer(socket.id);

        // send players to new player
        socket.emit('currentPlayers', this.players);
        // send monsters to new player
        socket.emit('currentMonsters', this.monsters);
        // send chests to new player
        socket.emit('currentChests', this.chests);
        // send new player to all players
        socket.broadcast.emit('spawnPlayer', this.players[socket.id]);

        socket.on('playerMovement', (playerData) => {
          if (this.players[socket.id]) {
            this.players[socket.id].x = playerData.x;
            this.players[socket.id].y = playerData.y;
            this.players[socket.id].flipX = playerData.flipX;

            // emit message to all players letting them know about the updated position
            this.io.emit('playerMove', this.players[socket.id]);
          }
        });
      });
    });
  }

  setupSpawners() {
  }

  spawnPlayer(playerId) {
    const player = new PlayerModel(playerId, this.playerLocations);
    this.players[playerId] = player;
  }
}
