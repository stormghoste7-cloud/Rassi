/**
 * RASSTUBE ULTIMATE - RShorts (Système TikTok-like)
 */

// Étendre l'objet App avec les méthodes RShorts
Object.assign(App, {
    renderRshorts() {
        const rshorts = this.state.posts.filter(p => p.type === 'rshort' || p.type === 'youtube');
        if(rshorts.length === 0) {
            document.getElementById('rsshort-container').innerHTML = `
                <div style="display:flex; align-items:center; justify-content:center; height:100%; background:var(--bg-deep); color:white;">
                    <div style="text-align:center;">
                        <i class="fas fa-play-circle" style="font-size:60px; color:var(--tiktok-pink); margin-bottom:20px;"></i>
                        <h3>Aucun RShort disponible</h3>
                        <p>Soyez le premier à créer un RShort !</p>
                        <button onclick="App.go('upload')" style="margin-top:20px; padding:12px 25px; background:var(--tiktok-pink); color:white; border:none; border-radius:var(--radius-md); cursor:pointer;">
                            Créer mon premier RShort
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        const currentRshort = rshorts[this.state.currentRshort];
        
        // Container principal
        if(currentRshort.type === 'youtube') {
            document.getElementById('rsshort-container').innerHTML = `
                <iframe 
                    src="${currentRshort.content}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0"
                    style="width:100%; height:100%; border:none;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            document.getElementById('rsshort-container').innerHTML = `
                <video class="rsshort-video" id="rsshort-video" autoplay muted playsinline>
                    <source src="${currentRshort.content}" type="video/mp4">
                </video>
            `;
        }
        
        // Overlay avec infos
        document.getElementById('rsshort-overlay').innerHTML = `
            <div style="margin-bottom:15px;">
                <h3 style="margin:0 0 10px 0; display:flex; align-items:center; gap:10px;">
                    <img src="${currentRshort.authorPfp}" style="width:40px; height:40px; border-radius:50%; border:2px solid var(--accent);">
                    ${currentRshort.author}
                    ${currentRshort.estimatedSubs ? `<span class="subscriber-badge" style="margin-left:10px;">+${currentRshort.estimatedSubs} abonnés</span>` : ''}
                </h3>
                <p style="margin:0; font-size:16px;">${currentRshort.title}</p>
            </div>
            <div style="display:flex; gap:15px; font-size:13px; color:var(--text-dim);">
                ${currentRshort.type === 'youtube' ? '<span><i class="fab fa-youtube" style="color:var(--youtube-red)"></i> YouTube</span>' : '<span><i class="fas fa-music"></i> Son original</span>'}
                <span><i class="fas fa-eye"></i> ${this.formatNumber(currentRshort.views)} vues</span>
                <span><i class="fas fa-clock"></i> ${this.formatTime(currentRshort.timestamp)}</span>
            </div>
        `;
        
        // Boutons latéraux avec animations
        document.getElementById('rsshort-side-buttons').innerHTML = `
            <div class="rsshort-btn ${currentRshort.likedBy.includes(this.state.session.pseudo) ? 'active' : ''}" onclick="App.likePost(${currentRshort.id})">
                <i class="fas fa-heart"></i>
                <span>${this.formatNumber(currentRshort.likes)}</span>
            </div>
            <div class="rsshort-btn" onclick="App.focusComment(${currentRshort.id})">
                <i class="fas fa-comment"></i>
                <span>${this.formatNumber(currentRshort.comments)}</span>
            </div>
            <div class="rsshort-btn" onclick="App.sharePost(${currentRshort.id})">
                <i class="fas fa-share"></i>
                <span>${this.formatNumber(currentRshort.shares)}</span>
            </div>
            <div class="rsshort-btn" onclick="App.toggleRshortPlay()">
                <i class="fas fa-${this.state.rshortPlaying ? 'pause' : 'play'}"></i>
                <span>${this.state.rshortPlaying ? 'Pause' : 'Play'}</span>
            </div>
            <div class="rsshort-btn" onclick="App.nextRshort()">
                <i class="fas fa-forward"></i>
                <span>Suivant</span>
            </div>
        `;
        
        // Configurer la vidéo (si ce n'est pas YouTube)
        if(currentRshort.type !== 'youtube') {
            const video = document.getElementById('rsshort-video');
            if(video) {
                video.onended = () => {
                    this.nextRshort();
                    this.addXP(3); // XP pour avoir regardé jusqu'au bout
                };
                video.onclick = () => this.toggleRshortPlay();
                
                if(this.state.rshortPlaying) {
                    video.play();
                } else {
                    video.pause();
                }
                
                // Barre de progression
                video.ontimeupdate = () => {
                    const progress = (video.currentTime / video.duration) * 100;
                    document.getElementById('rsshort-progress').style.width = progress + '%';
                };
            }
        }
        
        // Ajouter une vue
        setTimeout(() => {
            currentRshort.views = (currentRshort.views || 0) + 1;
            this.sync();
        }, 3000);
    },

    nextRshort() {
        const rshorts = this.state.posts.filter(p => p.type === 'rshort' || p.type === 'youtube');
        this.state.currentRshort = (this.state.currentRshort + 1) % rshorts.length;
        this.renderRshorts();
        this.addXP(2); // XP pour avoir regardé un nouveau RShort
    },

    toggleRshortPlay() {
        this.state.rshortPlaying = !this.state.rshortPlaying;
        
        if(this.state.posts.filter(p => p.type === 'rshort' || p.type === 'youtube')[this.state.currentRshort].type !== 'youtube') {
            const video = document.getElementById('rsshort-video');
            if(video) {
                if(this.state.rshortPlaying) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
        
        this.renderRshorts();
    },

    likePost(id) {
        const post = this.state.posts.find(p => p.id === id);
        if(!post) return;
        
        const index = post.likedBy.indexOf(this.state.session.pseudo);
        
        if(index === -1) {
            post.likes++;
            post.likedBy.push(this.state.session.pseudo);
            this.notify("❤️ Publication aimée ! +5 XP", "success");
            this.addXP(5);
            
            // Animation spéciale
            const heart = document.createElement('div');
            heart.innerHTML = '<i class="fas fa-heart" style="color:var(--accent); font-size:50px;"></i>';
            heart.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000; animation:heartbeat 0.5s ease;';
            document.getElementById('rsshort-container').appendChild(heart);
            setTimeout(() => heart.remove(), 500);
        } else {
            post.likes--;
            post.likedBy.splice(index, 1);
            this.notify("Like retiré", "info");
        }
        
        this.sync();
        this.renderRshorts();
    },

    sharePost(id) {
        const post = this.state.posts.find(p => p.id === id);
        if(!post) return;
        
        post.shares = (post.shares || 0) + 1;
        this.sync();
        this.addXP(10);
        
        this.notify("📤 Partage réussi ! +10 XP", "success");
        
        if(navigator.share) {
            navigator.share({
                title: `${post.author} sur Rasstube`,
                text: post.title,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(`Regarde ce RShort sur Rasstube !\n\n${post.author}: ${post.title}`);
        }
        
        this.renderRshorts();
    }
});