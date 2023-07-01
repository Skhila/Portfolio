"use strict";

/************************* SLIDER ************************/
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const dotContainer = document.querySelector(".dots");

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

dotContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots__dot")) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

/************************* MENU FADE ANIMATION  ************************/
const nav = document.querySelector(".nav");
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav-list-item-link")) {
    const clicked = e.target;
    const siblings = clicked
      .closest(".nav")
      .querySelectorAll(".nav-list-item-link");
    siblings.forEach((el) => {
      if (el !== clicked) el.style.opacity = opacity;
    });
  }
};
nav.addEventListener("mouseover", (e) => handleHover(e, 0.5));

nav.addEventListener("mouseout", (e) => handleHover(e, 1));

/************************* STICKY NAVIGATION  ************************/
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

/*************************  REVEAL SECTIONS  ************************/
const allSections = document.querySelectorAll(".section");

const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

/************************* LIGHT / DARK MODES  ************************/
const toggleButton = document.querySelector(".toggleDark");
const html = document.querySelector("html");
const navigation = document.querySelector(".nav");
const aboutText = document.querySelector(".about-text");
const secondaryHeading = document.querySelector(".secondary-heading");
const skillsText = document.querySelector(".skills-text");
const skillsHeadingPrimary = document.querySelector(".skills-heading-primary");
const projectsContainer = document.querySelector(".projects-container");
const projectNames = document.querySelectorAll(".project-name");
const projectLinks = document.querySelectorAll(".link-button");
const adviceText = document.querySelector(".advice");

toggleButton.addEventListener("click", function () {
  this.classList.toggle("bi-moon");
  if (this.classList.toggle("bi-brightness-high-fill")) {
    html.style.backgroundColor = "#f0eaf9";
    navigation.style.backgroundColor = "#6930c3";
    aboutText.style.color = skillsText.style.color = "#000";
    secondaryHeading.style.color = skillsHeadingPrimary.style.color = "#0a0513";
    projectNames.forEach((projectName) => {
      projectName.style.color = "#5f2bb0";
    });

    projectsContainer.style.backgroundImage =
      "radial-gradient(#e1d6f3, #f0eaf9, #fff)";
    projectLinks.forEach((projectLink) => {
      projectLink.style.color = "#000";
    });

    adviceText.style.color = "#000";

    html.style.transition = "2s";
  } else {
    html.style.backgroundColor = "#000";
    navigation.style.backgroundColor = "#000";
    aboutText.style.color = skillsText.style.color = "#fff";
    secondaryHeading.style.color = skillsHeadingPrimary.style.color = "#e1dbf3";
    projectNames.forEach((projectName) => {
      projectName.style.color = "#e1d6f3";
    });
    projectsContainer.style.backgroundImage =
      "radial-gradient(#6930c3, #0a0513, #000)";
    projectLinks.forEach((projectLink) => {
      projectLink.style.color = "#e1dbf3";
    });

    adviceText.style.color = "#e1d6f3";

    html.style.transition = "2s";
  }
});

/************************* COPYRIGHT  ************************/
let year = document.querySelector(".year");
year.textContent = new Date().getFullYear();

/************************* CUSTOM CURSOR  ************************/
let innerCursor = document.querySelector(".inner-cursor");
let outerCursor = document.querySelector(".outer-cursor");

document.addEventListener("mousemove", moveCursor);

function moveCursor(e) {
  let x = e.clientX;
  let y = e.clientY;

  innerCursor.style.left = `${x}px`;
  innerCursor.style.top = `${y}px`;
  outerCursor.style.left = `${x}px`;
  outerCursor.style.top = `${y}px`;
}

let links = Array.from(document.querySelectorAll("a"));

links.forEach((link) => {
  link.addEventListener("mouseover", () => {
    innerCursor.classList.add("grow");
  });
  link.addEventListener("mouseleave", () => {
    innerCursor.classList.remove("grow");
  });
});

// RANDOM ADVICE GENERATOR

const advice = document.querySelector(".advice");
const btn = document.querySelector(".advice-button");

const advices = async () => {
  try {
    const url = await fetch("https://api.adviceslip.com/advice");
    const data = await url.json();
    advice.textContent = data.slip.advice;
    advice.classList.add("active");
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

btn.addEventListener("click", () => {
  advice.classList.remove("active");
  advices();
});

advices();
