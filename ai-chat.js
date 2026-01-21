/**
 * RASSTUBE ULTIMATE - Chat IA Addictif
 */

// Étendre l'objet App avec les méthodes du chat IA
Object.assign(App, {
    // IA Chat
    aiConversation: [],
    aiPersonality: 'enthusiastic',
    
    // Réponses IA programmées
    aiResponses: {
        growth: [
            "🎯 Pour gagner des abonnés rapidement : Publiez du contenu à heure fixe chaque jour, utilisez au moins 5 hashtags pertinents, et collaborez avec d'autres créateurs de votre niche !",
            "🚀 Astuce growth : Les 3 premières secondes de votre vidéo sont cruciales. Commencez par quelque chose de choquant, drôle ou intriguant pour retenir l'attention !",
            "💡 Conseil IA : Analysez vos heures de pointe d'engagement (généralement 18h-21h) et programmez vos publications en conséquence pour maximiser la visibilité !",
            "📈 Pour augmenter l'engagement : Posez des questions dans vos légendes, répondez à tous les commentaires dans l'heure, et organisez des Q&A en direct !"
        ],
        content: [
            "✨ Idées de contenu viral : 1) Tutoriels rapides (60s max) 2) Avant/Après 3) Défis tendance 4) Réactions express 5) Contenu éducatif animé !",
            "🎬 Format gagnant : Les RShorts de moins de 30 secondes avec musique tendance ont 3x plus de chances de devenir viraux !",
            "📱 Conseil création : Utilisez des transitions fluides, des sous-titres dynamiques et des effets sonores pour rendre votre contenu plus professionnel !",
            "🔥 Tendances du moment : #CapCutChallenge, #AIArt, #SatisfyingVideos, #LearnIn60Seconds - Sautez sur ces trends rapidement !"
        ],
        analytics: [
            "📊 Votre contenu performe mieux les week-ends entre 11h et 14h. Le taux d'engagement est 40% plus élevé à ces moments !",
            "📈 Votre vidéo la plus vue a gardé 75% des viewers jusqu'à la fin. Répliquez ce format !",
            "🎯 Votre audience est principalement composée de 18-24 ans (65%). Adaptez votre contenu à cette démographie !",
            "📉 Conseil : Les vidéos entre 60 et 90 secondes ont le meilleur taux de rétention sur votre profil."
        ],
        optimization: [
            "⚡ Optimisez vos hashtags : Utilisez 3 hashtags populaires (1M+), 3 hashtags moyens (100k-1M) et 3 hashtags de niche (<100k) !",
            "🎨 Améliorez vos miniatures : Utilisez des couleurs vives, des visages expressifs et du texte en gros caractères !",
            "🔍 SEO pour Rasstube : Incluez vos mots-clés principaux dans les 50 premiers caractères de votre description !",
            "💎 Pro-tip : Utilisez des appels à l'action clairs (Likez si..., Abonnez-vous pour...) pour booster vos interactions !"
        ],
        entertainment: [
            "😂 Pourquoi les développeurs détestent-ils la nature ? Parce qu'il y a trop de bugs ! 🐛",
            "🎮 Savais-tu que le premier tweet a été envoyé en 2006 ? Moi non plus, je suis une IA de 2024 ! 😄",
            "✨ Blague IA : Combien de programmeurs faut-il pour changer une ampoule ? Aucun, c'est un problème matériel ! 💡",
            "😆 Pourquoi le livre de mathématiques était-il triste ? Parce qu'il avait trop de problèmes !"
        ],
        general: [
            "🌟 Salut ! Je suis ravi de discuter avec vous aujourd'hui. Comment puis-je vous aider à dominer Rasstube ?",
            "🤖 En tant qu'IA Rasstube, j'ai analysé des milliers de contenus viraux. Laissez-moi vous guider vers le succès !",
            "💫 Wow, excellente question ! Permettez-moi de vous donner les insights les plus récents du marché...",
            "🚀 Prêt à passer au niveau supérieur ? Je détecte un grand potentiel dans votre profil. Continuons !"
        ]
    },

    // MÉTHODES DU CHAT IA
    sendAIMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if(!message) return;
        
        // Ajouter le message utilisateur
        this.addAIMessage(message, 'user');
        input.value = '';
        
        // Réponse IA avec délai
        setTimeout(() => {
            this.generateAIResponse(message);
        }, 1000 + Math.random() * 1000);
    },

    sendAIQuick(message) {
        document.getElementById('ai-input').value = message;
        this.sendAIMessage();
    },

    addAIMessage(text, sender) {
        const container = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        if(sender === 'user') {
            messageDiv.innerHTML = `<strong>👤 Vous:</strong><p>${text}</p>`;
        } else {
            messageDiv.innerHTML = `<strong>🤖 IA Rasstube:</strong><p>${text}</p>`;
        }
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        // Ajouter XP pour interaction
        if(sender === 'user') {
            this.addXP(5);
        }
    },

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        
        // Montrer l'indicateur de frappe
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'ai-typing';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        document.getElementById('ai-chat-messages').appendChild(typingIndicator);
        
        // Générer une réponse basée sur le message
        setTimeout(() => {
            typingIndicator.remove();
            
            if(lowerMessage.includes('abonné') || lowerMessage.includes('follower') || lowerMessage.includes('croissance')) {
                response = this.aiResponses.growth[Math.floor(Math.random() * this.aiResponses.growth.length)];
            } else if(lowerMessage.includes('contenu') || lowerMessage.includes('idée') || lowerMessage.includes('vidéo')) {
                response = this.aiResponses.content[Math.floor(Math.random() * this.aiResponses.content.length)];
            } else if(lowerMessage.includes('analyse') || lowerMessage.includes('stat') || lowerMessage.includes('performance')) {
                response = this.aiResponses.analytics[Math.floor(Math.random() * this.aiResponses.analytics.length)];
            } else if(lowerMessage.includes('optim') || lowerMessage.includes('hashtag') || lowerMessage.includes('seo')) {
                response = this.aiResponses.optimization[Math.floor(Math.random() * this.aiResponses.optimization.length)];
            } else if(lowerMessage.includes('blague') || lowerMessage.includes('drôle') || lowerMessage.includes('rire')) {
                response = this.aiResponses.entertainment[Math.floor(Math.random() * this.aiResponses.entertainment.length)];
            } else {
                response = this.aiResponses.general[Math.floor(Math.random() * this.aiResponses.general.length)];
            }
            
            // Ajouter des éléments addictifs
            if(Math.random() > 0.7) {
                response += `\n\n🎮 **Astuce du jour** : ${this.getDailyTip()}`;
            }
            
            if(Math.random() > 0.8) {
                response += `\n\n🔥 **Votre streak** : ${this.state.flameDays} jours - Continuez comme ça !`;
            }
            
            this.addAIMessage(response, 'bot');
            
            // Ajouter XP pour réponse IA
            this.addXP(10);
        }, 1500 + Math.random() * 2000);
    },

    getDailyTip() {
        const tips = [
            "Likez 10 posts par jour pour augmenter votre visibilité de 30%",
            "Postez un RShort entre 18h et 20h pour maximiser les vues",
            "Utilisez 3 hashtags exacts dans vos 3 premiers commentaires",
            "Répondez aux commentaires dans les 15 minutes pour booster l'algorithme",
            "Collaborez avec un créateur de votre niche cette semaine"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
});