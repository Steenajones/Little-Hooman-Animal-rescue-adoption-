console.log("adopt.js loaded ✅");

// OPEN ADOPT POPUP
function handleAdopt(petName) {
    const user = JSON.parse(localStorage.getItem("user")); // ✅ fixed key

    if (!user) {
        // save which pet user wanted
        localStorage.setItem("pendingPet", petName);

        alert("Please login to proceed with the adoption of " + petName);

        // redirect to login/account page
        window.location.href = "account.html";
    } else {
        // open popup
        document.getElementById("adoptModal").style.display = "flex";

        // show pet name
        document.getElementById("petNameDisplay").innerText = petName;

        // ✅ auto-fill user data
        document.getElementById("adoptName").value = user.name || "";
        document.getElementById("adoptEmail").value = user.email || "";
    }
}

// SUBMIT ADOPTION FORM
function submitAdopt(){
    const name = document.getElementById("adoptName").value;
    const email = document.getElementById("adoptEmail").value;
    const msg = document.getElementById("adoptMsg").value;
    const pet = document.getElementById("petNameDisplay").innerText;

    if(!name || !email){
        alert("Please fill all required fields");
        return;
    }

    // 🔥 success message
    alert(`Adoption request for ${pet} submitted successfully! 🐾`);

    // clear form (optional)
    document.getElementById("adoptMsg").value = "";

    // close popup
    closeModal();
}

// CLOSE POPUP
function closeModal() {
    document.getElementById("adoptModal").style.display = "none";
}

// OPTIONAL: CONTINUE AFTER LOGIN
window.addEventListener("DOMContentLoaded", () => {
    const pendingPet = localStorage.getItem("pendingPet");

    if (pendingPet) {
        localStorage.removeItem("pendingPet");

        // wait a bit to ensure DOM is ready
        setTimeout(() => {
            handleAdopt(pendingPet);
        }, 300);
    }

    const modal = document.getElementById("adoptModal");
    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});