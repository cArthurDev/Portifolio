const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeLogo = document.querySelector("[data-theme-logo]");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const contactButton = document.querySelector('.button-ghost[href="#contact"]');
const specialtyDialog = document.querySelector("[data-specialty-dialog]");
const specialtyCards = [...document.querySelectorAll("[data-specialty]")];
const dialogClose = document.querySelector("[data-dialog-close]");
const specialtyDetails = {
  python: {
    label: "Python",
    title: "Python para criar inteligência.",
    description: "Uso Python para transformar dados e perguntas complexas em experimentos, modelos e soluções que funcionam no mundo real.",
    icon: "https://cdn.simpleicons.org/python/FFD43B",
    topics: ["Inteligência Artificial", "Dados", "Automação", "Visão Computacional"]
  },
  java: {
    label: "Java",
    title: "Java para sistemas confiáveis.",
    description: "Construo aplicações orientadas a objetos com foco em organização, regras de negócio e back-end consistente.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    topics: ["POO", "Back-end", "APIs", "Sistemas"]
  },
  javascript: {
    label: "JavaScript",
    title: "JavaScript para experiências vivas.",
    description: "Uso JavaScript para criar interfaces interativas, comportamentos de página e experiências web responsivas.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    topics: ["Web", "Interações", "DOM", "Responsividade"]
  },
  sql: {
    label: "SQL",
    title: "SQL para entender os dados.",
    description: "Estruturo consultas e relações para transformar informação armazenada em base para decisões e produtos.",
    icon: "https://cdn.simpleicons.org/mysql/4EFF9B",
    topics: ["Consultas", "Modelagem", "Relatórios", "Dados"]
  },
  git: {
    label: "Git",
    title: "Git para evoluir com segurança.",
    description: "Uso controle de versão para organizar experimentos, colaborar em projetos e manter cada mudança rastreável.",
    icon: "https://cdn.simpleicons.org/git/F05032",
    topics: ["Branches", "Commits", "GitHub", "Colaboração"]
  },
  api: {
    label: "APIs REST",
    title: "APIs para conectar sistemas.",
    description: "Desenho integrações claras entre front-end, back-end e serviços externos com endpoints previsíveis.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    topics: ["FastAPI", "Integrações", "JSON", "Endpoints"]
  },
  postgres: {
    label: "PostgreSQL",
    title: "PostgreSQL para dados sólidos.",
    description: "Uso bancos relacionais para persistir informação com consistência, consultas eficientes e estrutura bem definida.",
    icon: "https://cdn.simpleicons.org/postgresql/69A2D8",
    topics: ["Banco de dados", "Relacionamentos", "SQL", "Persistência"]
  },
  web: {
    label: "HTML & CSS",
    title: "Web para dar forma às ideias.",
    description: "Construo interfaces semânticas, responsivas e cuidadosas nos detalhes visuais e na experiência de uso.",
    icon: "https://cdn.simpleicons.org/html5/FF63DE",
    topics: ["HTML5", "CSS3", "Acessibilidade", "UI"]
  }
};

function openSpecialty(key) {
  const detail = specialtyDetails[key];
  if (!detail) return;
  document.querySelector("[data-dialog-label]").textContent = detail.label;
  document.querySelector("[data-dialog-title]").textContent = detail.title;
  document.querySelector("[data-dialog-description]").textContent = detail.description;
  document.querySelector("[data-dialog-icon]").src = detail.icon;
  document.querySelector("[data-dialog-icon]").alt = `Logo do ${detail.label}`;
  document.querySelector("[data-dialog-topics]").innerHTML = detail.topics.map((topic) => `<span>${topic}</span>`).join("");
  specialtyDialog.showModal();
}

specialtyCards.forEach((card) => card.addEventListener("click", () => openSpecialty(card.dataset.specialty)));
dialogClose.addEventListener("click", () => specialtyDialog.close());
specialtyDialog.addEventListener("click", (event) => {
  if (event.target === specialtyDialog) specialtyDialog.close();
});

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☼" : "☾";
  themeLogo.src = theme === "dark" ? "images/logo-white.png" : "images/logo-dark.png";
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
