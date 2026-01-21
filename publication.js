<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RASSTUBE - Publications</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', system-ui, sans-serif;
        }
        
        body {
            background-color: #0f0f0f;
            color: #f1f1f1;
            min-height: 100vh;
        }
        
        /* Header/Navbar */
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background-color: #0f0f0f;
            border-bottom: 1px solid #333;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #ff375f;
            letter-spacing: 1px;
        }
        
        .search-bar {
            flex-grow: 1;
            max-width: 600px;
            margin: 0 20px;
        }
        
        .search-bar input {
            width: 100%;
            padding: 10px 15px;
            background-color: #222;
            border: 1px solid #333;
            border-radius: 30px;
            color: white;
            font-size: 14px;
        }
        
        .user-menu {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #555;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        /* Stories section */
        .stories-container {
            padding: 15px 20px;
            border-bottom: 1px solid #333;
            overflow-x: auto;
            display: flex;
            gap: 15px;
        }
        
        .story {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 80px;
            cursor: pointer;
        }
        
        .story-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 5px;
            position: relative;
        }
        
        .story-avatar::after {
            content: '';
            position: absolute;
            width: 68px;
            height: 68px;
            border-radius: 50%;
            border: 2px solid #ff375f;
            top: -4px;
            left: -4px;
        }
        
        .my-story .story-avatar::after {
            border: 2px dashed #666;
        }
        
        .story-name {
            font-size: 12px;
            text-align: center;
        }
        
        /* Main content */
        .main-container {
            display: flex;
        }
        
        /* Sidebar */
        .sidebar {
            width: 240px;
            padding: 20px;
            border-right: 1px solid #333;
            position: sticky;
            top: 60px;
            height: calc(100vh - 60px);
        }
        
        .nav-links {
            list-style: none;
            margin-top: 20px;
        }
        
        .nav-links li {
            padding: 12px 0;
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            border-radius: 8px;
            padding-left: 15px;
            transition: background-color 0.2s;
        }
        
        .nav-links li:hover {
            background-color: #222;
        }
        
        .nav-links li.active {
            background-color: #222;
            font-weight: bold;
        }
        
        /* Posts feed */
        .posts-feed {
            flex-grow: 1;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .post {
            background-color: #1a1a1a;
            border-radius: 12px;
            margin-bottom: 20px;
            overflow: hidden;
            border: 1px solid #333;
        }
        
        .post-header {
            display: flex;
            align-items: center;
            padding: 15px;
            gap: 12px;
        }
        
        .post-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .post-user-info h3 {
            font-size: 16px;
        }
        
        .post-user-info p {
            font-size: 12px;
            color: #aaa;
        }
        
        .post-more {
            margin-left: auto;
            cursor: pointer;
            padding: 5px;
        }
        
        .post-content {
            padding: 0 15px 15px;
        }
        
        .post-text {
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .post-image {
            width: 100%;
            border-radius: 8px;
            margin-bottom: 15px;
            background-color: #333;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 14px;
        }
        
        .post-video {
            width: 100%;
            border-radius: 8px;
            margin-bottom: 15px;
            background-color: #333;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 14px;
        }
        
        .post-actions {
            display: flex;
            justify-content: space-between;
            padding: 0 15px 15px;
            border-top: 1px solid #333;
            padding-top: 15px;
        }
        
        .post-action {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 6px;
            transition: background-color 0.2s;
        }
        
        .post-action:hover {
            background-color: #222;
        }
        
        .post-action.liked {
            color: #ff375f;
        }
        
        .post-stats {
            padding: 0 15px 15px;
            font-size: 14px;
            color: #aaa;
            display: flex;
            justify-content: space-between;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }
            
            .search-bar {
                display: none;
            }
            
            .posts-feed {
                width: 100%;
            }
        }
        
        /* Loading animation */
        .loading {
            text-align: center;
            padding: 30px;
            color: #aaa;
            font-size: 14px;
        }
        
        .loading::after {
            content: '...';
            animation: dots 1.5s infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation bar -->
    <nav class="navbar">
        <div class="logo">RASSTUBE</div>
        
        <div class="search-bar">
            <input type="text" placeholder="Rechercher vidéos, photos, personnes...">
        </div>
        
        <div class="user-menu">
            <div class="user-avatar" style="background-color: #ff375f;">M</div>
        </div>
    </nav>
    
    <!-- Stories section -->
    <div class="stories-container">
        <div class="story my-story">
            <div class="story-avatar" style="background-color: #333;">
                <i class="fas fa-plus"></i>
            </div>
            <div class="story-name">Mon story</div>
        </div>
        
        <div class="story">
            <div class="story-avatar" style="background-color: #3a86ff;">R</div>
            <div class="story-name">Rayan</div>
        </div>
        
        <div class="story">
            <div class="story-avatar" style="background-color: #ff006e;">S</div>
            <div class="story-name">Sarah</div>
        </div>
        
        <div class="story">
            <div class="story-avatar" style="background-color: #8338ec;">I</div>
            <div class="story-name">Iron</div>
        </div>
        
        <div class="story">
            <div class="story-avatar" style="background-color: #ffbe0b;">L</div>
            <div class="story-name">Léa</div>
        </div>
        
        <div class="story">
            <div class="story-avatar" style="background-color: #06d6a0;">K</div>
            <div class="story-name">Karim</div>
        </div>
    </div>
    
    <!-- Main content -->
    <div class="main-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <ul class="nav-links">
                <li class="active">
                    <i class="fas fa-home"></i> ACCUEIL
                </li>
                <li>
                    <i class="fas fa-play-circle"></i> RSHORT
                </li>
                <li>
                    <i class="fas fa-compress-alt"></i> COMPRESSER
                </li>
                <li>
                    <i class="fas fa-robot"></i> IA
                </li>
                <li>
                    <i class="fas fa-user"></i> PROFIL
                </li>
            </ul>
            
            <div style="margin-top: 40px; padding: 15px; background-color: #222; border-radius: 8px;">
                <p style="font-size: 12px; color: #aaa; margin-bottom: 10px;">Visionnage de publication en cours de développement !</p>
                <p style="font-size: 14px;">Cette fonctionnalité sera bientôt disponible.</p>
            </div>
        </aside>
        
        <!-- Posts feed -->
        <main class="posts-feed" id="postsFeed">
            <!-- Posts will be loaded here dynamically -->
        </main>
    </div>

    <script>
        // Données des publications (simulées)
        const postsData = [
            {
                id: 1,
                username: "Rayan",
                avatarColor: "#3a86ff",
                time: "Il y a 2 heures",
                text: "Nouvelle vidéo sur le montage avec RASSTUBE ! Dites-moi ce que vous en pensez 👇",
                type: "video",
                likes: 245,
                comments: 42,
                shares: 12,
                liked: false
            },
            {
                id: 2,
                username: "Sarah",
                avatarColor: "#ff006e",
                time: "Il y a 5 heures",
                text: "Les couchers de soleil d'été sont toujours magnifiques. Qui aime cette période de l'année ? ☀️",
                type: "image",
                likes: 187,
                comments: 31,
                shares: 8,
                liked: true
            },
            {
                id: 3,
                username: "Iron",
                avatarColor: "#8338ec",
                time: "Il y a 1 jour",
                text: "Tuto: Comment compresser vos vidéos sans perdre en qualité avec l'outil RASSTUBE Compresser",
                type: "video",
                likes: 89,
                comments: 15,
                shares: 5,
                liked: false
            },
            {
                id: 4,
                username: "Léa",
                avatarColor: "#ffbe0b",
                time: "Il y a 2 jours",
                text: "Première utilisation de l'IA de RASSTUBE pour améliorer mes anciennes vidéos. Les résultats sont impressionnants !",
                type: "image",
                likes: 312,
                comments: 67,
                shares: 23,
                liked: false
            },
            {
                id: 5,
                username: "Karim",
                avatarColor: "#06d6a0",
                time: "Il y a 3 jours",
                text: "Partagez vos meilleurs RSHORT cette semaine ! J'ai hâte de voir vos créations 🔥",
                type: "video",
                likes: 421,
                comments: 89,
                shares: 34,
                liked: true
            }
        ];
        
        // Fonction pour générer le HTML d'une publication
        function createPostHTML(post) {
            return `
                <div class="post" id="post-${post.id}">
                    <div class="post-header">
                        <div class="post-avatar" style="background-color: ${post.avatarColor}">
                            ${post.username.charAt(0)}
                        </div>
                        <div class="post-user-info">
                            <h3>${post.username}</h3>
                            <p>${post.time}</p>
                        </div>
                        <div class="post-more">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                    
                    <div class="post-content">
                        <p class="post-text">${post.text}</p>
                        
                        ${post.type === 'image' 
                            ? `<div class="post-image">
                                <div><i class="fas fa-image"></i> Image de ${post.username}</div>
                               </div>`
                            : `<div class="post-video">
                                <div><i class="fas fa-play-circle"></i> Vidéo de ${post.username}</div>
                               </div>`
                        }
                    </div>
                    
                    <div class="post-stats">
                        <span>${post.likes} j'aime</span>
                        <span>${post.comments} commentaires</span>
                        <span>${post.shares} partages</span>
                    </div>
                    
                    <div class="post-actions">
                        <div class="post-action ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                            <i class="fas fa-heart"></i>
                            <span>J'aime</span>
                        </div>
                        <div class="post-action" onclick="focusComment(${post.id})">
                            <i class="fas fa-comment"></i>
                            <span>Commenter</span>
                        </div>
                        <div class="post-action" onclick="sharePost(${post.id})">
                            <i class="fas fa-share"></i>
                            <span>Partager</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Fonction pour charger les publications
        function loadPosts() {
            const postsFeed = document.getElementById('postsFeed');
            
            // Ajouter un indicateur de chargement
            postsFeed.innerHTML = '<div class="loading">Chargement des publications</div>';
            
            // Simuler un délai de chargement
            setTimeout(() => {
                // Générer les publications
                postsFeed.innerHTML = postsData.map(post => createPostHTML(post)).join('');
            }, 800);
        }
        
        // Fonction pour liker une publication
        function toggleLike(postId) {
            const post = postsData.find(p => p.id === postId);
            if (post) {
                post.liked = !post.liked;
                post.likes += post.liked ? 1 : -1;
                
                // Mettre à jour l'affichage
                const postElement = document.getElementById(`post-${postId}`);
                const likeButton = postElement.querySelector('.post-action');
                const likesCount = postElement.querySelector('.post-stats span');
                
                if (post.liked) {
                    likeButton.classList.add('liked');
                } else {
                    likeButton.classList.remove('liked');
                }
                
                likesCount.textContent = `${post.likes} j'aime`;
            }
        }
        
        // Fonction pour se concentrer sur les commentaires
        function focusComment(postId) {
            alert(`Ouverture des commentaires pour la publication ${postId}`);
            // Dans une vraie application, on afficherait une section de commentaires
        }
        
        // Fonction pour partager une publication
        function sharePost(postId) {
            const post = postsData.find(p => p.id === postId);
            if (post) {
                post.shares += 1;
                
                // Mettre à jour l'affichage
                const postElement = document.getElementById(`post-${postId}`);
                const sharesCount = postElement.querySelectorAll('.post-stats span')[2];
                sharesCount.textContent = `${post.shares} partages`;
                
                alert(`Publication de ${post.username} partagée !`);
            }
        }
        
        // Charger les publications au démarrage
        document.addEventListener('DOMContentLoaded', loadPosts);
        
        // Recherche
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length > 0) {
                const filteredPosts = postsData.filter(post => 
                    post.username.toLowerCase().includes(searchTerm) || 
                    post.text.toLowerCase().includes(searchTerm)
                );
                
                const postsFeed = document.getElementById('postsFeed');
                if (filteredPosts.length > 0) {
                    postsFeed.innerHTML = filteredPosts.map(post => createPostHTML(post)).join('');
                } else {
                    postsFeed.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #aaa;">
                            <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px;"></i>
                            <h3>Aucun résultat trouvé</h3>
                            <p>Aucune publication ne correspond à "${searchTerm}"</p>
                        </div>
                    `;
                }
            } else {
                loadPosts();
            }
        });
        
        // Gestion des clics sur les stories
        document.querySelectorAll('.story').forEach(story => {
            story.addEventListener('click', function() {
                const username = this.querySelector('.story-name').textContent;
                if (username !== 'Mon story') {
                    alert(`Ouverture du story de ${username}`);
                } else {
                    alert(`Création d'un nouveau story`);
                }
            });
        });
    </script>
</body>
</html>