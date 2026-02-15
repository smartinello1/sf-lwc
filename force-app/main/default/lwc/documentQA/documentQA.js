import { LightningElement, track, api } from 'lwc';

export default class DocumentQA extends LightningElement {
	// Public API
	@api showDebugInfo = false;

	// Model selection
	@track selectedModel = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';
	@track currentModelName = '';
	@track engineType = 'WebLLM';

	// Document management
	@track documents = [];
	nextDocumentId = 1;

	// Chat history
	@track chatHistory = [];
	nextMessageId = 1;

	// Question/Answer state
	@track question = '';
	@track generationStatus = '';

	// Model state
	@track modelStatus = '';
	@track modelLoadProgress = 0;
	@track modelReady = false;
	@track isModelLoading = false;

	// Processing flags
	@track isProcessing = false;
	@track isGenerating = false;

	// Iframe communication
	vfOrigin = 'https://martinellosimone-dev-ed--c.vf.force.com';
	iframeWindow = null;

	// Model options
	modelOptions = [
		{
			label: 'Phi-3 Mini - Fast & Smart (Recommended)',
			value: 'Phi-3-mini-4k-instruct-q4f16_1-MLC'
		},
		{
			label: 'Llama 3.2 1B - Lightweight & Fast',
			value: 'Llama-3.2-1B-Instruct-q4f16_1-MLC'
		},
		{
			label: 'Llama 3.2 3B - Balanced Performance',
			value: 'Llama-3.2-3B-Instruct-q4f16_1-MLC'
		},
		{ label: 'Gemma 2 2B - Google Model', value: 'gemma-2-2b-it-q4f16_1-MLC' },
		{
			label: 'Qwen 2.5 1.5B - Alibaba Model',
			value: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC'
		}
	];

	// Computed properties
	get vfPageUrl() {
		return `/apex/DocumentQA_VF`;
	}

	get engineStatusLabel() {
		if (this.isModelLoading) return '⏳ Loading...';
		if (this.modelReady) return '✅ Ready';
		return '❌ Not Ready';
	}

	get engineStatusClass() {
		if (this.isModelLoading) return 'status-badge-loading';
		if (this.modelReady) return 'status-badge-success';
		return 'status-badge-error';
	}

	get hasDocuments() {
		return this.documents.length > 0;
	}

	get hasChatHistory() {
		return this.chatHistory.length > 0;
	}

	get isChatEmpty() {
		return this.chatHistory.length === 0;
	}

	get documentsCountLabel() {
		return `${this.documents.length} document${
			this.documents.length !== 1 ? 's' : ''
		}`;
	}

	get totalDocuments() {
		return this.documents.length;
	}

	get totalChunks() {
		return this.documents.reduce((sum, doc) => sum + (doc.chunks || 0), 0);
	}

	get chatMessagesCount() {
		return this.chatHistory.length;
	}

	get askButtonLabel() {
		return this.isGenerating ? 'Sending...' : 'Send';
	}

	get isAskButtonDisabled() {
		return (
			!this.hasDocuments ||
			!this.question ||
			this.isGenerating ||
			this.isModelLoading ||
			!this.modelReady
		);
	}

	get isChatInputDisabled() {
		return (
			!this.hasDocuments ||
			this.isGenerating ||
			this.isModelLoading ||
			!this.modelReady
		);
	}

	get disableFileUpload() {
		return this.isModelLoading || !this.modelReady;
	}

	// Lifecycle hooks
	connectedCallback() {
		window.addEventListener('message', this.handleMessage.bind(this));
	}

	disconnectedCallback() {
		window.removeEventListener('message', this.handleMessage.bind(this));
	}

	handleIframeLoad() {
		this.iframeWindow = this.template.querySelector('iframe').contentWindow;
		console.log('Iframe loaded successfully');
	}

	// Message handling from Visualforce
	handleMessage(event) {
		if (event.origin !== this.vfOrigin) {
			return;
		}

		const message = event.data;
		console.log('Received message from VF:', message);

		switch (message.type) {
			case 'MODEL_LOADING':
				this.isModelLoading = true;
				this.modelStatus = message.status || 'Loading model...';
				this.modelLoadProgress = message.progress || 0;
				break;

			case 'MODEL_READY':
				this.modelReady = true;
				this.isModelLoading = false;
				this.currentModelName = this.getModelDisplayName(message.model);
				this.engineType = message.engine || 'WebLLM';
				this.modelStatus = '';
				this.modelLoadProgress = 100;
				setTimeout(() => {
					this.modelLoadProgress = 0;
				}, 2000);
				break;

			case 'MODEL_ERROR':
				this.modelReady = false;
				this.isModelLoading = false;
				this.modelStatus = '';
				this.modelLoadProgress = 0;
				this.showToast('Error', message.error, 'error');
				break;

			case 'DOCUMENT_PROCESSING':
				this.updateDocumentProgress(
					message.documentId,
					message.status,
					message.progress
				);
				break;

			case 'DOCUMENT_PROCESSED':
				this.completeDocumentProcessing(
					message.documentId,
					message.chunksCount
				);
				break;

			case 'DOCUMENT_ERROR':
				this.handleDocumentError(message.documentId, message.error);
				break;

			case 'ANSWER_GENERATING':
				this.generationStatus = message.status;
				break;

			case 'ANSWER_READY':
				this.addAIMessage(message.answer, message.sources);
				this.generationStatus = '';
				this.isGenerating = false;
				this.question = '';
				this.scrollToBottom();
				break;

			case 'ANSWER_ERROR':
				this.generationStatus = '';
				this.isGenerating = false;
				this.showToast('Error', message.error, 'error');
				break;
		}
	}

	// Send message to Visualforce
	sendMessageToVF(message) {
		if (this.iframeWindow) {
			this.iframeWindow.postMessage(message, this.vfOrigin);
		} else {
			console.error('Iframe window not available');
			this.showToast(
				'Error',
				'AI engine not ready. Please refresh the page.',
				'error'
			);
		}
	}

	// Event handlers
	handleModelChange(event) {
		const newModel = event.detail.value;
		if (newModel !== this.selectedModel) {
			this.selectedModel = newModel;
			this.isModelLoading = true;
			this.modelReady = false;

			this.sendMessageToVF({
				type: 'RELOAD_MODEL',
				model: newModel
			});
		}
	}

	handleQuestionChange(event) {
		this.question = event.target.value;
	}

	handleKeyDown(event) {
		// Send on Ctrl+Enter or Cmd+Enter
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			if (!this.isAskButtonDisabled) {
				this.askQuestion();
			}
		}
	}

	async handleFileUpload(event) {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		for (let file of files) {
			await this.processFile(file);
		}

		// Clear the input
		event.target.value = '';
	}

	async processFile(file) {
		// Create document entry
		const docId = 'doc_' + this.nextDocumentId++;
		const doc = {
			id: docId,
			name: file.name,
			size: file.size,
			type: file.type,
			icon: this.getFileIcon(file.name),
			chunks: 0,
			chunksLabel: 'Processing...',
			isProcessing: true,
			progress: 0,
			status: 'Reading file...'
		};

		this.documents = [...this.documents, doc];

		try {
			let content = '';
			const fileExtension = file.name.split('.').pop().toLowerCase();

			if (fileExtension === 'pdf') {
				// For PDF, we'll send the file to VF for processing
				const arrayBuffer = await this.readFileAsArrayBuffer(file);
				const base64 = this.arrayBufferToBase64(arrayBuffer);

				this.sendMessageToVF({
					type: 'PROCESS_DOCUMENT',
					documentId: docId,
					documentName: file.name,
					data: base64,
					fileType: 'pdf'
				});
			} else {
				// For text files, read directly
				content = await this.readFileAsText(file);

				this.sendMessageToVF({
					type: 'PROCESS_DOCUMENT',
					documentId: docId,
					documentName: file.name,
					data: content,
					fileType: 'text'
				});
			}
		} catch (error) {
			this.handleDocumentError(docId, error.message);
		}
	}

	handleRemoveDocument(event) {
		const docId = event.currentTarget.dataset.docId;

		// Remove from array
		this.documents = this.documents.filter((doc) => doc.id !== docId);

		// Notify VF to remove from index
		this.sendMessageToVF({
			type: 'REMOVE_DOCUMENT',
			documentId: docId
		});
	}

	handleClearAllDocuments() {
		this.documents = [];
		this.chatHistory = [];

		this.sendMessageToVF({
			type: 'CLEAR_ALL_DOCUMENTS'
		});
	}

	handleClearChat() {
		this.chatHistory = [];
	}

	askQuestion() {
		if (!this.question.trim()) {
			this.showToast('Warning', 'Please enter a question', 'warning');
			return;
		}

		if (!this.hasDocuments) {
			this.showToast(
				'Warning',
				'Please upload at least one document first',
				'warning'
			);
			return;
		}

		// Add user message to chat
		this.addUserMessage(this.question);

		// Set generating state
		this.isGenerating = true;
		this.generationStatus = 'Searching documents...';

		// Send to VF for processing
		this.sendMessageToVF({
			type: 'ASK_QUESTION',
			data: this.question
		});

		// Scroll to bottom
		this.scrollToBottom();
	}

	// Document management helpers
	updateDocumentProgress(docId, status, progress) {
		this.documents = this.documents.map((doc) => {
			if (doc.id === docId) {
				return { ...doc, status, progress };
			}
			return doc;
		});
	}

	completeDocumentProcessing(docId, chunksCount) {
		this.documents = this.documents.map((doc) => {
			if (doc.id === docId) {
				return {
					...doc,
					chunks: chunksCount,
					chunksLabel: `${chunksCount} chunks`,
					isProcessing: false,
					progress: 100,
					status: 'Complete'
				};
			}
			return doc;
		});
	}

	handleDocumentError(docId, error) {
		this.documents = this.documents.map((doc) => {
			if (doc.id === docId) {
				return {
					...doc,
					isProcessing: false,
					progress: 0,
					status: 'Error: ' + error,
					chunksLabel: 'Failed'
				};
			}
			return doc;
		});
	}

	// Chat helpers
	addUserMessage(content) {
		const message = {
			id: 'msg_' + this.nextMessageId++,
			sender: 'You',
			content: content,
			timestamp: this.getCurrentTime(),
			icon: 'utility:user',
			cssClass: 'message-user',
			hasSources: false
		};

		this.chatHistory = [...this.chatHistory, message];
	}

	addAIMessage(content, sources) {
		const processedSources = this.processSources(sources);

		const message = {
			id: 'msg_' + this.nextMessageId++,
			sender: 'AI Assistant',
			content: content,
			timestamp: this.getCurrentTime(),
			icon: 'utility:chat',
			cssClass: 'message-ai',
			hasSources: processedSources.length > 0,
			sourcesCount: processedSources.length,
			sources: processedSources
		};

		this.chatHistory = [...this.chatHistory, message];
	}

	processSources(sources) {
		if (!sources || sources.length === 0) return [];

		return sources.map((source, index) => ({
			id: 'source_' + index,
			documentName: source.documentName,
			relevance: `${(source.similarity * 100).toFixed(1)}% relevant`,
			text: source.text
		}));
	}

	// Helper methods
	getCurrentTime() {
		const now = new Date();
		return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	scrollToBottom() {
		setTimeout(() => {
			const chatContainer = this.template.querySelector('.chat-container');
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 100);
	}

	readFileAsText(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target.result);
			reader.onerror = (e) => reject(new Error('Failed to read file'));
			reader.readAsText(file);
		});
	}

	readFileAsArrayBuffer(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target.result);
			reader.onerror = (e) => reject(new Error('Failed to read file'));
			reader.readAsArrayBuffer(file);
		});
	}

	arrayBufferToBase64(buffer) {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}

	getFileIcon(filename) {
		const extension = filename.split('.').pop().toLowerCase();
		const iconMap = {
			pdf: 'doctype:pdf',
			txt: 'doctype:txt',
			md: 'doctype:txt',
			doc: 'doctype:word',
			docx: 'doctype:word',
			csv: 'doctype:csv',
			json: 'doctype:xml'
		};
		return iconMap[extension] || 'doctype:unknown';
	}

	getModelDisplayName(modelId) {
		if (!modelId) return '';

		const modelMap = {
			'Phi-3-mini-4k-instruct-q4f16_1-MLC': 'Phi-3 Mini',
			'Llama-3.2-1B-Instruct-q4f16_1-MLC': 'Llama 3.2 1B',
			'Llama-3.2-3B-Instruct-q4f16_1-MLC': 'Llama 3.2 3B',
			'gemma-2-2b-it-q4f16_1-MLC': 'Gemma 2 2B',
			'Qwen2.5-1.5B-Instruct-q4f16_1-MLC': 'Qwen 2.5 1.5B'
		};

		return modelMap[modelId] || modelId;
	}

	showToast(title, message, variant) {
		console.log(`${variant.toUpperCase()}: ${title} - ${message}`);
		// In production, use ShowToastEvent
	}
}
