document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       NAVIGATION
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    const navLinks = document.querySelectorAll('header nav a');

    // Toggle mobile menu
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                if (nav) nav.classList.remove('active');
                
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    /* =========================================
       SCROLL ANIMATIONS
       ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    /* =========================================
       FAQ ACCORDION
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    /* =========================================
       PLAYGROUND LOGIC
       ========================================= */
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const resultImage = document.getElementById('result-image');
    const loadingState = document.getElementById('loading-state');
    const downloadBtn = document.getElementById('download-btn');

    // Gallery images for random result simulation
    const resultImages = [
        'images/gallery-result-1.jpg',
        'images/gallery-result-2.jpg',
        'images/gallery-result-3.jpg',
        'images/gallery-result-4.jpg'
    ];

    // Upload Click
    if (uploadZone) {
        uploadZone.addEventListener('click', () => fileInput && fileInput.click());

        // Drag & Drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--primary)';
            uploadZone.style.background = 'rgba(0, 240, 255, 0.1)';
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '';
            uploadZone.style.background = '';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '';
            uploadZone.style.background = '';
            if (e.dataTransfer.files.length > 0 && fileInput) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect();
            }
        });
    }

    // File Change
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    function handleFileSelect() {
        if (!fileInput || !fileInput.files.length) return;
        const file = fileInput.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (previewImage) {
                    previewImage.src = e.target.result;
                    previewImage.classList.remove('hidden');
                }
                if (uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
                if (generateBtn) generateBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    }

    // Generate Button
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // UI State
            generateBtn.disabled = true;
            if (resultPlaceholder) resultPlaceholder.classList.add('hidden');
            if (resultImage) resultImage.classList.add('hidden');
            if (loadingState) loadingState.classList.remove('hidden');

            // Simulate Processing (3 seconds)
            setTimeout(() => {
                // Pick random result image
                const randomResult = resultImages[Math.floor(Math.random() * resultImages.length)];
                
                if (resultImage) {
                    resultImage.src = randomResult;
                    resultImage.classList.remove('hidden');
                }
                if (loadingState) loadingState.classList.add('hidden');
                if (downloadBtn) downloadBtn.disabled = false;
                generateBtn.disabled = false;
            }, 3000);
        });
    }

    // Reset Button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (fileInput) fileInput.value = '';
            if (previewImage) {
                previewImage.classList.add('hidden');
                previewImage.src = '';
            }
            if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
            
            if (resultImage) {
                resultImage.classList.add('hidden');
                resultImage.src = '';
            }
            if (resultPlaceholder) resultPlaceholder.classList.remove('hidden');
            
            if (generateBtn) generateBtn.disabled = true;
            if (downloadBtn) downloadBtn.disabled = true;
        });
    }

    // Download Button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            if (!resultImage || !resultImage.src) return;
            
            try {
                const response = await fetch(resultImage.src);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'fooocus-ai-result.jpg';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (error) {
                console.error('Download failed:', error);
                alert('Could not download image. Please try right-clicking and saving.');
            }
        });
    }

    /* =========================================
       MODALS (LEGAL)
       ========================================= */
    const openModalBtns = document.querySelectorAll('[data-modal-target]');
    const closeModalBtns = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('.modal');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});