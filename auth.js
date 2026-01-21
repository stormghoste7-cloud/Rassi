/**
 * RASSTUBE ULTIMATE - Authentification
 */

// Étendre l'objet App avec les méthodes d'authentification
Object.assign(App, {
    toggleAuth(type) {
        this.state.currentTab = type;
        
        // Mettre à jour les tabs
        document.getElementById('tab-login').classList.toggle('active', type === 'login');
        document.getElementById('tab-signup').classList.toggle('active', type === 'signup');
        
        // Afficher/masquer la configuration de profil pour l'inscription
        const setupDiv = document.getElementById('signup-profile-setup');
        if(type === 'signup') {
            setupDiv.classList.remove('hidden');
        } else {
            setupDiv.classList.add('hidden');
        }
        
        // Mettre à jour le texte du bouton
        document.getElementById('auth-btn-text').innerText = 
            type === 'login' ? 'SE CONNECTER' : 'CRÉER MON COMPTE';
    },

    selectAvatar(avatarUrl, element) {
        // Mettre à jour la prévisualisation
        document.getElementById('auth-pfp-preview').src = avatarUrl;
        
        // Mettre à jour la sélection visuelle
        document.querySelectorAll('.pfp-item').forEach(item => {
            item.classList.remove('selected');
        });
        element.classList.add('selected');
        
        this.state.selectedPfp = avatarUrl;
    },

    triggerPfpUpload() {
        document.getElementById('real-pfp-input').click();
    },

    handlePfpFile(event) {
        const file = event.target.files[0];
        if(!file) return;
        
        if(!file.type.startsWith('image/')) {
            this.notify("❌ Veuillez sélectionner une image", "error");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.state.selectedPfp = e.target.result;
            document.getElementById('auth-pfp-preview').src = e.target.result;
            this.notify("✅ Photo de profil chargée", "success");
        };
        reader.readAsDataURL(file);
    },

    executeAuth() {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-pass').value;
        const isSignup = this.state.currentTab === 'signup';
        const pseudo = isSignup ? document.getElementById('reg-pseudo').value : null;
        
        // Validation de base
        if(!email || !password) {
            this.showAuthMessage('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        if(isSignup && !pseudo) {
            this.showAuthMessage('Veuillez choisir un pseudo', 'error');
            return;
        }
        
        if(password.length < 6) {
            this.showAuthMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
            return;
        }
        
        // Afficher le loader
        const btnText = document.getElementById('auth-btn-text');
        const loader = document.getElementById('auth-loader');
        btnText.innerText = isSignup ? 'CRÉATION...' : 'CONNEXION...';
        loader.style.display = 'block';
        
        // Simuler un délai réseau
        setTimeout(() => {
            if(isSignup) {
                this.signup(email, password, pseudo);
            } else {
                this.login(email, password);
            }
            
            btnText.innerText = isSignup ? 'CRÉER MON COMPTE' : 'SE CONNECTER';
            loader.style.display = 'none';
        }, 1500);
    },

    signup(email, password, pseudo) {
        // Vérifier si l'email est déjà utilisé
        const existingUser = this.state.users.find(u => u.email === email);
        if(existingUser) {
            this.showAuthMessage('Cette adresse email est déjà utilisée', 'error');
            return;
        }
        
        // Vérifier si le pseudo est déjà pris
        const existingPseudo = this.state.users.find(u => u.pseudo === pseudo);
        if(existingPseudo) {
            this.showAuthMessage('Ce pseudo est déjà pris', 'error');
            return;
        }
        
        // Créer le nouvel utilisateur
        const newUser = {
            id: Date.now(),
            pseudo: pseudo,
            email: email,
            pass: password,
            pfp: this.state.selectedPfp,
            bio: 'Nouveau membre de la communauté Rasstube',
            followers: 0,
            following: 0,
            flameDays: 0,
            postsCount: 0,
            joined: new Date().toLocaleDateString('fr-FR')
        };
        
        // Ajouter à la liste des utilisateurs
        this.state.users.push(newUser);
        this.state.session = newUser;
        this.sync();
        
        // Lancer l'application
        this.launch();
        
        // Ajouter XP pour la création de compte
        this.addXP(100);
        
        this.showAuthMessage('Compte créé avec succès !', 'success');
        this.notify(`🎉 Bienvenue ${pseudo} ! Vous avez gagné 100 XP pour votre inscription.`, 'success');
    },

    login(email, password) {
        // Trouver l'utilisateur
        const user = this.state.users.find(u => u.email === email && u.pass === password);
        
        if(!user) {
            this.showAuthMessage('Email ou mot de passe incorrect', 'error');
            return;
        }
        
        // Mettre à jour la session
        this.state.session = user;
        this.sync();
        
        // Lancer l'application
        this.launch();
        
        // Ajouter XP pour la connexion
        this.addXP(10);
        
        this.showAuthMessage('Connexion réussie !', 'success');
    },

    showAuthMessage(message, type) {
        const msgElement = document.getElementById('auth-msg');
        msgElement.innerText = message;
        msgElement.style.color = type === 'error' ? '#ff4444' : '#44ff44';
        msgElement.style.display = 'block';
        
        setTimeout(() => {
            msgElement.style.display = 'none';
        }, 5000);
    }
});