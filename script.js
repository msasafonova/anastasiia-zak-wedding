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
