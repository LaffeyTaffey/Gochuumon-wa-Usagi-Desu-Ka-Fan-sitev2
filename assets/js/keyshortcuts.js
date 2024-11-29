document.addEventListener('keydown', function(e) {
  // Only handle shortcuts if main content is visible
  if ($('.main-content').is(':visible')) {
    switch(e.key) {
      case 'ArrowLeft':
        // Previous frame
        $('#prevBtn').click();
        break;
      
      case 'ArrowRight':
        // Next frame
        $('#nextBtn').click();
        break;
      
      case ' ':
        // Space bar - Play/Pause
        e.preventDefault();
        $('#playBtn').click();
        break;
      
      case 'r':
      case 'R':
        // Random frame
        $('#randomBtn').click();
        break;
      
      case 'Escape':
        // Back to main menu
        $('#backBtn').click();
        break;
      
      case 'm':
      case 'M':
        // Toggle music player
        $('.music-icon').click();
        break;
    }
  }
});

// Show keyboard shortcuts help
$('#helpBtn').click(function() {
  const shortcuts = `
    ← : Previous frame
    → : Next frame
    Space : Play/Pause
    R : Random frame
    Esc : Back to menu
    M : Toggle music
  `;
  
  // Show shortcuts in a bootstrap modal
  const modal = new bootstrap.Modal(document.getElementById('shortcutsModal'));
  $('#shortcutsModal .modal-body').text(shortcuts);
  modal.show();
});