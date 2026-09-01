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
const rsvpNote = document.querySelector('.rsvp-test-note');

if (rsvpNote) {
  rsvpNote.textContent = 'Your RSVP will be sent directly to Anastasiia & Zak.';
}

function updateAttendanceFields() {
  const selected = document.querySelector('input[name="attendance"]:checked')?.value;
  if (!attendingFields) return;
  const show = selected === 'yes' || selected === 'maybe';
  attendingFields.hidden = !show;
  attendingFields.querySelectorAll('input, textarea').forEach((field) => {
    field.disabled = !show;
  });
}

function buildGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: "Anastasiia & Zak's Wedding",
    dates: '20270313/20270314',
    details: "Anastasiia & Zak are getting married! Ceremony at 3:30 pm at St Andrew’s Greek Orthodox Church, followed by celebrations at Chateau Wyuna. More details: https://msasafonova.github.io/anastasiia-zak-wedding/",
    location: 'Melbourne, Victoria, Australia'
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadCalendarFile() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Anastasiia and Zak Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:anastasiia-zak-wedding-20270313@anastasiia-zak-wedding',
    'DTSTAMP:20260901T000000Z',
    'DTSTART;VALUE=DATE:20270313',
    'DTEND;VALUE=DATE:20270314',
    "SUMMARY:Anastasiia & Zak's Wedding",
    'LOCATION:Melbourne\, Victoria\, Australia',
    'DESCRIPTION:Ceremony at 3:30 pm at St Andrew’s Greek Orthodox Church\, followed by celebrations at Chateau Wyuna. More details: https://msasafonova.github.io/anastasiia-zak-wedding/',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'anastasiia-zak-wedding.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function showRsvpStatus(type, title, message, showCalendar = false) {
  if (!rsvpStatus) return;
  rsvpStatus.hidden = false;
  rsvpStatus.dataset.state = type;
  rsvpStatus.innerHTML = `<strong>${title}</strong><span>${message}</span>`;

  if (showCalendar) {
    const calendarWrap = document.createElement('div');
    calendarWrap.className = 'rsvp-calendar-actions';

    const googleLink = document.createElement('a');
    googleLink.className = 'primary-button rsvp-calendar-button';
    googleLink.href = buildGoogleCalendarUrl();
    googleLink.target = '_blank';
    googleLink.rel = 'noopener';
    googleLink.textContent = 'Add to Google Calendar';

    const icsButton = document.createElement('button');
    icsButton.className = 'primary-button rsvp-calendar-button rsvp-calendar-secondary';
    icsButton.type = 'button';
    icsButton.textContent = 'Apple / Outlook Calendar';
    icsButton.addEventListener('click', downloadCalendarFile);

    calendarWrap.append(googleLink, icsButton);
    rsvpStatus.appendChild(calendarWrap);
  }

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
  const attendanceLabel = attendance === 'yes' ? 'Yes' : attendance === 'maybe' ? 'Maybe' : 'Sadly, no';
  const potentiallyAttending = attendance === 'yes' || attendance === 'maybe';

  const submission = {
    name: (formData.get('name') || '').toString().trim(),
    attending: attendanceLabel,
    guests: potentiallyAttending ? (formData.get('guests') || '').toString().trim() : '',
    dietary: potentiallyAttending ? (formData.get('dietary') || '').toString().trim() : '',
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

    if (attendance === 'yes') {
      showRsvpStatus('success', 'We can’t wait!', 'Your RSVP has been sent. Add the wedding to your calendar so the date is safely saved. ♡', true);
    } else if (attendance === 'maybe') {
      showRsvpStatus('success', 'Fingers crossed!', 'Your “maybe” has been sent. Save the date in your calendar while you work it out. ♡', true);
    } else {
      showRsvpStatus('success', 'Thank you for letting us know', 'Your RSVP has been sent to Anastasiia & Zak. ♡');
    }
  } catch (error) {
    showRsvpStatus('error', 'Something went wrong', 'Please try sending your RSVP again in a moment.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send RSVP ♡';
    }
  }
});
