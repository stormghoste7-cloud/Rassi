/**
 * RASSTUBE ULTIMATE - Utilitaires
 */

// Étendre l'objet App avec les utilitaires
Object.assign(App, {
    // IMPORTATION YOUTUBE
    importYouTubeVideo() {
        const url = document.getElementById('youtube-link').value;
        if(!url) {
            this.notify("❌ Veuillez coller un lien YouTube", "error");
            return;
        }
        
        // Extraire l'ID de la vidéo YouTube
        let videoId = '';
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/
        ];
        
        for(const pattern of patterns) {
            const match = url.match(pattern);
            if(match && match[1]) {
                videoId = match[1];
                break;
            }
        }
        
        if(!videoId) {
            this.notify("❌ Lien YouTube invalide", "error");
            return;
        }
        
        // Trouver la vidéo dans notre liste ou en créer une nouvelle
        let youtubeVideo = this.state.youtubeVideos.find(v => v.id === videoId);
        
        if(!youtubeVideo) {
            // Créer une vidéo YouTube par défaut
            youtubeVideo = {
                id: videoId,
                title: 'Vidéo YouTube importée',
                author: 'YouTube Creator',
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                duration: '4:00',
                views: '1M'
            };
        }
        
        this.state.youtubeVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        
        // Mettre à jour l'interface
        document.getElementById('upload-preview').innerHTML = `
            <div class="youtube-player-container">
                <img src="${youtubeVideo.thumbnail}" class="youtube-thumbnail">
                <div class="youtube-play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div style="margin-top:15px; display:flex; align-items:center; gap:10px;">
                <i class="fab fa-youtube" style="color:var(--youtube-red)"></i>
                <span>${youtubeVideo.title} • ${youtubeVideo.duration}</span>
            </div>
            <p style="margin:5px 0 0; color:var(--text-dim); font-size:13px;">
                <i class="fas fa-user"></i> ${youtubeVideo.author} • <i class="fas fa-eye"></i> ${youtubeVideo.views} vues
            </p>
        `;
        
        document.getElementById('upload-preview').classList.remove('hidden');
        document.getElementById('up-type').value = 'youtube';
        
        // Estimer les abonnés pour une vidéo YouTube
        const estimatedSubs = this.calculateEstimatedSubs('Vidéo YouTube importée', 'youtube,video,tendance', 'youtube');
        document.getElementById('estimated-subs').innerText = `+${estimatedSubs}`;
        
        this.notify("✅ Vidéo YouTube importée avec succès !", "success");
    },

    // UPLOAD SYSTEM
    previewUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        const file = files[0];
        const preview = document.getElementById('upload-preview');
        
        // Vérifier la taille du fichier
        if (file.size > 100 * 1024 * 1024) { // 100MB max
            this.notify("⚠️ Fichier trop volumineux. Utilisez le compresseur.", "warning");
            this.go('compressor');
            return;
        }
        
        preview.classList.remove('hidden');
        
        if (file.type.startsWith('video/')) {
            preview.innerHTML = `
                <video controls style="width:100%; max-height:400px; border-radius:var(--radius-md);">
                    <source src="${URL.createObjectURL(file)}" type="${file.type}">
                </video>
                <div style="margin-top:15px; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-file-video" style="color:var(--accent)"></i>
                    <span>${file.name} • ${(file.size/(1024*1024)).toFixed(1)} MB</span>
                </div>
            `;
        } else if (file.type.startsWith('image/')) {
            preview.innerHTML = `
                <img src="${URL.createObjectURL(file)}" style="width:100%; max-height:400px; object-fit:cover; border-radius:var(--radius-md);">
                <div style="margin-top:15px; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-image" style="color:var(--accent)"></i>
                    <span>${file.name} • ${(file.size/(1024*1024)).toFixed(1)} MB</span>
                </div>
            `;
        }
        
        this.state.currentUploadFile = file;
        
        // Estimer les abonnés
        const title = document.getElementById('up-title').value || 'Nouvelle publication';
        const tags = document.getElementById('up-tags').value || '';
        const type = document.getElementById('up-type').value;
        const estimatedSubs = this.calculateEstimatedSubs(title, tags, type);
        document.getElementById('estimated-subs').innerText = `+${estimatedSubs}`;
        
        this.notify("📁 Fichier chargé avec succès", "success");
    },

    async publishPost() {
        const title = document.getElementById('up-title').value;
        const tags = document.getElementById('up-tags').value;
        const type = document.getElementById('up-type').value;
        
        if (!title.trim()) {
            this.notify("❌ Veuillez ajouter un titre", "error");
            return;
        }
        
        if (!this.state.currentUploadFile && !this.state.compressedVideoReady && !this.state.youtubeVideoUrl && type !== 'youtube') {
            this.notify("❌ Veuillez sélectionner un fichier", "error");
            return;
        }
        
        // Calculer les abonnés estimés
        const estimatedSubs = this.calculateEstimatedSubs(title, tags, type);
        
        const btnText = document.getElementById('publish-text');
        const loader = document.getElementById('publish-loader');
        
        btnText.innerText = "PUBLICATION...";
        loader.style.display = 'block';
        
        // Créer une barre de progression
        const progressBar = document.createElement('div');
        progressBar.className = 'upload-progress';
        progressBar.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <i class="fas fa-upload" style="color:var(--accent)"></i>
                <span>Publication en cours...</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="upload-progress-fill"></div>
            </div>
        `;
        document.body.appendChild(progressBar);
        
        // Simuler l'upload avec progression
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('upload-progress-fill').style.width = progress + '%';
            
            if(progress >= 100) {
                clearInterval(interval);
                
                // Créer le post
                let content = '';
                
                if(type === 'youtube' && this.state.youtubeVideoUrl) {
                    content = this.state.youtubeVideoUrl;
                } else if(this.state.compressedVideoReady) {
                    content = URL.createObjectURL(this.state.compressedVideoReady);
                } else if(this.state.currentUploadFile) {
                    content = URL.createObjectURL(this.state.currentUploadFile);
                } else {
                    // Utiliser une vidéo YouTube par défaut
                    const randomVideo = this.state.youtubeVideos[Math.floor(Math.random() * this.state.youtubeVideos.length)];
                    content = `https://www.youtube.com/embed/${randomVideo.id}`;
                }
                
                const newPost = {
                    id: Date.now(),
                    author: this.state.session.pseudo,
                    authorPfp: this.state.session.pfp,
                    title: title,
                    type: type,
                    content: content,
                    likes: 0,
                    likedBy: [],
                    comments: 0,
                    shares: 0,
                    views: 0,
                    timestamp: new Date().toISOString(),
                    tags: tags.split(',').map(tag => tag.trim()),
                    estimatedSubs: estimatedSubs
                };
                
                // Ajouter le post
                this.state.posts.unshift(newPost);
                this.sync();
                
                // Ajouter les abonnés estimés
                this.addSubscribers(this.state.session.pseudo, estimatedSubs);
                
                // Ajouter XP pour la publication
                this.addXP(20);
                
                // Mettre à jour les stats du profil
                this.updateProfileStats();
                
                // Supprimer la barre de progression
                setTimeout(() => {
                    if(progressBar.parentElement) {
                        progressBar.remove();
                    }
                }, 1000);
                
                // Réinitialiser le formulaire
                document.getElementById('up-title').value = '';
                document.getElementById('up-tags').value = '';
                document.getElementById('up-type').value = 'video';
                document.getElementById('upload-preview').innerHTML = '';
                document.getElementById('upload-preview').classList.add('hidden');
                document.getElementById('youtube-link').value = '';
                this.state.currentUploadFile = null;
                this.state.compressedVideoReady = null;
                this.state.youtubeVideoUrl = null;
                
                // Réinitialiser le bouton
                btnText.innerText = "PUBLIER";
                loader.style.display = 'none';
                
                // Notification de succès
                this.notify(`✅ Publication réussie ! +${estimatedSubs} abonnés gagnés`, 'success');
                
                // Retourner à l'accueil
                setTimeout(() => {
                    this.go('home');
                    this.renderFeed();
                }, 1500);
            }
        }, 100);
    }
});