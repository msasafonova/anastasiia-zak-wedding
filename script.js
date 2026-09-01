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
    behavior: 'smooth',
    block: 'start'
  });
});
