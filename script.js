// ===============================
// TAB SWITCHING + NOTIFICATION SYSTEM
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".subject-btn");
    const contents = document.querySelectorAll(".subject-content");

    // ===============================
    // TAB SWITCHING
    // ===============================
    buttons.forEach(button => {
        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));
            contents.forEach(content => content.classList.remove("active"));

            button.classList.add("active");

            const target = button.getAttribute("data-subject");
            const targetContent = document.getElementById(target);

            if (targetContent) {
                targetContent.classList.add("active");
            }

            // Mark as seen
            localStorage.setItem(target + "_last_seen", Date.now());

            // Remove badge
            const badge = button.querySelector(".notif-badge");
            if (badge) badge.remove();

        });
    });

    // ===============================
    // FORMAT POST TIME
    // ===============================
    const postTimes = document.querySelectorAll(".post-time");

    postTimes.forEach(time => {
        const storedDate = time.getAttribute("data-date");
        if (!storedDate) return;

        const date = new Date(storedDate);

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };

        time.innerText = "Posted on: " + date.toLocaleString("en-US", options);
    });

    // ===============================
    // SMART NEW BADGE SYSTEM
    // ===============================
    buttons.forEach(button => {

        const target = button.getAttribute("data-subject");
        const section = document.getElementById(target);
        if (!section) return;

        const posts = section.querySelectorAll(".post-time");
        if (posts.length === 0) return;

        let latestPost = 0;

        posts.forEach(post => {
            const dateValue = new Date(post.getAttribute("data-date")).getTime();
            if (dateValue > latestPost) {
                latestPost = dateValue;
            }
        });

        const lastSeen = localStorage.getItem(target + "_last_seen");

        if (!lastSeen || latestPost > lastSeen) {
            const badge = document.createElement("span");
            badge.classList.add("notif-badge");
            badge.innerText = "NEW";
            button.appendChild(badge);
        }

    });

    // ===============================
    // GALLERY SEE MORE TOGGLE
    // ===============================
    const seeMoreButtons = document.querySelectorAll(".see-more-btn");

    seeMoreButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const desc = btn.previousElementSibling;
            if (!desc) return;
            desc.classList.toggle("expanded");
            btn.innerText = desc.classList.contains("expanded") ? "See Less" : "See More";
        });
    });

    // ===============================
    // DOWNLOAD IMAGE FUNCTION
    // ===============================
    const downloadButtons = document.querySelectorAll(".download-btn");

    downloadButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const img = btn.previousElementSibling; // assumes button follows <img>
            if (!img || img.tagName !== "IMG") return;

            const link = document.createElement("a");
            link.href = img.src;
            link.download = img.alt || "church_image";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

});

// ===============================
// OFFLINE / ONLINE DETECTION
// ===============================
const offlineScreen = document.getElementById("offline-screen");

function updateOnlineStatus() {
    if (!offlineScreen) return;

    if (navigator.onLine) {
        offlineScreen.classList.add("hidden");
    } else {
        offlineScreen.classList.remove("hidden");
    }
}

// Initial check
window.addEventListener("load", updateOnlineStatus);

// Listen for changes
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

document.addEventListener("DOMContentLoaded", function () {
    const seeMoreBtns = document.querySelectorAll(".see-more-btn");

    seeMoreBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const desc = btn.previousElementSibling; // <p class="gallery-desc">
            
            if (desc.style.maxHeight && desc.style.maxHeight !== "0px") {
                // Collapse
                desc.style.maxHeight = null;
                btn.innerText = "See More";
            } else {
                // Expand to full height
                desc.style.maxHeight = desc.scrollHeight + "px";
                btn.innerText = "See Less";
            }
        });
    });
});