const envelope = document.getElementById("envelope");
const openInvitation = document.getElementById("openInvitation");

openInvitation.addEventListener("click", function () {
  envelope.classList.add("open");
});