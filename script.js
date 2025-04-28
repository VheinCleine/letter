// Initialize Three.js scene
let scene, camera, renderer, letter, heart, particles;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create floating letter
    createLetter();
    
    // Create heart
    createHeart();
    
    // Create floating particles
    createParticles();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createLetter() {
    const geometry = new THREE.PlaneGeometry(3, 4);
    const texture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60');
    const material = new THREE.MeshPhongMaterial({ 
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    
    letter = new THREE.Mesh(geometry, material);
    letter.position.y = 0.5;
    scene.add(letter);
}

function createHeart() {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.4, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.4, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    
    const extrudeSettings = {
        steps: 2,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 1
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xe74c3c,
        specular: 0x111111,
        shininess: 30
    });
    
    heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.8, 0.8, 0.8);
    heart.position.set(0, -1, 0);
    scene.add(heart);
}

function createParticles() {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        color.setHSL(Math.random() * 0.2 + 0.8, 0.8, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particle = new THREE.Points(particles, particleMaterial);
    scene.add(particle);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate letter and heart slightly
    if (letter) letter.rotation.y += 0.002;
    if (heart) {
        heart.rotation.z += 0.005;
        heart.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    renderer.render(scene, camera);
}

// Start the application
init();