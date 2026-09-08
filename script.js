/* Clínica Bio Medic — interações */
(function () {
  "use strict";

  /* ---------- Navbar: sombra ao rolar ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  var closeMenu = function () {
    toggle.classList.remove("open");
    mobile.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };
  toggle.addEventListener("click", function () {
    var open = mobile.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- Stagger: atrasa cada filho de .js-stagger ---------- */
  document.querySelectorAll(".js-stagger").forEach(function (group) {
    var kids = group.querySelectorAll(".reveal");
    kids.forEach(function (el, i) {
      el.style.setProperty("--rd", (i * 0.09).toFixed(2) + "s");
    });
  });

  /* ---------- Reveal ao entrar na viewport ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Formulário: envio para o WhatsApp ---------- */
  var form = document.getElementById("agendarForm");
  if (form) {
    var WHATS = "5534996588629"; // (34) 99658-8629 com DDI 55
    var okMsg = document.getElementById("agendarOk");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var fieldOf = function (id) {
      return document.getElementById(id).closest(".field");
    };
    var valOf = function (id) {
      return (document.getElementById(id).value || "").trim();
    };
    var setErr = function (field, msg) {
      if (!field) return;
      field.classList.add("field--error");
      var e = field.querySelector("[data-err]");
      if (e) e.textContent = msg;
      var inp = field.querySelector("input,select");
      if (inp) inp.setAttribute("aria-invalid", "true");
    };
    var clearErr = function (field) {
      if (!field) return;
      field.classList.remove("field--error");
      var e = field.querySelector("[data-err]");
      if (e) e.textContent = "";
      var inp = field.querySelector("input,select");
      if (inp) inp.removeAttribute("aria-invalid");
    };

    form.querySelectorAll("input,select").forEach(function (inp) {
      var handler = function () {
        clearErr(inp.closest(".field"));
        if (okMsg) okMsg.hidden = true;
      };
      inp.addEventListener("input", handler);
      inp.addEventListener("change", handler);
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var nome = valOf("f-nome");
      var email = valOf("f-email");
      var celular = valOf("f-celular");
      var telefone = valOf("f-telefone");
      var dia = valOf("f-dia");
      var periodo = valOf("f-periodo");

      var ok = true;
      if (!nome) { setErr(fieldOf("f-nome"), "Informe o seu nome."); ok = false; }
      if (!email) { setErr(fieldOf("f-email"), "Informe o seu e-mail."); ok = false; }
      else if (!emailRe.test(email)) { setErr(fieldOf("f-email"), "Digite um e-mail válido."); ok = false; }
      if (!celular) { setErr(fieldOf("f-celular"), "Informe o seu celular."); ok = false; }
      else if (celular.replace(/\D/g, "").length < 10) { setErr(fieldOf("f-celular"), "Digite um número com DDD."); ok = false; }
      if (!dia) { setErr(fieldOf("f-dia"), "Escolha um dia."); ok = false; }
      if (!periodo) { setErr(fieldOf("f-periodo"), "Escolha um período."); ok = false; }

      if (!ok) {
        var first = form.querySelector(".field--error");
        if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      var linhas = [
        "Olá, Clínica Bio Medic! Gostaria de agendar uma avaliação.",
        "",
        "Nome: " + nome,
        "E-mail: " + email,
        "Celular: " + celular,
        "Telefone: " + (telefone || "não informado"),
        "Disponibilidade: " + dia + ", " + periodo
      ];
      var url = "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(linhas.join("\n"));

      if (okMsg) okMsg.hidden = false;
      window.open(url, "_blank", "noopener");
    });
  }
})();
