// Meao Dictionary - Interactive Cat Interface
class MeaoCat {
    constructor() {
        this.catElement = document.getElementById('meao-cat');
        this.eyeBlinkElements = document.querySelectorAll('.eye-blink');
        this.clickHint = document.getElementById('click-hint');
        this.searchContainer = document.getElementById('search-container');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        
        // New language controls
        this.sourceLangSelect = document.getElementById('source-lang');
        this.targetLangSelect = document.getElementById('target-lang');
        this.swapLangBtn = document.getElementById('swap-lang-btn');
        
        this.isSearchVisible = false;
        
        // Voice recognition and translation properties
        this.recognition = null;
        this.isListening = false;
        this.isTranslationMode = false;
        this.translationResults = [];
        
        this.init();
    }
    
    init() {
        this.populateLanguages();
        this.setupEventListeners();
        this.initializeVoiceRecognition();
        console.log('🐱 Meao is ready! Click the cat to start searching.');
    }

    populateLanguages() {
        const languages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
            { code: 'es', name: 'Spanish', flag: '🇪🇸' },
            { code: 'fr', name: 'French', flag: '🇫🇷' },
            { code: 'de', name: 'German', flag: '🇩🇪' },
            { code: 'it', name: 'Italian', flag: '🇮🇹' },
            { code: 'ko', name: 'Korean', flag: '🇰🇷' },
            { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
            { code: 'ru', name: 'Russian', flag: '🇷🇺' },
            { code: 'pt', name: 'Portuguese', flag: '🇵🇹' }
        ];

        const createOption = (lang) => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = `${lang.flag} ${lang.name}`;
            return option;
        };

        // Clear existing options
        this.sourceLangSelect.innerHTML = '';
        this.targetLangSelect.innerHTML = '';

        languages.forEach(lang => {
            this.sourceLangSelect.appendChild(createOption(lang));
            this.targetLangSelect.appendChild(createOption(lang));
        });

        // Set defaults
        this.sourceLangSelect.value = 'en';
        this.targetLangSelect.value = 'ja';
        
        this.updatePlaceholder();
    }
    
    getLanguageName(code) {
        const names = {
            'en': 'English', 'ja': 'Japanese', 'es': 'Spanish', 'fr': 'French',
            'de': 'German', 'it': 'Italian', 'ko': 'Korean', 'zh': 'Chinese',
            'ru': 'Russian', 'pt': 'Portuguese'
        };
        return names[code] || code.toUpperCase();
    }
    
    setupEventListeners() {
        // Cat click handler
        this.catElement.addEventListener('click', () => {
            this.handleCatClick();
        });
        
        // Search functionality
        this.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });
        
        // Enter key in search input
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Search input focus effects
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.parentElement.style.transform = 'scale(1.02)';
        });
        
        this.searchInput.addEventListener('blur', () => {
            this.searchInput.parentElement.style.transform = 'scale(1)';
        });

        // Language controls
        this.sourceLangSelect.addEventListener('change', () => {
            this.updatePlaceholder();
            console.log(`Source language changed to: ${this.sourceLangSelect.value}`);
        });

        this.targetLangSelect.addEventListener('change', () => {
            console.log(`Target language changed to: ${this.targetLangSelect.value}`);
        });

        this.swapLangBtn.addEventListener('click', () => {
            const temp = this.sourceLangSelect.value;
            this.sourceLangSelect.value = this.targetLangSelect.value;
            this.targetLangSelect.value = temp;
            
            this.updatePlaceholder();
            
            // Animation for swap button
            this.swapLangBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                this.swapLangBtn.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
    
    updatePlaceholder() {
        const langName = this.sourceLangSelect.options[this.sourceLangSelect.selectedIndex].text;
        // Remove flag from text for placeholder
        const cleanName = langName.replace(/^[^\s]+\s/, '');
        this.searchInput.placeholder = `Search in ${cleanName}...`;
    }
    
    handleCatClick() {
        console.log('🐱 Meow! Cat clicked!');
        
        // Add wiggle animation to the image
        this.wiggleCat();
        
        // Show search interface if not already visible
        if (!this.isSearchVisible) {
            this.showSearchInterface();
        } else {
            // If already visible, just do a cute reaction
            this.addCatReaction();
        }
    }
    
    wiggleCat() {
        // Trigger a quick blink when clicked
        this.triggerBlink();
        
        // Remove any existing animation classes
        this.catElement.classList.remove('clicked', 'happy');
        
        // Force reflow to restart animation
        this.catElement.offsetHeight;
        
        // Add wiggle animation class
        this.catElement.classList.add('clicked');
        
        // Remove the class after animation completes
        setTimeout(() => {
            this.catElement.classList.remove('clicked');
        }, 600);
    }
    
    addCatReaction() {
        // Trigger a happy blink
        this.triggerBlink();
        
        // Add happy bounce animation when clicked again
        this.catElement.classList.remove('happy');
        this.catElement.offsetHeight;
        this.catElement.classList.add('happy');
        
        setTimeout(() => {
            this.catElement.classList.remove('happy');
        }, 800);
    }
    
    // Trigger a manual blink animation
    triggerBlink() {
        if (this.eyeBlinkElements && this.eyeBlinkElements.length > 0) {
            this.eyeBlinkElements.forEach(eye => {
                // Reset any existing animation
                eye.style.animation = 'none';
                
                // Force reflow
                eye.offsetHeight;
                
                // Trigger quick blink
                eye.style.animation = 'quickBlink 0.3s ease-out';
            });
            
            // Reset to normal blinking after quick blink
            setTimeout(() => {
                this.eyeBlinkElements.forEach((eye, index) => {
                    eye.style.animation = `blink 4s ease-in-out infinite ${index * 0.1}s`;
                });
            }, 300);
        }
    }
    
    showSearchInterface() {
        // Hide click hint
        this.clickHint.style.opacity = '0';
        this.clickHint.style.transform = 'translateY(-20px)';
        
        // Show search container after a short delay
        setTimeout(() => {
            this.searchContainer.classList.add('show');
            this.isSearchVisible = true;
            
            // Focus on search input after animation
            setTimeout(() => {
                this.searchInput.focus();
            }, 300);
            
        }, 200);
        
        // Move cat slightly up to make room
        this.catElement.style.transform = 'translateY(-20px) scale(0.9)';
        
        console.log('🔍 Search interface activated!');
    }
    
    async handleSearch() {
        const query = this.searchInput.value.trim();
        const sourceLang = this.sourceLangSelect.value;
        const targetLang = this.targetLangSelect.value;
        
        if (!query) {
            // Shake the search box if empty
            this.shakeSearchBox();
            return;
        }
        
        console.log(`🔍 Searching for: "${query}" from ${sourceLang} to ${targetLang}`);
        
        // Add loading state
        this.setSearchLoading(true);
        
        try {
            let result;
            if (sourceLang === 'en') {
                result = await this.searchEnglishDictionary(query, targetLang);
            } else if (sourceLang === 'ja') {
                result = await this.searchJapaneseDictionary(query, targetLang);
            } else {
                // Generic translation for other languages
                result = await this.performGenericTranslation(query, sourceLang, targetLang);
            }
            
            this.setSearchLoading(false);
            this.displaySearchResults(result);
            
            // Save to history
            this.saveToHistory(query, result);
            
        } catch (error) {
            console.error('Search error:', error);
            this.setSearchLoading(false);
            this.displayErrorResult(query, error);
        }
    }
    
    // Search English dictionary using Free Dictionary API
    async searchEnglishDictionary(word, targetLang = 'ja') {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Word not found: ${word}`);
        }
        
        const data = await response.json();
        const entry = data[0]; // Get first entry
        
        // Extract relevant information
        const result = {
            word: entry.word,
            phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
            audio: entry.phonetics?.find(p => p.audio)?.audio || '',
            meanings: entry.meanings.map(meaning => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions.slice(0, 3).map(def => ({
                    definition: def.definition,
                    example: def.example || ''
                }))
            })),
            language: 'en'
        };
        
        // Add Translation
        try {
            const translationText = await this.translateText(entry.word, 'en', targetLang);
            if (translationText) {
                result.translation = {
                    text: translationText,
                    language: targetLang,
                    label: `${this.getLanguageName(targetLang)} Translation`
                };
            }
        } catch (error) {
            console.warn('Failed to get translation:', error);
        }
        
        return result;
    }
    
    // Search Japanese dictionary using JMdict API
    async searchJapaneseDictionary(word, targetLang = 'en') {
        try {
            // Using jisho.org API which provides access to JMdict data
            const apiUrl = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Japanese word not found: ${word}`);
            }
            
            const data = await response.json();
            
            if (!data.data || data.data.length === 0) {
                throw new Error(`No Japanese entries found for: ${word}`);
            }
            
            const entry = data.data[0]; // Get first entry
            
            // Extract readings (pronunciation)
            const readings = entry.japanese || [];
            const mainReading = readings.find(r => r.reading) || readings[0] || {};
            const phonetic = mainReading.reading || mainReading.word || '';
            
            // Extract meanings
            const senses = entry.senses || [];
            const meanings = senses.slice(0, 3).map(sense => ({
                partOfSpeech: sense.parts_of_speech?.[0] || '品詞不明',
                definitions: sense.english_definitions ? sense.english_definitions.slice(0, 3).map((def, index) => ({
                    definition: def,
                    example: sense.tags?.length > 0 ? `Tags: ${sense.tags.join(', ')}` : ''
                })) : [{
                    definition: 'Definition not available',
                    example: ''
                }]
            }));
            
            // If no meanings found, create a basic one
            if (meanings.length === 0) {
                meanings.push({
                    partOfSpeech: '単語',
                    definitions: [{
                        definition: 'Japanese word found, but detailed definition not available',
                        example: ''
                    }]
                });
            }
            
            const result = {
                word: entry.japanese?.[0]?.word || entry.japanese?.[0]?.reading || word,
                phonetic: phonetic,
                audio: '', // Jisho doesn't provide audio, but we could integrate with other services
                meanings: meanings,
                language: 'ja',
                // Additional Japanese-specific info
                jlptLevel: entry.jlpt?.[0] || null,
                isCommon: entry.is_common || false
            };
            
            // Add Translation
            try {
                const translationText = await this.translateText(result.word, 'ja', targetLang);
                if (translationText) {
                    result.translation = {
                        text: translationText,
                        language: targetLang,
                        label: `${this.getLanguageName(targetLang)} Translation`
                    };
                }
            } catch (error) {
                console.warn('Failed to get translation:', error);
            }
            
            return result;
            
        } catch (error) {
            console.error('Japanese dictionary error:', error);
            
            // Fallback to a more informative mock result
            return {
                word: word,
                phonetic: 'にほんご',
                audio: '',
                meanings: [{
                    partOfSpeech: '検索エラー',
                    definitions: [{
                        definition: `Could not find "${word}" in Japanese dictionary. Try searching in hiragana, katakana, or kanji.`,
                        example: 'Example: try "ねこ" instead of "neko", or "猫" for cat'
                    }]
                }],
                language: 'ja',
                error: true
            };
        }
    }

    async performGenericTranslation(word, sourceLang, targetLang) {
        const translation = await this.translateText(word, sourceLang, targetLang);
        
        if (!translation) {
            throw new Error('Translation failed');
        }

        return {
            word: word,
            phonetic: '',
            audio: '',
            meanings: [{
                partOfSpeech: 'Translation',
                definitions: [{
                    definition: translation,
                    example: ''
                }]
            }],
            language: sourceLang,
            translation: {
                text: translation,
                language: targetLang,
                label: `${this.getLanguageName(targetLang)} Translation`
            }
        };
    }
    
    // Initialize Web Speech API for voice recognition
    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US'; // Will be changed based on translation mode
            this.recognition.maxAlternatives = 1;
            
            this.recognition.onstart = () => {
                console.log('🎤 Voice recognition started');
                this.isListening = true;
                this.updateVoiceUI();
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript && this.isTranslationMode) {
                    this.translateAndDisplay(finalTranscript.trim());
                }
                
                // Update interim display
                if (interimTranscript && this.isTranslationMode) {
                    this.updateInterimTranscript(interimTranscript);
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceUI();
            };
            
            this.recognition.onend = () => {
                console.log('🎤 Voice recognition ended');
                this.isListening = false;
                this.updateVoiceUI();
                
                // Restart if still in translation mode
                if (this.isTranslationMode) {
                    setTimeout(() => {
                        if (this.isTranslationMode) {
                            this.startListening();
                        }
                    }, 100);
                }
            };
            
            console.log('🎤 Voice recognition initialized');
        } else {
            console.warn('Voice recognition not supported in this browser');
        }
    }
    
    // Start/stop continuous listening
    toggleTranslation() {
        if (!this.recognition) {
            alert('Voice recognition is not supported in your browser. Please use Chrome, Safari, or Edge.');
            return;
        }
        
        if (this.isTranslationMode) {
            // Stop
            this.isTranslationMode = false;
            this.stopListening();
            this.hideTranslationPanel();
        } else {
            // Start
            this.isTranslationMode = true;
            
            // Set recognition language based on source
            const sourceLang = this.sourceLangSelect.value;
            // Map simple codes to full locale codes for speech recognition
            const locales = {
                'en': 'en-US', 'ja': 'ja-JP', 'es': 'es-ES', 'fr': 'fr-FR',
                'de': 'de-DE', 'it': 'it-IT', 'ko': 'ko-KR', 'zh': 'zh-CN',
                'ru': 'ru-RU', 'pt': 'pt-PT'
            };
            this.recognition.lang = locales[sourceLang] || 'en-US';
            
            this.startListening();
            this.showTranslationPanel();
        }
        
        this.updateVoiceUI();
        console.log(`🎌 Translation mode: ${this.isTranslationMode ? 'ON' : 'OFF'}`);
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting voice recognition:', error);
            }
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    // Translate spoken text and display result
    async translateAndDisplay(text) {
        if (!text.trim()) return;
        
        const sourceLang = this.sourceLangSelect.value;
        const targetLang = this.targetLangSelect.value;
        
        console.log(`🗣️ Translating: "${text}" from ${sourceLang} to ${targetLang}`);
        
        try {
            const translation = await this.translateText(text, sourceLang, targetLang);
            
            if (translation) {
                const translationItem = {
                    original: text,
                    translated: translation,
                    timestamp: new Date().toLocaleTimeString(),
                    id: Date.now(),
                    originalLangFlag: this.getFlag(sourceLang),
                    translatedLangFlag: this.getFlag(targetLang)
                };
                
                this.translationResults.unshift(translationItem);
                
                // Keep only last 20 translations
                if (this.translationResults.length > 20) {
                    this.translationResults = this.translationResults.slice(0, 20);
                }
                
                this.updateTranslationDisplay();
                this.triggerBlink(); 
            }
        } catch (error) {
            console.error('Translation error:', error);
        }
    }
    
    getFlag(code) {
        const flags = {
            'en': '🇺🇸', 'ja': '🇯🇵', 'es': '🇪🇸', 'fr': '🇫🇷',
            'de': '🇩🇪', 'it': '🇮🇹', 'ko': '🇰🇷', 'zh': '🇨🇳',
            'ru': '🇷🇺', 'pt': '🇵🇹'
        };
        return flags[code] || '🏳️';
    }
    
    updateInterimTranscript(interimText) {
        const interimElement = document.getElementById('interim-transcript');
        if (interimElement) {
            interimElement.textContent = interimText;
        }
    }
    
    updateTranslationDisplay() {
        const translationList = document.getElementById('translation-list');
        if (!translationList) return;
        
        const translations = this.translationResults || [];
        const translationsHTML = translations.map(item => `
            <div class="translation-item" data-id="${item.id}">
                <div class="translation-original">
                    <span class="lang-indicator">${item.originalLangFlag}</span>
                    "${item.original}"
                </div>
                <div class="translation-arrow">→</div>
                <div class="translation-result">
                    <span class="lang-indicator">${item.translatedLangFlag}</span>
                    "${item.translated}"
                </div>
                <div class="translation-time">${item.timestamp}</div>
                <button class="remove-translation" onclick="window.meaoCat.removeTranslation(${item.id})">×</button>
            </div>
        `).join('');
        
        translationList.innerHTML = translationsHTML;
    }
    
    removeTranslation(id) {
        this.translationResults = this.translationResults.filter(item => item.id !== id);
        this.updateTranslationDisplay();
    }
    
    clearAllTranslations() {
        if (confirm('Clear all translations?')) {
            this.translationResults = [];
            this.updateTranslationDisplay();
        }
    }
    
    showTranslationPanel() {
        const panel = document.getElementById('translation-panel');
        if (panel) {
            panel.classList.add('show');
            
            // Update title
            const title = document.getElementById('translation-panel-title');
            if (title) {
                title.textContent = `🌐 Live Translation (${this.getLanguageName(this.sourceLangSelect.value)} → ${this.getLanguageName(this.targetLangSelect.value)})`;
            }
        }
    }
    
    hideTranslationPanel() {
        const panel = document.getElementById('translation-panel');
        if (panel) {
            panel.classList.remove('show');
        }
    }
    
    updateVoiceUI() {
        const voiceBtn = document.getElementById('voice-translation-btn');
        const statusIndicator = document.getElementById('voice-status');
        
        if (voiceBtn) {
            if (this.isTranslationMode) {
                voiceBtn.classList.add('active');
                voiceBtn.innerHTML = this.isListening ? '🔴 Stop Translation' : '⏸️ Translation Active';
            } else {
                voiceBtn.classList.remove('active');
                voiceBtn.innerHTML = '<span>🎤</span> Start Translation';
            }
        }
        
        // Update status indicator
        if (statusIndicator) {
            if (this.isTranslationMode) {
                const sourceName = this.getLanguageName(this.sourceLangSelect.value);
                const targetName = this.getLanguageName(this.targetLangSelect.value);
                
                statusIndicator.innerHTML = this.isListening ? 
                    `<span class="listening">🎤 Listening (${sourceName} → ${targetName})...</span>` : 
                    `<span class="waiting">⏸️ Translation Mode Active</span>`;
                statusIndicator.classList.add('active');
            } else {
                statusIndicator.innerHTML = '<span class="inactive">🔇 Translation Off</span>';
                statusIndicator.classList.remove('active');
            }
        }
    }
    
    // Translation API integration
    async translateText(text, fromLang, toLang) {
        try {
            // Using unofficial Google Translate method
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Translation service unavailable');
            }
            
            const data = await response.json();
            
            // Extract translated text from response
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                return data[0][0][0];
            } else {
                throw new Error('Translation not available');
            }
            
        } catch (error) {
            console.warn('Translation failed:', error);
            
            // Fallback translations for common words
            const fallbackTranslations = {
                'en_to_ja': {
                    'cat': '猫',
                    'dog': '犬', 
                    'hello': 'こんにちは',
                    'thank you': 'ありがとう',
                    'water': '水',
                    'food': '食べ物'
                },
                'ja_to_en': {
                    '猫': 'cat',
                    '犬': 'dog',
                    'こんにちは': 'hello',
                    'ありがとう': 'thank you',
                    '水': 'water',
                    '食べ物': 'food'
                }
            };
            
            const translationKey = `${fromLang}_to_${toLang}`;
            const fallback = fallbackTranslations[translationKey];
            
            if (fallback && fallback[text.toLowerCase()]) {
                return fallback[text.toLowerCase()];
            }
            
            // Return null if translation fails
            return null;
        }
    }
    
    shakeSearchBox() {
        const searchBox = this.searchInput.parentElement;
        searchBox.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            searchBox.style.animation = '';
        }, 500);
    }
    
    setSearchLoading(isLoading) {
        if (isLoading) {
            this.searchBtn.innerHTML = '<span>⏳</span>';
            this.searchBtn.style.animation = 'spin 1s linear infinite';
        } else {
            this.searchBtn.innerHTML = '<span>🔍</span>';
            this.searchBtn.style.animation = '';
        }
    }
    
    displaySearchResults(result) {
        const resultsContainer = document.getElementById('results-container');
        
        // Create pronunciation section with audio if available
        const phoneticSection = result.phonetic ? `
            <div class="phonetic-section">
                <span class="phonetic-text">${result.phonetic}</span>
                ${result.audio ? `
                    <button class="audio-btn" onclick="this.previousElementSibling.click()">🔊</button>
                    <audio preload="none" style="display: none;">
                        <source src="${result.audio}" type="audio/mpeg">
                    </audio>
                ` : ''}
            </div>
        ` : '';
        
        // Create translation section if available
        const translationSection = result.translation ? `
            <div class="translation-section">
                <h4 class="translation-label">
                    <span class="translation-icon">🌍</span>
                    ${result.translation.label}
                </h4>
                <div class="translation-content">
                    <span class="translation-text">${result.translation.text}</span>
                    <span class="translation-lang-indicator">(${result.translation.language.toUpperCase()})</span>
                </div>
            </div>
        ` : '';
        
        // Create meanings sections
        const meaningsHTML = result.meanings.map(meaning => `
            <div class="meaning-section">
                <h4 class="part-of-speech">${meaning.partOfSpeech}</h4>
                ${meaning.definitions.map((def, index) => `
                    <div class="definition-item">
                        <div class="definition">${index + 1}. ${def.definition}</div>
                        ${def.example ? `
                            <div class="example">
                                <em>"${def.example}"</em>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `).join('');
        
        // Create bookmark button
        const bookmarkBtn = `
            <button class="bookmark-btn" onclick="window.meaoCat.toggleBookmark('${result.word}', '${result.language}')" title="Bookmark this word">
                <span class="bookmark-icon">⭐</span>
            </button>
        `;
        
        resultsContainer.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <div class="word-info">
                        <h2 class="word-title">${result.word}</h2>
                        ${phoneticSection}
                    </div>
                    ${bookmarkBtn}
                </div>
                
                ${translationSection}
                
                <div class="meanings-container">
                    ${meaningsHTML}
                </div>
                
                <div class="result-footer">
                    <div class="footer-left">
                        <small class="language-tag">${result.language === 'en' ? 'English' : 'Japanese'}</small>
                        ${result.jlptLevel ? `<small class="jlpt-tag">JLPT ${result.jlptLevel}</small>` : ''}
                        ${result.isCommon ? '<small class="common-tag">Common</small>' : ''}
                    </div>
                    <small class="search-time">Searched ${new Date().toLocaleTimeString()}</small>
                </div>
            </div>
        `;
        
        resultsContainer.classList.add('show');
        
        // Cat celebrates with happy bounce
        setTimeout(() => {
            this.addCatReaction();
        }, 300);
        
        console.log('📚 Dictionary result displayed!', result);
    }
    
    displayErrorResult(query, error) {
        const resultsContainer = document.getElementById('results-container');
        
        resultsContainer.innerHTML = `
            <div class="result-card error-card">
                <div class="error-content">
                    <h3>🤔 Word not found</h3>
                    <p>Sorry, I couldn't find "<strong>${query}</strong>" in the dictionary.</p>
                    <div class="error-suggestions">
                        <p>Try:</p>
                        <ul>
                            <li>Checking the spelling</li>
                            <li>Using a different form of the word</li>
                            <li>Switching the language</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.classList.add('show');
        console.log('❌ Search error displayed:', error);
    }
    
    // Local storage methods for word history and bookmarks
    saveToHistory(query, result) {
        try {
            const history = this.getHistory();
            const historyItem = {
                word: result.word,
                language: result.language,
                timestamp: new Date().toISOString(),
                query: query
            };
            
            // Remove if already exists and add to front
            const filtered = history.filter(item => 
                !(item.word.toLowerCase() === result.word.toLowerCase() && item.language === result.language)
            );
            filtered.unshift(historyItem);
            
            // Keep only last 100 searches
            const limitedHistory = filtered.slice(0, 100);
            
            localStorage.setItem('meao-history', JSON.stringify(limitedHistory));
            console.log('💾 Saved to history:', historyItem);
        } catch (error) {
            console.warn('Could not save to history:', error);
        }
    }
    
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('meao-history') || '[]');
        } catch {
            return [];
        }
    }
    
    toggleBookmark(word, language) {
        try {
            const bookmarks = this.getBookmarks();
            const existingIndex = bookmarks.findIndex(item => 
                item.word.toLowerCase() === word.toLowerCase() && item.language === language
            );
            
            if (existingIndex >= 0) {
                // Remove bookmark
                bookmarks.splice(existingIndex, 1);
                console.log('❌ Removed bookmark:', word);
            } else {
                // Add bookmark
                bookmarks.unshift({
                    word: word,
                    language: language,
                    timestamp: new Date().toISOString()
                });
                console.log('⭐ Added bookmark:', word);
            }
            
            localStorage.setItem('meao-bookmarks', JSON.stringify(bookmarks));
            
            // Update bookmark button appearance
            this.updateBookmarkButton(word, language);
            
            // Trigger a happy blink
            this.triggerBlink();
            
        } catch (error) {
            console.warn('Could not toggle bookmark:', error);
        }
    }
    
    getBookmarks() {
        try {
            return JSON.parse(localStorage.getItem('meao-bookmarks') || '[]');
        } catch {
            return [];
        }
    }
    
    updateBookmarkButton(word, language) {
        const bookmarks = this.getBookmarks();
        const isBookmarked = bookmarks.some(item => 
            item.word.toLowerCase() === word.toLowerCase() && item.language === language
        );
        
        const bookmarkBtn = document.querySelector('.bookmark-btn .bookmark-icon');
        if (bookmarkBtn) {
            bookmarkBtn.textContent = isBookmarked ? '⭐' : '☆';
            bookmarkBtn.parentElement.title = isBookmarked ? 'Remove bookmark' : 'Bookmark this word';
        }
    }
    
    // Show search history
    showHistory() {
        const history = this.getHistory();
        const resultsContainer = document.getElementById('results-container');
        
        if (history.length === 0) {
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <div class="empty-state">
                        <h3>📚 No search history yet</h3>
                        <p>Words you search for will appear here!</p>
                    </div>
                </div>
            `;
        } else {
            const historyHTML = history.slice(0, 20).map(item => `
                <div class="history-item" onclick="window.meaoCat.searchWord('${item.word}', '${item.language}')">
                    <div class="history-word">${item.word}</div>
                    <div class="history-meta">
                        <span class="language-tag">${item.language.toUpperCase()}</span>
                        <span class="history-time">${new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');
            
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <div class="list-header">
                        <h3>📚 Search History</h3>
                        <button class="clear-btn" onclick="window.meaoCat.clearHistory()">Clear All</button>
                    </div>
                    <div class="history-list">
                        ${historyHTML}
                    </div>
                </div>
            `;
        }
        
        resultsContainer.classList.add('show');
        this.triggerBlink();
    }
    
    // Show bookmarked words
    showBookmarks() {
        const bookmarks = this.getBookmarks();
        const resultsContainer = document.getElementById('results-container');
        
        if (bookmarks.length === 0) {
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <div class="empty-state">
                        <h3>⭐ No bookmarks yet</h3>
                        <p>Bookmark words to save them for later study!</p>
                    </div>
                </div>
            `;
        } else {
            const bookmarksHTML = bookmarks.map(item => `
                <div class="history-item" onclick="window.meaoCat.searchWord('${item.word}', '${item.language}')">
                    <div class="history-word">⭐ ${item.word}</div>
                    <div class="history-meta">
                        <span class="language-tag">${item.language.toUpperCase()}</span>
                        <span class="history-time">${new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');
            
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <div class="list-header">
                        <h3>⭐ Bookmarked Words</h3>
                        <button class="clear-btn" onclick="window.meaoCat.clearBookmarks()">Clear All</button>
                    </div>
                    <div class="history-list">
                        ${bookmarksHTML}
                    </div>
                </div>
            `;
        }
        
        resultsContainer.classList.add('show');
        this.triggerBlink();
    }
    
    // Search for a specific word (used by history/bookmarks)
    async searchWord(word, language) {
        this.sourceLangSelect.value = language;
        this.updatePlaceholder();
        this.searchInput.value = word;
        await this.handleSearch();
    }
    
    // Clear methods
    clearHistory() {
        if (confirm('Clear all search history?')) {
            localStorage.removeItem('meao-history');
            this.showHistory(); // Refresh display
            console.log('🗑️ Search history cleared');
        }
    }
    
    clearBookmarks() {
        if (confirm('Clear all bookmarks?')) {
            localStorage.removeItem('meao-bookmarks');
            this.showBookmarks(); // Refresh display
            console.log('🗑️ Bookmarks cleared');
        }
    }
}

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize the Meao cat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.meaoCat = new MeaoCat();
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeaoCat;
}