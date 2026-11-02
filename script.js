/* ========================================
   TREE PARALLAX
   TREES FINISH AT THE BOTTOM OF THE PAGE
======================================== */

const oliveTree = document.querySelector(".olive-tree");
const birchTree = document.querySelector(".birch-tree");

let ticking = false;


function positionTree(tree) {

  if (!tree) return;


  /* Total amount the page can scroll */

  const maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;


  /* How far through the page we currently are */

  const progress =
    maxScroll > 0
      ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
      : 0;


  /* Tree measurements */

  const treeHeight =
    tree.offsetHeight;

  const styles =
    window.getComputedStyle(tree);

  const treeTop =
    parseFloat(styles.top) || 0;


  /*
    At the very bottom of the page,
    place the bottom of the tree
    exactly at the bottom of the viewport.
  */

  const finalTranslate =
    window.innerHeight -
    treeHeight -
    treeTop;


  /* Move smoothly from starting position to final position */

  const translateY =
    finalTranslate * progress;


  tree.style.transform =
    `translateY(${translateY}px)`;
}


function updateTreeParallax() {

  positionTree(oliveTree);
  positionTree(birchTree);


  ticking = false;
}


function requestTreeParallaxUpdate() {

  if (!ticking) {

    window.requestAnimationFrame(
      updateTreeParallax
    );

    ticking = true;
  }
}


window.addEventListener(
  "scroll",
  requestTreeParallaxUpdate,
  { passive: true }
);


window.addEventListener(
  "resize",
  requestTreeParallaxUpdate
);


window.addEventListener(
  "load",
  updateTreeParallax
);


updateTreeParallax();


/* ========================================
   RSVP MODAL
======================================== */

const openRsvpButton =
  document.getElementById("openRsvp");

const closeRsvpButton =
  document.getElementById("closeRsvp");

const rsvpModal =
  document.getElementById("rsvpModal");

const rsvpForm =
  document.getElementById("rsvpForm");

const rsvpStatus =
  document.getElementById("rsvpStatus");


/* ========================================
   OPEN RSVP
======================================== */

function openRsvp() {
  rsvpModal.classList.add("open");

  rsvpModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";
}


/* ========================================
   CLOSE RSVP
======================================== */

function closeRsvp() {
  rsvpModal.classList.remove("open");

  rsvpModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";
}


if (openRsvpButton) {
  openRsvpButton.addEventListener(
    "click",
    openRsvp
  );
}


if (closeRsvpButton) {
  closeRsvpButton.addEventListener(
    "click",
    closeRsvp
  );
}


/* CLICK OUTSIDE FORM TO CLOSE */

if (rsvpModal) {
  rsvpModal.addEventListener(
    "click",
    (event) => {

      if (event.target === rsvpModal) {
        closeRsvp();
      }

    }
  );
}


/* ESC KEY TO CLOSE */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      rsvpModal.classList.contains("open")
    ) {
      closeRsvp();
    }

  }
);


/* ========================================
   GOOGLE APPS SCRIPT URL
======================================== */

const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxD116hffgZxumCRJq3X44uPD8e2-9otJ6MHx5dVn_5ox0BbfAzdhNOE8WIZn7lKZfN3w/exec";


/* ========================================
   RSVP FORM SUBMISSION
======================================== */

if (rsvpForm) {

  rsvpForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const submitButton =
        rsvpForm.querySelector(
          ".rsvp-submit"
        );


      const data = {
        name:
          document
            .getElementById("rsvpName")
            .value
            .trim(),

        attending:
          document
            .getElementById("rsvpAttending")
            .value,

        guests:
          document
            .getElementById("rsvpGuests")
            .value
            .trim(),

        dietary:
          document
            .getElementById("rsvpDietary")
            .value
            .trim(),

        message:
          document
            .getElementById("rsvpMessage")
            .value
            .trim()
      };


      submitButton.disabled = true;

      submitButton.textContent =
        "Sending…";

      rsvpStatus.textContent =
        "";


      try {

        await fetch(
          RSVP_ENDPOINT,
          {
            method: "POST",

            mode: "no-cors",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(data)
          }
        );


        rsvpForm.reset();


        rsvpStatus.textContent =
          "Thank you — your RSVP has been received!";


        submitButton.textContent =
          "Sent";


        setTimeout(
          () => {

            closeRsvp();

            submitButton.disabled =
              false;

            submitButton.textContent =
              "Send RSVP";

            rsvpStatus.textContent =
              "";

          },
          2500
        );


      } catch (error) {

        console.error(
          "RSVP submission failed:",
          error
        );


        rsvpStatus.textContent =
          "Something went wrong. Please try again.";


        submitButton.disabled =
          false;

        submitButton.textContent =
          "Send RSVP";

      }

    }
  );

}


/* ========================================
   PHOTO & VIDEO UPLOAD
======================================== */

const PHOTO_UPLOAD_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwfUQRGDjzIIE1ADq6iYl_xEcYGPX2LgdJM9Cq7-myfEtc1wwyY2aCajKLz31mrxc7f4A/exec";

const MAX_PHOTO_FILES = 20;
const MAX_PHOTO_FILE_SIZE = 30 * 1024 * 1024;

const openPhotoUploadButton =
  document.getElementById("openPhotoUpload");

const closePhotoUploadButton =
  document.getElementById("closePhotoUpload");

const photoUploadModal =
  document.getElementById("photoUploadModal");

const photoUploadForm =
  document.getElementById("photoUploadForm");

const photoFilesInput =
  document.getElementById("photoFiles");

const photoFileSummary =
  document.getElementById("photoFileSummary");

const photoUploadStatus =
  document.getElementById("photoUploadStatus");


function openPhotoUpload() {
  photoUploadModal.classList.add("open");

  photoUploadModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";
}


function closePhotoUpload() {
  photoUploadModal.classList.remove("open");

  photoUploadModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";
}


if (openPhotoUploadButton) {
  openPhotoUploadButton.addEventListener(
    "click",
    openPhotoUpload
  );
}


if (closePhotoUploadButton) {
  closePhotoUploadButton.addEventListener(
    "click",
    closePhotoUpload
  );
}


if (photoUploadModal) {
  photoUploadModal.addEventListener(
    "click",
    (event) => {
      if (event.target === photoUploadModal) {
        closePhotoUpload();
      }
    }
  );
}


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      photoUploadModal &&
      photoUploadModal.classList.contains("open")
    ) {
      closePhotoUpload();
    }
  }
);


function formatFileSize(bytes) {
  return bytes >= 1024 * 1024
    ? (bytes / (1024 * 1024)).toFixed(1) + " MB"
    : (bytes / 1024).toFixed(0) + " KB";
}


if (photoFilesInput) {
  photoFilesInput.addEventListener(
    "change",
    () => {
      const files = Array.from(photoFilesInput.files || []);

      photoFileSummary.textContent = files.length
        ? files.length + " file(s) selected"
        : "No files selected.";

      photoUploadStatus.textContent = "";
    }
  );
}


function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const commaPosition = result.indexOf(",");

      if (commaPosition === -1) {
        reject(new Error("Could not read " + file.name));
        return;
      }

      resolve(result.slice(commaPosition + 1));
    };

    reader.onerror = () => {
      reject(reader.error || new Error("Could not read " + file.name));
    };

    reader.readAsDataURL(file);
  });
}


if (photoUploadForm) {
  photoUploadForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const files = Array.from(photoFilesInput.files || []);
      const guestName = document
        .getElementById("photoGuestName")
        .value
        .trim();

      const submitButton =
        document.getElementById("photoUploadSubmit");

      if (files.length === 0) {
        photoUploadStatus.textContent =
          "Please choose at least one photo or video.";
        return;
      }

      if (files.length > MAX_PHOTO_FILES) {
        photoUploadStatus.textContent =
          "You can upload up to 20 files at a time.";
        return;
      }

      const invalidType = files.find((file) =>
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
      );

      if (invalidType) {
        photoUploadStatus.textContent =
          "Please choose image or video files only.";
        return;
      }

      const oversizedFile = files.find(
        (file) => file.size > MAX_PHOTO_FILE_SIZE
      );

      if (oversizedFile) {
        photoUploadStatus.textContent =
          oversizedFile.name + " is larger than 30 MB.";
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Uploading…";
      photoUploadStatus.textContent = "";

      let sentCount = 0;

      try {
        for (const file of files) {
          photoUploadStatus.textContent =
            "Preparing file " + (sentCount + 1) +
            " of " + files.length + "…";

          const base64 = await readFileAsBase64(file);
          const safeGuestName = guestName
            .replace(/[\\/:*?"<>|]/g, "")
            .trim();

          const storedFileName = safeGuestName
            ? safeGuestName + " - " + file.name
            : file.name;

          photoUploadStatus.textContent =
            "Sending file " + (sentCount + 1) +
            " of " + files.length + "…";

          await fetch(
            PHOTO_UPLOAD_ENDPOINT,
            {
              method: "POST",
              mode: "no-cors",
              headers: {
                "Content-Type": "text/plain;charset=utf-8"
              },
              body: JSON.stringify({
                file: base64,
                fileName: storedFileName,
                mimeType: file.type
              })
            }
          );

          sentCount++;
        }

        photoUploadForm.reset();
        photoFileSummary.textContent = "No files selected.";

        photoUploadStatus.textContent =
          "Upload requests sent. Thank you for sharing your memories!";

        submitButton.textContent = "Sent";

        setTimeout(() => {
          closePhotoUpload();
          submitButton.disabled = false;
          submitButton.textContent = "Upload files";
          photoUploadStatus.textContent = "";
        }, 3000);

      } catch (error) {
        console.error("Photo upload failed:", error);

        photoUploadStatus.textContent =
          sentCount > 0
            ? "The connection stopped after " + sentCount +
              " file(s). Some may already be in the folder. Please check before trying again."
            : "Something went wrong. Please try again.";

        submitButton.disabled = false;
        submitButton.textContent = "Try again";
      }
    }
  );
}
