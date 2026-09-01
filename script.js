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

const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwjWWFIL9EObg5obVMAF0jMKQDIA9p8MZcWKdm7S7MsklgwKGNgmn-UFIdexszf1MdgRA/exec';
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

function showRsvpStatus(type, title, message) {
  if (!rsvpStatus) return;
  rsvpStatus.hidden = false;
  rsvpStatus.dataset.state = type;
  rsvpStatus.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  rsvpStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

attendanceInputs.forEach((input) => input.addEventListener('change', updateAttendanceFields));
updateAttendanceFields();

rsvpForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!rsvpForm.reportValidity()) return;

  const submitButton = rsvpForm.querySelector('.rsvp-submit');
  const formData = new FormData(rsvpForm);
  const attendance = (formData.get('attendance') || '').toString();
  const submission = {
    name: (formData.get('name') || '').toString().trim(),
    attending: attendance === 'yes' ? 'Yes' : 'Sadly, no',
    guests: attendance === 'yes' ? (formData.get('guests') || '').toString().trim() : '',
    dietary: attendance === 'yes' ? (formData.get('dietary') || '').toString().trim() : '',
    message: (formData.get('message') || '').toString().trim()
  };

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  }
  if (rsvpStatus) rsvpStatus.hidden = true;

  try {
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(submission)
    });

    rsvpForm.reset();
    updateAttendanceFields();
    showRsvpStatus('success', 'Thank you!', 'Your RSVP has been sent to Anastasiia & Zak. ♡');
  } catch (error) {
    showRsvpStatus('error', 'Something went wrong', 'Please try sending your RSVP again in a moment.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send RSVP ♡';
    }
  }
});
