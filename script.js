const envelope = document.getElementById('envelope');
const openButton = document.getElementById('openInvitation');
const viewInvitation = document.getElementById('viewInvitation');

function openEnvelope() {
  if (!envelope || envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  const card = envelope.querySelector('.invitation-card');
  if (card) card.setAttribute('aria-hidden', 'false');
}

openButton?.addEventListener('click', openEnvelope);

viewInvitation?.addEventListener('click', () => {
  document.getElementById('our-day')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});
