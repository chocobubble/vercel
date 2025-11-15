class ConversationDictation {
    constructor() {
        this.currentScenario = 'restaurant_ordering';
        this.currentIndex = 0;
        this.scenarios = {};
        this.grammar = {};
        this.currentGrammarIndex = 0;
        this.currentMode = 'conversation';
        this.init();
    }

    async init() {
        await this.loadScenarios();
        await this.loadGrammar();
        this.setupEventListeners();
        this.selectScenario(this.currentScenario);
    }

    async loadGrammar() {
        try {
            const response = await fetch('./data/grammar.json');
            const data = await response.json();
            this.grammar = data.daily_grammar;
        } catch (error) {
            console.error('문법 데이터 로딩 실패:', error);
        }
    }

    switchMode(mode) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const conversationElements = ['.progress', '.controls', '.input-section', '.result'];
        
        if (mode === 'conversation') {
            document.getElementById('conversationMode').style.display = 'block';
            document.getElementById('grammarMode').style.display = 'none';
            conversationElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'block';
            });
        } else {
            document.getElementById('conversationMode').style.display = 'none';
            document.getElementById('grammarMode').style.display = 'block';
            conversationElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });
            if (this.grammar.length > 0) {
                this.showGrammar();
            }
        }
    }

    showGrammar() {
        if (!this.grammar || this.grammar.length === 0) return;
        
        const grammar = this.grammar[this.currentGrammarIndex];
        document.getElementById('grammarTopic').textContent = grammar.topic;
        document.getElementById('grammarExplanation').textContent = grammar.explanation;
        document.getElementById('grammarProgress').textContent = `${this.currentGrammarIndex + 1} / ${this.grammar.length}`;
        
        const examplesDiv = document.getElementById('grammarExamples');
        examplesDiv.innerHTML = '';
        
        grammar.examples.forEach(example => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'grammar-example';
            exampleDiv.innerHTML = `
                <div class="sentence">${example.sentence}</div>
                <div class="korean">${example.korean}</div>
                <div class="note">${example.note}</div>
            `;
            examplesDiv.appendChild(exampleDiv);
        });
    }

    nextGrammar() {
        if (this.currentGrammarIndex < this.grammar.length - 1) {
            this.currentGrammarIndex++;
            this.showGrammar();
        }
    }

    prevGrammar() {
        if (this.currentGrammarIndex > 0) {
            this.currentGrammarIndex--;
            this.showGrammar();
        }
    }

    async loadScenarios() {
        try {
            const response = await fetch('./data/scenarios.json');
            this.scenarios = await response.json();
            this.createScenarioButtons();
            console.log('Scenarios loaded:', Object.keys(this.scenarios));
        } catch (error) {
            console.error('Failed to load scenarios:', error);
            this.scenarios = {};
        }
    }

    createScenarioButtons() {
        const container = document.getElementById('scenarioButtons');
        container.innerHTML = '';
        
        Object.keys(this.scenarios).forEach((key, index) => {
            const scenario = this.scenarios[key];
            const button = document.createElement('button');
            button.className = `scenario-btn ${index === 0 ? 'active' : ''}`;
            button.textContent = scenario.title;
            button.onclick = () => this.selectScenario(key);
            container.appendChild(button);
        });
    }

    selectScenario(scenarioName) {
        if (!this.scenarios[scenarioName]) return; // Guard clause
        
        this.currentScenario = scenarioName;
        this.currentIndex = 0;
        
        document.querySelectorAll('.scenario-btn').forEach(btn => btn.classList.remove('active'));
        const targetBtn = document.querySelector(`[onclick="app.selectScenario('${scenarioName}')"]`);
        if (targetBtn) targetBtn.classList.add('active');
        
        const scenario = this.scenarios[scenarioName];
        document.getElementById('scenarioInfo').textContent = `${scenario.title} (${scenario.difficulty})`;
        document.getElementById('totalSentences').textContent = scenario.dialogue.length;
        document.getElementById('currentSentence').textContent = '1';
        this.resetUI();
    }

    playSentence(rate = 1.0) {
        if (!this.scenarios[this.currentScenario]) return; // Guard clause
        
        const dialogue = this.scenarios[this.currentScenario].dialogue[this.currentIndex];
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(dialogue.text);
        utterance.rate = rate;
        utterance.lang = 'en-US';
        
        console.log('Playing:', dialogue.text); // Debug log
        
        speechSynthesis.speak(utterance);
    }

    checkAnswer() {
        const userAnswer = document.getElementById('userInput').value.trim();
        const correctAnswer = this.scenarios[this.currentScenario].dialogue[this.currentIndex].text;
        const resultDiv = document.getElementById('result');

        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            resultDiv.className = 'result correct';
            resultDiv.innerHTML = '🎉 정답입니다!';
        } else {
            resultDiv.className = 'result incorrect';
            resultDiv.innerHTML = `❌ 틀렸습니다.<br><br><strong>당신의 답:</strong><br>${userAnswer}<br><br><strong>정답:</strong><br>${correctAnswer}`;
        }

        resultDiv.style.display = 'block';
        this.showExplanation();
        document.getElementById('nextBtn').style.display = 'block';
    }

    showExplanation() {
        const dialogue = this.scenarios[this.currentScenario].dialogue[this.currentIndex];
        const contentDiv = document.getElementById('explanationContent');
        
        contentDiv.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>🎭 화자:</strong> ${dialogue.speaker === 'Staff' ? '직원' : '고객'}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>🔤 의미:</strong> ${dialogue.korean}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>📖 주요 어휘:</strong><br>
                ${dialogue.vocabulary.map(v => `• ${v.word}: ${v.meaning}`).join('<br>')}
            </div>
            <div>
                <strong>📝 문법:</strong> ${dialogue.grammar}
            </div>
        `;
        
        document.getElementById('explanation').style.display = 'block';
    }

    nextSentence() {
        this.currentIndex++;
        
        if (this.currentIndex >= this.scenarios[this.currentScenario].dialogue.length) {
            alert('대화 완료! 🎉');
            this.currentIndex = 0;
        }
        
        document.getElementById('currentSentence').textContent = this.currentIndex + 1;
        this.resetUI();
    }

    resetUI() {
        document.getElementById('userInput').value = '';
        document.getElementById('result').style.display = 'none';
        document.getElementById('explanation').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
    }

    setupEventListeners() {
        const userInput = document.getElementById('userInput');
        
        // Enter key for checking answer
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.checkAnswer();
            }
        });

        // Escape to unfocus input field
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                userInput.blur();
            }
        });

        // Global keyboard shortcuts with safe Ctrl combinations
        document.addEventListener('keydown', (e) => {
            if (!e.ctrlKey) return;

            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.playSentence();
                    break;
                case ';':
                    e.preventDefault();
                    this.playSentence(0.7);
                    break;
                case "'":
                    e.preventDefault();
                    if (document.getElementById('nextBtn').style.display !== 'none') {
                        this.nextSentence();
                    }
                    break;
                case '.':
                    e.preventDefault();
                    this.playSentence();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.checkAnswer();
                    break;
            }
        });
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for voices to load
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            app = new ConversationDictation();
        });
    } else {
        app = new ConversationDictation();
    }
});
