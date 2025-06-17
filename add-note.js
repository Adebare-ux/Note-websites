// DOM Elements
    const titleInput = document.getElementById('noteTitle');
    const bodyTextarea = document.getElementById('noteBody');
    const createButton = document.getElementById('createNote');
    const saveButton = document.getElementById('saveNote');
    const successToast = document.getElementById('successToast');

    // Character counter for title
    function createCharCounter(input, maxLength) {
      const counter = document.createElement('div');
      counter.className = 'char-counter';
      input.parentNode.appendChild(counter);
      
      function updateCounter() {
        const remaining = maxLength - input.value.length;
        counter.textContent = `${input.value.length}/${maxLength}`;
        counter.classList.toggle('warning', remaining < 10);
      }
      
      input.addEventListener('input', updateCounter);
      updateCounter();
    }

    // Initialize character counter
    createCharCounter(titleInput, 100);

    // Auto-save functionality
    let autoSaveTimeout;
    
    function autoSave() {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        const noteData = {
          title: titleInput.value.trim(),
          body: bodyTextarea.value.trim(),
          lastSaved: new Date().toISOString()
        };
        
        // Store in memory (since localStorage isn't available)
        window.tempNoteData = noteData;
        console.log('Auto-saved note data:', noteData);
      }, 1000);
    }

    // Add auto-save listeners
    titleInput.addEventListener('input', autoSave);
    bodyTextarea.addEventListener('input', autoSave);

    // Form validation
    function validateForm() {
      const title = titleInput.value.trim();
      const body = bodyTextarea.value.trim();
      
      createButton.disabled = !title || !body;
      saveButton.disabled = !title || !body;
      
      return title && body;
    }

    // Add validation listeners
    titleInput.addEventListener('input', validateForm);
    bodyTextarea.addEventListener('input', validateForm);

    // Initial validation
    validateForm();

    // Show toast notification
    function showToast(message, type = 'success') {
      const toast = successToast;
      const messageElement = toast.querySelector('.toast-message');
      
      messageElement.textContent = message;
      toast.className = `toast ${type}`;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Helper to get notes array from localStorage
    function getNotes() {
      return JSON.parse(localStorage.getItem('notes') || '[]');
    }

    // Helper to save notes array to localStorage
    function saveNotes(notes) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Create note functionality
    async function createNote() {
      if (!validateForm()) return;

      const noteData = {
        id: Date.now(),
        title: titleInput.value.trim(),
        body: bodyTextarea.value.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add loading state
      createButton.classList.add('loading');
      createButton.disabled = true;

      try {
        const notes = getNotes();
        notes.push(noteData);
        saveNotes(notes);
        showToast('Note created successfully!');
        // Optionally, redirect to index after creation
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } catch (error) {
        showToast('Failed to create note', 'error');
      } finally {
        createButton.classList.remove('loading');
        createButton.disabled = false;
      }
    }

    // Quick save functionality
    function quickSave() {
      if (!validateForm()) return;
      
      const noteData = {
        title: titleInput.value.trim(),
        body: bodyTextarea.value.trim(),
        savedAt: new Date().toISOString()
      };
      
      console.log('Quick saved:', noteData);
      showToast('Note saved!');
    }

    // Event listeners
    createButton.addEventListener('click', createNote);
    saveButton.addEventListener('click', quickSave);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        quickSave();
      }
      
      // Ctrl/Cmd + Enter to create
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        createNote();
      }
    });

    // Focus title input on load
    window.addEventListener('load', () => {
      titleInput.focus();
    });

    // Warn before leaving if there's unsaved content
    window.addEventListener('beforeunload', (e) => {
      const hasContent = titleInput.value.trim() || bodyTextarea.value.trim();
      if (hasContent) {
        e.preventDefault();
        e.returnValue = '';
      }
    });