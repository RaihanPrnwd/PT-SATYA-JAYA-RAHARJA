/**
 * PT SATYA JAYA RAHARJA - Official Script
 * Modular client-side interactions:
 * - Dynamic copyright year
 * - Accessible mobile navigation drawer
 * - Interactive 25-page company profile lightbox viewer with prev/next & keyboard nav
 * - WhatsApp consultation project form builder
 * - Interactive rule-based Customer Support Chatbot
 * - Rotating live portfolio activity toast
 * - Splash entry modal transition
 */

(function () {
  "use strict";

  // Base configuration
  const WHATSAPP_NUMBER = "6281385999512";
  const ASSETS_PATH = "assets/";

  // Helper DOM selector
  function byId(id) {
    return document.getElementById(id);
  }

  // Safe WhatsApp URL redirect
  function openWhatsApp(text) {
    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  /* --------------------------------------------------------------------------
     1. Dynamic Copyright Year
     -------------------------------------------------------------------------- */
  function initYear() {
    const yearEl = byId("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* --------------------------------------------------------------------------
     2. Responsive Navigation, Dynamic Sticky Scroll & Mobile Drawer
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const header = byId("mainHeader") || document.querySelector("header");
    const menuButton = byId("menubtn");
    const mobileDrawer = byId("mobileDrawer");
    const navBackdrop = byId("navBackdrop");
    const drawerClose = byId("drawerClose");
    const drawerDropdownBtn = byId("drawerDropdownBtn");
    const drawerDropdown = byId("drawerDropdown");
    const desktopDropdownTrigger = byId("dropdownTrigger");
    const servicesDropdown = byId("navServicesDropdown");

    // 1. Dynamic Glassmorphic Scroll Effect
    if (header) {
      function handleScroll() {
        if (window.scrollY > 24) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Trigger initial check
    }

    // 2. Mobile Drawer Controls
    function toggleMobileDrawer(forceOpen) {
      if (!mobileDrawer) return;
      const isOpen = typeof forceOpen === "boolean" ? forceOpen : !mobileDrawer.classList.contains("show");
      
      mobileDrawer.classList.toggle("show", isOpen);
      mobileDrawer.setAttribute("aria-hidden", String(!isOpen));
      
      if (navBackdrop) {
        navBackdrop.classList.toggle("show", isOpen);
      }
      
      if (menuButton) {
        menuButton.classList.toggle("is-active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
      }

      // Lock body scroll while mobile drawer is open
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    if (menuButton) {
      menuButton.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleMobileDrawer();
      });
    }

    if (drawerClose) {
      drawerClose.addEventListener("click", function () {
        toggleMobileDrawer(false);
      });
    }

    if (navBackdrop) {
      navBackdrop.addEventListener("click", function () {
        toggleMobileDrawer(false);
      });
    }

    // Close mobile drawer when clicking navigation links
    if (mobileDrawer) {
      mobileDrawer.querySelectorAll(".drawer-link, .drawer-sublink, .drawer-cta").forEach(function (link) {
        link.addEventListener("click", function () {
          toggleMobileDrawer(false);
        });
      });
    }

    // 3. Mobile Accordion for Layanan Sub-Services
    if (drawerDropdownBtn && drawerDropdown) {
      drawerDropdownBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const isOpen = drawerDropdown.classList.toggle("open");
        drawerDropdownBtn.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // 4. Desktop Dropdown Touch/Click & Keyboard Toggle
    if (desktopDropdownTrigger && servicesDropdown) {
      desktopDropdownTrigger.addEventListener("click", function (e) {
        e.stopPropagation();
        const isExpanded = servicesDropdown.classList.toggle("is-open");
        desktopDropdownTrigger.setAttribute("aria-expanded", String(isExpanded));
      });

      document.addEventListener("click", function (e) {
        if (!servicesDropdown.contains(e.target)) {
          servicesDropdown.classList.remove("is-open");
          desktopDropdownTrigger.setAttribute("aria-expanded", "false");
        }
      });
    }

    // 5. Global Escape Key handler for Drawer & Dropdown
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (mobileDrawer && mobileDrawer.classList.contains("show")) {
          toggleMobileDrawer(false);
        }
        if (servicesDropdown && servicesDropdown.classList.contains("is-open")) {
          servicesDropdown.classList.remove("is-open");
          if (desktopDropdownTrigger) desktopDropdownTrigger.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Company Profile Document Lightbox Gallery
     -------------------------------------------------------------------------- */
  function initDocuments() {
    const grid = byId("docgrid");
    const modal = byId("imagemodal");
    const modalImage = byId("modalimg");
    const modalCaption = byId("modalcaption");
    const modalClose = byId("modalclose");
    const modalPrev = byId("modalprev");
    const modalNext = byId("modalnext");

    if (!grid || !modal || !modalImage) return;

    const docTitles = [
      "Sampul & identitas",
      "Tentang kami",
      "Visi, misi & budaya",
      "Keunggulan perusahaan",
      "Data perusahaan",
      "Kualifikasi usaha",
      "Struktur organisasi",
      "Fasilitas & peralatan",
      "Pengalaman pekerjaan",
      "Data pengalaman kerja",
      "Akta pendirian",
      "Pengesahan Kemenkum",
      "Lampiran pengesahan",
      "Daftar kegiatan usaha",
      "Daftar kegiatan usaha",
      "Daftar kegiatan usaha",
      "Nomor Induk Berusaha",
      "Sertifikat Badan Usaha — Hunian",
      "Lampiran SBU — Hunian",
      "Sertifikat Badan Usaha — Perkantoran",
      "Lampiran SBU — Perkantoran",
      "NPWP",
      "Kartu tanda anggota",
      "Dokumen perusahaan",
      "Lampiran company profile"
    ];

    const TOTAL_PAGES = 25;
    let currentDocIndex = 0;

    function renderModalPage(index) {
      currentDocIndex = (index + TOTAL_PAGES) % TOTAL_PAGES;
      const pageNum = currentDocIndex + 1;
      const paddedNum = String(pageNum).padStart(2, "0");
      modalImage.src = ASSETS_PATH + "company-profile/page-" + paddedNum + ".png";
      modalImage.alt = "Halaman " + pageNum + " — " + (docTitles[currentDocIndex] || "Company profile");

      if (modalCaption) {
        modalCaption.textContent = (docTitles[currentDocIndex] || "Company profile") + " · Halaman " + pageNum + " dari " + TOTAL_PAGES;
      }
    }

    function openModal(index) {
      renderModalPage(index);
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    // Build document cards
    for (let i = 1; i <= TOTAL_PAGES; i += 1) {
      const pageIndex = i - 1;
      const button = document.createElement("button");
      button.className = "doc";
      button.type = "button";
      button.setAttribute("aria-label", "Lihat " + (docTitles[pageIndex] || "Halaman " + i));

      const image = document.createElement("img");
      image.loading = "lazy";
      image.src = ASSETS_PATH + "company-profile/page-" + String(i).padStart(2, "0") + ".png";
      image.alt = "Halaman " + i + " company profile";

      const title = document.createElement("span");
      title.textContent = docTitles[pageIndex] || "Halaman " + i;

      const caption = document.createElement("small");
      caption.textContent = "Halaman " + i + " · klik untuk perbesar";

      button.append(image, title, caption);
      button.addEventListener("click", function () {
        openModal(pageIndex);
      });
      grid.append(button);
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalPrev) {
      modalPrev.addEventListener("click", function (e) {
        e.stopPropagation();
        renderModalPage(currentDocIndex - 1);
      });
    }
    if (modalNext) {
      modalNext.addEventListener("click", function (e) {
        e.stopPropagation();
        renderModalPage(currentDocIndex + 1);
      });
    }

    // Backdrop click to close
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    // Keyboard navigation (Arrow keys & Escape)
    document.addEventListener("keydown", function (event) {
      if (!modal.classList.contains("open")) return;
      if (event.key === "Escape") {
        closeModal();
      } else if (event.key === "ArrowLeft") {
        renderModalPage(currentDocIndex - 1);
      } else if (event.key === "ArrowRight") {
        renderModalPage(currentDocIndex + 1);
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Smart Fast Consultation Multi-Step Form Engine
     -------------------------------------------------------------------------- */
  function initSmartConsultationForm() {
    const form = byId("smartConsultationForm");
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 3;

    // Service category options configuration for dynamic contextual fields
    const dynamicConfigs = {
      "Konstruksi Gedung Hunian": {
        title: "Spesifikasi Proyek Gedung Hunian",
        fields: `
          <div class="field">
            <label for="dynBuildingType">Jenis Hunian</label>
            <select id="dynBuildingType">
              <option value="Rumah Tinggal Pribadi">Rumah Tinggal Pribadi</option>
              <option value="Rumah Kos / Kontrakan">Rumah Kos / Kontrakan</option>
              <option value="Villa / Paviliun">Villa / Paviliun</option>
              <option value="Townhouse / Cluster">Townhouse / Cluster</option>
            </select>
          </div>
          <div class="field">
            <label for="dynFloors">Jumlah Lantai Rencana</label>
            <select id="dynFloors">
              <option value="1 Lantai">1 Lantai</option>
              <option value="2 Lantai" selected>2 Lantai</option>
              <option value="3 Lantai">3 Lantai</option>
              <option value="4+ Lantai">4+ Lantai</option>
            </select>
          </div>
          <div class="field">
            <label for="dynArea">Estimasi Luas Bangunan (m²)</label>
            <input id="dynArea" placeholder="Contoh: 150 m²">
          </div>
          <div class="field">
            <label for="dynLandStatus">Kondisi Lahan</label>
            <select id="dynLandStatus">
              <option value="Lahan Kosong Siap Bangun">Lahan Kosong Siap Bangun</option>
              <option value="Ada Bangunan Lama (Perlu Dibongkar)">Ada Bangunan Lama (Perlu Dibongkar)</option>
              <option value="Perlu Urug / Pematangan Lahan">Perlu Urug / Pematangan Lahan</option>
            </select>
          </div>
        `
      },
      "Konstruksi Gedung Perkantoran": {
        title: "Spesifikasi Gedung Komersial / Kantor",
        fields: `
          <div class="field">
            <label for="dynBuildingType">Fungsi Bangunan</label>
            <select id="dynBuildingType">
              <option value="Gedung Perkantoran">Gedung Perkantoran</option>
              <option value="Ruko / Shophouse">Ruko / Shophouse</option>
              <option value="Fasilitas Dapur Sehat / Resto">Fasilitas Dapur Sehat / Resto</option>
              <option value="Gudang / Warehouse">Gudang / Warehouse</option>
            </select>
          </div>
          <div class="field">
            <label for="dynFloors">Jumlah Lantai</label>
            <select id="dynFloors">
              <option value="1 - 2 Lantai">1 - 2 Lantai</option>
              <option value="3 - 4 Lantai" selected>3 - 4 Lantai</option>
              <option value="5+ Lantai">5+ Lantai</option>
            </select>
          </div>
          <div class="field full">
            <label for="dynArea">Estimasi Luas Total Bangunan (m²)</label>
            <input id="dynArea" placeholder="Contoh: 500 m²">
          </div>
        `
      },
      "Konstruksi Gedung Pendidikan": {
        title: "Spesifikasi Fasilitas Pendidikan / Umum",
        fields: `
          <div class="field">
            <label for="dynBuildingType">Tipe Fasilitas</label>
            <select id="dynBuildingType">
              <option value="Gedung Sekolah / Ruang Kelas">Gedung Sekolah / Ruang Kelas</option>
              <option value="Gedung Asrama / Yayasan">Gedung Asrama / Yayasan</option>
              <option value="Pos Jaga / Fasilitas Keamanan">Pos Jaga / Fasilitas Keamanan</option>
              <option value="Gedung Serbaguna">Gedung Serbaguna</option>
            </select>
          </div>
          <div class="field">
            <label for="dynArea">Estimasi Luas / Kapasitas</label>
            <input id="dynArea" placeholder="Contoh: 6 Ruang Kelas / 300 m²">
          </div>
        `
      },
      "Renovasi & Rehabilitasi": {
        title: "Spesifikasi Pekerjaan Renovasi",
        fields: `
          <div class="field">
            <label for="dynRenovScope">Lingkup Renovasi Utama</label>
            <select id="dynRenovScope">
              <option value="Renovasi Total (Full House)">Renovasi Total (Full House)</option>
              <option value="Peningkatan / Cor Dak Tambah Lantai">Peningkatan / Cor Dak Tambah Lantai</option>
              <option value="Perbaikan Atap, Plafon & Kebocoran">Perbaikan Atap, Plafon & Kebocoran</option>
              <option value="Renovasi Fasad Depan Modern">Renovasi Fasad Depan Modern</option>
              <option value="Renovasi Sebagian Ruangan">Renovasi Sebagian Ruangan</option>
            </select>
          </div>
          <div class="field">
            <label for="dynPropertyState">Kondisi Bangunan Saat Ini</label>
            <select id="dynPropertyState">
              <option value="Sedang Dihuni">Sedang Dihuni</option>
              <option value="Bangunan Kosong">Bangunan Kosong</option>
            </select>
          </div>
          <div class="field full">
            <label for="dynArea">Estimasi Luas Area Renovasi</label>
            <input id="dynArea" placeholder="Contoh: Sekitar 80 m² / Lantai 2">
          </div>
        `
      },
      "Dekorasi Interior & Eksterior": {
        title: "Spesifikasi Interior / Eksterior",
        fields: `
          <div class="field">
            <label for="dynDesignScope">Lingkup Pekerjaan</label>
            <select id="dynDesignScope">
              <option value="Interior Rumah Tinggal Lengkap">Interior Rumah Tinggal Lengkap</option>
              <option value="Interior Kantor / Ruang Kerja">Interior Kantor / Ruang Kerja</option>
              <option value="Kitchen Set & Ruang Makan">Kitchen Set & Ruang Makan</option>
              <option value="Fasad Eksterior & Lanskap">Fasad Eksterior & Lanskap</option>
            </select>
          </div>
          <div class="field">
            <label for="dynDesignStyle">Konsep Desain Disukai</label>
            <select id="dynDesignStyle">
              <option value="Modern Minimalis">Modern Minimalis</option>
              <option value="Industrial Kontemporer">Industrial Kontemporer</option>
              <option value="Klasik Mewah">Klasik Mewah</option>
              <option value="Belum Ada Konsep (Butuh Rekomendasi)">Belum Ada Konsep (Butuh Rekomendasi)</option>
            </select>
          </div>
        `
      },
      "Pekerjaan Khusus (Aluminium, Pagar, Aspal)": {
        title: "Spesifikasi Pekerjaan Penunjang",
        fields: `
          <div class="field">
            <label for="dynSpecialType">Jenis Pekerjaan</label>
            <select id="dynSpecialType">
              <option value="Pekerjaan Kusen, Pintu & Jendela Aluminium">Pekerjaan Kusen, Pintu & Jendela Aluminium</option>
              <option value="Pagar Besi, Pintu Gerbang & Kanopi Las">Pagar Besi, Pintu Gerbang & Kanopi Las</option>
              <option value="Pengaspalan Jalan Hotmix / Paving Block">Pengaspalan Jalan Hotmix / Paving Block</option>
            </select>
          </div>
          <div class="field">
            <label for="dynArea">Perkiraan Volume / Panjang / Luasan</label>
            <input id="dynArea" placeholder="Contoh: 12 unit kusen / Pagar 15 meter">
          </div>
        `
      }
    };

    // Render dynamic fields based on selected service radio
    function renderDynamicFields(serviceName) {
      const container = byId("dynamicFieldBox");
      if (!container) return;
      const config = dynamicConfigs[serviceName] || dynamicConfigs["Konstruksi Gedung Hunian"];
      container.innerHTML = `<span class="dynamic-field-title">🛠️ ${config.title}</span>` + config.fields;
    }

    // Get selected service name
    function getSelectedService() {
      const checked = form.querySelector('input[name="project_service"]:checked');
      return checked ? checked.value : "Konstruksi Gedung Hunian";
    }

    // Setup service pill selection clicks
    const pills = form.querySelectorAll(".service-pill");
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(p => p.classList.remove("selected"));
        pill.classList.add("selected");
        const radio = pill.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          renderDynamicFields(radio.value);
        }
      });
    });

    // Real-time Indonesian phone number validator
    const phoneInput = byId("sfPhone");
    const phoneStatus = byId("phoneStatus");
    function validatePhone(val) {
      const raw = String(val || "").replace(/[^0-9]/g, "");
      // Cleans leading 0 or 62
      let normalized = raw;
      if (normalized.startsWith("62")) normalized = normalized.slice(2);
      if (normalized.startsWith("0")) normalized = normalized.slice(1);
      const isValid = /^8\d{8,11}$/.test(normalized);
      if (phoneStatus) {
        if (!raw) {
          phoneStatus.textContent = "";
          phoneStatus.className = "phone-status";
        } else if (isValid) {
          phoneStatus.textContent = "✓";
          phoneStatus.className = "phone-status valid";
        } else {
          phoneStatus.textContent = "✕";
          phoneStatus.className = "phone-status invalid";
        }
      }
      return { isValid, cleanNumber: normalized ? "0" + normalized : "" };
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        validatePhone(phoneInput.value);
        const parent = phoneInput.closest(".field");
        if (parent) parent.classList.remove("has-error");
      });
    }

    // Step switching & visual indicator update
    function goToStep(step) {
      currentStep = step;
      // Panes
      form.querySelectorAll(".step-pane").forEach(function (pane) {
        pane.classList.remove("active");
        if (parseInt(pane.getAttribute("data-step"), 10) === step) {
          pane.classList.add("active");
        }
      });

      // Progress bar items
      document.querySelectorAll(".step-progress .step-item").forEach(function (item) {
        const itemStep = parseInt(item.getAttribute("data-step"), 10);
        item.classList.remove("active", "completed");
        if (itemStep === step) {
          item.classList.add("active");
        } else if (itemStep < step) {
          item.classList.add("completed");
        }
      });

      // If going to Step 3, update the Live Summary Box
      if (step === 3) {
        updateSummaryBox();
      }
    }

    // Collect dynamic specifications for summary and text
    function getSpecsText() {
      const service = getSelectedService();
      const parts = [];
      const buildingType = byId("dynBuildingType");
      const floors = byId("dynFloors");
      const area = byId("dynArea");
      const land = byId("dynLandStatus");
      const scope = byId("dynRenovScope");
      const designScope = byId("dynDesignScope");
      const style = byId("dynDesignStyle");
      const specType = byId("dynSpecialType");

      if (buildingType && buildingType.value) parts.push(buildingType.value);
      if (floors && floors.value) parts.push(floors.value);
      if (area && area.value.trim()) parts.push("Luas: " + area.value.trim());
      if (land && land.value) parts.push(land.value);
      if (scope && scope.value) parts.push(scope.value);
      if (designScope && designScope.value) parts.push(designScope.value);
      if (style && style.value) parts.push(style.value);
      if (specType && specType.value) parts.push(specType.value);

      return parts.length ? parts.join(" · ") : "Spesifikasi standar";
    }

    // Update Live Calculation & Smart Summary Box
    function updateSummaryBox() {
      const sumService = byId("sumService");
      const sumSpecs = byId("sumSpecs");
      const sumLocation = byId("sumLocation");
      const sumBudget = byId("sumBudget");

      const locationVal = (byId("sfLocation") ? byId("sfLocation").value.trim() : "") || "(Belum diisi)";
      const budgetVal = (byId("sfBudget") ? byId("sfBudget").value : "") || "Perlu Diskusi RAB";

      if (sumService) sumService.textContent = getSelectedService();
      if (sumSpecs) sumSpecs.textContent = getSpecsText();
      if (sumLocation) sumLocation.textContent = locationVal;
      if (sumBudget) sumBudget.textContent = budgetVal;
    }

    // Validation for step progression
    function validateStep(step) {
      let valid = true;
      if (step === 2) {
        const loc = byId("sfLocation");
        const parent = loc ? loc.closest(".field") : null;
        if (!loc || !loc.value.trim()) {
          if (parent) parent.classList.add("has-error");
          valid = false;
        } else {
          if (parent) parent.classList.remove("has-error");
        }
      } else if (step === 3) {
        const name = byId("sfName");
        const nameParent = name ? name.closest(".field") : null;
        if (!name || !name.value.trim()) {
          if (nameParent) nameParent.classList.add("has-error");
          valid = false;
        } else {
          if (nameParent) nameParent.classList.remove("has-error");
        }

        const phone = byId("sfPhone");
        const phoneParent = phone ? phone.closest(".field") : null;
        const phoneCheck = validatePhone(phone ? phone.value : "");
        if (!phoneCheck.isValid) {
          if (phoneParent) phoneParent.classList.add("has-error");
          valid = false;
        } else {
          if (phoneParent) phoneParent.classList.remove("has-error");
        }
      }
      return valid;
    }

    // Attach step navigation buttons
    form.querySelectorAll(".btn-step-next").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const nextStep = parseInt(btn.getAttribute("data-next"), 10);
        // Validasi step sebelum lanjut
        if (validateStep(currentStep)) {
          goToStep(nextStep);
        }
      });
    });

    form.querySelectorAll(".btn-step-prev").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const prevStep = parseInt(btn.getAttribute("data-prev"), 10);
        goToStep(prevStep);
      });
    });

    // Lead storage handler (Local Backup + AJAX/Backend hook)
    async function saveLeadData(leadPayload) {
      try {
        const recent = JSON.parse(localStorage.getItem("sjr_leads_history") || "[]");
        recent.unshift({ ...leadPayload, submittedAt: new Date().toISOString() });
        localStorage.setItem("sjr_leads_history", JSON.stringify(recent.slice(0, 10)));
      } catch (e) {
        // storage fallback
      }

      // Backend API / Webhook integration endpoint (e.g. Google Apps Script / CRM / Mailgun)
      const BACKEND_ENDPOINT = ""; 
      if (BACKEND_ENDPOINT) {
        try {
          await fetch(BACKEND_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leadPayload)
          });
        } catch (err) {
          console.warn("Backend API lead logging skipped:", err);
        }
      }
    }

    // Final Form Submission
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!validateStep(3)) return;

      const nameVal = byId("sfName").value.trim();
      const phoneCheck = validatePhone(byId("sfPhone").value);
      const serviceVal = getSelectedService();
      const specsVal = getSpecsText();
      const locationVal = byId("sfLocation").value.trim();
      const budgetVal = byId("sfBudget").value;
      const timelineVal = byId("sfTimeline") ? byId("sfTimeline").value : "-";
      const notesVal = byId("sfNotes") && byId("sfNotes").value.trim() ? byId("sfNotes").value.trim() : "-";

      const leadPayload = {
        name: nameVal,
        phone: phoneCheck.cleanNumber,
        service: serviceVal,
        specs: specsVal,
        location: locationVal,
        budget: budgetVal,
        timeline: timelineVal,
        notes: notesVal
      };

      // Simpan lead di background
      await saveLeadData(leadPayload);

      // Susun pesan WhatsApp profesional & terstruktur
      const whatsappMessage = [
        "*KONSULTASI PROYEK KONSTRUKSI — PT SATYA JAYA RAHARJA*",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "👤 *Data Klien:*",
        "• Nama: " + nameVal,
        "• WhatsApp: " + phoneCheck.cleanNumber,
        "",
        "🏗️ *Rincian Kebutuhan Proyek:*",
        "• Kategori Layanan: " + serviceVal,
        "• Spesifikasi: " + specsVal,
        "• Lokasi Proyek: " + locationVal,
        "• Perkiraan Budget: " + budgetVal,
        "• Target Mulai: " + timelineVal,
        "",
        "📝 *Keterangan Khusus / Catatan:*",
        '"' + notesVal + '"',
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "_Dikirim otomatis via Form Konsultasi Pintar ptsatyajayaraharja.id_"
      ].join("\n");

      // Buka WhatsApp resmi PT SJR
      openWhatsApp(whatsappMessage);
    });

    // Inisialisasi awal field dinamis untuk opsi terpilih
    renderDynamicFields(getSelectedService());
  }

  /* --------------------------------------------------------------------------
     5. Smart AI Chat Assistant Engine (Intent Recognition & State Persistence)
     -------------------------------------------------------------------------- */
  const CHAT_STORAGE_KEY = "sjr_ai_chat_history";
  let csSoundContext = null;

  function playCsReplySound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      csSoundContext = csSoundContext || new AudioCtx();
      if (csSoundContext.state === "suspended") csSoundContext.resume();
      const ctx = csSoundContext;
      const now = ctx.currentTime;
      [680, 880].forEach(function (freq, index) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const at = now + index * 0.08;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.06, at + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(at);
        osc.stop(at + 0.18);
      });
    } catch (e) {}
  }

  function scrollChatToBottom() {
    const log = byId("chatlog");
    if (!log) return;
    requestAnimationFrame(function () {
      log.scrollTop = log.scrollHeight;
    });
  }

  // Load chat history from localStorage
  function loadChatHistory() {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Save chat history to localStorage
  function saveChatHistory(messages) {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch (e) {}
  }

  function initChat() {
    const launch = byId("chatlaunch");
    const box = byId("chatbox");
    const form = byId("chatform");
    const closeBtn = byId("chatclose");
    const resetBtn = byId("chatReset");
    const attachBtn = byId("chatAttach");
    const log = byId("chatlog");
    const quickChipsEl = byId("quickChips");
    const inputEl = byId("chatmessage");

    if (!launch || !box || !log) return;

    let chatHistory = loadChatHistory() || [];

    // Default chips list (Humanized & Action-Oriented)
    const defaultChips = [
      { label: "📝 Isi Form Konsultasi", query: "Buka formulir konsultasi cepat" },
      { label: "📅 Jadwal Survei Lokasi", query: "Bagaimana cara jadwalkan survei lokasi lapangan?" },
      { label: "💰 Estimasi Biaya & RAB", query: "Berapa estimasi biaya bangun rumah?" },
      { label: "🔨 Renovasi & Tambah Lantai", query: "Saya mau renovasi rumah dan tambah lantai" },
      { label: "🏢 Gedung & Ruko Komersial", query: "Berapa biaya konstruksi gedung perkantoran?" },
      { label: "📍 Alamat Kantor & Legalitas", query: "Di mana alamat kantor dan bukti legalitas PT SJR?" },
      { label: "💬 WhatsApp Tim Ahli", query: "Hubungkan saya dengan tim ahli di WhatsApp" }
    ];

    // Toggle chatbox visibility
    function toggleChat(forceOpen) {
      const isOpen = typeof forceOpen === "boolean" ? forceOpen : !box.classList.contains("open");
      box.classList.toggle("open", isOpen);
      launch.classList.toggle("is-open", isOpen);
      launch.setAttribute("aria-expanded", String(isOpen));
      box.setAttribute("aria-hidden", String(!isOpen));

      if (isOpen) {
        scrollChatToBottom();
        if (inputEl) inputEl.focus();
      }
    }

    launch.addEventListener("click", function () {
      toggleChat();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        toggleChat(false);
      });
    }

    // Reset conversation
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("Hapus riwayat obrolan dan mulai percakapan baru dengan Asisten Proyek?")) {
          localStorage.removeItem(CHAT_STORAGE_KEY);
          chatHistory = [];
          renderAllMessages();
          renderChips(defaultChips);
        }
      });
    }

    // Attachment helper: direct to WhatsApp photo sharing
    if (attachBtn) {
      attachBtn.addEventListener("click", function () {
        const attachReply = "Untuk mengirimkan lampiran foto denah arsitektur, foto kondisi bangunan saat ini, atau dokumen PDF, silakan kirimkan langsung ke WhatsApp Business tim teknis kami.";
        renderBotMessage({
          text: attachReply,
          action: {
            label: "Kirim Foto Denah via WhatsApp ↗",
            url: "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Halo Tim SJR, saya ingin mengirimkan foto denah/lokasi proyek untuk konsultasi.")
          }
        });
        chatHistory.push({ role: "bot", text: attachReply, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) });
        saveChatHistory(chatHistory);
      });
    }

    // Render Quick Action Chips
    function renderChips(chips) {
      if (!quickChipsEl) return;
      quickChipsEl.replaceChildren();
      chips.forEach(function (c) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip-btn";
        btn.textContent = c.label;
        btn.addEventListener("click", function () {
          handleUserSend(c.query);
        });
        quickChipsEl.appendChild(btn);
      });
    }

    // Render Bot Message Bubble
    function renderBotMessage(msgData) {
      const row = document.createElement("div");
      row.className = "chat-message-row bot-row";

      const avatar = document.createElement("div");
      avatar.className = "msg-avatar";
      avatar.textContent = "👷‍♂️";
      avatar.setAttribute("aria-label", "Tim Proyek");

      const bubble = document.createElement("div");
      bubble.className = "bubble bot";
      bubble.innerHTML = msgData.html || msgData.text.replace(/\n/g, "<br>");

      // If bot message includes In-Chat Consultation Form
      if (msgData.showForm) {
        const formCard = createInChatForm();
        bubble.appendChild(formCard);
      }

      // If there's an action button inside the bot message
      if (msgData.action) {
        const actBtn = document.createElement("a");
        actBtn.className = "bubble-action-btn wa-btn";
        actBtn.href = msgData.action.url;
        actBtn.target = "_blank";
        actBtn.rel = "noopener noreferrer";
        actBtn.textContent = msgData.action.label;
        bubble.appendChild(document.createElement("br"));
        bubble.appendChild(actBtn);
      }

      row.append(avatar, bubble);
      log.appendChild(row);
      scrollChatToBottom();
      return row;
    }

    // Render In-Chat Interactive Consultation Form
    function createInChatForm() {
      const card = document.createElement("div");
      card.className = "in-chat-form-card";

      card.innerHTML = `
        <div class="form-card-head">
          <strong>📋 Form Konsultasi & Survei Cepat</strong>
          <span>Respon Cepat</span>
        </div>
        <form class="in-chat-form-inner" autocomplete="off">
          <div class="chat-form-group" data-field="name">
            <label for="icfName">Nama Lengkap / Instansi *</label>
            <input type="text" id="icfName" class="chat-form-input" placeholder="Contoh: Bpk. Afrizal / Ibu Mega" required>
            <span class="chat-form-err-msg">Mohon tuliskan nama Anda</span>
          </div>

          <div class="chat-form-group" data-field="service">
            <label for="icfService">Jenis Pekerjaan Proyek *</label>
            <select id="icfService" class="chat-form-select">
              <option value="Bangun Rumah Tinggal / Hunian">Bangun Rumah Tinggal / Hunian</option>
              <option value="Gedung Komersial & Perkantoran">Gedung Komersial & Perkantoran</option>
              <option value="Renovasi & Tambah Lantai">Renovasi & Tambah Lantai</option>
              <option value="Desain Interior & Eksterior">Desain Interior & Eksterior</option>
              <option value="Fasilitas Dapur Sehat / Gudang">Fasilitas Dapur Sehat / Gudang</option>
            </select>
          </div>

          <div class="chat-form-group" data-field="specs">
            <label for="icfSpecs">Perkiraan Luas / Lokasi / Budget</label>
            <input type="text" id="icfSpecs" class="chat-form-input" placeholder="Contoh: Luas ~150m² · Pondok Gede, Bekasi">
          </div>

          <div class="chat-form-group" data-field="phone">
            <label for="icfPhone">Nomor WhatsApp Aktif *</label>
            <input type="tel" id="icfPhone" class="chat-form-input" placeholder="08xxxxxxxxxx" required>
            <span class="chat-form-err-msg">Nomor WhatsApp tidak valid (contoh: 08123456789)</span>
          </div>

          <button type="submit" class="chat-form-submit-btn">
            <span>Kirim Konsultasi ke WhatsApp Tim ↗</span>
          </button>
        </form>
      `;

      const innerForm = card.querySelector(".in-chat-form-inner");
      const nameInput = card.querySelector("#icfName");
      const serviceSelect = card.querySelector("#icfService");
      const specsInput = card.querySelector("#icfSpecs");
      const phoneInput = card.querySelector("#icfPhone");

      innerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Simple validation
        let isValid = true;
        const nameVal = nameInput.value.trim();
        const serviceVal = serviceSelect.value;
        const specsVal = specsInput.value.trim() || "Spesifikasi didiskusikan";
        const rawPhone = phoneInput.value.replace(/[^0-9]/g, "");

        // Validate Name
        const nameGroup = nameInput.closest(".chat-form-group");
        if (!nameVal) {
          nameGroup.classList.add("has-error");
          isValid = false;
        } else {
          nameGroup.classList.remove("has-error");
        }

        // Validate Phone (Indonesian format 08... or 628...)
        let cleanPhone = rawPhone;
        if (cleanPhone.startsWith("62")) cleanPhone = cleanPhone.slice(2);
        if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.slice(1);
        const isPhoneValid = /^8\d{8,11}$/.test(cleanPhone);
        const phoneGroup = phoneInput.closest(".chat-form-group");

        if (!isPhoneValid) {
          phoneGroup.classList.add("has-error");
          isValid = false;
        } else {
          phoneGroup.classList.remove("has-error");
        }

        if (!isValid) return;

        // Lock form on success
        card.classList.add("is-submitted");
        innerForm.querySelectorAll("input, select, button").forEach(el => el.disabled = true);

        const formattedPhone = "0" + cleanPhone;

        // 1. Post user confirmation message
        const userMsg = `Saya mengajukan konsultasi untuk ${serviceVal}.\nNama: ${nameVal} · No. WA: ${formattedPhone}`;
        renderUserMessage(userMsg);
        chatHistory.push({ role: "user", text: userMsg, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) });
        saveChatHistory(chatHistory);

        // 2. Prepare structured WhatsApp link
        const waText = `Halo Tim Ahli PT Satya Jaya Raharja, saya telah mengisi formulir konsultasi cepat:\n\n• Nama: ${nameVal}\n• Layanan: ${serviceVal}\n• Keterangan / Luas: ${specsVal}\n• No. WhatsApp: ${formattedPhone}\n\nMohon informasi estimasi biaya awal dan jadwal survei lokasi. Terima kasih.`;
        const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waText);

        // 3. Show typing indicator then bot confirmation
        showTypingIndicator();
        setTimeout(function () {
          removeTypingIndicator();
          playCsReplySound();

          const botReplyHtml = `Terima kasih Bpk/Ibu <strong>${nameVal}</strong>! Data permohonan konsultasi Anda telah berhasil kami catat.<br><br>
          <div class="chat-summary-box">
            <div class="chat-summary-title">📋 Ringkasan Permintaan Konsultasi</div>
            <div class="chat-summary-list">
              <div class="chat-summary-row"><span>Klien:</span> <span>${nameVal}</span></div>
              <div class="chat-summary-row"><span>Layanan:</span> <span>${serviceVal}</span></div>
              <div class="chat-summary-row"><span>Detail / Luas:</span> <span>${specsVal}</span></div>
              <div class="chat-summary-row"><span>WhatsApp:</span> <span>${formattedPhone}</span></div>
            </div>
          </div>
          Tim estimator & project engineer kami siap melanjutkan diskusi dan menjadwalkan kunjungan survei lapangan. Silakan klik tombol di bawah untuk langsung terhubung:`;

          renderBotMessage({
            html: botReplyHtml,
            action: {
              label: "Kirim Ringkasan ke WhatsApp Tim Ahli (0813 8599 9512) ↗",
              url: waUrl
            }
          });

          chatHistory.push({
            role: "bot",
            html: botReplyHtml,
            action: {
              label: "Kirim Ringkasan ke WhatsApp Tim Ahli (0813 8599 9512) ↗",
              url: waUrl
            },
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          });
          saveChatHistory(chatHistory);

          // Update chips
          renderChips([
            { label: "📍 Cek Lokasi Kantor PT SJR", query: "Di mana alamat kantor PT SJR?" },
            { label: "📁 Lihat Portofolio Selesai", query: "Apa saja portofolio proyek PT Satya Jaya Raharja?" },
            { label: "💬 Hubungi WhatsApp Resmi", query: "Hubungkan saya dengan tim ahli di WhatsApp" }
          ]);

          // Open WhatsApp directly in new window
          window.open(waUrl, "_blank");
        }, 600);
      });

      return card;
    }

    // Render User Message Bubble
    function renderUserMessage(text, timeStr) {
      const row = document.createElement("div");
      row.className = "chat-message-row user-row";

      const col = document.createElement("div");
      col.className = "user-status-col";

      const bubble = document.createElement("div");
      bubble.className = "bubble user";
      bubble.textContent = text;

      const meta = document.createElement("div");
      meta.className = "user-msg-meta";
      meta.innerHTML = `<span>${timeStr || new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span> <span class="user-msg-ticks">✓✓</span>`;

      col.append(bubble, meta);
      row.appendChild(col);
      log.appendChild(row);
      scrollChatToBottom();
      return row;
    }

    // Render Typing Indicator
    function showTypingIndicator() {
      const row = document.createElement("div");
      row.className = "typing-row";
      row.id = "chatTyping";

      const avatar = document.createElement("div");
      avatar.className = "msg-avatar";
      avatar.textContent = "👷‍♂️";

      const bubble = document.createElement("div");
      bubble.className = "typing-bubble";
      bubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;

      row.append(avatar, bubble);
      log.appendChild(row);
      scrollChatToBottom();
      return row;
    }

    function removeTypingIndicator() {
      const el = byId("chatTyping");
      if (el) el.remove();
    }

    // Restore all messages from history
    function renderAllMessages() {
      log.replaceChildren();
      if (!chatHistory.length) {
        // Welcome Greeting
        const welcomeText = `Halo! Selamat datang di Layanan Live Support <strong>PT Satya Jaya Raharja</strong>. 👷‍♂️<br><br>Saya <strong>Asisten Proyek</strong>, siap membantu Anda menghitung estimasi biaya konstruksi, konsultasi renovasi, desain interior, hingga penjadwalan survei lokasi gratis bersama tim engineering kami. Ada proyek yang sedang Anda rencanakan?`;
        renderBotMessage({ html: welcomeText });
        return;
      }

      chatHistory.forEach(function (m) {
        if (m.role === "user") {
          renderUserMessage(m.text, m.time);
        } else {
          renderBotMessage(m);
        }
      });
      scrollChatToBottom();
    }

    // =========================================================================
    // INTENT RECOGNITION & SMART KNOWLEDGE BASE
    // =========================================================================
    function analyzeIntent(query) {
      const q = query.toLowerCase().trim();

      // 0. Form Konsultasi & Jadwal Survei (In-Chat Smart Form Trigger)
      if (/form|formulir|daftar|pesan|order|survei|survey|jadwal survei|tinjau lokasi|survei langsung|buka form/.test(q)) {
        return {
          text: `Tentu, tim kami siap membantu Anda! 👷‍♂️\n\nSilakan isi <strong>Formulir Konsultasi & Survei Cepat</strong> di bawah ini agar tim engineering kami dapat langsung meninjau spesifikasi dan lokasi proyek Anda:`,
          showForm: true,
          chips: [
            { label: "💰 Estimasi Biaya & RAB", query: "Berapa estimasi biaya bangun rumah?" },
            { label: "🔨 Konsultasi Renovasi", query: "Saya butuh renovasi rumah" },
            { label: "📍 Alamat Kantor SJR", query: "Di mana alamat kantor PT SJR?" }
          ]
        };
      }

      // 1. Harga / Biaya / Estimasi / RAB / Tarif
      if (/harga|biaya|berapa|tarif|estimasi|budget|rab|ongkos|permeter|per m2|meter/.test(q)) {
        return {
          text: `Estimasi biaya konstruksi standar bersama PT Satya Jaya Raharja:\n\n• 🏠 <strong>Bangun Rumah Hunian:</strong> Mulai Rp 3.500.000 – Rp 5.500.000 / m² (tergantung spesifikasi material & jumlah lantai).\n• 🔨 <strong>Renovasi & Tambah Lantai:</strong> Mulai Rp 2.500.000 – Rp 4.200.000 / m².\n• 🏢 <strong>Gedung & Ruko Komersial:</strong> Mulai Rp 4.000.000 – Rp 6.500.000 / m².\n• 🛋️ <strong>Interior & Finishing:</strong> Mulai Rp 1.800.000 – Rp 3.500.000 / m².\n\nBiaya riil dihitung transparan melalui penyusunan Rencana Anggaran Biaya (RAB) resmi setelah peninjauan lokasi.`,
          action: {
            label: "Konsultasi RAB Rinci di WhatsApp ↗",
            url: "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Halo Tim SJR, saya ingin minta simulasi hitungan RAB untuk estimasi proyek saya.")
          },
          chips: [
            { label: "📝 Isi Form Survei Langsung", query: "Buka formulir konsultasi cepat" },
            { label: "🔨 Konsultasi Renovasi", query: "Saya butuh renovasi rumah" },
            { label: "💬 Hubungi WhatsApp Tim", query: "Hubungkan ke WhatsApp resmi" }
          ]
        };
      }

      // 2. Renovasi / Perbaikan / Tambah Lantai / Bocor / Atap
      if (/renov|rehab|tambah lantai|cor dak|bocor|atap|fasad|perbaikan/.test(q)) {
        return {
          text: `PT Satya Jaya Raharja berpengalaman menangani berbagai proyek renovasi perumahan dan komersial:\n\n• Penambahan lantai 2/3 dengan perkuatan struktur beton & baja.\n• Perbaikan total atap bocor, dak beton, dan waterproofing.\n• Pembaruan fasad modern dan tata ruang arsitektur.\n\nSetiap renovasi mencakup garansi retensi masa pemeliharaan resmi!`,
          action: {
            label: "Jadwalkan Peninjauan Lapangan ↗",
            url: "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Halo tim SJR, saya ingin konsultasi renovasi rumah/bangunan.")
          },
          chips: [
            { label: "💰 Estimasi Biaya Renovasi", query: "Berapa perkiraan biaya renovasi?" },
            { label: "📅 Survei Lokasi Gratis", query: "Jadwalkan survei lokasi" },
            { label: "🏠 Bangun Baru Hunian", query: "Berapa biaya bangun rumah baru?" }
          ]
        };
      }

      // 3. Bangun Baru / Rumah / Gedung / Kantor / Ruko / Gudang
      if (/bangun|rumah baru|gedung|kantor|ruko|gudang|dapur sehat|kos/.test(q)) {
        return {
          text: `Kami melayani pekerjaan konstruksi menyeluruh (*Design & Build*) dari pondasi hingga finishing siap pakai:\n\n• Menggunakan material bersertifikat SNI (besi ulir, beton ready-mix, bata ringan).\n• Dilengkapi pengawasan teknis oleh Project Manager & Site Engineer berpengalaman.\n• Didukung Sertifikat Badan Usaha (SBU) resmi kualifikasi BG001, BG002, dan BG006.`,
          action: {
            label: "Diskusikan Proyek Bangun Baru ↗",
            url: "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Halo PT Satya Jaya Raharja, saya berencana membangun gedung/rumah baru.")
          },
          chips: [
            { label: "💰 Hitung Estimasi Biaya", query: "Estimasi biaya bangun gedung" },
            { label: "📁 Lihat Portofolio Proyek", query: "Apa saja portofolio proyek PT SJR?" },
            { label: "📅 Jadwal Survei", query: "Jadwal survei lokasi" }
          ]
        };
      }

      // 4. Desain Interior & Eksterior / Arsitek
      if (/interior|eksterior|desain|kitchen set|partisi|ruang tamu|kamar/.test(q)) {
        return {
          text: `Layanan dekorasi interior & eksterior kami mencakup:\n\n• Penataan ruang hunian, kantor, cafe, dan fasilitas publik.\n• Pembuatan custom furniture, kitchen set, partisi HPL/kaca, dan plafon drop-ceiling.\n• Penataan fasad eksterior modern (ACP, kisi-kisi aluminium, conwood).\n\nDilengkapi visualisasi 3D sebelum pengerjaan dimulai!`,
          action: {
            label: "Konsultasi Desain Interior ↗",
            url: "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Halo tim interior SJR, saya ingin konsultasi desain interior/eksterior.")
          },
          chips: [
            { label: "💰 Biaya Interior", query: "Berapa biaya interior per meter?" },
            { label: "💬 Hubungi Desainer WhatsApp", query: "Hubungkan ke WhatsApp desainer" }
          ]
        };
      }

      // 5. Survei Lokasi / Pengukuran Lapangan
      if (/survei|survey|cek lokasi|tinjau|jadwal|kunjungan|pengukuran/.test(q)) {
        return {
          text: `PT Satya Jaya Raharja menyediakan fasilitas <strong>Survei Lokasi & Pengukuran GRATIS</strong> untuk area Jabodetabek.\n\nTim teknis kami akan memeriksa kondisi fisik lahan, elevasi tanah, akses logistik material, dan mendiskusikan denah awal secara langsung di lokasi Anda.`,
          action: {
            label: "Atur Jadwal Survei di WhatsApp ↗",
            url: "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Halo tim SJR, saya ingin mengajukan jadwal survei lokasi untuk proyek saya.")
          },
          chips: [
            { label: "📍 Cek Lokasi Kantor", query: "Di mana alamat kantor PT SJR?" },
            { label: "💰 Tanya Estimasi Biaya", query: "Estimasi biaya konstruksi" }
          ]
        };
      }

      // 6. Alamat Kantor / Lokasi Perusahaan
      if (/lokasi|alamat|kantor|depok|cipayung|ratujaya|datang/.test(q)) {
        return {
          text: `Kantor Operasional PT Satya Jaya Raharja beralamat di:\n\n📍 <strong>Jl. H. Nurdin RT 005/RW 007, Kel. Ratujaya, Kec. Cipayung, Kota Depok, Jawa Barat</strong>.\n\nAnda dapat berkunjung langsung untuk diskusi denah proyek pada hari kerja (Senin – Sabtu, 08.00 – 17.00 WIB).`,
          action: {
            label: "Buka Petunjuk Arah di Google Maps ↗",
            url: "https://www.google.com/maps/search/?api=1&query=Jl.+H.+Nurdin+RT+005/RW+007,+Ratujaya,+Cipayung,+Depok"
          },
          chips: [
            { label: "📅 Janji Temu Kantor", query: "Saya ingin buat janji temu di kantor" },
            { label: "💬 Hubungi WhatsApp", query: "Hubungi WhatsApp resmi" }
          ]
        };
      }

      // 7. Legalitas / Izin / NIB / SBU / Profil PT
      if (/legal|izin|akta|notaris|sbu|nib|npwp|aman|terpercaya|pt/.test(q)) {
        return {
          text: `PT Satya Jaya Raharja adalah perseroan berbadan hukum resmi dengan kredensial lengkap:\n\n• <strong>NIB:</strong> 2602260121291 (Berlaku efektif)\n• <strong>Akta Pendirian:</strong> No. 10 Notaris Amanda Tasya, S.H., M.Kn.\n• <strong>SBU LPJK:</strong> Kualifikasi BG001 (Hunian), BG002 (Perkantoran), BG006 (Pendidikan)\n• <strong>NPWP:</strong> Terdaftar resmi.\n• Pembayaran bertahap sesuai termin progress fisik dengan kontrak kerja (SPK) sah bermaterai.`,
          action: {
            label: "Periksa Lampiran Dokumen Resmi ↗",
            url: "#dokumen"
          },
          chips: [
            { label: "📁 Lihat Portofolio", query: "Apa saja pengalaman kerja PT SJR?" },
            { label: "💬 Hubungi WhatsApp", query: "Hubungi WhatsApp resmi" }
          ]
        };
      }

      // 8. Portofolio Proyek
      if (/portofolio|proyek|pengalaman|klien|partner|contoh/.test(q)) {
        return {
          text: `Beberapa proyek yang telah kami selesaikan antara lain:\n\n• Pembangunan Rumah Kos 2 Lantai Bpk. Afrizal di Jatinangor (Rp 4,7 Miliar).\n• Konstruksi Rumah Tinggal 2 Lantai Kolonel Didi Subandi di Bekasi (Rp 1,2 Miliar).\n• Pembangunan Fasilitas Dapur Sehat PT Berlian Cipta Boga (Rp 1 Miliar).\n• Renovasi Fasilitas Skadron Udara 31 & Skadron 45 Halim Perdanakusuma.\n• Renovasi Gedung Sekolah SMP Angkasa & Yayasan Nurul Ikhlas.`,
          action: {
            label: "Lihat Dokumentasi Portofolio ↗",
            url: "#pengalaman"
          },
          chips: [
            { label: "💰 Tanya Estimasi Biaya", query: "Berapa biaya bangun rumah?" },
            { label: "📅 Jadwal Survei", query: "Jadwal survei lokasi" }
          ]
        };
      }

      // 9. Salam / Pembuka
      if (/halo|hai|hello|pagi|siang|sore|malam|assalam|bisa bantu/.test(q)) {
        const hour = new Date().getHours();
        const timeGreeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";
        return {
          text: `${timeGreeting}! Terima kasih telah menghubungi PT Satya Jaya Raharja. 👷‍♂️\n\nSaya siap membantu memberikan estimasi biaya, penjelasan teknis renovasi/bangun baru, atau menjadwalkan survei lokasi langsung. Apa yang sedang Anda rencanakan?`,
          chips: defaultChips
        };
      }

      // 10. Fallback: Pertanyaan Kompleks / Butuh Diskusi Langsung
      const whatsappQueryUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(`Halo Tim PT Satya Jaya Raharja, saya sedang berada di website dan ingin berkonsultasi mengenai: "${query}"`);
      return {
        text: `Pertanyaan Anda mengenai <em>"${query}"</em> sangat spesifik dan memerlukan rincian teknis langsung dari tim estimator kami.\n\nSilakan klik tombol di bawah untuk meneruskan pertanyaan Anda langsung ke WhatsApp Business resmi kami agar ditangani oleh engineer yang bertugas:`,
        action: {
          label: "Lanjutkan Diskusi di WhatsApp Resmi ↗",
          url: whatsappQueryUrl
        },
        chips: [
          { label: "💰 Estimasi Biaya & RAB", query: "Berapa estimasi biaya bangun rumah?" },
          { label: "📅 Jadwal Survei Gratis", query: "Bagaimana cara jadwalkan survei lokasi?" },
          { label: "📍 Lokasi Kantor SJR", query: "Di mana alamat kantor PT SJR?" }
        ]
      };
    }

    // Handle user submission
    function handleUserSend(textToSend) {
      const text = String(textToSend || (inputEl ? inputEl.value : "")).trim();
      if (!text) return;

      if (inputEl) inputEl.value = "";
      const nowTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

      // 1. Tampilkan pesan user
      renderUserMessage(text, nowTime);
      chatHistory.push({ role: "user", text: text, time: nowTime });
      saveChatHistory(chatHistory);

      // 2. Tampilkan animasi typing indicator
      const typingEl = showTypingIndicator();

      // 3. Respon bot dengan delay natural (450ms - 850ms)
      const intentResult = analyzeIntent(text);
      const simulatedDelay = Math.min(900, 450 + Math.min(text.length * 5, 400));

      setTimeout(function () {
        removeTypingIndicator();
        playCsReplySound();

        renderBotMessage(intentResult);
        chatHistory.push({
          role: "bot",
          text: intentResult.text,
          showForm: intentResult.showForm,
          action: intentResult.action,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        });
        saveChatHistory(chatHistory);

        // Update chips
        if (intentResult.chips) {
          renderChips(intentResult.chips);
        }
      }, simulatedDelay);
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        handleUserSend();
      });
    }

    // Keyboard Escape to close
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("open")) {
        toggleChat(false);
      }
    });

    // Inisialisasi awal pesan & chip
    renderAllMessages();
    renderChips(defaultChips);
  }

  /* --------------------------------------------------------------------------
     6. Rotating Activity Toast (Sequential Looping Social Proof)
     -------------------------------------------------------------------------- */
  const clientTestimonials = [
    {
      name: "Bpk. Afrizal",
      project: "Pembangunan Rumah Kos 2 Lantai · Jatinangor",
      review: "“Pembangunan selesai tepat waktu sesuai spesifikasi teknis. Struktur kokoh, finishing rapi, dan laporan progres mingguan selalu transparan.”",
      avatar: "BA",
      score: "5.0 · Sangat Puas"
    },
    {
      name: "Bpk. Kolonel Didi Subandi",
      project: "Konstruksi Rumah Tinggal 2 Lantai · Bekasi",
      review: "“Sangat puas dengan kedisiplinan dan profesionalisme tim di lapangan. Kualitas material dan mutu bangunan terjamin amanah.”",
      avatar: "DS",
      score: "5.0 · Sangat Puas"
    },
    {
      name: "PT Berlian Cipta Boga",
      project: "Fasilitas Komersial Dapur Sehat · Depok",
      review: "“Pengerjaan fasilitas komersial kami selesai lebih cepat dari target dengan standar kebersihan dan struktur yang sangat presisi.”",
      avatar: "BCB",
      photo: "partners/berlian-group.jpeg",
      score: "5.0 · Sangat Puas"
    },
    {
      name: "Mayor Nuragil",
      project: "Renovasi Total Rumah Tinggal · Halim",
      review: "“Renovasi berjalan lancar tanpa kendala. Estimasi anggaran (RAB) sangat akurat dan hasilnya melebihi ekspektasi keluarga kami.”",
      avatar: "MN",
      score: "5.0 · Sangat Puas"
    },
    {
      name: "Yayasan Nurul Ikhlas",
      project: "Renovasi Gedung Sekolah RA · Kota Depok",
      review: "“Pengerjaan ruang kelas sangat berkualitas dan aman bagi anak-anak. Terima kasih atas dedikasi dan integritas tim kontraktor PT SJR.”",
      avatar: "YNI",
      photo: "partners/yayasan-nurul-ikhlas.jpeg",
      score: "5.0 · Sangat Puas"
    }
  ];

  function initActivityToast() {
    const toast = byId("activityToast");
    const closeBtn = byId("toastClose");
    const avatarEl = byId("toastAvatar");
    const nameEl = byId("toastName");
    const projectEl = byId("toastProject");
    const reviewEl = byId("toastReview");
    const scoreEl = toast ? toast.querySelector(".toast-score") : null;
    const progressEl = byId("toastProgress");

    if (!toast || !clientTestimonials.length) return;

    let currentIndex = 0;
    let isDismissed = false;
    let isPaused = false;
    let timerId = null;

    const DISPLAY_DURATION = 5500; // 5.5 detik tampil
    const PAUSE_DURATION = 3500;   // 3.5 detik jeda saat menghilang
    const TRANSITION_TIME = 400;   // 0.4 detik animasi fade

    function renderItem(item) {
      if (nameEl) nameEl.textContent = item.name;
      if (projectEl) projectEl.textContent = item.project;
      if (reviewEl) reviewEl.textContent = item.review;
      if (scoreEl && item.score) scoreEl.textContent = item.score;

      if (avatarEl) {
        avatarEl.replaceChildren();
        if (item.photo) {
          const img = document.createElement("img");
          img.src = ASSETS_PATH + item.photo;
          img.alt = "Logo " + item.name;
          img.loading = "lazy";
          img.onerror = function () {
            avatarEl.textContent = item.avatar;
          };
          avatarEl.appendChild(img);
        } else {
          avatarEl.textContent = item.avatar;
        }
      }
    }

    function hideToast(onHiddenCallback) {
      toast.classList.remove("is-visible");
      toast.classList.add("is-leaving");

      setTimeout(function () {
        toast.classList.remove("is-leaving");
        toast.hidden = true;
        toast.setAttribute("hidden", "");
        if (progressEl) progressEl.style.transform = "scaleX(0)";
        if (typeof onHiddenCallback === "function") {
          onHiddenCallback();
        }
      }, TRANSITION_TIME);
    }

    function showNextToast() {
      if (isDismissed) return;

      // Jangan tampil jika user masih di layar splash screen entry
      if (document.body.classList.contains("sjr-entry-active")) {
        return;
      }

      // Jangan tampil jika chatbox sedang terbuka di layar HP
      const chatbox = byId("chatbox");
      if (chatbox && chatbox.classList.contains("open") && window.innerWidth < 768) {
        timerId = setTimeout(showNextToast, PAUSE_DURATION);
        return;
      }

      // 1. Ambil data secara BERURUTAN (sequential loop)
      const item = clientTestimonials[currentIndex];
      currentIndex = (currentIndex + 1) % clientTestimonials.length;

      // 2. Render data
      renderItem(item);

      // 3. Tampilkan dengan animasi masuk
      toast.hidden = false;
      toast.removeAttribute("hidden");
      toast.classList.remove("is-leaving");
      // Force reflow agar animasi progress bar terpicu ulang
      void toast.offsetWidth;
      toast.classList.add("is-visible");

      // 4. Jadwalkan sembunyi setelah DISPLAY_DURATION
      scheduleHide();
    }

    function scheduleHide() {
      clearTimeout(timerId);
      timerId = setTimeout(function () {
        if (isPaused) {
          // Jika mouse sedang hover, tunggu sampai mouse leave
          return;
        }
        hideToast(function () {
          // Setelah menghilang, tunggu PAUSE_DURATION lalu tampilkan data berikutnya
          if (!isDismissed) {
            timerId = setTimeout(showNextToast, PAUSE_DURATION);
          }
        });
      }, DISPLAY_DURATION);
    }

    // UX: Pause saat hover agar pengunjung sempat membaca
    toast.addEventListener("mouseenter", function () {
      isPaused = true;
    });

    toast.addEventListener("mouseleave", function () {
      if (isPaused) {
        isPaused = false;
        clearTimeout(timerId);
        timerId = setTimeout(function () {
          hideToast(function () {
            if (!isDismissed) {
              timerId = setTimeout(showNextToast, PAUSE_DURATION);
            }
          });
        }, 2000);
      }
    });

    // Tombol close manual
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        isDismissed = true;
        clearTimeout(timerId);
        hideToast();
      });
    }

    // Trigger otomatis saat user klik "JELAJAHI WEBSITE" pada entry overlay
    document.addEventListener("sjr:entered", function () {
      if (!isDismissed) {
        clearTimeout(timerId);
        timerId = setTimeout(showNextToast, 1200); // 1.2 detik setelah transisi masuk
      }
    });

    // Mulai rotasi jika tidak ada layar entry (atau class sudah dilepas)
    if (!document.body.classList.contains("sjr-entry-active")) {
      timerId = setTimeout(showNextToast, 1500);
    }
  }

  /* --------------------------------------------------------------------------
     7. SJR Entry Landing Modal
     -------------------------------------------------------------------------- */
  function initEntry() {
    const landing = byId("sjr-entry");
    const enterButton = byId("sjr-entry-enter");
    if (!landing || !enterButton) {
      document.body.classList.remove("sjr-entry-active");
      return;
    }

    enterButton.addEventListener("click", function () {
      landing.classList.add("is-leaving");
      document.body.classList.remove("sjr-entry-active");
      // Kirim event penanda user sudah masuk ke halaman utama
      document.dispatchEvent(new CustomEvent("sjr:entered"));
      setTimeout(function () {
        landing.remove();
      }, 650);
    });
  }

  /* --------------------------------------------------------------------------
     Initialize All Modules
     -------------------------------------------------------------------------- */
  initYear();
  initNavigation();
  initDocuments();
  initSmartConsultationForm();
  initChat();
  initActivityToast();
  initEntry();
})();
