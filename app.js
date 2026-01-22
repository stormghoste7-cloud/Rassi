/**
 * RASSTUBE ULTIMATE v5.0 - Core Application
 */

const App = {
    // ÉTAT GLOBAL
    state: {
        users: JSON.parse(localStorage.getItem('rt_v5_users') || '[]'),
        posts: JSON.parse(localStorage.getItem('rt_v5_posts') || '[]'),
        session: JSON.parse(localStorage.getItem('rt_v5_session') || 'null'),
        currentTab: 'login',
        selectedPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rass',
        activeSection: 'home',
        currentUploadFile: null,
        compressedVideoReady: null,
        youtubeVideoUrl: null,
        subscriptions: JSON.parse(localStorage.getItem('rt_v5_subscriptions') || '{}'),
        messages: JSON.parse(localStorage.getItem('rt_v5_messages') || '[]'),
        savedPosts: JSON.parse(localStorage.getItem('rt_v5_saved') || '[]'),
        currentRshort: 0,
        rshortPlaying: true,
        profileTab: 'posts',
        
        // Système de flammes (comme TikTok)
        flameDays: parseInt(localStorage.getItem('rt_flame_days') || '0'),
        flameProgress: parseInt(localStorage.getItem('rt_flame_progress') || '0'),
        lastLoginDate: localStorage.getItem('rt_last_login_date') || '',
        flameFreezeEnd: localStorage.getItem('rt_flame_freeze_end') || '',
        
        // Système d'abonnés
        subscribers: JSON.parse(localStorage.getItem('rt_subscribers') || '{}'),
        
        // XP et niveaux
        xp: parseInt(localStorage.getItem('rt_xp') || '0'),
        level: parseInt(localStorage.getItem('rt_level') || '1'),
        dailyRewardClaimed: localStorage.getItem('rt_daily_reward') === new Date().toDateString(),
        
        // Vidéos YouTube disponibles
        youtubeVideos: [
            {
                id: 'dQw4w9WgXcQ',
                title: 'Never Gonna Give You Up',
                author: 'Rick Astley',
                thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                duration: '3:32',
                views: '1.4B'
            },
            {
                id: '9bZkp7q19f0',
                title: 'Gangnam Style',
                author: 'PSY',
                thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
                duration: '4:13',
                views: '4.7B'
            },
            {
                id: 'kJQP7kiw5Fk',
                title: 'Despacito',
                author: 'Luis Fonsi',
                thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
                duration: '4:41',
                views: '8.1B'
            }
        ]
    },

    // INITIALISATION
    init() {
        this.verifySession();
        this.renderAvatars();
        this.sync();
        this.setupDragAndDrop();

        if(this.state.session) {
            this.launch();
        }
        
        // Créer des données par défaut
        if(this.state.posts.length === 0) {
            this.createDefaultData();
        }
        
        // Vérifier la récompense quotidienne
        this.checkDailyReward();
        
        // Vérifier le système de flammes
        this.checkFlameSystem();
    },

    // CRÉATION DES DONNÉES PAR DÉFAUT
    createDefaultData() {
        const defaultUsers = [
            { 
                pseudo: 'Rayan', 
                email: 'rayan@example.com',
                pass: '123456',
                pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rayan',
                bio: 'Gamer & Content Creator 🎮 • Nouveau sur Rasstube',
                followers: 0,
                following: 0,
                flameDays: 7,
                postsCount: 2
            },
            { 
                pseudo: 'Sarah', 
                email: 'sarah@example.com',
                pass: '123456',
                pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                bio: 'Photographe voyage 🌍 • Aventurière digitale',
                followers: 0,
                following: 0,
                flameDays: 3,
                postsCount: 1
            },
            { 
                pseudo: 'Alex', 
                email: 'alex@example.com',
                pass: '123456',
                pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                bio: 'Chef cuisinier 👨‍🍳 • Recettes en 60s',
                followers: 0,
                following: 0,
                flameDays: 5,
                postsCount: 0
            }
        ];
        
        defaultUsers.forEach(user => {
            if(!this.state.users.find(u => u.pseudo === user.pseudo)) {
                this.state.users.push({
                    id: Date.now() + Math.random(),
                    ...user,
                    joined: new Date().toLocaleDateString('fr-FR')
                });
            }
        });

        const defaultPosts = [
            {
                id: 1,
                author: 'Rayan',
                authorPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rayan',
                title: 'Nouveau record sur Fortnite ! 🎮 #gaming #fortnite #record',
                type: 'rshort',
                content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                likes: 1245,
                likedBy: ['Rayan', 'Sarah'],
                comments: 89,
                shares: 45,
                views: 12500,
                duration: 15,
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                tags: ['gaming', 'fortnite', 'record'],
                estimatedSubs: 45
            },
            {
                id: 2,
                author: 'Sarah',
                authorPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                title: 'Coucher de soleil à Bali 🌅 #voyage #bali #photographie #paradis',
                type: 'photo',
                content: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                likes: 892,
                likedBy: ['Sarah', 'Alex'],
                comments: 67,
                shares: 23,
                views: 8900,
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                tags: ['voyage', 'bali', 'photographie'],
                estimatedSubs: 32
            }
        ];
        
        this.state.posts = defaultPosts;
        this.sync();
    },

    // LANCEMENT APP
    launch() {
        document.getElementById('auth-portal').classList.add('hidden');
        document.getElementById('main-app').style.display = 'block';
        
        // Mettre à jour l'interface
        document.getElementById('user-pfp-top').src = this.state.session.pfp;
        document.getElementById('prof-pfp').src = this.state.session.pfp;
        document.getElementById('prof-name').innerText = this.state.session.pseudo;
        document.getElementById('prof-email').innerText = this.state.session.email;
        document.getElementById('prof-bio').innerText = this.state.session.bio || "Aucune bio pour le moment";
        
        // Mettre à jour les flammes et XP
        this.updateFlameSystem();
        this.updateXPBar();
        
        // Afficher les éléments addictifs
        document.getElementById('xp-bar').classList.remove('hidden');
        document.getElementById('streak-counter').classList.remove('hidden');
        document.getElementById('flame-progress').classList.remove('hidden');
        
        if(!this.state.dailyRewardClaimed) {
            document.getElementById('daily-reward').classList.remove('hidden');
        }
        
        // Afficher la badge de notification
        document.getElementById('notification-badge').style.display = 'block';
        
        this.updateProfileStats();
        this.renderFeed();
        this.renderStories();
        this.go('home');
        
        // Déclencher une notification de bienvenue
        setTimeout(() => {
            if(this.state.flameDays > 0) {
                this.notify(`🔥 Streak de ${this.state.flameDays} jours ! Continuez comme ça !`, 'success');
            } else {
                this.notify(`🎉 Bienvenue sur Rasstube ! Commencez votre streak de flammes dès aujourd'hui !`, 'success');
            }
            this.showAchievement('Bienvenue !', 'fas fa-trophy', 'Vous avez ouvert Rasstube aujourd\'hui !');
        }, 1000);
    },

    // SYSTÈME DE FLAMMES (comme TikTok)
    checkFlameSystem() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const threeDaysAgo = new Date(Date.now() - (3 * 86400000)).toDateString();
        
        // Récupérer la dernière date de connexion
        const lastLogin = this.state.lastLoginDate ? new Date(this.state.lastLoginDate) : null;
        
        if(!lastLogin) {
            // Première connexion
            this.state.flameDays = 0;
            this.state.flameProgress = 0;
            this.state.lastLoginDate = today;
        } else {
            const lastLoginDateStr = lastLogin.toDateString();
            
            // Vérifier si la flamme est gelée
            if(this.state.flameFreezeEnd) {
                const freezeEnd = new Date(this.state.flameFreezeEnd);
                if(new Date() > freezeEnd) {
                    // Fin du gel - réinitialiser les flammes
                    this.state.flameDays = 0;
                    this.state.flameProgress = 0;
                    this.state.flameFreezeEnd = '';
                    this.notify("❄️ Votre streak de flammes a été réinitialisé après 3 jours d'inactivité", "warning");
                }
            }
            
            // Mettre à jour le streak
            if(lastLoginDateStr === yesterday) {
                // Connexion quotidienne - augmenter la progression
                this.state.flameProgress += 1;
                
                if(this.state.flameProgress >= 7) {
                    this.state.flameDays += 1;
                    this.state.flameProgress = 0;
                    this.showAchievement('Flamme gagnée !', 'fas fa-fire', `Vous avez maintenant ${this.state.flameDays} jours de streak !`);
                }
            } else if(lastLoginDateStr !== today) {
                // Connexion après plus d'un jour
                if(this.state.flameDays > 0) {
                    // Commencer le gel de 3 jours
                    const freezeEnd = new Date();
                    freezeEnd.setDate(freezeEnd.getDate() + 3);
                    this.state.flameFreezeEnd = freezeEnd.toISOString();
                    this.notify("❄️ Attention : Votre streak est maintenant gelé pour 3 jours ! Revenez demain pour le sauver.", "warning");
                }
            }
            
            this.state.lastLoginDate = today;
        }
        
        this.syncFlameData();
    },

    updateFlameSystem() {
        // Mettre à jour l'affichage des flammes
        document.getElementById('streak-days').innerText = this.state.flameDays + ' jours';
        
        const flameProgressPercent = (this.state.flameProgress / 7) * 100;
        document.getElementById('flame-bar').style.width = flameProgressPercent + '%';
        document.getElementById('flame-days').innerText = this.state.flameProgress + '/7';
        
        // Mettre à jour dans le profil
        document.getElementById('flame-streak-profile').innerText = this.state.flameProgress + '/7 jours';
        document.getElementById('flame-progress-profile').style.width = flameProgressPercent + '%';
        document.getElementById('flame-count').innerHTML = `🔥 ${this.state.flameDays}`;
        
        // Animation spéciale pour les flammes
        if(this.state.flameDays > 0) {
            document.getElementById('streak-counter').style.animation = 'flame 2s infinite';
        }
    },

    syncFlameData() {
        localStorage.setItem('rt_flame_days', this.state.flameDays.toString());
        localStorage.setItem('rt_flame_progress', this.state.flameProgress.toString());
        localStorage.setItem('rt_last_login_date', this.state.lastLoginDate);
        if(this.state.flameFreezeEnd) {
            localStorage.setItem('rt_flame_freeze_end', this.state.flameFreezeEnd);
        }
    },

    // SYSTÈME D'ABONNÉS
    addSubscribers(userPseudo, amount) {
        // Trouver l'utilisateur
        const user = this.state.users.find(u => u.pseudo === userPseudo);
        if(user) {
            user.followers = (user.followers || 0) + amount;
            
            // Mettre à jour le compteur d'abonnés dans le profil
            if(user.pseudo === this.state.session.pseudo) {
                document.getElementById('count-followers').innerText = user.followers;
            }
            
            this.sync();
            
            // Notifier l'utilisateur
            if(amount > 0) {
                this.notify(`🎉 +${amount} nouveaux abonnés !`, 'success');
                
                // Gagner de l'XP pour les nouveaux abonnés
                this.addXP(amount * 5);
            }
        }
    },

    calculateEstimatedSubs(title, tags, type) {
        // Calculer les abonnés estimés basés sur le titre, les hashtags et le type
        let baseSubs = 10;
        
        // Bonus pour le titre (longueur optimale)
        if(title.length > 20 && title.length < 60) baseSubs += 5;
        
        // Bonus pour les hashtags (entre 3 et 5 hashtags optimaux)
        const tagCount = tags.split(',').filter(t => t.trim()).length;
        if(tagCount >= 3 && tagCount <= 5) baseSubs += 8;
        
        // Bonus pour le type de contenu
        if(type === 'rshort') baseSubs += 15;
        if(type === 'youtube') baseSubs += 12;
        
        // Aléatoire entre -5 et +10
        const randomBonus = Math.floor(Math.random() * 16) - 5;
        
        return Math.max(5, baseSubs + randomBonus);
    },

    // XP SYSTEM
    updateXPBar() {
        const xpNeededForNextLevel = this.state.level * 100;
        const progress = (this.state.xp % 100) / 100 * 100;
        document.getElementById('xp-progress').style.width = progress + '%';
    },

    addXP(amount) {
        this.state.xp += amount;
        const oldLevel = this.state.level;
        this.state.level = Math.floor(this.state.xp / 100) + 1;
        
        if(this.state.level > oldLevel) {
            this.showAchievement('Niveau ' + this.state.level + ' atteint !', 'fas fa-star', 'Vous progressez rapidement !');
            this.notify(`🎉 Félicitations ! Vous avez atteint le niveau ${this.state.level} !`, 'success');
        }
        
        localStorage.setItem('rt_xp', this.state.xp.toString());
        localStorage.setItem('rt_level', this.state.level.toString());
        this.updateXPBar();
    },

    checkDailyReward() {
        const today = new Date().toDateString();
        if(localStorage.getItem('rt_daily_reward') !== today) {
            this.state.dailyRewardClaimed = false;
        }
    },

    claimDailyReward() {
        this.state.dailyRewardClaimed = true;
        localStorage.setItem('rt_daily_reward', new Date().toDateString());
        
        const rewardXP = 50 + (this.state.flameDays * 10);
        this.addXP(rewardXP);
        
        // Ajouter aussi des abonnés pour la récompense quotidienne
        const rewardSubs = 3 + this.state.flameDays;
        this.addSubscribers(this.state.session.pseudo, rewardSubs);
        
        document.getElementById('daily-reward').classList.add('hidden');
        this.showAchievement('Récompense quotidienne !', 'fas fa-gift', `+${rewardXP} XP et +${rewardSubs} abonnés !`);
        this.notify(`🎁 Récompense quotidienne : +${rewardXP} XP et +${rewardSubs} abonnés !`, 'success');
    },

    // NAVIGATION
    go(section) {
        document.querySelectorAll('.app-section').forEach(sec => {
            sec.classList.add('hidden');
        });
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.getElementById('sec-' + section).classList.remove('hidden');
        
        // Mettre à jour la navigation active
        if(section === 'home') document.querySelector('.nav-item:nth-child(1)').classList.add('active');
        if(section === 'rsshort') document.querySelector('.nav-item:nth-child(2)').classList.add('active');
        if(section === 'upload') document.querySelector('.fab-upload').classList.add('active');
        if(section === 'compressor') document.querySelector('.nav-item:nth-child(4)').classList.add('active');
        if(section === 'aichat') document.querySelector('.nav-item:nth-child(5)').classList.add('active');
        if(section === 'profile') document.querySelector('.nav-item:nth-child(6)').classList.add('active');
        
        this.state.activeSection = section;
        
        // Exécuter des actions spécifiques selon la section
        if(section === 'rsshort') {
            this.renderRshorts();
        } else if(section === 'upload') {
            this.updateEstimatedSubs();
        }
    },

    // UTILITAIRES
    formatNumber(num) {
        if(num >= 1000000) return (num/1000000).toFixed(1) + 'M';
        if(num >= 1000) return (num/1000).toFixed(1) + 'k';
        return num;
    },

    formatTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;
        
        if(diff < 60000) return 'À l\'instant';
        if(diff < 3600000) return Math.floor(diff/60000) + ' min';
        if(diff < 86400000) return Math.floor(diff/3600000) + ' h';
        if(diff < 604800000) return Math.floor(diff/86400000) + ' j';
        return date.toLocaleDateString('fr-FR');
    },

    notify(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: var(--text-dim); cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.getElementById('notification-box').appendChild(toast);
        
        setTimeout(() => {
            if(toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    },

    showAchievement(title, icon, description) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-icon">
                <i class="${icon}"></i>
            </div>
            <h3 style="margin:0 0 10px 0; color:var(--accent);">${title}</h3>
            <p style="margin:0; color:var(--text-dim);">${description}</p>
            <button onclick="this.parentElement.remove()" style="margin-top:20px; padding:10px 20px; background:var(--accent); color:white; border:none; border-radius:var(--radius-md); cursor:pointer;">
                Super !
            </button>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            if(popup.parentElement) {
                popup.remove();
            }
        }, 5000);
    },

    // SYNC
    sync() {
        localStorage.setItem('rt_v5_users', JSON.stringify(this.state.users));
        localStorage.setItem('rt_v5_posts', JSON.stringify(this.state.posts));
        localStorage.setItem('rt_v5_session', JSON.stringify(this.state.session));
    },

    verifySession() {
        const session = this.state.session;
        if(session && session.pseudo) {
            const user = this.state.users.find(u => u.pseudo === session.pseudo);
            if(user) {
                this.state.session = user;
                this.sync();
                return true;
            }
        }
        return false;
    },

    // DRAG AND DROP
    setupDragAndDrop() {
        const dropzone = document.getElementById('upload-dropzone');
        if(dropzone) {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--accent)';
                dropzone.style.background = 'var(--accent-soft)';
            });
            
            dropzone.addEventListener('dragleave', () => {
                dropzone.style.borderColor = 'var(--border)';
                dropzone.style.background = '';
            });
            
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--border)';
                dropzone.style.background = '';
                
                const files = e.dataTransfer.files;
                if(files.length > 0) {
                    const event = { target: { files: files } };
                    this.previewUpload(event);
                }
            });
        }
    },

    // UPDATE ESTIMATED SUBS
    updateEstimatedSubs() {
        const title = document.getElementById('up-title')?.value || '';
        const tags = document.getElementById('up-tags')?.value || '';
        const type = document.getElementById('up-type')?.value || 'video';
        const estimatedSubs = this.calculateEstimatedSubs(title, tags, type);
        document.getElementById('estimated-subs').innerText = `+${estimatedSubs}`;
    },

    // PROFILE MANAGEMENT
    updateProfileStats() {
        const user = this.state.session;
        if(!user) return;
        
        const userPosts = this.state.posts.filter(p => p.author === user.pseudo);
        document.getElementById('count-posts').innerText = userPosts.length;
        document.getElementById('count-followers').innerText = user.followers || 0;
        document.getElementById('count-following').innerText = user.following || 0;
    },

    switchProfileTab(tab) {
        this.state.profileTab = tab;
        document.querySelectorAll('.profile-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.profile-tab[onclick*="${tab}"]`).classList.add('active');
        this.renderProfileContent();
    },

    renderProfileContent() {
        const user = this.state.session;
        const container = document.getElementById('profile-grid');
        if(!container) return;
        
        const userPosts = this.state.posts.filter(p => p.author === user.pseudo);
        
        if(userPosts.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-camera" style="font-size: 50px; color: var(--text-dim); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--text-dim); margin-bottom: 10px;">Aucune publication</h3>
                    <p style="color: var(--text-dim);">Commencez par publier votre premier contenu !</p>
                    <button onclick="App.go('upload')" style="margin-top: 20px; padding: 12px 25px; background: var(--accent); color: white; border: none; border-radius: var(--radius-md); cursor: pointer;">
                        <i class="fas fa-plus"></i> Créer une publication
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = userPosts.map(post => `
            <div class="photo-item" onclick="App.viewPoFromfeed(${post.id})">
                ${post.type === 'video' || post.type === 'rshort' ? 
                    `<div style="position:relative;">
                        <img src="${post.content}" alt="${post.title}">
                        <div style="position:absolute; bottom:5px; right:5px; background:rgba(0,0,0,0.7); color:white; padding:2px 5px; border-radius:3px; font-size:10px;">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>` : 
                    `<img src="${post.content}" alt="${post.title}">`
                }
            </div>
        `).join('');
    },

    // INITIALISATION DES AVATARS
    renderAvatars() {
        const container = document.getElementById('default-avatars');
        if(!container) return;
        
        const avatars = [
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Rass',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Rayan',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas'
        ];
        
        container.innerHTML = avatars.map((avatar, index) => `
            <div class="pfp-item ${index === 0 ? 'selected' : ''}" onclick="App.selectAvatar('${avatar}', this)">
                <img src="${avatar}" alt="Avatar ${index + 1}">
            </div>
        `).join('');
    },

    // AUTRES MÉTHODES
    editProfile() {
        this.notify("La fonctionnalité d'édition de profil sera disponible prochainement !", "info");
    },

    showNotifications() {
        this.notify("Système de notifications en cours de développement !", "info");
    },

    showMessages() {
        this.notify("Système de messagerie en cours de développement !", "info");
    },

    filterContent(query) {
        // Implémentation de base de la recherche
        console.log("Recherche :", query);
    },

    focusComment(postId) {
        this.notify("Système de commentaires en cours de développement !", "info");
    },

    viewPost(postId) {
        this.notify("Visionnage de publication en cours de développement !", "info");
    }
};