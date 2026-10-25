const projects = [
    {
        number: "01",
        title: "Responsive Restaurant Landing Page",
        category: "Web Design",
        description: "A restaurant landing page that showcases its menu and dining experience through an attractive, responsive layout.",
        technologies: ["HTML5", "CSS3", "Flexbox", "Grid"],
        filters: ["css", "responsive"],
        symbol: "✳",
        accent: "#ffab86",
        path: "./practical_1_TSD2/Practical_1.html"
    },
    {
        number: "02",
        title: "E-commerce Product Catalog",
        category: "E-commerce UI",
        description: "A structured product catalog that presents products using modern layouts and responsive design principles.",
        technologies: ["HTML5", "CSS Grid", "Flexbox", "Positioning"],
        filters: ["css", "responsive"],
        symbol: "◇",
        accent: "#75c8ff",
        path: "./practical_2_TSD2/index.html"
    },
    {
        number: "03",
        title: "Personal Portfolio Website",
        category: "Personal Branding",
        description: "A personal portfolio showcasing web development work and exploring CSS variables, pseudo-classes, and pseudo-elements.",
        technologies: ["HTML5", "CSS3", "JavaScript", "Flask"],
        filters: ["css", "javascript"],
        symbol: "</>",
        accent: "#c3a0ff",
        path: "./practical_3_TSD2/index.html"
    },
    {
        number: "04",
        title: "Animated Login & Registration",
        category: "Interactive UI",
        description: "An authentication interface exploring smooth transitions, CSS animations, and keyframes.",
        technologies: ["HTML5", "CSS3", "Animations", "Flask"],
        filters: ["css"],
        symbol: "⌘",
        accent: "#ff8fb5",
        path: "./practical_4_TSD2/index.html"
    },
    {
        number: "05",
        title: "Responsive News Portal",
        category: "News & Media",
        description: "A news portal homepage that organises content using responsive grids, flexible layouts, media queries, and layering.",
        technologies: ["HTML5", "CSS Grid", "Flexbox", "Media Queries"],
        filters: ["css", "responsive", "javascript"],
        symbol: "▤",
        accent: "#80e2c2",
        path: "./practical_5_TSD2/index.html"
    },
    {
        number: "06",
        title: "Student Profile Card with React",
        category: "React Development",
        description: "A student profile card built with React, JSX, functional components, and props to demonstrate reusable UI elements.",
        technologies: ["React", "JSX", "Components", "Props"],
        filters: ["react", "javascript"],
        symbol: "⚛",
        accent: "#76d9ff",
        path: "https://tsd-student-portal.vercel.app/"
    }
];

const projectGrid = document.getElementById("projectGrid");

function createProjectCard(project) {
    const card = document.createElement("article");

    card.className = "project-card";
    card.style.setProperty("--accent", project.accent);

    card.dataset.filters = project.filters.join(" ");

    const preview = document.createElement("div");
    preview.className = "project-preview";

    const previewGrid = document.createElement("div");
    previewGrid.className = "preview-grid";
    previewGrid.setAttribute("aria-hidden", "true");

    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = `EXP. ${project.number}`;

    const type = document.createElement("span");
    type.className = "project-type";
    type.textContent = project.category;

    const art = document.createElement("div");
    art.className = "preview-art";
    art.textContent = project.symbol;
    art.setAttribute("aria-hidden", "true");

    preview.append(previewGrid, number, type, art);

    const body = document.createElement("div");
    body.className = "project-body";

    const category = document.createElement("span");
    category.className = "project-category";
    category.textContent = `EXPERIMENT ${project.number}`;

    const title = document.createElement("h3");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;

    const tags = document.createElement("div");
    tags.className = "project-tags";

    project.technologies.forEach((technology) => {
        const tag = document.createElement("span");
        tag.className = "project-tag";
        tag.textContent = technology;
        tags.appendChild(tag);
    });

    const link = document.createElement("a");
    link.className = "project-link";
    link.href = project.path;
    link.innerHTML = "Open Experiment <span aria-hidden='true'>↗</span>";
    link.setAttribute("aria-label", `Open ${project.title}`);

    body.append(category, title, description, tags, link);
    card.append(preview, body);

    return card;
}

function renderProjects() {
    if (!projectGrid) return;

    const fragment = document.createDocumentFragment();

    projects.forEach((project) => {
        fragment.appendChild(createProjectCard(project));
    });

    projectGrid.replaceChildren(fragment);
}

function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-button");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((item) => {
                const isActive = item === button;

                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            document.querySelectorAll(".project-card").forEach((card) => {
                const cardFilters = card.dataset.filters.split(" ");

                const shouldShow =
                    selectedFilter === "all" ||
                    cardFilters.includes(selectedFilter);

                card.hidden = !shouldShow;
            });
        });
    });

    filterButtons.forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(button.classList.contains("active"))
        );
    });
}

function setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            menuToggle.textContent = "☰";
        });
    });
}

function setupScrollEffects() {
    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(".nav-link");

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navigationLinks.forEach((link) => {
                    const isCurrent =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    link.classList.toggle("active", isCurrent);
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    sections.forEach((section) => observer.observe(section));
}

function setupFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

renderProjects();
setupFilters();
setupMobileMenu();
setupScrollEffects();
setupFooterYear();