const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const contactButton = document.querySelector('.button-ghost[href="#contact"]');

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☼" : "☾";
}

setTheme(localStorage.getItem("portfolio-theme") || "dark");
document.querySelector("#year").textContent = new Date().getFullYear();

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });

  contactButton?.addEventListener("click", (event) => {
    event.preventDefault();
    contactButton.classList.add("is-navigating");
    window.setTimeout(() => {
      window.location.hash = "contact";
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      contactButton.classList.remove("is-navigating");
    }, 650);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
    if (activeLink) {
      navLinks.forEach((link) => link.classList.remove("active"));
      activeLink.classList.add("active");
    }
  });
}, { rootMargin: "-30% 0px -60% 0px" });

sections.forEach((section) => observer.observe(section));

const githubUser = "cArthurDev";
const contributionGrid = document.querySelector("[data-contribution-grid]");
const contributionTotal = document.querySelector("[data-contribution-total]");
const contributionYears = [...document.querySelectorAll("[data-contribution-year]")];
const monthLabels = document.querySelector("[data-month-labels]");

async function loadContributionGraph(year) {
  contributionGrid.innerHTML = '<span class="feed-loading">carregando contribuições...</span>';
  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUser}?y=${year}`);
    if (!response.ok) throw new Error("Contribution API request failed");
    const data = await response.json();
    const contributions = data.contributions || [];
    const total = data.total?.[year] ?? contributions.reduce((sum, day) => sum + day.count, 0);
    contributionTotal.textContent = total;
    const firstDay = contributions[0] ? new Date(`${contributions[0].date}T00:00:00Z`).getUTCDay() : 0;
    const leadingBlanks = (firstDay + 6) % 7;
    const cells = [...Array(leadingBlanks).fill(null), ...contributions];
    contributionGrid.innerHTML = cells.map((day) => day
      ? `<span class="contribution-cell level-${day.level}" title="${day.count} contribuições em ${day.date}"></span>`
      : '<span aria-hidden="true"></span>').join("");
    monthLabels.innerHTML = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"].map((month) => `<span>${month}</span>`).join("");
    contributionYears.forEach((button) => button.classList.toggle("active", button.dataset.contributionYear === String(year)));
  } catch (error) {
    console.error("Não foi possível carregar o gráfico de contribuições.", error);
    contributionTotal.textContent = "—";
    contributionGrid.innerHTML = '<span class="feed-loading">não foi possível carregar o gráfico agora.</span>';
  }
}

contributionYears.forEach((button) => {
  button.addEventListener("click", () => loadContributionGraph(button.dataset.contributionYear));
});

loadContributionGraph(2026);
