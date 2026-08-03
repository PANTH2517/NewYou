import net from 'net';

const host = 'ac-7hvlxy5-shard-00-01.tjvixh1.mongodb.net';
const port = 27017;

console.log(`Testing raw TCP connection to ${host}:${port} ...`);

const socket = new net.Socket();
socket.setTimeout(4000);

socket.on('connect', () => {
  console.log(`✅ SUCCESS: Port ${port} is OPEN and reachable!`);
  socket.destroy();
});

socket.on('timeout', () => {
  console.error(`❌ TIMEOUT: Port ${port} is BLOCKED by firewall/router.`);
  socket.destroy();
});

socket.on('error', (err) => {
  console.error(`❌ ERROR: Port ${port} connection failed:`, err.message);
});

socket.connect(port, host);
