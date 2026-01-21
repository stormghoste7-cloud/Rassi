/**
 * RASSTUBE ULTIMATE - Flux d'actualités et Stories
 */

// Étendre l'objet App avec les méthodes du flux
Object.assign(App, {
    renderStories() {
        const container = document.getElementById('story-container');
        if(!container) return;
        
        const users = this.state.users.filter(u => u.pseudo !== this.state.session.pseudo);
        const stories = users.slice(0, 8).map(user => ({
            user: user,
            hasNew: Math.random() > 0.5
        }));
        
        // Ajouter l'utilisateur actuel en premier
        stories.unshift({
            user: this.state.session,
            hasNew: false,
            isMe: true
        });
        
        container.innerHTML = stories.map(story => `
            <div class="story-card" onclick="App.viewStory('${story.user.pseudo}')">
                <div class="story-ring ${story.hasNew ? 'new' : ''}">
                    <img src="${story.user.pfp}" alt="${story.user.pseudo}">
                </div>
                <div class="story-label">${story.isMe ? 'Mon story' : story.user.pseudo}</div>
            </div>
        `).join('');
    },

    renderFeed() {
        const container = document.getElementById('main-feed');
        if(!container) return;
        
        // Trier les posts par date (les plus récents en premier)
        const sortedPosts = [...this.state.posts].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        container.innerHTML = sortedPosts.map(post => `
            <div class="explore-card" onclick="App.viewPost(${post.id})">
                ${post.type === 'video' || post.type === 'rshort' ? 
                    `<div style="position:relative;">
                        <img src="${post.content}" class="explore-thumbnail" alt="${post.title}">
                        <div style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.7); color:white; padding:4px 8px; border-radius:4px; font-size:11px;">
                            <i class="fas fa-play"></i> ${post.duration || '1:30'}
                        </div>
                    </div>` : 
                    `<img src="${post.content}" class="explore-thumbnail" alt="${post.title}">`
                }
                <div class="explore-info">
                    <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:10px;">
                        <img src="${post.authorPfp}" style="width:36px; height:36px; border-radius:50%;">
                        <div style="flex:1;">
                            <h4 style="margin:0 0 5px 0; font-size:15px;">${post.title}</h4>
                            <div style="display:flex; align-items:center; gap:15px; font-size:12px; color:var(--text-dim);">
                                <span><i class="fas fa-user"></i> ${post.author}</span>
                                <span><i class="fas fa-clock"></i> ${this.formatTime(post.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:20px; font-size:13px; color:var(--text-dim);">
                        <span><i class="fas fa-heart" style="color:${post.likedBy.includes(this.state.session.pseudo) ? 'var(--accent)' : 'var(--text-dim)'}"></i> ${this.formatNumber(post.likes)}</span>
                        <span><i class="fas fa-comment"></i> ${this.formatNumber(post.comments)}</span>
                        <span><i class="fas fa-share"></i> ${this.formatNumber(post.shares)}</span>
                        <span><i class="fas fa-eye"></i> ${this.formatNumber(post.views)}</span>
                    </div>
                    ${post.estimatedSubs ? `
                        <div style="margin-top:10px; padding:5px 10px; background:var(--accent-soft); border-radius:var(--radius-md); display:inline-flex; align-items:center; gap:5px; font-size:11px; color:var(--accent);">
                            <i class="fas fa-users"></i>
                            <span>+${post.estimatedSubs} abonnés gagnés</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    viewStory(username) {
        const user = this.state.users.find(u => u.pseudo === username);
        if(!user) return;
        
        this.notify(`Story de ${username} - Fonctionnalité en développement !`, "info");
    }
});