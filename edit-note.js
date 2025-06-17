class NoteEditor {
  constructor() {
    this.elements = {
      form: document.getElementById('noteForm'),
      title: document.getElementById('noteTitle'),
      content: document.getElementById('noteContent'),
      editBtn: document.getElementById('editBtn'),
      saveBtn: document.getElementById('saveBtn'),
      cancelBtn: document.getElementById('cancelBtn'),
      alert: document.getElementById('alert'),
      actions: document.getElementById('actions'),
      navActions: document.getElementById('navActions')
    };

    this.state = {
      isEditing: false,
      originalData: { title: '', content: '' },
      noteId: null,
      noteIndex: null
    };

    this.init();
  }

  init() {
    this.loadNote();
    this.bindEvents();
  }

  // Get note ID from URL
  getNoteIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  // Load the note from localStorage by ID
  loadNote() {
    try {
      const noteId = this.getNoteIdFromUrl();
      if (!noteId) throw new Error('No note ID provided.');

      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const idx = notes.findIndex(n => String(n.id) === String(noteId));
      if (idx === -1) throw new Error('Note not found.');

      this.state.noteId = noteId;
      this.state.noteIndex = idx;
      const note = notes[idx];

      this.elements.title.value = note.title;
      this.elements.content.value = note.body || note.content || '';
      this.saveOriginalData();
      this.toggleEdit(false);
    } catch (error) {
      this.showAlert(error.message, 'error');
      this.elements.form.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
    }
  }

  saveOriginalData() {
    this.state.originalData = {
      title: this.elements.title.value,
      content: this.elements.content.value
    };
  }

  bindEvents() {
    this.elements.editBtn.addEventListener('click', () => this.toggleEdit(true));
    this.elements.cancelBtn.addEventListener('click', () => this.cancelEdit());
    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.elements.title.addEventListener('input', () => this.validateForm());
    this.elements.content.addEventListener('input', () => this.validateForm());
  }

  toggleEdit(editing) {
    this.state.isEditing = editing;
    this.elements.title.disabled = !editing;
    this.elements.content.disabled = !editing;
    this.elements.actions.classList.toggle('hidden', !editing);
    this.elements.navActions.classList.toggle('hidden', editing);
    this.elements.editBtn.disabled = editing;
    if (editing) {
      this.elements.title.focus();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.validateForm()) return;
    this.saveNote();
  }

  validateForm() {
    let valid = true;
    const title = this.elements.title.value.trim();
    const content = this.elements.content.value.trim();

    if (!title) {
      document.getElementById('titleError').textContent = 'Title is required.';
      valid = false;
    } else {
      document.getElementById('titleError').textContent = '';
    }

    if (!content) {
      document.getElementById('contentError').textContent = 'Content is required.';
      valid = false;
    } else {
      document.getElementById('contentError').textContent = '';
    }

    this.elements.saveBtn.disabled = !valid;
    return valid;
  }

  saveNote() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const idx = this.state.noteIndex;
    if (idx === null || idx === -1) {
      this.showAlert('Note not found.', 'error');
      return;
    }
    notes[idx].title = this.elements.title.value.trim();
    notes[idx].body = this.elements.content.value.trim();
    notes[idx].updatedAt = new Date().toISOString();
    localStorage.setItem('notes', JSON.stringify(notes));
    this.saveOriginalData();
    this.toggleEdit(false);
    this.showAlert('Note updated successfully!');
  }

  cancelEdit() {
    this.elements.title.value = this.state.originalData.title;
    this.elements.content.value = this.state.originalData.content;
    this.toggleEdit(false);
  }

  showAlert(message, type = 'success') {
    this.elements.alert.textContent = message;
    this.elements.alert.className = 'alert';
    if (type === 'error') {
      this.elements.alert.classList.add('error');
    }
    this.elements.alert.style.display = 'block';
    setTimeout(() => {
      this.elements.alert.style.display = 'none';
    }, 2000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NoteEditor());
} else {
  new NoteEditor();
}