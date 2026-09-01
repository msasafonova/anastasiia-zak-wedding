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

const rsvpForm = document.getElementById('rsvpForm');
const attendingFields = document.getElementById('attendingFields');
const rsvpStatus = document.getElementById('rsvpStatus');
const attendanceInputs = document.querySelectorAll('input[name="attendance"]');

function updateAttendanceFields() {
  const selected = document.querySelector('input[name="attendance"]:checked')?.value;
  if (!attendingFields) return;
  const show = selected === 'yes';
  attendingFields.hidden = !show;
  attendingFields.querySelectorAll('input, textarea').forEach((field) => {
    field.disabled = !show;
  });
}

attendanceInputs.forEach((input) => input.addEventListener('change', updateAttendanceFields));
updateAttendanceFields();

rsvpForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!rsvpForm.reportValidity()) return;

  const formData = new FormData(rsvpForm);
  const submission = {
    submittedAt: new Date().toISOString(),
    name: (formData.get('name') || '').toString().trim(),
    attendance: (formData.get('attendance') || '').toString(),
    guests: (formData.get('guests') || '').toString().trim(),
    dietary: (formData.get('dietary') || '').toString().trim(),
    message: (formData.get('message') || '').toString().trim()
  };

  const existing = JSON.parse(localStorage.getItem('anastasiiaZakRsvpTest') || '[]');
  existing.push(submission);
  localStorage.setItem('anastasiiaZakRsvpTest', JSON.stringify(existing));

  rsvpForm.reset();
  updateAttendanceFields();

  if (rsvpStatus) {
    rsvpStatus.hidden = false;
    rsvpStatus.innerHTML = '<strong>Thank you!</strong><span>Your test RSVP was saved on this device.</span>';
    rsvpStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
