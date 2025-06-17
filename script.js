const notesContainer = document.getElementById('notesContainer');
const modalContainer = document.getElementById('modal-container');
const confirmDelete = document.getElementById('confirm-delete');
const cancelDelete = document.getElementById('cancel-delete');
const noteNameSpan = document.getElementById('note-name');

let currentNoteIdToDelete = null;

// Helper to get notes from localStorage
function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]');
}

// Helper to save notes to localStorage
function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Render notes
function renderNotes() {
  const notes = getNotes();
  notesContainer.innerHTML = '';

  if (notes.length === 0) {
    notesContainer.innerHTML = '<p style="color:#888;">No notes yet.</p>';
    return;
  }

  notes.forEach(note => {
    const article = document.createElement('article');
    article.className = 'note-item';

    // Link to edit-note.html with note id as query param
    const link = document.createElement('a');
    link.className = 'note-link';
    link.href = `edit-note.html?id=${note.id}`;
    link.setAttribute('aria-label', `Edit ${note.title}`);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';

    const h3 = document.createElement('h3');
    h3.className = 'note-title';
    h3.textContent = note.title;

    contentDiv.appendChild(h3);
    link.appendChild(contentDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.setAttribute('data-note', note.title);
    deleteBtn.setAttribute('data-id', note.id);
    deleteBtn.setAttribute('aria-label', `Delete ${note.title}`);
    deleteBtn.innerHTML = '<span aria-hidden="true">×</span>';

    // Delete button event
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentNoteIdToDelete = note.id;
      noteNameSpan.textContent = note.title;
      modalContainer.classList.add('show');
      modalContainer.setAttribute('aria-hidden', 'false');
      confirmDelete.focus();
    });

    article.appendChild(link);
    article.appendChild(deleteBtn);

    notesContainer.appendChild(article);
  });
}

// Handle confirm delete
confirmDelete.addEventListener('click', () => {
  if (currentNoteIdToDelete !== null) {
    let notes = getNotes();
    notes = notes.filter(note => note.id !== currentNoteIdToDelete);
    saveNotes(notes);
    renderNotes();
    currentNoteIdToDelete = null;
  }
  closeModal();
});

// Handle cancel delete
cancelDelete.addEventListener('click', () => {
  currentNoteIdToDelete = null;
  closeModal();
});

// Close modal when clicking outside
modalContainer.addEventListener('click', (e) => {
  if (e.target === modalContainer) {
    currentNoteIdToDelete = null;
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalContainer.classList.contains('show')) {
    currentNoteIdToDelete = null;
    closeModal();
  }
});

function closeModal() {
  modalContainer.classList.remove('show');
  modalContainer.setAttribute('aria-hidden', 'true');
}

// Initial render
renderNotes();