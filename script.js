const envelope = document.getElementById('envelope');
const openButton = document.getElementById('openInvitation');
const openHint = document.getElementById('openHint');
const viewInvitation = document.getElementById('viewInvitation');

function openEnvelope() {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  envelope.querySelector('.invitation-card').setAttribute('aria-hidden', 'false');
}

openButton.addEventListener('click', openEnvelope);
openHint.addEventListener('click', openEnvelope);

viewInvitation.addEventListener('click', () => {
  document.getElementById('our-day').scrollIntoView({
    behaviour: 'smooth',
    block: 'start'
  });
});

// Keyboard-friendly envelope opening.
envelope.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && !envelope.classList.contains('open')) {
    event.preventDefault();
    openEnvelope();
  }
});
