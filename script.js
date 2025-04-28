// Initialize Three.js scene
let scene, camera, renderer, letter, heart, particles, textGroup;

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
    controls.enableZoom = true;
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
    
    // Load font and create text
    loadFontAndCreateText();
    
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
        opacity: 0.9
    });
    
    letter = new THREE.Mesh(geometry, material);
    letter.position.y = 0.5;
    scene.add(letter);
    
    return letter;
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

function loadFontAndCreateText() {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        textGroup = new THREE.Group();
        
        // First line of text
        const textGeometry1 = new THREE.TextGeometry('My Dearest,', {
            font: font,
            size: 0.15,
            height: 0.02,
            curveSegments: 12,
            bevelEnabled: false
        });
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const textMesh1 = new THREE.Mesh(textGeometry1, textMaterial);
        textGeometry1.center();
        textMesh1.position.set(0, 0.8, 0.1);
        
        // Second line of text
        const textGeometry2 = new THREE.TextGeometry('You mean the world to me', {
            font: font,
            size: 0.12,
            height: 0.02,
            curveSegments: 12,
            bevelEnabled: false
        });
        const textMesh2 = new THREE.Mesh(textGeometry2, textMaterial);
        textGeometry2.center();
        textMesh2.position.set(0, 0.5, 0.1);
        
        // Third line of text
        const textGeometry3 = new THREE.TextGeometry('Forever yours,', {
            font: font,
            size: 0.12,
            height: 0.02,
            curveSegments: 12,
            bevelEnabled: false
        });
        const textMesh3 = new THREE.Mesh(textGeometry3, textMaterial);
        textGeometry3.center();
        textMesh3.position.set(0, -0.2, 0.1);
        
        // Signature
        const textGeometry4 = new THREE.TextGeometry('Your Love', {
            font: font,
            size: 0.15,
            height: 0.02,
            curveSegments: 12,
            bevelEnabled: false
        });
        const signatureMaterial = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
        const textMesh4 = new THREE.Mesh(textGeometry4, signatureMaterial);
        textGeometry4.center();
        textMesh4.position.set(0.5, -0.5, 0.1);
        
        // Add all text to group
        textGroup.add(textMesh1);
        textGroup.add(textMesh2);
        textGroup.add(textMesh3);
        textGroup.add(textMesh4);
        
        // Position the group relative to the letter
        textGroup.position.copy(letter.position);
        textGroup.rotation.copy(letter.rotation);
        scene.add(textGroup);
    });
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
    
    // Rotate letter and text together
    if (letter) {
        letter.rotation.y += 0.002;
        if (textGroup) {
            textGroup.rotation.copy(letter.rotation);
        }
    }
    
    if (heart) {
        heart.rotation.z += 0.005;
        heart.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    renderer.render(scene, camera);
}

// Start the application
init();