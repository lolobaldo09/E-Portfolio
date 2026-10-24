"use strict";


/* =========================================
   1. FACEBOOK-STYLE NAVIGATION MENU
   ========================================= */

const menuToggle = document.getElementById("menuToggle");
const sectionMenu = document.getElementById("sectionMenu");
const menuBackdrop = document.getElementById("menuBackdrop");

const menuLinks = document.querySelectorAll(".menu-link");


function setMenuOpen(isOpen) {

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    sectionMenu.hidden = !isOpen;
    menuBackdrop.hidden = !isOpen;

    document.body.classList.toggle("menu-open", isOpen);

}


menuToggle.addEventListener("click", function () {

    const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

    setMenuOpen(!isOpen);

});


menuBackdrop.addEventListener("click", function () {

    setMenuOpen(false);

});


/* =========================================
   2. NAVIGATE TO PORTFOLIO SECTIONS
   ========================================= */

function updateActiveLink(targetId) {

    menuLinks.forEach(function (link) {

        const isActive =
            link.getAttribute("href") === targetId;

        link.classList.toggle("active", isActive);

        if (isActive) {

            link.setAttribute("aria-current", "location");

        } else {

            link.removeAttribute("aria-current");

        }

    });

}


menuLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = link.getAttribute("href");

        const targetSection =
            document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        event.preventDefault();

        setMenuOpen(false);

        if (window.location.hash !== targetId) {

            history.pushState(null, "", targetId);

        }

        targetSection.scrollIntoView({

            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",

            block: "start"

        });

        updateActiveLink(targetId);

    });

});


/* =========================================
   3. ESCAPE KEY CLOSES THE MENU
   ========================================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {

            setMenuOpen(false);

            menuToggle.focus();

        }

    }

});


/* =========================================
   4. BROWSER BACK/FORWARD NAVIGATION
   ========================================= */

window.addEventListener("popstate", function () {

    const targetId = window.location.hash;

    if (!targetId) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;

    }

    const targetSection =
        document.querySelector(targetId);

    if (targetSection) {

        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        updateActiveLink(targetId);

    }

});


/* =========================================
   5. HIGHLIGHT THE VISIBLE SECTION
   ========================================= */

const observedSections = document.querySelectorAll(
    ".portfolio-section"
);

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    updateActiveLink("#" + entry.target.id);

                }

            });

        },

        {
            rootMargin: "-15% 0px -70% 0px",
            threshold: 0
        }

    );

    observedSections.forEach(function (section) {

        sectionObserver.observe(section);

    });

}


/* =========================================
   6. PROFILE PHOTO UPLOAD AND PREVIEW
   ========================================= */

const profilePhotoInput =
    document.getElementById("profilePhotoInput");

const profilePreview =
    document.getElementById("profilePreview");

const photoPlaceholder =
    document.getElementById("photoPlaceholder");


if (profilePhotoInput) {

    profilePhotoInput.addEventListener("change", function () {

        const file = profilePhotoInput.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            profilePhotoInput.value = "";

            return;

        }

        const reader = new FileReader();

        reader.onload = function (event) {

            profilePreview.src = event.target.result;

            profilePreview.hidden = false;

            photoPlaceholder.hidden = true;

        };

        reader.readAsDataURL(file);

    });

}


/* =========================================
   7. CURRICULUM VITAE UPLOAD
   ========================================= */

const cvInput = document.getElementById("cvInput");
const cvStatus = document.getElementById("cvStatus");


if (cvInput) {

    cvInput.addEventListener("change", function () {

        const file = cvInput.files[0];

        if (!file) {
            return;
        }

        if (
            file.type !== "application/pdf" &&
            !file.name.toLowerCase().endsWith(".pdf")
        ) {

            alert("Please select a PDF file.");

            cvInput.value = "";

            return;

        }

        cvStatus.textContent = "Selected CV: " + file.name;

    });

}


/* =========================================
   8. CREATE A PHOTO GALLERY
   ========================================= */

function addImagesToGallery(files, gallery) {

    if (!gallery) {
        return;
    }

    Array.from(files).forEach(function (file) {

        if (!file.type.startsWith("image/")) {
            return;
        }

        const image = document.createElement("img");

        image.className = "gallery-image";

        image.alt = file.name;

        image.loading = "lazy";

        const imageUrl = URL.createObjectURL(file);

        image.src = imageUrl;

        image.addEventListener("error", function () {

            URL.revokeObjectURL(imageUrl);

            image.remove();

        });

        gallery.appendChild(image);

    });

}


/* =========================================
   9. SCHOOL PHOTO GALLERY
   ========================================= */

const schoolPhotosInput =
    document.getElementById("schoolPhotosInput");

const schoolPhotoGallery =
    document.getElementById("schoolPhotoGallery");


if (schoolPhotosInput) {

    schoolPhotosInput.addEventListener("change", function () {

        addImagesToGallery(
            schoolPhotosInput.files,
            schoolPhotoGallery
        );

        schoolPhotosInput.value = "";

    });

}


/* =========================================
   10. WEEKLY PHOTO DOCUMENTATION
   ========================================= */

document.querySelectorAll(".week-photo-input").forEach(

    function (input) {

        input.addEventListener("change", function () {

            const accordionContent =
                input.closest(".accordion-content");

            if (!accordionContent) {
                return;
            }

            const gallery =
                accordionContent.querySelector(".photo-gallery");

            addImagesToGallery(input.files, gallery);

            input.value = "";

        });

    }

);


/* =========================================
   11. PROFESSIONAL ACTIVITY PHOTOS
   ========================================= */

document.querySelectorAll(".activity-photo-input").forEach(

    function (input) {

        input.addEventListener("change", function () {

            const accordionContent =
                input.closest(".accordion-content");

            if (!accordionContent) {
                return;
            }

            const gallery =
                accordionContent.querySelector(".photo-gallery");

            addImagesToGallery(input.files, gallery);

            input.value = "";

        });

    }

);


/* =========================================
   12. PROFESSIONAL ACTIVITY DOCUMENTS
   ========================================= */

document.querySelectorAll(".activity-document-input").forEach(

    function (input) {

        input.addEventListener("change", function () {

            const accordionContent =
                input.closest(".accordion-content");

            if (!accordionContent) {
                return;
            }

            const status =
                accordionContent.querySelector(".file-status");

            if (!status) {
                return;
            }

            status.replaceChildren();

            Array.from(input.files).forEach(function (file) {

                const fileLink = document.createElement("a");

                fileLink.className = "file-link";

                fileLink.textContent = "Download: " + file.name;

                fileLink.href = URL.createObjectURL(file);

                fileLink.download = file.name;

                fileLink.target = "_blank";

                fileLink.rel = "noopener";

                status.appendChild(fileLink);

            });

            input.value = "";

        });

    }

);


/* =========================================
   13. APPENDIX DOCUMENT UPLOADS
   ========================================= */

document.querySelectorAll(".appendix-input").forEach(

    function (input) {

        input.addEventListener("change", function () {

            const card = input.closest(".card");

            if (!card) {
                return;
            }

            const fileList =
                card.querySelector(".file-list");

            if (!fileList) {
                return;
            }

            Array.from(input.files).forEach(function (file) {

                const fileLink = document.createElement("a");

                fileLink.href = URL.createObjectURL(file);

                fileLink.download = file.name;

                fileLink.target = "_blank";

                fileLink.rel = "noopener";

                fileLink.textContent =
                    "Download: " + file.name;

                fileList.appendChild(fileLink);

            });

            input.value = "";

        });

    }

);


/* =========================================
   14. ACCORDION BEHAVIOR
   ========================================= */

// Only one entry in each accordion list can be open at a time.

document.querySelectorAll(".accordion-list").forEach(

    function (list) {

        const items = list.querySelectorAll(
            ".accordion-item"
        );

        items.forEach(function (item) {

            item.addEventListener("toggle", function () {

                if (!item.open) {
                    return;
                }

                items.forEach(function (otherItem) {

                    if (otherItem !== item) {

                        otherItem.open = false;

                    }

                });

            });

        });

    }

);


/* =========================================
   15. BACK TO TOP
   ========================================= */

const backToTop =
    document.querySelector(".back-to-top");


if (backToTop) {

    backToTop.addEventListener("click", function (event) {

        event.preventDefault();

        window.scrollTo({

            top: 0,

            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"

        });

        history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
        );

        updateActiveLink("#introduction");

    });

}


/* =========================================
   16. INITIALIZE THE PAGE
   ========================================= */

setMenuOpen(false);


/* Navigate to a section if the page opens with a URL hash. */

window.addEventListener("load", function () {

    if (!window.location.hash) {
        return;
    }

    const targetSection =
        document.querySelector(window.location.hash);

    if (targetSection) {

        setTimeout(function () {

            targetSection.scrollIntoView({
                behavior: "auto",
                block: "start"
            });

            updateActiveLink(window.location.hash);

        }, 100);

    }

});