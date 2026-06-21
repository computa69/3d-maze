// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Create a simple maze
const maze = new THREE.Group();

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
maze.add(floor);

// Walls
const wallGeometry = new THREE.BoxGeometry(1, 2, 20);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });

const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 1, -10);
maze.add(wall1);

const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.position.set(0, 1, 10);
maze.add(wall2);

const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
wall3.rotation.y = Math.PI / 2;
wall3.position.set(-10, 1, 0);
maze.add(wall3);

const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
wall4.rotation.y = Math.PI / 2;
wall4.position.set(10, 1, 0);
maze.add(wall4);

// Goal
const goalGeometry = new THREE.BoxGeometry(1, 1, 1);
const goalMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const goal = new THREE.Mesh(goalGeometry, goalMaterial);
goal.position.set(0, 0.5, 9);
maze.add(goal);

// Player
const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.25, 0);
maze.add(player);

scene.add(maze);

// Camera position
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

// Movement variables
const moveSpeed = 0.2;
const keys = {};

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Check for collisions
function checkCollision(newPosition) {
    const playerBox = new THREE.Box3().setFromObject(player);
    playerBox.expandByVector(new THREE.Vector3(0.5, 0, 0.5));

    const walls = [wall1, wall2, wall3, wall4];
    for (const wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) {
            return true;
        }
    }
    return false;
}

// Update game state
function update() {
    // Reset player position if out of bounds
    if (Math.abs(player.position.x) > 10 || Math.abs(player.position.z) > 10) {
        player.position.set(0, 0.25, 0);
    }

    // Move player
    if (keys['ArrowUp']) {
        player.position.z -= moveSpeed;
        if (checkCollision()) player.position.z += moveSpeed;
    }
    if (keys['ArrowDown']) {
        player.position.z += moveSpeed;
        if (checkCollision()) player.position.z -= moveSpeed;
    }
    if (keys['ArrowLeft']) {
        player.position.x -= moveSpeed;
        if (checkCollision()) player.position.x += moveSpeed;
    }
    if (keys['ArrowRight']) {
        player.position.x += moveSpeed;
        if (checkCollision()) player.position.x -= moveSpeed;
    }

    // Check if player reached the goal
    const playerBox = new THREE.Box3().setFromObject(player);
    const goalBox = new THREE.Box3().setFromObject(goal);
    if (playerBox.intersectsBox(goalBox)) {
        alert("🎉 You Win! Refresh to play again.");
        player.position.set(0, 0.25, 0);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game
animate();
