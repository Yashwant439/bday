// Enhanced script.js with premium animations

// Global confetti variables
let confettiParticles = [];
let confettiCanvas = null;
let confettiCtx = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initParticles();
    initNavigation();
    initCountdown();
    initPhotoGallery();
    initWishForm();
    initMusicPlayer();
    initConfetti();
    initSmoothScrolling();
    initParallaxEffects();
    restoreLikes();
    // Format timestamps on page (convert ISO/other formats to user's local time)
    if (typeof formatWishTimes === 'function') formatWishTimes();
    
    // Auto-start animations
    startBalloonAnimation();
    startCakeAnimation();
    
    console.log('🎉 Premium Birthday Website Loaded!');

    // Prevent same-person duplicate attempts: when user types name, check localStorage
    const nameInput = document.getElementById('nameInput');
    const submitBtn = document.querySelector('.btn-submit-wish');

    if (nameInput && submitBtn) {
        // store original text for restoration
        submitBtn.dataset.originalText = submitBtn.innerHTML;

        nameInput.addEventListener('input', () => {
            const val = nameInput.value.trim().toLowerCase();
            const key = 'wished_' + val;
            if (val && localStorage.getItem(key)) {
                if (nameInput.dataset.notified !== '1') {
                    showNotification('You have already sent a wish for this name.', 'info');
                    nameInput.dataset.notified = '1';
                }
                // Do NOT disable the submit button — only notify the user.
            } else {
                nameInput.dataset.notified = '0';
            }
        });

        // Also run once on load if there's already a name prefilled
        const preKey = nameInput.value && localStorage.getItem('wished_' + nameInput.value.trim().toLowerCase());
        if (preKey) {
            showNotification('You have already sent a wish for this name.', 'info');
            nameInput.dataset.notified = '1';
        }
    }
});

/* === Initialize Particles.js Background === */
function initParticles() {
    // Particles.js is loaded in HTML via CDN
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80 },
                color: { value: ["#FFD700", "#FF6B8B", "#4ECDC4", "#9D4EDD"] },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3 },
                move: { speed: 1 }
            }
        });
    }
}

/* === Premium Navigation === */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll spy
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* === Enhanced Countdown === */
function initCountdown() {
    const birthday = new Date('December 19, 2025 00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = birthday - now;
        
        if (distance < 0) {
            document.querySelector('.countdown-container').innerHTML = `
                <h3>🎉 Happy Birthday Nikhil! 🎉</h3>
                <p>The celebration is here! Let's party! 🥳</p>
            `;
            createConfettiRain();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Add animation to changing numbers
        animateCountdown('days', days);
        animateCountdown('hours', hours);
        animateCountdown('minutes', minutes);
        animateCountdown('seconds', seconds);
    }
    
    function animateCountdown(id, value) {
        const element = document.getElementById(id);
        if (element.textContent !== value.toString().padStart(2, '0')) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#FFD700';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 300);
        }
        element.textContent = value.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

/* === Photo Gallery with 3D Effects === */
function initPhotoGallery() {
    const photoCards = document.querySelectorAll('.photo-card');
    
    photoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
        
        // Click to enlarge
        card.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('h4')?.textContent || '';
            openLightbox(img.src, caption);
        });
    });
}

/* === Enhanced Wish System === */
function initWishForm() {
    const wishForm = document.querySelector('.wish-form-glass');
    const nameInput = document.getElementById('nameInput');
    const wishMessage = document.getElementById('wishMessage');
    
    // Auto-complete enhancement
    nameInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const datalist = document.getElementById('namesDatalist');
        const options = Array.from(datalist.options);
        
        // Highlight matching names
        options.forEach(option => {
            if (option.value.toLowerCase().includes(value)) {
                this.style.borderColor = '#4ECDC4';
            }
        });
    });
    
    // Form validation with real-time feedback
    wishMessage.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const hasBirthdayKeywords = /birthday|happy|wish|celebrate/.test(value);
        const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(value);
        
        if (hasBirthdayKeywords || hasEmoji) {
            this.style.borderColor = '#4ECDC4';
            this.style.boxShadow = '0 0 20px rgba(78, 205, 196, 0.3)';
        } else {
            this.style.borderColor = '#FF6B8B';
            this.style.boxShadow = '0 0 20px rgba(255, 107, 139, 0.3)';
        }
    });
}

/* === Premium Music Player === */
function initMusicPlayer() {
    const music = document.getElementById('bgMusic');
    const toggleBtn = document.querySelector('.player-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    
    if (!music) {
        console.warn('Music element not found');
        return;
    }
    
    // Set initial volume
    music.volume = 0.3;
    if (volumeSlider) {
        volumeSlider.value = 30;
    }
    
    // Toggle music
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (music.paused) {
                music.play().catch(e => {
                    console.log('Music play failed:', e);
                    showNotification('Click anywhere to enable audio', 'info');
                });
                if (icon) icon.classList.remove('fa-music');
                if (icon) icon.classList.add('fa-pause');
                showNotification('Music playing 🎵', 'success');
            } else {
                music.pause();
                if (icon) icon.classList.remove('fa-pause');
                if (icon) icon.classList.add('fa-music');
                showNotification('Music paused', 'info');
            }
        });
    }
    
    // Volume control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            music.volume = this.value / 100;
        });
    }
    
    // Auto-play on user interaction (one time only)
    let autoPlayTriggered = false;
    function enableAutoPlay() {
        if (autoPlayTriggered) return;
        autoPlayTriggered = true;
        music.play().catch(e => {
            console.log('Auto-play prevented by browser:', e);
        });
        document.removeEventListener('click', enableAutoPlay);
        document.removeEventListener('touchstart', enableAutoPlay);
    }
    
    document.addEventListener('click', enableAutoPlay);
    document.addEventListener('touchstart', enableAutoPlay);
}

/* === Enhanced Confetti System === */
function initConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    confettiCtx = confettiCanvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create confetti particle
    function createConfettiParticle(x, y) {
        const colors = ['#FF6B8B', '#FFD700', '#4ECDC4', '#9D4EDD', '#FF8E53'];
        const types = ['circle', 'rect', 'heart'];
        
        return {
            x: x || Math.random() * confettiCanvas.width,
            y: y || -20,
            radius: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: types[Math.floor(Math.random() * types.length)],
            speed: Math.random() * 3 + 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.2 - 0.1,
            wobble: Math.random() * 2,
            wobbleSpeed: Math.random() * 0.1
        };
    }
    
    // Render confetti
    function renderConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confettiParticles.forEach((p, i) => {
            // Update position
            p.y += p.speed;
            p.x += Math.sin(Date.now() * 0.001 * p.wobbleSpeed) * p.wobble;
            p.rotation += p.rotationSpeed;
            
            // Draw particle
            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate(p.rotation);
            confettiCtx.fillStyle = p.color;
            
            switch(p.type) {
                case 'circle':
                    confettiCtx.beginPath();
                    confettiCtx.arc(0, 0, p.radius, 0, Math.PI * 2);
                    confettiCtx.fill();
                    break;
                case 'rect':
                    confettiCtx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                    break;
                case 'heart':
                    drawHeart(confettiCtx, p.radius);
                    break;
            }
            
            confettiCtx.restore();
            
            // Remove if out of bounds
            if (p.y > confettiCanvas.height + 50) {
                confettiParticles.splice(i, 1);
            }
        });
        
        if (confettiParticles.length > 0) {
            requestAnimationFrame(renderConfetti);
        }
    }
    
    // Draw heart shape
    function drawHeart(ctx, size) {
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, size/3);
        // Left top curve
        ctx.bezierCurveTo(
            -size/2, -size/3,
            -size, size/2,
            0, size
        );
        // Right top curve
        ctx.bezierCurveTo(
            size, size/2,
            size/2, -size/3,
            0, size/3
        );
        ctx.fill();
    }
    
    // Create confetti burst
    window.createConfettiBurst = function(count = 200) {
        for (let i = 0; i < count; i++) {
            confettiParticles.push(createConfettiParticle());
        }
        renderConfetti();
        playSound('success');
    };
    
    // Create confetti rain
    window.createConfettiRain = function(duration = 5000) {
        renderConfetti();
        
        const interval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                confettiParticles.push(createConfettiParticle(
                    Math.random() * confettiCanvas.width
                ));
            }
        }, 100);
        
        setTimeout(() => clearInterval(interval), duration);
    };
}

/* === Smooth Scrolling === */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* === Parallax Effects === */
function initParallaxEffects() {
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

/* === Balloon Animation === */
function startBalloonAnimation() {
    const balloons = document.querySelectorAll('.balloon');
    
    balloons.forEach((balloon, index) => {
        // Randomize animation
        const duration = 15 + Math.random() * 10;
        const delay = index * 2;
        
        balloon.style.animation = `float ${duration}s infinite ease-in-out ${delay}s`;
        
        // Add shine effect
        const shine = document.createElement('div');
        shine.style.position = 'absolute';
        shine.style.top = '20%';
        shine.style.left = '30%';
        shine.style.width = '30%';
        shine.style.height = '20%';
        shine.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)';
        shine.style.borderRadius = '50%';
        balloon.appendChild(shine);
    });
}

/* === Cake Animation === */
function startCakeAnimation() {
    const cake = document.querySelector('.spinning-cake');
    
    setInterval(() => {
        cake.style.boxShadow = `
            0 0 60px rgba(255, 215, 0, ${0.3 + Math.random() * 0.3}),
            0 0 120px rgba(255, 107, 139, ${0.2 + Math.random() * 0.2})
        `;
    }, 1000);
}

/* === Enhanced Add Wish Function === */
async function addWish() {
    const nameInput = document.getElementById('nameInput');
    const wishMessage = document.getElementById('wishMessage');
    
    const name = nameInput.value.trim();
    const message = wishMessage.value.trim();
    
    // Validation
    if (!name) {
        showNotification('Please enter your name!', 'error');
        nameInput.focus();
        return;
    }
    
    if (!message) {
        showNotification('Please write a birthday wish!', 'error');
        wishMessage.focus();
        return;
    }
    
    // Birthday content validation
    const lowered = message.toLowerCase();
    const hasKeywords = /birthday|happy|wish|celebrate|congrat|best wishes/.test(lowered);
    const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(message);
    
    if (!hasKeywords && !hasEmoji) {
        showNotification('Please include birthday-related words or emojis! 🎂', 'error');
        wishMessage.focus();
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit-wish');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/add-wish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: escapeHtml(name), 
                message: escapeHtml(message) 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Add wish to DOM with animation
            addWishToDOM(result.wish);
            
            // Reset form
            nameInput.value = '';
            wishMessage.value = '';
            document.querySelector('.char-counter').textContent = '0/500';
            
            // Show success
            showNotification('Wish sent successfully! 🎉', 'success');
            
            // Launch confetti
            createConfettiBurst(300);
            
            // Play success sound
            playSound('success');
            
            // Scroll to new wish
            setTimeout(() => {
                const wishesGrid = document.getElementById('wishesGrid');
                if (wishesGrid.firstChild) {
                    wishesGrid.firstChild.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 500);
            // Mark this name as submitted in localStorage (UX only)
            try {
                const key = 'wished_' + name.toLowerCase();
                localStorage.setItem(key, '1');
                // Do not disable the submit button — server enforces duplicates.
            } catch (e) {
                // ignore storage errors
            }
            // Ensure the newly-added wish timestamp is formatted
            if (typeof formatWishTimes === 'function') formatWishTimes();
        } else {
            // If server tells us the user already sent a wish, set localStorage (UX only)
            const errMsg = result.error || 'Failed to send wish';
            showNotification(errMsg, 'error');
            if (errMsg.toLowerCase().includes('already')) {
                try {
                    const key = 'wished_' + name.toLowerCase();
                    localStorage.setItem(key, '1');
                    // Don't disable the submit button here; only notify the user.
                } catch (e) {}
            }
        }
    } catch (err) {
        console.error(err);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        // Always reset the button to its original state after the request finishes
        try {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        } catch (e) {}
    }
}

/* === Add Wish to DOM with Animation === */
function addWishToDOM(wish) {
    const wishesGrid = document.getElementById('wishesGrid');
    
    const wishBubble = document.createElement('div');
    wishBubble.className = 'wish-bubble';
    wishBubble.setAttribute('data-aos', 'fade-up');
    wishBubble.setAttribute('data-wish-id', wish.id);
    wishBubble.innerHTML = `
        <div class="bubble-content">
            <div class="bubble-header">
                <div class="avatar" style="background: linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})">
                    ${wish.name.charAt(0).toUpperCase()}
                </div>
                <div class="bubble-info">
                    <h4>${escapeHtml(wish.name)}</h4>
                    <span class="time" data-ts="${escapeHtml(wish.timestamp)}"></span>
                </div>
            </div>
            <div class="bubble-message">
                ${escapeHtml(wish.message)}
            </div>
            <div class="bubble-actions">
                <button class="like-btn" onclick="toggleLike(this)">
                    <i class="far fa-heart"></i>
                    <span class="like-count">${Number(wish.likes || 0)}</span>
                </button>
                <button class="share-btn" onclick="shareWish('${escapeHtml(wish.name)}', '${escapeHtml(wish.message)}')">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
        <div class="bubble-tail"></div>
    `;
    
    // Add to beginning with animation
    if (wishesGrid.firstChild) {
        wishesGrid.insertBefore(wishBubble, wishesGrid.firstChild);
    } else {
        wishesGrid.appendChild(wishBubble);
    }
    
    // Animate entrance
    setTimeout(() => {
        wishBubble.style.opacity = '1';
        wishBubble.style.transform = 'translateY(0)';
    }, 10);
    // Format timestamp for the inserted wish
    if (typeof formatWishTimes === 'function') formatWishTimes();
}

/* === Helper Functions === */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

async function toggleLike(btn) {
    const icon = btn.querySelector('i');
    const countEl = btn.querySelector('.like-count');
    const wishBubble = btn.closest('.wish-bubble');
    const wishId = wishBubble.getAttribute('data-wish-id');

    // parse current count
    const prevCount = parseInt(countEl.textContent || '0', 10) || 0;
    const isCurrentlyLiked = icon.classList.contains('fas');
    const delta = isCurrentlyLiked ? -1 : 1;

    // Optimistic UI update
    if (isCurrentlyLiked) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        countEl.textContent = Math.max(0, prevCount - 1);
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#FF6B8B';
        countEl.textContent = prevCount + 1;
        // small scale animation
        btn.style.transform = 'scale(1.15)';
        setTimeout(() => btn.style.transform = '', 200);
        animateCountChange(countEl);
        createHeartParticles(btn);
    }

    // Send update to server
    try {
        const res = await fetch('/wish-like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: Number(wishId), delta })
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json && json.error ? json.error : 'Failed to update like');
        }

        // Update localStorage caches (likedWishes and likeCounts)
        try {
            const likeCounts = JSON.parse(localStorage.getItem('likeCounts') || '{}');
            const likedWishes = JSON.parse(localStorage.getItem('likedWishes') || '[]');
            likeCounts[wishId] = json.likes;
            if (delta === 1) {
                if (!likedWishes.includes(wishId)) likedWishes.push(wishId);
            } else {
                const idx = likedWishes.indexOf(wishId);
                if (idx !== -1) likedWishes.splice(idx, 1);
            }
            localStorage.setItem('likeCounts', JSON.stringify(likeCounts));
            localStorage.setItem('likedWishes', JSON.stringify(likedWishes));
            // ensure displayed count matches server
            countEl.textContent = json.likes;
        } catch (e) {
            // ignore localStorage errors
            countEl.textContent = json.likes;
        }
    } catch (err) {
        // Revert optimistic UI on error
        console.error('Like update failed', err);
        showNotification('Failed to update like. Please try again.', 'error');
        if (isCurrentlyLiked) {
            // was liked, revert to liked state
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#FF6B8B';
            countEl.textContent = prevCount;
        } else {
            // was not liked, revert to not-liked state
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
            countEl.textContent = prevCount;
        }
    }
}

/* === Restore Likes from LocalStorage === */
function restoreLikes() {
    const likedWishes = JSON.parse(localStorage.getItem('likedWishes') || '[]');
    const likeCounts = JSON.parse(localStorage.getItem('likeCounts') || '{}');
    
    // Restore like counts for all wishes
    document.querySelectorAll('[data-wish-id]').forEach(wishBubble => {
        const wishId = wishBubble.getAttribute('data-wish-id');
        const likeBtn = wishBubble.querySelector('.like-btn');
        const icon = likeBtn.querySelector('i');
        const count = likeBtn.querySelector('.like-count');
        
        // Set count
        const currentCount = likeCounts[wishId] || 0;
        count.textContent = currentCount;
        
        // Set liked state if in likedWishes array
        if (likedWishes.includes(wishId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#FF6B8B';
        }
    });
}

/* === Animate Count Change === */
function animateCountChange(countElement) {
    countElement.style.transition = 'all 0.3s ease';
    countElement.style.transform = 'scale(1.5)';
    countElement.style.color = '#FF6B8B';
    countElement.style.fontWeight = 'bold';
    
    setTimeout(() => {
        countElement.style.transform = 'scale(1)';
        countElement.style.color = '';
        countElement.style.fontWeight = 'normal';
    }, 300);
}

function createHeartParticles(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.opacity = '1';
            heart.style.transition = 'all 1s ease-out';
            
            document.body.appendChild(heart);
            
            // Animate
            setTimeout(() => {
                heart.style.transform = `translate(${Math.random() * 100 - 50}px, -100px)`;
                heart.style.opacity = '0';
            }, 10);
            
            // Remove
            setTimeout(() => heart.remove(), 1100);
        }, i * 100);
    }
}

function shareWish(name, message) {
    const text = `Check out this birthday wish for Nikhil from ${name}: "${message}"`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Birthday Wish for Nikhil',
            text: text,
            url: url
        });
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        showNotification('Wish copied to clipboard! 📋', 'success');
    }
}

function sharePage() {
    const text = "Join me in wishing Nikhil a happy birthday! 🎂";
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Nikhil\'s Birthday Celebration',
            text: text,
            url: url
        });
    } else {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + url)}`;
        window.open(shareUrl, '_blank');
    }
}

function getRandomColor() {
    const colors = ['#FF6B8B', '#FFD700', '#4ECDC4', '#9D4EDD', '#FF8E53'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function playSound(type) {
    const audio = new Audio();
    if (type === 'success') {
        audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
    }
    audio.volume = 0.3;
    audio.play().catch(() => {});
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* === Lightbox Functions === */
let currentImageIndex = 0;
const photos = [];

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    // Get all photos
    const photoElements = document.querySelectorAll('.photo-card img');
    photos.length = 0;
    photoElements.forEach(img => {
        photos.push({
            src: img.src,
            caption: img.alt
        });
    });
    
    // Find current index
    currentImageIndex = photos.findIndex(p => p.src === src);
    
    // Update lightbox
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = photos.length - 1;
    } else if (currentImageIndex >= photos.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    // Fade transition
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = photos[currentImageIndex].src;
        lightboxCaption.textContent = photos[currentImageIndex].caption;
        lightboxImg.style.opacity = '1';
    }, 200);
}

// Close lightbox on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
});

/* === Additional Helper Functions === */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleMusic() {
    const toggleBtn = document.querySelector('.player-btn');
    if (toggleBtn) {
        toggleBtn.click();
    }
}

function launchConfettiWithMusic() {
    // Play music
    const music = document.getElementById('bgMusic');
    if (music && music.paused) {
        music.play().catch(e => {
            console.log('Music play failed:', e);
        });
        
        // Update music player button icon
        const icon = document.querySelector('.player-btn i');
        if (icon) {
            icon.classList.remove('fa-music');
            icon.classList.add('fa-pause');
        }
    }
    
    // Launch confetti burst
    createConfettiBurst(250);
    
    // Show notification
    showNotification('🎵 Enjoy the music!', 'success');
}

/* === Format wish timestamps to local timezone === */
function formatWishTimes() {
    document.querySelectorAll('.time').forEach(el => {
        const ts = el.getAttribute('data-ts');
        if (!ts) return;
        try {
            const d = new Date(ts);
            if (!isNaN(d.getTime())) {
                el.textContent = d.toLocaleString();
            } else {
                // fallback: show original string
                el.textContent = ts;
            }
        } catch (e) {
            el.textContent = ts;
        }
    });
}