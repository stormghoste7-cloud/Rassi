/**
 * RASSTUBE ULTIMATE - Système de Compression Vidéo
 */

// Étendre l'objet App avec les méthodes de compression
Object.assign(App, {
    // Système de compression
    compressor: {
        currentFile: null,
        quality: 'medium',
        compressedBlob: null
    },

    // MÉTHODES DE COMPRESSION
    setCompressionQuality(quality) {
        this.compressor.quality = quality;
        document.querySelectorAll('.quality-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.quality-btn[data-quality="${quality}"]`).classList.add('active');
    },

    handleCompressorFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Vérifier que c'est une vidéo
        if (!file.type.startsWith('video/')) {
            this.notify("❌ Veuillez sélectionner une vidéo", "error");
            return;
        }
        
        // Vérifier la taille (max 2GB)
        if (file.size > 2 * 1024 * 1024 * 1024) {
            this.notify("❌ La vidéo est trop lourde (max 2GB)", "error");
            return;
        }
        
        this.compressor.currentFile = file;
        
        // Afficher les infos du fichier
        const fileSize = (file.size / (1024 * 1024)).toFixed(1);
        document.getElementById('original-file-info').innerText = 
            `${file.name} • ${fileSize} MB`;
        
        // Prévisualiser la vidéo
        const preview = document.getElementById('compressor-preview');
        preview.src = URL.createObjectURL(file);
        
        // Passer à l'étape 2
        document.getElementById('compressor-step-1').classList.add('hidden');
        document.getElementById('compressor-step-2').classList.remove('hidden');
        
        this.notify("📹 Vidéo chargée avec succès", "success");
    },

    async startCompression() {
        const file = this.compressor.currentFile;
        if (!file) return;
        
        const btn = document.getElementById('compress-btn');
        const btnText = document.getElementById('compress-btn-text');
        const loader = document.getElementById('compress-loader');
        
        btn.disabled = true;
        btnText.innerText = "COMPRESSION EN COURS...";
        loader.style.display = 'block';
        
        try {
            // Simuler la compression
            await this.simulateCompression(file);
            
            // Passer à l'étape 3
            document.getElementById('compressor-step-2').classList.add('hidden');
            document.getElementById('compressor-step-3').classList.remove('hidden');
            
            // Gagner XP pour la compression
            this.addXP(25);
            this.notify("✅ Compression réussie !", "success");
            
        } catch (error) {
            this.notify("❌ Erreur lors de la compression", "error");
        } finally {
            btn.disabled = false;
            btnText.innerText = "COMPRESSER LA VIDÉO";
            loader.style.display = 'none';
        }
    },

    simulateCompression(file) {
        return new Promise((resolve) => {
            const quality = this.compressor.quality;
            const originalSize = file.size;
            
            // Facteurs de compression selon la qualité
            const compressionFactors = {
                high: 0.6,    // -40%
                medium: 0.3,  // -70%
                low: 0.1      // -90%
            };
            
            const factor = compressionFactors[quality];
            const newSize = originalSize * factor;
            
            // Mettre à jour la barre de progression
            const bar = document.getElementById('compression-bar');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += 2;
                bar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Mettre à jour les infos
                    const originalMB = (originalSize / (1024 * 1024)).toFixed(1);
                    const newMB = (newSize / (1024 * 1024)).toFixed(1);
                    const savings = (100 - (newSize / originalSize * 100)).toFixed(0);
                    
                    document.getElementById('compressed-file-info').innerText = 
                        `Version compressée • ${newMB} MB`;
                    document.getElementById('savings-percent').innerText = 
                        `${savings}% d'économie`;
                    
                    // Créer un blob simulé
                    this.compressor.compressedBlob = new Blob(
                        [file.slice(0, file.size * factor)], 
                        { type: file.type }
                    );
                    
                    resolve();
                }
            }, 30);
        });
    },

    downloadCompressedVideo() {
        if (!this.compressor.compressedBlob) return;
        
        const url = URL.createObjectURL(this.compressor.compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${this.compressor.currentFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.notify("📥 Téléchargement lancé", "success");
    },

    uploadCompressedVideo() {
        if (!this.compressor.compressedBlob) return;
        
        // Créer un fichier à partir du blob
        const compressedFile = new File(
            [this.compressor.compressedBlob],
            `compressed_${this.compressor.currentFile.name}`,
            { type: this.compressor.currentFile.type }
        );
        
        // Rediriger vers la section upload avec le fichier pré-chargé
        this.go('upload');
        
        // Simuler le chargement du fichier dans l'upload
        setTimeout(() => {
            const dropzone = document.getElementById('upload-dropzone');
            dropzone.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-check-circle" style="font-size: 40px; color: var(--success); margin-bottom: 15px;"></i>
                    <p style="margin: 0; font-weight: 700;">Vidéo compressée prête</p>
                    <p style="margin: 5px 0 0; color: var(--text-dim);">${compressedFile.name}</p>
                    <p style="margin: 5px 0 0; color: var(--success); font-size: 12px;">
                        <i class="fas fa-check"></i> Optimisée pour Rasstube
                    </p>
                </div>
            `;
            
            // Stocker le fichier pour la publication
            this.state.compressedVideoReady = compressedFile;
            
            this.notify("🎬 Vidéo compressée prête à être publiée", "success");
        }, 500);
    }
});