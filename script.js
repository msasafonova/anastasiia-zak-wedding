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

const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxD116hffgZxumCRJq3X44uPD8e2-9otJ6MHx5dVn_5ox0BbfAzdhNOE8WIZn7lKZfN3w/exec';
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

const PHOTO_UPLOAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwfUQRGDjzIIE1ADq6iYl_xEcYGPX2LgdJM9Cq7-myfEtc1wwyY2aCajKLz31mrxc7f4A/exec';
const photoUploadForm = document.getElementById('photoUploadForm');
const photoFiles = document.getElementById('photoFiles');
const photoGuestName = document.getElementById('photoGuestName');
const photoSelection = document.getElementById('photoSelection');
const photoUploadStatus = document.getElementById('photoUploadStatus');
const photoUploadButton = document.getElementById('photoUploadButton');
const MAX_PHOTO_SIZE = 15 * 1024 * 1024;
const MAX_PHOTO_COUNT = 20;

function safeFilePart(value) {
  return value.replace(/[^a-z0-9 _.-]/gi, '').trim().replace(/\s+/g, '-').slice(0, 40);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = () => reject(reader.error || new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function showPhotoStatus(message, state = 'info') {
  if (!photoUploadStatus) return;
  photoUploadStatus.hidden = false;
  photoUploadStatus.dataset.state = state;
  photoUploadStatus.textContent = message;
}

photoFiles?.addEventListener('change', () => {
  const files = Array.from(photoFiles.files || []);
  if (!photoSelection) return;
  if (!files.length) {
    photoSelection.textContent = 'You can choose several photos at once.';
    return;
  }
  photoSelection.textContent = `${files.length} photo${files.length === 1 ? '' : 's'} selected.`;
});

photoUploadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const files = Array.from(photoFiles?.files || []);

  if (!files.length) {
    showPhotoStatus('Please choose at least one photo.', 'error');
    return;
  }
  if (files.length > MAX_PHOTO_COUNT) {
    showPhotoStatus(`Please upload up to ${MAX_PHOTO_COUNT} photos at a time.`, 'error');
    return;
  }

  const tooLarge = files.find((file) => file.size > MAX_PHOTO_SIZE);
  if (tooLarge) {
    showPhotoStatus(`${tooLarge.name} is too large. Please keep each photo under 15 MB.`, 'error');
    return;
  }

  if (photoUploadButton) {
    photoUploadButton.disabled = true;
    photoUploadButton.textContent = 'Uploading…';
  }

  const guest = safeFilePart(photoGuestName?.value || '');

  try {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      showPhotoStatus(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
      const base64 = await fileToBase64(file);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const originalName = safeFilePart(file.name) || `photo-${index + 1}`;
      const fileName = `${guest ? `${guest}-` : ''}${timestamp}-${originalName}`;

      await fetch(PHOTO_UPLOAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          file: base64,
          fileName,
          mimeType: file.type || 'application/octet-stream'
        })
      });
    }

    photoUploadForm.reset();
    if (photoSelection) photoSelection.textContent = 'You can choose several photos at once.';
    showPhotoStatus(`Thank you! ${files.length === 1 ? 'Your photo has' : 'Your photos have'} been uploaded ♡`, 'success');
  } catch (error) {
    showPhotoStatus('Something went wrong while uploading. Please try again.', 'error');
  } finally {
    if (photoUploadButton) {
      photoUploadButton.disabled = false;
      photoUploadButton.textContent = 'Upload photos ♡';
    }
  }
});
