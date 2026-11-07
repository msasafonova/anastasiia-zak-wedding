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
const TARGET_COMPRESSED_IMAGE_SIZE = 28 * 1024 * 1024;
const MAX_COMPRESSED_IMAGE_DIMENSION = 6000;


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

/* ========================================
   BANK DETAILS MODAL
======================================== */

const openBankDetailsButton =
  document.getElementById("openBankDetails");

const closeBankDetailsButton =
  document.getElementById("closeBankDetails");

const bankDetailsModal =
  document.getElementById("bankDetailsModal");


function openBankDetails() {
  bankDetailsModal.classList.add("open");

  bankDetailsModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";
}


function closeBankDetails() {
  bankDetailsModal.classList.remove("open");

  bankDetailsModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";
}


if (openBankDetailsButton) {
  openBankDetailsButton.addEventListener(
    "click",
    openBankDetails
  );
}


if (closeBankDetailsButton) {
  closeBankDetailsButton.addEventListener(
    "click",
    closeBankDetails
  );
}


if (bankDetailsModal) {
  bankDetailsModal.addEventListener(
    "click",
    (event) => {
      if (event.target === bankDetailsModal) {
        closeBankDetails();
      }
    }
  );
}


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      bankDetailsModal &&
      bankDetailsModal.classList.contains("open")
    ) {
      closeBankDetails();
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


/* ========================================
   AUTOMATIC PHOTO COMPRESSION
======================================== */

function loadImageForCompression(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error(
          'We could not process "' + file.name +
          '". Please choose a standard JPEG or HEIC photo, or a smaller version.'
        )
      );
    };

    image.src = objectUrl;
  });
}


async function compressImageForUpload(file) {
  const image = await loadImageForCompression(file);

  const originalWidth = image.naturalWidth;
  const originalHeight = image.naturalHeight;

  if (!originalWidth || !originalHeight) {
    throw new Error(
      'Could not read the dimensions of ' + file.name
    );
  }

  const scale = Math.min(
    1,
    MAX_COMPRESSED_IMAGE_DIMENSION /
      Math.max(originalWidth, originalHeight)
  );

  const width = Math.round(originalWidth * scale);
  const height = Math.round(originalHeight * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Your browser could not prepare " + file.name
    );
  }

  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  const qualities = [
    0.94,
    0.90,
    0.86,
    0.82,
    0.78,
    0.74,
    0.70
  ];

  let compressedBlob = null;

  for (const quality of qualities) {
    compressedBlob = await new Promise((resolve) => {
      canvas.toBlob(
        resolve,
        "image/jpeg",
        quality
      );
    });

    if (
      compressedBlob &&
      compressedBlob.size <= TARGET_COMPRESSED_IMAGE_SIZE
    ) {
      break;
    }
  }

  canvas.width = 0;
  canvas.height = 0;

  if (
    !compressedBlob ||
    compressedBlob.size > TARGET_COMPRESSED_IMAGE_SIZE
  ) {
    throw new Error(
      'The photo "' + file.name +
      '" could not be compressed below 28 MB. Please choose a smaller version.'
    );
  }

  const originalName = file.name.replace(/\.[^/.]+$/, "");

  return new File(
    [compressedBlob],
    (originalName || "photo") + ".jpg",
    {
      type: "image/jpeg",
      lastModified: Date.now()
    }
  );
}


if (photoUploadForm) {
  photoUploadForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const files = Array.from(photoFilesInput.files || []);

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


      const oversizedVideo = files.find((file) =>
        file.type.startsWith("video/") &&
        file.size > MAX_PHOTO_FILE_SIZE
      );

      if (oversizedVideo) {
        photoUploadStatus.textContent =
          oversizedVideo.name +
          " is larger than 30 MB. Please choose a smaller video.";
        return;
      }


      submitButton.disabled = true;
      submitButton.textContent = "Preparing…";
      photoUploadStatus.textContent = "";

      let sentCount = 0;
      let preparingFiles = true;


      try {

        /* PREPARE ALL FILES BEFORE UPLOADING */

        const preparedFiles = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          photoUploadStatus.textContent =
            "Preparing file " + (i + 1) +
            " of " + files.length + "…";

          if (
            file.type.startsWith("image/") &&
            file.size > MAX_PHOTO_FILE_SIZE
          ) {
            const compressedFile =
              await compressImageForUpload(file);

            preparedFiles.push(compressedFile);

          } else {
            preparedFiles.push(file);
          }
        }


        /* ALL FILES PREPARED SUCCESSFULLY */

        preparingFiles = false;
        submitButton.textContent = "Uploading…";


        /* UPLOAD FILES ONE BY ONE */

        for (let i = 0; i < preparedFiles.length; i++) {
          const file = preparedFiles[i];

          photoUploadStatus.textContent =
            "Uploading file " + (i + 1) +
            " of " + preparedFiles.length + "…";

          const base64 = await readFileAsBase64(file);

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
                fileName: file.name,
                mimeType: file.type
              })
            }
          );

          sentCount++;
        }


        photoUploadForm.reset();

        photoFileSummary.textContent =
          "No files selected.";

        photoUploadStatus.textContent =
          "Your photos have been uploaded. Thank you for sharing your memories!";

        submitButton.textContent = "Sent";

        setTimeout(() => {
          closePhotoUpload();

          submitButton.disabled = false;

          submitButton.textContent = "Upload files";

          photoUploadStatus.textContent = "";
        }, 3000);


      } catch (error) {

        console.error("Photo upload failed:", error);

        if (preparingFiles) {
          photoUploadStatus.textContent =
            error.message ||
            "We couldn't prepare your files. Please try again.";

        } else if (sentCount > 0) {
          photoUploadStatus.textContent =
            "The connection stopped after " + sentCount +
            " file(s). Some may already be in the folder. Please check before trying again.";

        } else {
          photoUploadStatus.textContent =
            "Something went wrong. Please try again.";
        }

        submitButton.disabled = false;
        submitButton.textContent = "Try again";
      }
    }
  );
}

/* ========================================
   INTRO ENVELOPE SCREEN
======================================== */

const introScreen = document.getElementById("introScreen");

if (introScreen) {
  introScreen.addEventListener("click", () => {
    if (introScreen.classList.contains("is-opening")) return;

    introScreen.classList.add("is-opening");
    introScreen.setAttribute("aria-hidden", "true");
    document.body.classList.remove("intro-locked");
  });
}
