// ============================================
// WINTER PLATFORMER GAME - SANTA'S ADVENTURE
// ============================================

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Detect mobile device - more reliable detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                 ('ontouchstart' in window) || 
                 (navigator.maxTouchPoints > 0) ||
                 (window.innerWidth <= 768);

// Set canvas size based on device
if (isMobile) {
    // For mobile, use full screen width but leave space for controls at bottom
    canvas.width = window.innerWidth;
    // Reserve 140px at bottom for controls
    canvas.height = window.innerHeight - 140;
} else {
    // For desktop, use fixed size
    canvas.width = 800;
    canvas.height = 600;
}

// Handle resize
window.addEventListener('resize', () => {
    if (isMobile) {
        canvas.width = window.innerWidth;
        // Reserve 140px at bottom for controls
        canvas.height = window.innerHeight - 140;
    }
});

// Prevent default touch behaviors (but allow input field to work)
document.addEventListener('touchstart', (e) => {
    // Don't prevent default for input fields
    if (e.target.tagName === 'INPUT' || e.target.id === 'mobileNameInput') {
        return;
    }
    if (e.target === canvas || e.target.closest('#virtualControls')) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    // Don't prevent default for input fields
    if (e.target.tagName === 'INPUT' || e.target.id === 'mobileNameInput') {
        return;
    }
    if (e.target === canvas || e.target.closest('#virtualControls')) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', (e) => {
    // Don't prevent default for input fields
    if (e.target.tagName === 'INPUT' || e.target.id === 'mobileNameInput') {
        return;
    }
    if (e.target === canvas || e.target.closest('#virtualControls')) {
        e.preventDefault();
    }
}, { passive: false });

// ============================================
// INPUT HANDLER
// ============================================
class InputHandler {
    constructor() {
        this.keys = {};
        this.jumpPressed = false;
        this.jumpConsumed = false; // Track if jump was used this frame
        this.keyProcessed = false; // Track if key was processed for name input
        
        // Touch state
        this.touchLeft = false;
        this.touchRight = false;
        this.touchJump = false;
        
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            const jumpKeys = [' ', 'w', 'arrowup'];
            if (jumpKeys.includes(e.key.toLowerCase())) {
                if (!this.jumpConsumed) {
                    this.jumpPressed = true;
                }
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            const jumpKeys = [' ', 'w', 'arrowup'];
            if (jumpKeys.includes(e.key.toLowerCase())) {
                this.jumpPressed = false;
                this.jumpConsumed = false; // Reset when key is released
            }
        });
        
        // Setup virtual controls - always setup, but only show on mobile
        this.setupVirtualControls();
    }
    
    setupVirtualControls() {
        // Show virtual controls only on mobile/touch devices
        const virtualControls = document.getElementById('virtualControls');
        if (virtualControls) {
            // Always setup, but only show on mobile
            if (isMobile || 'ontouchstart' in window) {
                virtualControls.style.display = 'block';
            } else {
                virtualControls.style.display = 'none';
            }
            virtualControls.style.position = 'fixed';
            virtualControls.style.top = '0';
            virtualControls.style.left = '0';
            virtualControls.style.width = '100%';
            virtualControls.style.height = '100%';
            virtualControls.style.zIndex = '10000';
        }
        
        // Left button
        const btnLeft = document.getElementById('btnLeft');
        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchLeft = true;
            });
            btnLeft.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchLeft = false;
            });
            btnLeft.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.touchLeft = false;
            });
            // Also support mouse for testing
            btnLeft.addEventListener('mousedown', () => {
                this.touchLeft = true;
            });
            btnLeft.addEventListener('mouseup', () => {
                this.touchLeft = false;
            });
            btnLeft.addEventListener('mouseleave', () => {
                this.touchLeft = false;
            });
        }
        
        // Right button
        const btnRight = document.getElementById('btnRight');
        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchRight = true;
            });
            btnRight.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchRight = false;
            });
            btnRight.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.touchRight = false;
            });
            // Also support mouse for testing
            btnRight.addEventListener('mousedown', () => {
                this.touchRight = true;
            });
            btnRight.addEventListener('mouseup', () => {
                this.touchRight = false;
            });
            btnRight.addEventListener('mouseleave', () => {
                this.touchRight = false;
            });
        }
        
        // Jump button
        const btnJump = document.getElementById('btnJump');
        if (btnJump) {
            btnJump.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.touchJump = true;
                if (!this.jumpConsumed) {
                    this.jumpPressed = true;
                }
            });
            btnJump.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.touchJump = false;
                // Reset jump consumed after a short delay to allow next jump
                setTimeout(() => {
                    this.jumpConsumed = false;
                }, 100);
            });
            btnJump.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.touchJump = false;
                // Reset jump consumed after a short delay
                setTimeout(() => {
                    this.jumpConsumed = false;
                }, 100);
            });
            // Also support mouse for testing
            btnJump.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.touchJump = true;
                if (!this.jumpConsumed) {
                    this.jumpPressed = true;
                }
            });
            btnJump.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.touchJump = false;
                // Reset jump consumed after a short delay
                setTimeout(() => {
                    this.jumpConsumed = false;
                }, 100);
            });
            btnJump.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.touchJump = false;
                // Reset jump consumed after a short delay
                setTimeout(() => {
                    this.jumpConsumed = false;
                }, 100);
            });
        }
    }
    
    isPressed(key) {
        // Check keyboard first
        if (this.keys[key.toLowerCase()]) {
            return true;
        }
        
        // Check touch controls
        if (key.toLowerCase() === 'a' || key.toLowerCase() === 'arrowleft') {
            return this.touchLeft;
        }
        if (key.toLowerCase() === 'd' || key.toLowerCase() === 'arrowright') {
            return this.touchRight;
        }
        if (key.toLowerCase() === ' ' || key.toLowerCase() === 'w' || key.toLowerCase() === 'arrowup') {
            return this.touchJump || this.jumpPressed;
        }
        
        return false;
    }
    
    consumeJump() {
        this.jumpConsumed = true;
        this.jumpPressed = false;
        // Don't reset touchJump here - it will be reset when button is released
    }
}

// ============================================
// CAMERA
// ============================================
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.smoothness = 0.1;
        this.autoScrollSpeed = 0.1; // Pixels per frame for auto-scrolling
    }
    
    update(deltaTime, playerX = null, playerY = null, levelLength = 6000, playerMovingRight = false) {
        // Auto-scroll from right to left (base speed)
        let scrollSpeed = this.autoScrollSpeed;
        
        if (playerX !== null) {
            const screenX = playerX - this.x;
            const twoThirdsScreen = canvas.width * (2/3);
            
            // If player is beyond 2/3 and moving right, accelerate camera
            if (playerMovingRight && screenX >= twoThirdsScreen) {
                // Player is at or beyond 2/3 of screen and moving right - camera follows (accelerates)
                const distance = screenX - twoThirdsScreen;
                // Strong acceleration to keep up with player movement
                const followSpeed = this.autoScrollSpeed + (distance * 0.008); // Increased acceleration
                scrollSpeed = Math.min(followSpeed, this.autoScrollSpeed * 5); // Higher cap
            }
            // If player stops moving right but is still beyond 2/3, camera continues at current speed
            // This prevents the player from being snapped back
        }
        
        this.x += scrollSpeed * deltaTime;
        this.y = 0; // Fixed vertical camera
        
        // Keep camera within level bounds (don't scroll past start or end)
        this.x = Math.max(0, Math.min(this.x, levelLength - canvas.width));
    }
    
    toScreenX(worldX) {
        return worldX - this.x;
    }
    
    toScreenY(worldY) {
        return worldY - this.y;
    }
}

// ============================================
// PARALLAX LAYER
// ============================================
class ParallaxLayer {
    constructor(speed, type) {
        this.speed = speed;
        this.type = type; // 'sky', 'mountains', 'trees', 'houses'
        this.x = 0;
    }
    
    update(cameraX) {
        this.x = cameraX * this.speed;
    }
    
    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        
        switch(this.type) {
            case 'sky':
                // Sky gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#E0F6FF');
                gradient.addColorStop(0.5, '#B8E0FF');
                gradient.addColorStop(1, '#A8D8FF');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
                
            case 'mountains':
                // Distant mountains
                ctx.fillStyle = '#C8D8E8';
                for (let i = -2; i < 5; i++) {
                    const x = screenX + i * 400;
                    ctx.beginPath();
                    ctx.moveTo(x, canvas.height * 0.6);
                    ctx.lineTo(x + 200, canvas.height * 0.3);
                    ctx.lineTo(x + 400, canvas.height * 0.6);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
                
            case 'trees':
                // Pine trees
                ctx.fillStyle = '#2D5016';
                for (let i = -2; i < 8; i++) {
                    const x = screenX + i * 150;
                    const treeY = canvas.height * 0.55;
                    // Tree trunk
                    ctx.fillRect(x + 20, treeY, 10, 30);
                    // Tree triangle
                    ctx.beginPath();
                    ctx.moveTo(x, treeY);
                    ctx.lineTo(x + 25, treeY - 40);
                    ctx.lineTo(x + 50, treeY);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
        }
    }
}

// ============================================
// SNOWFLAKE PARTICLE
// ============================================
class Snowflake {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.drift = Math.random() * 0.5 - 0.25;
    }
    
    update(deltaTime) {
        this.y += this.speed * deltaTime;
        this.x += this.drift * deltaTime;
        
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
    }
    
    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================
// HOUSE
// ============================================
class House {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 60;
        this.smokeParticles = [];
        this.smokeTimer = 0;
        this.lightsOn = false; // Track if player has entered
        this.chimneyTop = this.y - 35; // Top of chimney (higher than roof - roof is at y - 25)
        this.chimneyX = this.x + this.width / 2 - 5; // Center chimney
        this.chimneyWidth = 10;
        this.chimneyHeight = 25; // Taller chimney extending above roof
    }
    
    getChimneyBounds() {
        return {
            x: this.chimneyX,
            y: this.chimneyTop,
            width: this.chimneyWidth,
            height: this.chimneyHeight
        };
    }
    
    getDoorBounds() {
        return {
            x: this.x + this.width / 2 - 10,
            y: this.y + 35,
            width: 20,
            height: 25
        };
    }
    
    update(deltaTime, camera) {
        this.smokeTimer += deltaTime;
        
        // Add smoke particles
        if (this.smokeTimer > 1000) {
            this.smokeTimer = 0;
            this.smokeParticles.push({
                x: this.x + this.width / 2 + 5,
                y: this.y - 10,
                size: 5,
                opacity: 0.6,
                drift: Math.random() * 0.3 - 0.15
            });
        }
        
        // Update smoke particles
        for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
            const p = this.smokeParticles[i];
            p.y -= 0.5 * deltaTime;
            p.x += p.drift * deltaTime;
            p.size += 0.1 * deltaTime;
            p.opacity -= 0.002 * deltaTime;
            
            if (p.opacity <= 0 || p.y < -50) {
                this.smokeParticles.splice(i, 1);
            }
        }
    }
    
    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // House body
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Roof
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(screenX - 5, screenY);
        ctx.lineTo(screenX + this.width / 2, screenY - 25);
        ctx.lineTo(screenX + this.width + 5, screenY);
        ctx.closePath();
        ctx.fill();
        
        // Snow on roof
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenX - 5, screenY - 3, this.width + 10, 6);
        
        // Windows (lit only if lightsOn)
        ctx.fillStyle = this.lightsOn ? '#FFD700' : '#4A4A4A';
        ctx.fillRect(screenX + 15, screenY + 15, 15, 15);
        ctx.fillRect(screenX + 50, screenY + 15, 15, 15);
        // Window frames
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX + 15, screenY + 15, 15, 15);
        ctx.strokeRect(screenX + 50, screenY + 15, 15, 15);
        
        // Door
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(screenX + this.width / 2 - 10, screenY + 35, 20, 25);
        
        // Chimney (taller, extends above roof, different color)
        // Chimney extends from roof top upward
        ctx.fillStyle = '#4A3728'; // Darker brown, different from roof (#654321)
        ctx.fillRect(screenX + this.width / 2 - 5, screenY - 25, 10, 25); // Starts at roof top (y - 25), extends 25px up
        
        // Chimney top platform (for jumping) - slightly wider
        ctx.fillStyle = '#3D2E20'; // Even darker for contrast
        ctx.fillRect(screenX + this.width / 2 - 6, screenY - 35, 12, 4);
        
        // Smoke particles
        for (const p of this.smokeParticles) {
            ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x - camera.x, p.y - camera.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ============================================
// PLATFORM
// ============================================
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Base (dirt/ice)
        ctx.fillStyle = '#6B7B8C';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Snow top
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenX, screenY, this.width, 8);
        
        // Snow bumps
        ctx.fillStyle = '#F0F0F0';
        for (let i = 0; i < this.width; i += 20) {
            ctx.beginPath();
            ctx.arc(screenX + i, screenY + 4, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ============================================
// COLLECTIBLE
// ============================================
class Collectible {
    constructor(x, y, type = 'present') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.collected = false;
        this.bobOffset = 0;
        this.bobSpeed = 0.003;
        this.collectionTimer = 0;
        this.collectionScale = 1;
        this.collectionOpacity = 1;
    }
    
    update(deltaTime) {
        if (this.collected) {
            this.collectionTimer += deltaTime;
            this.collectionScale += 0.05 * deltaTime;
            this.collectionOpacity -= 0.01 * deltaTime;
            return;
        }
        
        this.bobOffset = Math.sin(Date.now() * this.bobSpeed) * 5;
    }
    
    draw(ctx, camera) {
        if (this.collected && this.collectionOpacity <= 0) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y + this.bobOffset;
        
        ctx.save();
        ctx.globalAlpha = this.collectionOpacity;
        ctx.translate(screenX, screenY);
        ctx.scale(this.collectionScale, this.collectionScale);
        
        if (this.type === 'present') {
            // Present box
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(-15, -15, 30, 30);
            
            // Ribbon
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(-15, -3, 30, 6);
            ctx.fillRect(-3, -15, 6, 30);
            
            // Bow
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(-8, -8, 5, 0, Math.PI * 2);
            ctx.arc(8, -8, 5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Star
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                const x = Math.cos(angle) * 15;
                const y = Math.sin(angle) * 15;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    getBounds() {
        return {
            x: this.x - 15,
            y: this.y - 15 + this.bobOffset,
            width: 30,
            height: 30
        };
    }
}

// ============================================
// PARTICLE SYSTEM
// ============================================
class Particle {
    constructor(x, y, vx, vy, color, size, lifetime) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.gravity = 0.005; // Much slower gravity: was 0.01, now 0.005
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.vy += this.gravity * deltaTime;
        this.lifetime -= deltaTime;
    }
    
    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        if (screenX < -50 || screenX > canvas.width + 50 || screenY < -50 || screenY > canvas.height + 50) {
            return; // Don't draw particles off screen
        }
        
        const alpha = this.lifetime / this.maxLifetime;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    
    isDead() {
        return this.lifetime <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createCollectibleParticles(x, y, type) {
        const colors = type === 'present' 
            ? ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'] 
            : ['#FFD700', '#FFA500', '#FFFF00', '#FFFFFF'];
        const count = 12;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 0.03 + Math.random() * 0.02; // Much slower: was 0.08-0.13, now 0.03-0.05
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 2 + Math.random() * 2;
            const lifetime = 400 + Math.random() * 200;
            
            this.particles.push(new Particle(x, y, vx, vy, color, size, lifetime));
        }
    }
    
    createEnemyDefeatParticles(x, y) {
        const count = 20;
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.02 + Math.random() * 0.03; // Much slower: was 0.05-0.13, now 0.02-0.05
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 0.01; // Slight upward bias (reduced)
            const color = '#FFFFFF';
            const size = 3 + Math.random() * 3;
            const lifetime = 500 + Math.random() * 300;
            
            this.particles.push(new Particle(x, y, vx, vy, color, size, lifetime));
        }
    }
    
    createLandingParticles(x, y) {
        const count = 8;
        
        for (let i = 0; i < count; i++) {
            const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.5; // Mostly upward
            const speed = 0.015 + Math.random() * 0.015; // Much slower: was 0.04-0.08, now 0.015-0.03
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = '#FFFFFF';
            const size = 2 + Math.random() * 2;
            const lifetime = 300 + Math.random() * 200;
            
            this.particles.push(new Particle(x, y, vx, vy, color, size, lifetime));
        }
    }
    
    createChimneySmoke(x, y) {
        const count = 15;
        
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            const vx = (Math.random() - 0.5) * 0.01; // Much slower: was 0.025, now 0.01
            const vy = -0.02 - Math.random() * 0.02; // Upward, much slower: was -0.05 to -0.1, now -0.02 to -0.04
            const color = `rgba(100, 100, 100, ${0.6 + Math.random() * 0.4})`;
            const size = 4 + Math.random() * 4;
            const lifetime = 800 + Math.random() * 400;
            
            this.particles.push(new Particle(x + offsetX, y, vx, vy, color, size, lifetime));
        }
    }
    
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw(ctx, camera) {
        for (const particle of this.particles) {
            particle.draw(ctx, camera);
        }
    }
}

// ============================================
// ENEMY (SNOWMAN)
// ============================================
class Enemy {
    constructor(x, y, gender = null, name = null, usedNames = null) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 50;
        this.speed = 0.03;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.patrolDistance = 100;
        this.startX = x;
        this.defeated = false;
        this.defeatTimer = 0;
        
        // Gender and name
        this.gender = gender || (Math.random() > 0.5 ? 'male' : 'female');
        this.name = name || this.generateName(usedNames);
    }
    
    generateName(usedNames = null) {
        // Use names from config file
        if (typeof SNOWMAN_NAMES !== 'undefined') {
            let availableNames;
            if (this.gender === 'male') {
                availableNames = [...SNOWMAN_NAMES.male];
            } else {
                availableNames = [...SNOWMAN_NAMES.female];
            }
            
            // Remove used names
            if (usedNames && usedNames.length > 0) {
                availableNames = availableNames.filter(name => !usedNames.includes(name));
            }
            
            // If all names are used, reset (shouldn't happen with enough names)
            if (availableNames.length === 0) {
                availableNames = this.gender === 'male' ? [...SNOWMAN_NAMES.male] : [...SNOWMAN_NAMES.female];
            }
            
            return availableNames[Math.floor(Math.random() * availableNames.length)];
        }
        // Fallback names if config not loaded
        const maleNames = ['Frosty', 'Jack', 'Snowball'];
        const femaleNames = ['Snowflake', 'Crystal', 'Ivy'];
        return this.gender === 'male' 
            ? maleNames[Math.floor(Math.random() * maleNames.length)]
            : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    }
    
    update(deltaTime) {
        if (this.defeated) {
            this.defeatTimer += deltaTime;
            return;
        }
        
        // Simple patrol
        this.x += this.speed * this.direction * deltaTime;
        
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
    }
    
    draw(ctx, camera) {
        if (this.defeated && this.defeatTimer > 500) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(screenX + this.width / 2, screenY + this.height + 5, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.defeated) {
            ctx.globalAlpha = 0.5;
        }
        
        // Bottom circle (body)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2, screenY + this.height - 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Middle circle
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2, screenY + this.height - 35, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Top circle (head)
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2, screenY + this.height - 50, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2 - 3, screenY + this.height - 52, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2 + 3, screenY + this.height - 52, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (dots)
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(screenX + this.width / 2 - 4 + i * 4, screenY + this.height - 48, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Nose (carrot)
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2, screenY + this.height - 50);
        ctx.lineTo(screenX + this.width / 2 + 6, screenY + this.height - 48);
        ctx.lineTo(screenX + this.width / 2, screenY + this.height - 46);
        ctx.closePath();
        ctx.fill();
        
        // Arms (sticks)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2 - 12, screenY + this.height - 40);
        ctx.lineTo(screenX + this.width / 2 - 20, screenY + this.height - 35);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2 + 12, screenY + this.height - 40);
        ctx.lineTo(screenX + this.width / 2 + 20, screenY + this.height - 35);
        ctx.stroke();
        
        // Gender-specific features
        if (this.gender === 'male') {
            // Male: Top hat
            ctx.fillStyle = '#000000';
            ctx.fillRect(screenX + this.width / 2 - 8, screenY + this.height - 60, 16, 8);
            ctx.fillRect(screenX + this.width / 2 - 6, screenY + this.height - 65, 12, 5);
            
            // Male: Scarf (winter scarf)
            ctx.fillStyle = '#8B0000'; // Dark red scarf
            ctx.fillRect(screenX + this.width / 2 - 10, screenY + this.height - 45, 20, 4);
            // Scarf ends hanging down
            ctx.fillRect(screenX + this.width / 2 - 12, screenY + this.height - 41, 6, 8);
            ctx.fillRect(screenX + this.width / 2 + 6, screenY + this.height - 41, 6, 8);
            
            // Male: Buttons (3 buttons down front)
            ctx.fillStyle = '#000000';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(screenX + this.width / 2, screenY + this.height - 30 + i * 8, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Female: Bow on head (larger, more prominent)
            ctx.fillStyle = '#FF1493'; // Deep pink bow
            ctx.beginPath();
            // Bow center
            ctx.arc(screenX + this.width / 2, screenY + this.height - 58, 5, 0, Math.PI * 2);
            ctx.fill();
            // Bow loops (larger)
            ctx.beginPath();
            ctx.ellipse(screenX + this.width / 2 - 6, screenY + this.height - 60, 4, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(screenX + this.width / 2 + 6, screenY + this.height - 60, 4, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Female: Scarf (elegant scarf, different color)
            ctx.fillStyle = '#FF69B4'; // Pink scarf
            ctx.fillRect(screenX + this.width / 2 - 8, screenY + this.height - 45, 16, 3);
            // Scarf ends (more decorative)
            ctx.fillRect(screenX + this.width / 2 - 10, screenY + this.height - 42, 5, 10);
            ctx.fillRect(screenX + this.width / 2 + 5, screenY + this.height - 42, 5, 10);
            
            // Female: Necklace or decorative element
            ctx.fillStyle = '#FFD700'; // Gold necklace
            ctx.beginPath();
            ctx.arc(screenX + this.width / 2 - 6, screenY + this.height - 42, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(screenX + this.width / 2, screenY + this.height - 42, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(screenX + this.width / 2 + 6, screenY + this.height - 42, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1.0;
        
        // Draw name above snowman
        if (!this.defeated) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(screenX - 20, screenY - 25, 70, 18);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, screenX + this.width / 2, screenY - 10);
            ctx.textAlign = 'left';
        }
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ============================================
// PLAYER (SANTA)
// ============================================
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 0.35; // Slower horizontal movement speed
        this.jumpForce = 50; // pixels per frame (negative Y is up) - high jump
        this.gravity = 0.15; // Very low gravity for slow fall and much longer air time
        this.friction = 0.8;
        this.onGround = true; // Start on ground
        this.wasOnGround = true; // Track previous frame ground state
        this.idleOffset = 0;
        this.squashStretchX = 1;
        this.squashStretchY = 1;
        this.squashTimer = 0;
        
        // Animation state
        this.animationFrame = 0;
        this.walkCycle = 0;
        this.facingRight = true; // Direction facing
        this.isMoving = false;
        this.isJumping = false;
        
        // Death animation state
        this.isDead = false;
        this.deathTimer = 0;
        this.deathRotation = 0;
        this.deathScale = 1;
        this.deathOpacity = 1;
        this.deathX = 0;
        this.deathY = 0;
        
        // House entry/exit state
        this.inHouse = false;
        this.houseEntryTimer = 0;
        this.houseExitTimer = 0;
        this.currentHouse = null;
    }
    
    update(deltaTime, input, platforms, houses = [], camera = null, particleSystem = null, goalX = null) {
        // Don't update if player is in house
        if (this.inHouse) {
            return;
        }
        
        // Handle death animation
        if (this.isDead) {
            this.deathTimer += deltaTime;
            
            // Update death animation properties
            const progress = Math.min(this.deathTimer / 1000, 1); // 1 second death animation
            
            // Rotation: spin 720 degrees (2 full rotations)
            this.deathRotation = progress * Math.PI * 4;
            
            // Scale: shrink from 1.0 to 0.0
            this.deathScale = 1 - progress;
            
            // Opacity: fade from 1.0 to 0.0
            this.deathOpacity = 1 - progress;
            
            // After 1 second, respawn
            if (this.deathTimer >= 1000) {
                // Reset position and state
                this.x = 100;
                this.y = canvas.height - 80;
                this.velocityX = 0;
                this.velocityY = 0;
                this.onGround = true;
                this.isDead = false;
                this.deathTimer = 0;
                this.deathRotation = 0;
                this.deathScale = 1;
                this.deathOpacity = 1;
            }
            
            return; // Don't process movement/physics during death
        }
        
        // Store houses and camera reference
        this.houses = houses;
        this.camera = camera;
        this.particleSystem = particleSystem;
        this.goalX = goalX;
        
        // Track previous ground state for landing detection
        this.wasOnGround = this.onGround;
        
        // Update animation state
        this.isMoving = Math.abs(this.velocityX) > 0.01;
        this.isJumping = !this.onGround;
        
        // Update facing direction
        if (this.velocityX < 0) {
            this.facingRight = false;
        } else if (this.velocityX > 0) {
            this.facingRight = true;
        }
        
        // Update walk animation cycle
        if (this.isMoving && this.onGround) {
            this.walkCycle += deltaTime * 0.01;
            this.animationFrame = Math.floor(this.walkCycle) % 4; // 4-frame walk cycle
        } else {
            this.walkCycle = 0;
            this.animationFrame = 0;
        }
        
        // Idle animation (subtle bobbing)
        this.idleOffset = Math.sin(Date.now() * 0.003) * 1;
        
        // Horizontal movement
        if (input.isPressed('a') || input.isPressed('arrowleft')) {
            this.velocityX = -this.speed * deltaTime;
        } else if (input.isPressed('d') || input.isPressed('arrowright')) {
            this.velocityX = this.speed * deltaTime;
        } else {
            this.velocityX *= this.friction;
        }
        
        // Prevent player from leaving screen boundaries (relative to camera)
        if (camera) {
            const screenX = this.x - camera.x;
            
            // Prevent leaving left side of screen
            if (screenX < 0) {
                // Player is off left side, keep them at left edge of screen
                this.x = camera.x;
                // Only prevent leftward movement, allow rightward movement
                if (this.velocityX < 0) {
                    this.velocityX = 0;
                }
            }
            
            // Prevent leaving right side of screen (2/3 of screen width)
            // But allow full movement if goal is nearby (within screen width)
            const twoThirdsScreen = canvas.width * (2/3);
            const rightEdge = twoThirdsScreen - this.width;
            const maxRightEdge = twoThirdsScreen + 30; // Allow 30px beyond for camera to catch up
            
            const isMovingRight = input.isPressed('d') || input.isPressed('arrowright');
            
            // Check if goal is nearby - if so, disable boundary restriction
            const goalNearby = this.goalX !== null && (this.goalX - this.x) < canvas.width;
            
            // Only enforce boundary if goal is not nearby
            if (!goalNearby) {
                // Only clamp if player goes way too far beyond (camera should handle normal following)
                if (screenX > maxRightEdge) {
                    // Player is too far beyond, gently push back (don't snap)
                    const pushBack = (screenX - maxRightEdge) * 0.3; // Gradual push back
                    this.x -= pushBack;
                    if (this.velocityX > 0) {
                        this.velocityX *= 0.7; // Slow down gradually
                    }
                }
                // Don't push back when player stops - let camera handle it naturally
            }
            // If goal is nearby, allow free movement to reach it
        }
        
        // Check if player is on ground BEFORE processing jump
        this.onGround = false;
        for (const platform of platforms) {
            const bounds = platform.getBounds();
            
            // Check if player is horizontally overlapping with platform
            if (this.x < bounds.x + bounds.width &&
                this.x + this.width > bounds.x) {
                
                const playerBottom = this.y + this.height;
                const platformTop = bounds.y;
                const tolerance = 20; // Increased tolerance for more reliable ground detection
                
                // Check if player is standing on top of platform or very close
                if (playerBottom >= platformTop - tolerance && playerBottom <= platformTop + tolerance) {
                    // Snap player to platform top
                    this.y = bounds.y - this.height;
                    // Reset vertical velocity if falling or standing
                    if (this.velocityY >= 0) {
                        this.velocityY = 0;
                    }
                    
                    // Check if player just landed (wasn't on ground before, now is)
                    if (!this.wasOnGround && this.onGround === false && this.particleSystem) {
                        // Create landing particles
                        const landingX = this.x + this.width / 2;
                        const landingY = this.y + this.height;
                        this.particleSystem.createLandingParticles(landingX, landingY);
                        
                        // Landing squash animation
                        this.squashStretchX = 1.3;
                        this.squashStretchY = 0.7;
                        this.squashTimer = 100;
                    }
                    
                    this.onGround = true;
                }
            }
        }
        
        // Jumping - check BEFORE applying gravity
        if (input.jumpPressed && this.onGround) {
            // Set initial upward velocity (negative Y is up)
            this.velocityY = -this.jumpForce;
            this.onGround = false;
            this.squashStretchX = 1.2;
            this.squashStretchY = 0.8;
            this.squashTimer = 150; // Frames for squash/stretch animation
            input.consumeJump(); // Mark jump as consumed
        }
        
        // Update squash/stretch timer
        if (this.squashTimer > 0) {
            this.squashTimer -= deltaTime * 0.5;
            if (this.squashTimer <= 0) {
                this.squashStretchX = 1;
                this.squashStretchY = 1;
            }
        }
        
        // Apply gravity only if not on ground
        if (!this.onGround) {
            this.velocityY += this.gravity * deltaTime;
        }
        
        // Update horizontal position
        this.x += this.velocityX;
        
        // Update vertical position with collision check to prevent falling through platforms
        const oldY = this.y;
        this.y += this.velocityY;
        
        // Check for platform collision immediately after vertical movement
        for (const platform of platforms) {
            const bounds = platform.getBounds();
            
            // Check if player overlaps horizontally with platform
            if (this.x < bounds.x + bounds.width &&
                this.x + this.width > bounds.x) {
                
                const playerBottom = this.y + this.height;
                const platformTop = bounds.y;
                const tolerance = 25; // Increased tolerance for more reliable landing
                
                // If falling and about to land on platform
                if (this.velocityY >= 0 && playerBottom >= platformTop - tolerance && playerBottom <= platformTop + tolerance) {
                    // Land on platform - snap to top
                    this.y = bounds.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                    break; // Only land on one platform
                }
            }
        }
        
        // Reset squash/stretch
        if (this.squashTimer > 0) {
            this.squashTimer -= deltaTime;
            if (this.squashTimer <= 0) {
                this.squashStretchX = 1;
                this.squashStretchY = 1;
            } else {
                const progress = this.squashTimer / 200;
                this.squashStretchX = 1 + (0.2 * progress);
                this.squashStretchY = 1 - (0.2 * progress);
            }
        }
        
        // Landing squash
        if (this.onGround && Math.abs(this.velocityY) < 0.1 && this.squashTimer <= 0) {
            this.squashStretchX = 0.9;
            this.squashStretchY = 1.1;
            setTimeout(() => {
                this.squashStretchX = 1;
                this.squashStretchY = 1;
            }, 100);
        }
        
        // Collision with platforms - check after movement for all collisions
        for (const platform of platforms) {
            const bounds = platform.getBounds();
            
            // Check if player overlaps with platform
            if (this.x < bounds.x + bounds.width &&
                this.x + this.width > bounds.x &&
                this.y < bounds.y + bounds.height &&
                this.y + this.height > bounds.y) {
                
                const playerBottom = this.y + this.height;
                const playerTop = this.y;
                const platformTop = bounds.y;
                const platformBottom = bounds.y + bounds.height;
                const tolerance = 20; // Increased tolerance for more reliable landing
                
                // Determine collision type based on player position relative to platform
                const playerCenterY = this.y + this.height / 2;
                const platformCenterY = bounds.y + bounds.height / 2;
                
                // Check if hitting platform from below (jumping upward)
                if (this.velocityY < 0 && playerTop < platformBottom && playerBottom > platformTop && playerCenterY < platformCenterY) {
                    // Player is moving upward and hitting platform from below - prevent jumping through
                    this.y = platformBottom;
                    this.velocityY = 0;
                    this.onGround = false;
                }
                // Landing on top (falling down onto platform)
                else if (this.velocityY >= 0 && playerBottom >= platformTop - tolerance && playerBottom <= platformTop + tolerance) {
                    // Land on platform
                    const wasFalling = this.velocityY > 1; // Check before resetting velocity
                    this.y = bounds.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                    if (wasFalling) { // Landing from jump
                        this.squashStretchX = 0.9;
                        this.squashStretchY = 1.1;
                        setTimeout(() => {
                            this.squashStretchX = 1;
                            this.squashStretchY = 1;
                        }, 100);
                    }
                    break; // Only process one platform collision
                }
                // Side collisions (only if not already handled above)
                else if (playerTop < platformBottom && playerBottom > platformTop) {
                    // Hitting from the side
                    if (this.velocityX > 0 && this.x + this.width > bounds.x && this.x < bounds.x) {
                        // Hitting from left side
                        this.x = bounds.x - this.width;
                        this.velocityX = 0;
                    } else if (this.velocityX < 0 && this.x < bounds.x + bounds.width && this.x + this.width > bounds.x + bounds.width) {
                        // Hitting from right side
                        this.x = bounds.x + bounds.width;
                        this.velocityX = 0;
                    }
                }
            }
        }
        
        // Boundary check (falling) - just reset position, don't lose life
        if (this.y > canvas.height + 100) {
            // Reset to starting position instead of losing life
            this.x = 100;
            this.y = canvas.height - 80;
            this.velocityX = 0;
            this.velocityY = 0;
            this.onGround = true;
        }
        
        return null;
    }
    
    draw(ctx, camera) {
        // Use death position if dead, otherwise use current position
        const drawX = this.isDead ? this.deathX : this.x;
        const drawY = this.isDead ? this.deathY : this.y;
        
        const screenX = drawX - camera.x;
        const screenY = drawY - camera.y + (this.onGround && !this.isDead ? this.idleOffset : 0);
        
        // Shadow (only if not dead or during early death animation)
        if (!this.isDead || this.deathOpacity > 0.3) {
            ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * this.deathOpacity})`;
            ctx.beginPath();
            ctx.ellipse(screenX + this.width / 2, screenY + this.height + 5, 18, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
        
        // Apply death animation transforms
        if (this.isDead) {
            ctx.globalAlpha = this.deathOpacity;
            ctx.rotate(this.deathRotation);
            ctx.scale(this.deathScale, this.deathScale);
        } else {
            // Flip horizontally if facing left
            if (!this.facingRight) {
                ctx.scale(-1, 1);
            }
            
            // Apply squash/stretch for jump
            if (this.squashTimer > 0) {
                ctx.scale(this.squashStretchX, this.squashStretchY);
            }
        }
        
        // Calculate animation offsets for walking
        let armOffset = 0;
        let legOffset = 0;
        if (this.isMoving && this.onGround) {
            // Animate arms and legs based on walk cycle
            const cycle = this.animationFrame;
            if (cycle === 0 || cycle === 2) {
                armOffset = 0;
                legOffset = 0;
            } else if (cycle === 1) {
                armOffset = 3; // Right arm forward, left arm back
                legOffset = -2; // Right leg forward, left leg back
            } else if (cycle === 3) {
                armOffset = -3; // Left arm forward, right arm back
                legOffset = 2; // Left leg forward, right leg back
            }
        }
        
        // Body (red rectangle)
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-10, -5, 20, 15);
        ctx.strokeRect(-10, -5, 20, 15);
        
        // Head (red square)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-8, -18, 16, 16);
        ctx.strokeRect(-8, -18, 16, 16);
        
        // Eyes (square eyes)
        ctx.fillStyle = '#000000';
        ctx.fillRect(-5, -14, 3, 3);
        ctx.fillRect(2, -14, 3, 3);
        
        // Mouth (curved smile)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -8, 4, 0, Math.PI);
        ctx.stroke();
        
        // Hat (large triangle)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(-10, -18);
        ctx.lineTo(0, -32);
        ctx.lineTo(10, -18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Hat top (small rectangle)
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(-2, -32, 4, 6);
        ctx.strokeRect(-2, -32, 4, 6);
        
        // Ears/headwear extensions (small rectangles on sides)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-12, -12, 3, 6);
        ctx.fillRect(9, -12, 3, 6);
        ctx.strokeRect(-12, -12, 3, 6);
        ctx.strokeRect(9, -12, 3, 6);
        
        // Arms (small rectangles extending outward)
        const leftArmX = -12;
        const rightArmX = 12;
        const armY = 0;
        
        // Left arm
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(leftArmX, armY + armOffset, 4, 8);
        ctx.strokeRect(leftArmX, armY + armOffset, 4, 8);
        
        // Right arm
        ctx.fillRect(rightArmX, armY - armOffset, 4, 8);
        ctx.strokeRect(rightArmX, armY - armOffset, 4, 8);
        
        // Legs (two rectangles close together)
        const legY = 10;
        const legSpacing = 3;
        
        // Left leg
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-6 - legSpacing/2, legY + legOffset, 5, 10);
        ctx.strokeRect(-6 - legSpacing/2, legY + legOffset, 5, 10);
        
        // Right leg
        ctx.fillRect(1 + legSpacing/2, legY - legOffset, 5, 10);
        ctx.strokeRect(1 + legSpacing/2, legY - legOffset, 5, 10);
        
        ctx.restore();
        
        // Reset global alpha if it was changed for death animation
        if (this.isDead) {
            ctx.globalAlpha = 1.0;
        }
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ============================================
// GAME CLASS
// ============================================
class Game {
    constructor() {
        this.state = 'nameEntry'; // nameEntry, start, playing, gameOver, victory
        this.input = new InputHandler();
        this.camera = new Camera();
        this.player = new Player(100, canvas.height - 80);
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.houses = [];
        this.snowflakes = [];
        this.parallaxLayers = [];
        this.particleSystem = new ParticleSystem();
        this.score = 0;
        this.lives = 3;
        this.lastTime = 0;
        this.goalX = 2000;
        this.playerName = '';
        this.nameInput = '';
        this.highScores = this.loadHighScores();
        
        // Mobile name input element
        this.mobileNameInput = document.getElementById('mobileNameInput');
        if (this.mobileNameInput) {
            // Sync input value with game's nameInput
            this.mobileNameInput.addEventListener('input', (e) => {
                this.nameInput = e.target.value.toUpperCase().substring(0, 10);
            });
            
            // Handle form submission (Enter key)
            this.mobileNameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.nameInput.trim().length > 0) {
                        this.playerName = this.nameInput.trim().substring(0, 10);
                        this.state = 'start';
                        this.nameInput = '';
                        this.mobileNameInput.value = '';
                        this.mobileNameInput.style.display = 'none';
                        this.mobileNameInput.blur();
                    }
                }
            });
            
            // On mobile, allow tapping canvas to focus input
            if (isMobile) {
                canvas.addEventListener('touchstart', (e) => {
                    if (this.state === 'nameEntry' && this.mobileNameInput) {
                        e.preventDefault();
                        this.mobileNameInput.focus();
                        // Trigger keyboard on iOS
                        setTimeout(() => {
                            this.mobileNameInput.click();
                        }, 50);
                    }
                }, { passive: false });
            }
            
            // Don't hide input on blur - let user continue typing
            // Input will be hidden when state changes or name is submitted
        }
        
        this.init();
    }
    
    loadHighScores() {
        try {
            const saved = localStorage.getItem('winterPlatformerHighScores');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }
    
    saveHighScore(name, score) {
        this.highScores.push({ name: name, score: score, date: new Date().toISOString() });
        // Sort by score (highest first) and keep top 10
        this.highScores.sort((a, b) => {
            // First sort by score (descending)
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            // If scores are equal, sort by date (newer first)
            return new Date(b.date) - new Date(a.date);
        });
        this.highScores = this.highScores.slice(0, 10);
        
        try {
            localStorage.setItem('winterPlatformerHighScores', JSON.stringify(this.highScores));
        } catch (e) {
            console.error('Failed to save high scores:', e);
        }
    }
    
    init() {
        // Clear existing level elements
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.houses = [];
        this.parallaxLayers = [];
        this.snowflakes = [];
        
        // Create parallax layers
        this.parallaxLayers.push(new ParallaxLayer(0, 'sky'));
        this.parallaxLayers.push(new ParallaxLayer(0.2, 'mountains'));
        this.parallaxLayers.push(new ParallaxLayer(0.4, 'trees'));
        
        // Create snowflakes
        for (let i = 0; i < 50; i++) {
            this.snowflakes.push(new Snowflake());
        }
        
        // Level length: 6000 pixels (twice as long)
        const levelLength = 6000;
        
        // Create ground platform (y position is the TOP of the platform)
        this.platforms.push(new Platform(0, canvas.height - 40, levelLength, 40));
        
        // Get all available names and create exactly that many enemies
        const allMaleNames = typeof SNOWMAN_NAMES !== 'undefined' ? [...SNOWMAN_NAMES.male] : [];
        const allFemaleNames = typeof SNOWMAN_NAMES !== 'undefined' ? [...SNOWMAN_NAMES.female] : [];
        const totalNames = allMaleNames.length + allFemaleNames.length;
        
        // Track used names to ensure uniqueness
        const usedNames = [];
        const usedMaleNames = [];
        const usedFemaleNames = [];
        
        // Create randomized level elements
        const groundY = canvas.height - 90;
        const minPlatformY = 250;
        const maxPlatformY = 480;
        const minSpacing = 150;
        const maxSpacing = 350;
        
        // Generate randomized platforms, enemies, collectibles, and houses
        let currentX = 300;
        const platforms = [];
        const enemies = [];
        const collectibles = [];
        const houses = [];
        
        // First, create all enemies using all available names
        let enemyX = 400;
        for (let i = 0; i < totalNames; i++) {
            // Alternate between male and female, or random if one gender runs out
            let gender, name;
            if (usedMaleNames.length >= allMaleNames.length) {
                gender = 'female';
                const available = allFemaleNames.filter(n => !usedFemaleNames.includes(n));
                name = available[Math.floor(Math.random() * available.length)];
                usedFemaleNames.push(name);
            } else if (usedFemaleNames.length >= allFemaleNames.length) {
                gender = 'male';
                const available = allMaleNames.filter(n => !usedMaleNames.includes(n));
                name = available[Math.floor(Math.random() * available.length)];
                usedMaleNames.push(name);
            } else {
                gender = Math.random() > 0.5 ? 'male' : 'female';
                if (gender === 'male') {
                    const available = allMaleNames.filter(n => !usedMaleNames.includes(n));
                    name = available[Math.floor(Math.random() * available.length)];
                    usedMaleNames.push(name);
                } else {
                    const available = allFemaleNames.filter(n => !usedFemaleNames.includes(n));
                    name = available[Math.floor(Math.random() * available.length)];
                    usedFemaleNames.push(name);
                }
            }
            
            const enemy = new Enemy(enemyX, groundY, gender, name, usedNames);
            enemies.push(enemy);
            usedNames.push(name);
            enemyX += 200 + Math.random() * 300; // Space enemies throughout level
        }
        
        // Generate platforms, collectibles, and houses
        const existingPlatforms = []; // Track platform positions to prevent overlap
        while (currentX < levelLength - 500) {
            const rand = Math.random();
            
            if (rand < 0.5) {
                // Create floating platform (more platforms)
                const platformY = minPlatformY + Math.random() * (maxPlatformY - minPlatformY);
                const platformWidth = 100 + Math.random() * 150;
                
                // Check for overlap with existing platforms
                let overlaps = false;
                for (const existing of existingPlatforms) {
                    const horizontalOverlap = (currentX < existing.x + existing.width && currentX + platformWidth > existing.x);
                    const verticalOverlap = (Math.abs(platformY - existing.y) < 50); // 50px vertical tolerance
                    if (horizontalOverlap && verticalOverlap) {
                        overlaps = true;
                        break;
                    }
                }
                
                // Only add platform if it doesn't overlap
                if (!overlaps) {
                    platforms.push(new Platform(currentX, platformY, platformWidth, 20));
                    existingPlatforms.push({ x: currentX, y: platformY, width: platformWidth });
                    
                    // Sometimes add collectible above platform
                    if (Math.random() > 0.4) {
                        const collectibleType = Math.random() > 0.5 ? 'present' : 'star';
                        collectibles.push(new Collectible(currentX + platformWidth / 2, platformY - 50, collectibleType));
                    }
                }
            } else if (rand < 0.75) {
                // Create collectible
                const collectibleY = minPlatformY + Math.random() * (maxPlatformY - minPlatformY);
                const collectibleType = Math.random() > 0.5 ? 'present' : 'star';
                collectibles.push(new Collectible(currentX, collectibleY, collectibleType));
            } else {
                // Create house
                houses.push(new House(currentX, canvas.height - 100));
            }
            
            // Move to next position with random spacing
            currentX += minSpacing + Math.random() * (maxSpacing - minSpacing);
        }
        
        // Add platforms, enemies, collectibles, and houses
        this.platforms.push(...platforms);
        this.enemies.push(...enemies);
        this.collectibles.push(...collectibles);
        this.houses.push(...houses);
        
        // Ensure we have enough platforms (check for overlap when adding)
        const platformPositions = existingPlatforms.map(p => ({ x: p.x, y: p.y, width: p.width }));
        if (this.platforms.length < 30) {
            // Add more platforms if we don't have enough
            let addedX = 500;
            for (let i = this.platforms.length; i < 30; i++) {
                const platformY = minPlatformY + Math.random() * (maxPlatformY - minPlatformY);
                const platformWidth = 120;
                
                // Check for overlap
                let overlaps = false;
                for (const existing of platformPositions) {
                    const horizontalOverlap = (addedX < existing.x + existing.width && addedX + platformWidth > existing.x);
                    const verticalOverlap = (Math.abs(platformY - existing.y) < 50);
                    if (horizontalOverlap && verticalOverlap) {
                        overlaps = true;
                        break;
                    }
                }
                
                if (!overlaps) {
                    this.platforms.push(new Platform(addedX, platformY, platformWidth, 20));
                    platformPositions.push({ x: addedX, y: platformY, width: platformWidth });
                }
                addedX += 400;
            }
        }
        
        // Goal (Christmas tree) at end of level
        this.goalX = levelLength - 200; // 5800 pixels (for 6000 pixel level)
    }
    
    update(deltaTime) {
        // Handle name entry
        if (this.state === 'nameEntry') {
            // On mobile, show and focus the input field to trigger keyboard
            if (isMobile && this.mobileNameInput) {
                if (this.mobileNameInput.style.display === 'none' || this.mobileNameInput.style.display === '') {
                    this.mobileNameInput.style.display = 'block';
                    // Focus after a short delay to ensure it's visible
                    setTimeout(() => {
                        this.mobileNameInput.focus();
                        this.mobileNameInput.value = this.nameInput;
                    }, 100);
                }
                // Sync the displayed value
                if (this.mobileNameInput.value.toUpperCase() !== this.nameInput) {
                    this.mobileNameInput.value = this.nameInput;
                }
            } else {
                // Desktop: Handle keyboard input for name
                let keyPressed = false;
                for (const key in this.input.keys) {
                    if (this.input.keys[key]) {
                        keyPressed = true;
                        if (key.length === 1 && key.match(/[a-zA-Z0-9]/) && this.nameInput.length < 10) {
                            if (!this.input.keyProcessed) {
                                this.nameInput += key.toUpperCase();
                                this.input.keyProcessed = true;
                            }
                        } else if (key === 'backspace') {
                            if (!this.input.keyProcessed) {
                                this.nameInput = this.nameInput.slice(0, -1);
                                this.input.keyProcessed = true;
                            }
                        } else if (key === 'enter' || key === ' ') {
                            if (!this.input.keyProcessed) {
                                if (this.nameInput.trim().length > 0) {
                                    this.playerName = this.nameInput.trim().substring(0, 10); // Max 10 chars
                                    this.state = 'start';
                                    this.nameInput = '';
                                    if (this.mobileNameInput) {
                                        this.mobileNameInput.style.display = 'none';
                                    }
                                }
                                this.input.keyProcessed = true;
                            }
                        }
                    }
                }
                // Reset key processed flag when all keys are released
                if (!keyPressed) {
                    this.input.keyProcessed = false;
                }
            }
            return;
        } else {
            // Hide mobile input when not in nameEntry state
            if (this.mobileNameInput && this.mobileNameInput.style.display !== 'none') {
                this.mobileNameInput.style.display = 'none';
                this.mobileNameInput.blur();
            }
        }
        
        if (this.state === 'start' || this.state === 'gameOver' || this.state === 'victory') {
            if (this.input.isPressed(' ') || this.input.isPressed('enter')) {
                this.restart();
            }
            return;
        }
        
        // Update parallax layers
        for (const layer of this.parallaxLayers) {
            layer.update(this.camera.x);
        }
        
        // Update snowflakes
        for (const flake of this.snowflakes) {
            flake.update(deltaTime);
        }
        
        // Update particle system
        this.particleSystem.update(deltaTime);
        
        // Update houses
        for (const house of this.houses) {
            house.update(deltaTime, this.camera);
        }
        
        // Handle player house entry/exit
        if (this.player.inHouse) {
            this.player.houseEntryTimer += deltaTime;
            
            // After 1 second of being invisible, exit from door
            if (this.player.houseEntryTimer > 1000) {
                const doorBounds = this.player.currentHouse.getDoorBounds();
                // Position player at door, but ensure they're on the ground
                this.player.x = doorBounds.x + doorBounds.width / 2 - this.player.width / 2;
                // Position player so their bottom aligns with ground platform (canvas.height - 40)
                this.player.y = canvas.height - 40 - this.player.height;
                this.player.velocityX = 0;
                this.player.velocityY = 0;
                this.player.onGround = true; // Ensure player is on ground
                this.player.inHouse = false;
                this.player.houseEntryTimer = 0;
                this.player.houseExitTimer = 0;
                this.player.currentHouse = null;
            }
        } else {
            // Update player normally (no life loss on falling - only on snowman contact)
            // Add chimneys as platforms for collision
            const platformsWithChimneys = [...this.platforms];
            for (const house of this.houses) {
                if (!house.lightsOn) {
                    const chimneyBounds = house.getChimneyBounds();
                    platformsWithChimneys.push({
                        getBounds: () => ({
                            x: chimneyBounds.x - 2,
                            y: chimneyBounds.y,
                            width: chimneyBounds.width + 4,
                            height: 3
                        })
                    });
                }
            }
            this.player.update(deltaTime, this.input, platformsWithChimneys, this.houses, this.camera, this.particleSystem, this.goalX);
            
            // Check chimney collisions
            for (const house of this.houses) {
                if (!house.lightsOn) {
                    const chimneyBounds = house.getChimneyBounds();
                    const playerBounds = this.player.getBounds();
                    
                    // Check if player is on or near chimney top (more lenient detection)
                    const playerCenterX = playerBounds.x + playerBounds.width / 2;
                    const chimneyCenterX = chimneyBounds.x + chimneyBounds.width / 2;
                    const distanceX = Math.abs(playerCenterX - chimneyCenterX);
                    const playerBottom = playerBounds.y + playerBounds.height;
                    
                    // Player is on chimney if:
                    // - Horizontally aligned with chimney (within reasonable distance)
                    // - Player bottom is at or near chimney top
                    // - Player is falling or standing still
                    if (distanceX < chimneyBounds.width / 2 + playerBounds.width / 2 &&
                        playerBottom >= chimneyBounds.y - 5 &&
                        playerBottom <= chimneyBounds.y + 15 &&
                        this.player.velocityY >= -2) {
                        
                        // Player entered chimney
                        this.player.inHouse = true;
                        this.player.houseEntryTimer = 0;
                        this.player.houseExitTimer = 0;
                        this.player.currentHouse = house;
                        house.lightsOn = true;
                        this.score += 200; // Points for entering house
                        
                        // Create chimney smoke particles
                        const chimneyBounds = house.getChimneyBounds();
                        this.particleSystem.createChimneySmoke(
                            chimneyBounds.x + chimneyBounds.width / 2,
                            chimneyBounds.y
                        );
                        
                        // Spawn a present somewhere on screen
                        const screenLeft = this.camera.x;
                        const screenRight = this.camera.x + canvas.width;
                        const screenTop = 100;
                        const screenBottom = canvas.height - 150;
                        
                        // Random position on screen (visible area)
                        const presentX = screenLeft + Math.random() * (screenRight - screenLeft);
                        const presentY = screenTop + Math.random() * (screenBottom - screenTop);
                        
                        // Create new present collectible
                        this.collectibles.push(new Collectible(presentX, presentY, 'present'));
                        
                        break;
                    }
                }
            }
        }
        
        // Update camera (auto-scrolling, follows player if beyond 2/3 of screen and moving right)
        const playerMovingRight = this.input.isPressed('d') || this.input.isPressed('arrowright');
        this.camera.update(deltaTime, this.player.x, this.player.y, 6000, playerMovingRight);
        
        // Update enemies
        for (const enemy of this.enemies) {
            enemy.update(deltaTime);
            
            // Don't check collision if player is dead
            if (this.player.isDead) {
                continue;
            }
            
            if (!enemy.defeated) {
                const enemyBounds = enemy.getBounds();
                const playerBounds = this.player.getBounds();
                
                // Check collision
                if (playerBounds.x < enemyBounds.x + enemyBounds.width &&
                    playerBounds.x + playerBounds.width > enemyBounds.x &&
                    playerBounds.y < enemyBounds.y + enemyBounds.height &&
                    playerBounds.y + playerBounds.height > enemyBounds.y) {
                    
                    // Calculate positions
                    const playerBottom = playerBounds.y + playerBounds.height;
                    const playerTop = playerBounds.y;
                    const enemyTop = enemyBounds.y;
                    const enemyCenter = enemyBounds.y + enemyBounds.height / 2;
                    const stompThreshold = 15; // pixels from enemy top
                    
                    // Check if player is stomping (falling down onto enemy from above)
                    if (this.player.velocityY > 0 && playerBottom >= enemyTop && playerBottom <= enemyTop + stompThreshold) {
                        // Stomp successful
                        enemy.defeated = true;
                        this.player.velocityY = -5; // Bounce
                        this.score += 100;
                        
                        // Create enemy defeat particles
                        const enemyCenterX = enemyBounds.x + enemyBounds.width / 2;
                        const enemyCenterY = enemyBounds.y + enemyBounds.height / 2;
                        this.particleSystem.createEnemyDefeatParticles(enemyCenterX, enemyCenterY);
                    } 
                    // Player is jumping upward - allow jumping over without penalty
                    else if (this.player.velocityY < 0) {
                        // Player is moving upward - allow to pass over enemy
                        // Only lose life if clearly hitting from below (player top below enemy bottom)
                        if (playerTop > enemyBounds.y + enemyBounds.height - 5) {
                            // Hitting from below - lose life
                            this.loseLife();
                            return;
                        }
                        // Otherwise, allow jumping over - no penalty
                    }
                    // Player is falling or stationary - lose life only on side/bottom contact
                    else {
                        // Check if it's a side collision (not stomping)
                        // Only lose life if player is clearly hitting from the side or bottom
                        if (playerBottom > enemyTop + 5) {
                            // Hitting from side or bottom - lose life
                            this.loseLife();
                            return;
                        }
                        // If player is very close to enemy top while falling, might be a near-miss - be lenient
                    }
                }
            }
        }
        
        // Update collectibles
        for (const collectible of this.collectibles) {
            collectible.update(deltaTime);
            
            if (!collectible.collected) {
                const collBounds = collectible.getBounds();
                const playerBounds = this.player.getBounds();
                
                if (playerBounds.x < collBounds.x + collBounds.width &&
                    playerBounds.x + playerBounds.width > collBounds.x &&
                    playerBounds.y < collBounds.y + collBounds.height &&
                    playerBounds.y + playerBounds.height > collBounds.y) {
                    collectible.collected = true;
                    this.score += 50;
                    
                    // Create collectible particles
                    const collectibleCenterX = collBounds.x + collBounds.width / 2;
                    const collectibleCenterY = collBounds.y + collBounds.height / 2;
                    this.particleSystem.createCollectibleParticles(collectibleCenterX, collectibleCenterY, collectible.type);
                }
            }
        }
        
        // Check win condition
        if (this.player.x >= this.goalX) {
            this.state = 'victory';
            // Save high score
            if (this.playerName) {
                this.saveHighScore(this.playerName, this.score);
            }
        }
    }
    
    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.state = 'gameOver';
            // Save high score
            if (this.playerName) {
                this.saveHighScore(this.playerName, this.score);
            }
        } else {
            // Trigger death animation instead of immediate reset
            this.player.isDead = true;
            this.player.deathTimer = 0;
            this.player.deathRotation = 0;
            this.player.deathScale = 1;
            this.player.deathOpacity = 1;
            // Store death position for animation
            this.player.deathX = this.player.x;
            this.player.deathY = this.player.y;
            
            // Stop player movement
            this.player.velocityX = 0;
            this.player.velocityY = 0;
            
            // Position reset will be handled in player.update() after 1 second
        }
    }
    
    restart() {
        this.state = 'playing';
        this.score = 0;
        this.lives = 3;
        this.player = new Player(100, canvas.height - 80);
        this.camera = new Camera();
        
        // Reset particle system
        this.particleSystem = new ParticleSystem();
        
        // Regenerate entire level (including resetting house lights and randomizing layout)
        this.init();
    }
    
    draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw parallax background
        for (const layer of this.parallaxLayers) {
            layer.draw(ctx, this.camera);
        }
        
        // Draw snowflakes
        for (const flake of this.snowflakes) {
            flake.draw(ctx);
        }
        
        // Draw houses
        for (const house of this.houses) {
            house.draw(ctx, this.camera);
        }
        
        // Draw goal (Large Christmas tree with multiple branches and ornaments)
        const goalScreenX = this.goalX - this.camera.x;
        if (goalScreenX > -200 && goalScreenX < canvas.width + 200) {
            const treeBaseY = canvas.height - 40; // Ground level
            const treeWidth = 120; // Much wider tree
            const treeHeight = 300; // Much taller tree
            const trunkWidth = 30;
            const trunkHeight = 60;
            
            // Tree trunk (larger)
            ctx.fillStyle = '#654321';
            ctx.fillRect(goalScreenX - trunkWidth / 2, treeBaseY - trunkHeight, trunkWidth, trunkHeight);
            
            // Multiple branch levels (6 levels for a full tree)
            ctx.fillStyle = '#228B22';
            const branchLevels = [
                { y: treeBaseY - 50, width: 80, height: 40 },
                { y: treeBaseY - 90, width: 100, height: 50 },
                { y: treeBaseY - 140, width: 110, height: 50 },
                { y: treeBaseY - 190, width: 100, height: 50 },
                { y: treeBaseY - 240, width: 80, height: 40 },
                { y: treeBaseY - 280, width: 60, height: 30 }
            ];
            
            for (const level of branchLevels) {
                // Draw branch triangle pointing upward (base at bottom, point at top)
                ctx.beginPath();
                ctx.moveTo(goalScreenX - level.width / 2, level.y); // Bottom left
                ctx.lineTo(goalScreenX + level.width / 2, level.y); // Bottom right
                ctx.lineTo(goalScreenX, level.y - level.height); // Top point (center)
                ctx.closePath();
                ctx.fill();
                
                // Add some snow on branches (at the top edge)
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(goalScreenX - level.width / 2, level.y - level.height - 2, level.width, 4);
                ctx.fillStyle = '#228B22';
            }
            
            // Christmas ornaments (balls) - lots of them!
            const ornaments = [
                // Bottom layer
                { x: goalScreenX - 25, y: treeBaseY - 60, color: '#FF0000', size: 6 },
                { x: goalScreenX + 25, y: treeBaseY - 60, color: '#0000FF', size: 6 },
                { x: goalScreenX - 15, y: treeBaseY - 75, color: '#FFFF00', size: 5 },
                { x: goalScreenX + 15, y: treeBaseY - 75, color: '#FF00FF', size: 5 },
                // Second layer
                { x: goalScreenX - 30, y: treeBaseY - 100, color: '#FF0000', size: 6 },
                { x: goalScreenX + 30, y: treeBaseY - 100, color: '#00FF00', size: 6 },
                { x: goalScreenX - 20, y: treeBaseY - 115, color: '#0000FF', size: 5 },
                { x: goalScreenX + 20, y: treeBaseY - 115, color: '#FFFF00', size: 5 },
                { x: goalScreenX, y: treeBaseY - 110, color: '#FF00FF', size: 6 },
                // Third layer
                { x: goalScreenX - 35, y: treeBaseY - 150, color: '#FF0000', size: 6 },
                { x: goalScreenX + 35, y: treeBaseY - 150, color: '#0000FF', size: 6 },
                { x: goalScreenX - 25, y: treeBaseY - 165, color: '#FFFF00', size: 5 },
                { x: goalScreenX + 25, y: treeBaseY - 165, color: '#00FF00', size: 5 },
                { x: goalScreenX - 10, y: treeBaseY - 160, color: '#FF00FF', size: 5 },
                { x: goalScreenX + 10, y: treeBaseY - 160, color: '#FF0000', size: 5 },
                // Fourth layer
                { x: goalScreenX - 30, y: treeBaseY - 200, color: '#0000FF', size: 6 },
                { x: goalScreenX + 30, y: treeBaseY - 200, color: '#FFFF00', size: 6 },
                { x: goalScreenX - 20, y: treeBaseY - 215, color: '#FF0000', size: 5 },
                { x: goalScreenX + 20, y: treeBaseY - 215, color: '#00FF00', size: 5 },
                { x: goalScreenX, y: treeBaseY - 210, color: '#FF00FF', size: 6 },
                // Fifth layer
                { x: goalScreenX - 25, y: treeBaseY - 250, color: '#FF0000', size: 5 },
                { x: goalScreenX + 25, y: treeBaseY - 250, color: '#0000FF', size: 5 },
                { x: goalScreenX - 15, y: treeBaseY - 265, color: '#FFFF00', size: 5 },
                { x: goalScreenX + 15, y: treeBaseY - 265, color: '#00FF00', size: 5 },
                // Top layer
                { x: goalScreenX - 20, y: treeBaseY - 290, color: '#FF0000', size: 5 },
                { x: goalScreenX + 20, y: treeBaseY - 290, color: '#0000FF', size: 5 },
                { x: goalScreenX, y: treeBaseY - 295, color: '#FFFF00', size: 5 }
            ];
            
            // Draw all ornaments
            for (const ornament of ornaments) {
                // Ornament ball
                ctx.fillStyle = ornament.color;
                ctx.beginPath();
                ctx.arc(ornament.x, ornament.y, ornament.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Ornament highlight (shiny effect)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(ornament.x - ornament.size * 0.3, ornament.y - ornament.size * 0.3, ornament.size * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // Ornament hook/string
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(ornament.x, ornament.y - ornament.size);
                ctx.lineTo(ornament.x, ornament.y - ornament.size - 3);
                ctx.stroke();
            }
            
            // Large star on top
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                const x = goalScreenX + Math.cos(angle) * 15;
                const y = treeBaseY - treeHeight + Math.sin(angle) * 15;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            // Star center highlight
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.arc(goalScreenX, treeBaseY - treeHeight, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw platforms
        for (const platform of this.platforms) {
            platform.draw(ctx, this.camera);
        }
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(ctx, this.camera);
        }
        
        // Draw collectibles
        for (const collectible of this.collectibles) {
            collectible.draw(ctx, this.camera);
        }
        
        // Draw particles (behind player but above collectibles)
        this.particleSystem.draw(ctx, this.camera);
        
        // Draw player (only if not in house - player is invisible for 1 second after entering chimney)
        if (this.state === 'playing') {
            // Player is invisible immediately when entering chimney, stays invisible for 1 second
            if (!this.player.inHouse) {
                this.player.draw(ctx, this.camera);
            }
        }
        
        // Draw UI
        this.drawUI();
    }
    
    drawUI() {
        // Score and lives with background for readability
        ctx.font = 'bold 28px Arial';
        const scoreText = `Punkte: ${this.score}`;
        const livesText = `Leben: ${this.lives}`;
        
        // Draw semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(5, 5, 200, 70);
        
        // Draw text with outline for better visibility
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#FFFFFF';
        
        ctx.strokeText(scoreText, 15, 35);
        ctx.fillText(scoreText, 15, 35);
        
        ctx.strokeText(livesText, 15, 65);
        ctx.fillText(livesText, 15, 65);
        
        // Reset line width
        ctx.lineWidth = 1;
        
        // Game state screens
        if (this.state === 'nameEntry') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GIB DEINEN NAMEN EIN', canvas.width / 2, canvas.height / 2 - 50);
            
            ctx.font = '32px Arial';
            const displayName = this.nameInput || '_';
            ctx.fillStyle = '#FFD700';
            ctx.fillText(displayName, canvas.width / 2, canvas.height / 2);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '18px Arial';
            ctx.fillText('Tippe deinen Namen und drücke ENTER', canvas.width / 2, canvas.height / 2 + 40);
            ctx.fillText('(Max. 10 Zeichen)', canvas.width / 2, canvas.height / 2 + 65);
            ctx.textAlign = 'left';
        } else if (this.state === 'start') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SANTA\'S WINTER ABENTEUER', canvas.width / 2, canvas.height / 2 - 80);
            
            if (this.playerName) {
                ctx.font = '24px Arial';
                ctx.fillText(`Spieler: ${this.playerName}`, canvas.width / 2, canvas.height / 2 - 30);
            }
            
            ctx.font = '24px Arial';
            ctx.fillText('Drücke LEERTASTE oder ENTER zum Starten', canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText('Pfeiltasten oder A/D zum Bewegen', canvas.width / 2, canvas.height / 2 + 50);
            ctx.fillText('LEERTASTE zum Springen', canvas.width / 2, canvas.height / 2 + 80);
            ctx.textAlign = 'left';
        } else if (this.state === 'gameOver') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FF0000';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SPIEL VORBEI', canvas.width / 2, canvas.height / 2 - 150);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px Arial';
            ctx.fillText(`${this.playerName ? this.playerName + ' - ' : ''}Endpunktzahl: ${this.score}`, canvas.width / 2, canvas.height / 2 - 100);
            
            // Display high scores (top 10, but only show what fits on screen)
            ctx.font = '20px Arial';
            ctx.fillText('BESTENLISTE', canvas.width / 2, canvas.height / 2 - 60);
            ctx.font = '16px Arial';
            const topScores = this.highScores.slice(0, 10);
            const startY = canvas.height / 2 - 30;
            const lineHeight = 20;
            const maxVisible = Math.min(topScores.length, 8); // Show up to 8 scores to fit on screen
            
            for (let i = 0; i < maxVisible; i++) {
                const hs = topScores[i];
                ctx.fillText(`${i + 1}. ${hs.name}: ${hs.score}`, canvas.width / 2, startY + i * lineHeight);
            }
            
            ctx.font = '20px Arial';
            ctx.fillText('Drücke LEERTASTE oder ENTER zum Neustart', canvas.width / 2, canvas.height / 2 + 130);
            ctx.textAlign = 'left';
        } else if (this.state === 'victory') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00FF00';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('DU HAST GEWONNEN!', canvas.width / 2, canvas.height / 2 - 150);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px Arial';
            ctx.fillText(`${this.playerName ? this.playerName + ' - ' : ''}Endpunktzahl: ${this.score}`, canvas.width / 2, canvas.height / 2 - 100);
            
            // Display high scores (top 10, but only show what fits on screen)
            ctx.font = '20px Arial';
            ctx.fillText('BESTENLISTE', canvas.width / 2, canvas.height / 2 - 60);
            ctx.font = '16px Arial';
            const topScores = this.highScores.slice(0, 10);
            const startY = canvas.height / 2 - 30;
            const lineHeight = 20;
            const maxVisible = Math.min(topScores.length, 8); // Show up to 8 scores to fit on screen
            
            for (let i = 0; i < maxVisible; i++) {
                const hs = topScores[i];
                ctx.fillText(`${i + 1}. ${hs.name}: ${hs.score}`, canvas.width / 2, startY + i * lineHeight);
            }
            
            ctx.font = '20px Arial';
            ctx.fillText('Drücke LEERTASTE oder ENTER zum erneuten Spielen', canvas.width / 2, canvas.height / 2 + 130);
            ctx.textAlign = 'left';
        }
    }
    
    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Cap deltaTime to prevent large jumps
        const cappedDelta = Math.min(deltaTime, 50);
        
        this.update(cappedDelta);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    start() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
}

// ============================================
// START GAME
// ============================================
const game = new Game();
game.start();

