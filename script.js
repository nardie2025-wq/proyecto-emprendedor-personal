document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const currentSection = document.getElementById("currentSection");
  const toast = document.getElementById("toast");
  const video = document.getElementById("presentationVideo");
  const videoPlaceholder = document.getElementById("videoPlaceholder");
  const canvasVideo = document.getElementById("canvasVideo");
  const canvasVideoPlaceholder = document.getElementById("canvasVideoPlaceholder");

  const sectionNames = {
    inicio: "Inicio",
    presentacion: "Presentación personal",
    inteligencias: "Inteligencias múltiples",
    personales: "Habilidades personales",
    sociales: "Habilidades sociales",
    directivas: "Habilidades directivas",
    debilidad: "Mi debilidad · FODA-MACA",
    metas: "Metas y objetivos",
    acciones: "Acciones y evidencias",
    canvas: "Canvas personal"
  };

  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  menuToggle?.addEventListener("click", () => {
    const opened = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(opened));
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      const id = link.getAttribute("href").slice(1);
      if (currentSection) currentSection.textContent = sectionNames[id] || "Proyecto";
      sidebar.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const sections = [...document.querySelectorAll(".section-anchor")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
      if (currentSection) currentSection.textContent = sectionNames[id] || "Proyecto";
    }, { rootMargin: "-18% 0px -62% 0px", threshold: [0, .15, .35, .6] });
    sections.forEach(section => observer.observe(section));
  }

  // Detecta si el video de presentación existe y puede cargarse.
  if (video && videoPlaceholder) {
    video.addEventListener("loadedmetadata", () => {
      video.style.display = "block";
      videoPlaceholder.style.display = "none";
    });
    video.addEventListener("error", () => {
      video.style.display = "none";
      videoPlaceholder.style.display = "flex";
    });
    video.load();
  }

  // Detecta si el video del Canvas existe y puede cargarse.
  if (canvasVideo && canvasVideoPlaceholder) {
    canvasVideo.addEventListener("loadedmetadata", () => {
      canvasVideo.style.display = "block";
      canvasVideoPlaceholder.style.display = "none";
    });
    canvasVideo.addEventListener("error", () => {
      canvasVideo.style.display = "none";
      canvasVideoPlaceholder.style.display = "flex";
    });
    canvasVideo.load();
  }

  // Las casillas son un recordatorio visual; no se guardan al cerrar la página.
  document.querySelectorAll(".action-row input[type='checkbox']").forEach(input => {
    input.addEventListener("change", () => {
      const row = input.closest(".action-row");
      const tag = row?.querySelector(".evidence-tag");
      row?.classList.toggle("completed", input.checked);
      if (tag) tag.textContent = input.checked ? "Marcada como realizada" : "Evidencia pendiente";
      showToast(input.checked
        ? "Acción marcada. Recuerda agregar la evidencia real."
        : "Acción desmarcada.");
    });
  });

  // Aviso si alguien intenta abrir un video aún no agregado.
  document.querySelectorAll(".video-placeholder").forEach(placeholder => {
    placeholder.addEventListener("click", () => {
      if (placeholder.id === "videoPlaceholder") {
        showToast("Agrega tu video como assets/presentacion.mp4 para mostrarlo aquí.");
      } else {
        showToast("Agrega tu video como assets/canvas.mp4 para mostrarlo aquí.");
      }
    });
  });
});
