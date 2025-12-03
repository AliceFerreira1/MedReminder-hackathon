let medications = JSON.parse(localStorage.getItem("medications")) || [];
let history = JSON.parse(localStorage.getItem("medicationHistory")) || [];
let highContrast = false;
let largeFont = false;
let alarmCheckInterval = null;
let activeAlarm = null;
let audioPrimed = false;

const contrastToggle = document.getElementById("contrastToggle");
const fontToggle = document.getElementById("fontToggle");
const medicationForm = document.getElementById("medicationForm");
const medicationList = document.getElementById("medicationList");
const testAlarmBtn = document.getElementById("testAlarmBtn");
const clearMedsBtn = document.getElementById("clearMedsBtn");
const notificationArea = document.getElementById("notificationArea");
const historyContent = document.getElementById("historyContent");
const exportHistoryBtn = document.getElementById("exportHistoryBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const navBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

const alarmSound = new Audio("assets/sound.mp3");
alarmSound.loop = true;
alarmSound.preload = "auto";

function primeAudio() {
  if (audioPrimed) return;
  audioPrimed = true;
  alarmSound
    .play()
    .then(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    })
    .catch(() => {});
}

["click", "touchstart", "keydown"].forEach((evt) => {
  document.addEventListener(evt, primeAudio, { once: true, passive: true });
});

document.addEventListener("DOMContentLoaded", function () {
  loadMedications();
  loadHistory();
  updateMedicationCount();
  startAlarmCheck();

  navBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      navBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === sectionId) {
          section.classList.add("active");
        }
      });
    });
  });

  contrastToggle.addEventListener("click", function () {
    highContrast = !highContrast;
    if (highContrast) {
      document.body.classList.add("high-contrast");
      this.innerHTML = '<i class="fas fa-adjust"></i> Contraste Normal';
      showNotification("Alto contraste ativado", "info");
    } else {
      document.body.classList.remove("high-contrast");
      this.innerHTML = '<i class="fas fa-adjust"></i> Alto Contraste';
      showNotification("Alto contraste desativado", "info");
    }
  });

  fontToggle.addEventListener("click", function () {
    largeFont = !largeFont;
    if (largeFont) {
      document.body.classList.add("large-font");
      this.innerHTML = '<i class="fas fa-text-height"></i> Fonte Normal';
      showNotification("Fonte aumentada", "info");
    } else {
      document.body.classList.remove("large-font");
      this.innerHTML = '<i class="fas fa-text-height"></i> Aumentar Fonte';
      showNotification("Fonte normal", "info");
    }
  });

  medicationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const medName = document.getElementById("medName").value.trim();
    const medDosage = document.getElementById("medDosage").value.trim();
    const medTime = document.getElementById("medTime").value;

    if (medName && medDosage && medTime) {
      const medication = {
        id: Date.now(),
        name: medName,
        dosage: medDosage,
        time: medTime,
        taken: false,
        addedDate: new Date().toISOString(),
      };

      medications.push(medication);
      saveMedications();
      loadMedications();
      medicationForm.reset();

      addHistoryRecord({
        type: "medication_added",
        medicationId: medication.id,
        medicationName: medication.name,
        time: medication.time,
        dosage: medication.dosage,
        timestamp: new Date().toISOString(),
      });

      Swal.fire({
        icon: "success",
        title: "Medicamento Adicionado",
        text: `${medName} foi adicionado para às ${formatTime(medTime)}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Campos Incompletos",
        text: "Por favor, preencha todos os campos",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });

  testAlarmBtn.addEventListener("click", function () {
    primeAudio();
    Swal.fire({
      icon: "info",
      title: "Teste de Alarme",
      text: "Testando som do alarme...",
      timer: 1500,
      showConfirmButton: false,
    });

    alarmSound.play().catch((e) => {
      Swal.fire({
        icon: "warning",
        title: "Permissão de Áudio",
        text: "Toque em qualquer lugar da página para permitir sons",
        timer: 3000,
        showConfirmButton: false,
      });
    });

    setTimeout(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }, 2000);
  });

  clearMedsBtn.addEventListener("click", function () {
    if (medications.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sem Medicamentos",
        text: "Não há medicamentos para remover",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      title: "Limpar Todos os Medicamentos?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, limpar tudo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        addHistoryRecord({
          type: "all_medications_cleared",
          count: medications.length,
          timestamp: new Date().toISOString(),
        });

        medications = [];
        saveMedications();
        loadMedications();

        Swal.fire({
          icon: "success",
          title: "Medicamentos Removidos",
          text: "Todos os medicamentos foram removidos",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  });

  exportHistoryBtn.addEventListener("click", function () {
    if (history.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Histórico Vazio",
        text: "Não há dados para exportar",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const dataStr = JSON.stringify(history, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "historico-medicamentos.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    Swal.fire({
      icon: "success",
      title: "Histórico Exportado",
      text: "O histórico foi baixado com sucesso",
      timer: 2000,
      showConfirmButton: false,
    });
  });

  clearHistoryBtn.addEventListener("click", function () {
    if (history.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Histórico Vazio",
        text: "Não há histórico para limpar",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      title: "Limpar Todo o Histórico?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, limpar histórico",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        history = [];
        saveHistory();
        loadHistory();

        Swal.fire({
          icon: "success",
          title: "Histórico Limpo",
          text: "Todo o histórico foi removido",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  });
});

function loadMedications() {
  medicationList.innerHTML = "";

  if (medications.length === 0) {
    medicationList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-pills"></i>
                        <h3>Nenhum medicamento cadastrado</h3>
                        <p>Adicione seu primeiro lembrete usando o formulário ao lado.</p>
                    </div>
                `;
    updateMedicationCount();
    return;
  }

  medications.sort((a, b) => a.time.localeCompare(b.time));

  medications.forEach((med) => {
    const medElement = document.createElement("div");
    medElement.className = "medication-item";
    medElement.id = `med-${med.id}`;
    medElement.innerHTML = `
                    <div class="medication-info">
                        <h3>${med.name}</h3>
                        <p><strong>Dosagem:</strong> ${med.dosage}</p>
                        <p class="medication-time">
                            <i class="fas fa-clock"></i> ${formatTime(med.time)}
                            ${
                              med.taken
                                ? '<span style="color: var(--success); margin-left: 10px; display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-check-circle"></i> Tomado</span>'
                                : ""
                            }
                        </p>
                    </div>
                    <div class="medication-actions">
                        ${
                          med.taken
                            ? `<span class="status-taken">
                                <i class="fas fa-check-circle"></i> Tomado
                            </span>`
                            : `<button class="btn btn-primary take-med-btn" data-id="${med.id}">
                                <i class="fas fa-check-circle"></i> Tomar Agora
                            </button>`
                        }
                        <button class="btn btn-danger delete-med-btn" data-id="${
                          med.id
                        }">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
    medicationList.appendChild(medElement);
  });

  document.querySelectorAll(".take-med-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      markMedicationAsTaken(id);
    });
  });

  document.querySelectorAll(".delete-med-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      removeMedication(id);
    });
  });

  updateMedicationCount();
}

function updateMedicationCount() {
  const medCount = document.getElementById("medCount");
  const total = medications.length;
  const taken = medications.filter((m) => m.taken).length;
  medCount.textContent = `${taken}/${total}`;
}

function markMedicationAsTaken(id) {
  const medication = medications.find((med) => med.id === id);
  if (medication) {
    medication.taken = true;
    medication.takenTime = new Date().toISOString();
    saveMedications();
    loadMedications();

    addHistoryRecord({
      type: "medication_taken",
      medicationId: medication.id,
      medicationName: medication.name,
      time: medication.time,
      dosage: medication.dosage,
      timestamp: new Date().toISOString(),
    });

    Swal.fire({
      icon: "success",
      title: "Medicamento Registrado",
      text: `${medication.name} registrado como tomado`,
      timer: 2000,
      showConfirmButton: false,
    });

    if (activeAlarm && activeAlarm.id === id) {
      stopAlarm();
    }
  }
}

function removeMedication(id) {
  const medication = medications.find((med) => med.id === id);
  if (medication) {
    Swal.fire({
      title: "Remover Medicamento?",
      text: `Deseja remover "${medication.name}" da lista?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        addHistoryRecord({
          type: "medication_removed",
          medicationId: medication.id,
          medicationName: medication.name,
          timestamp: new Date().toISOString(),
        });

        medications = medications.filter((med) => med.id !== id);
        saveMedications();
        loadMedications();

        Swal.fire({
          icon: "success",
          title: "Medicamento Removido",
          text: `${medication.name} foi removido da lista`,
          timer: 2000,
          showConfirmButton: false,
        });

        if (activeAlarm && activeAlarm.id === id) {
          stopAlarm();
        }
      }
    });
  }
}

function saveMedications() {
  localStorage.setItem("medications", JSON.stringify(medications));
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("pt-BR") +
    " " +
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function showNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  let icon = "info-circle";
  let title = "Informação";

  if (type === "success") {
    icon = "check-circle";
    title = "Sucesso!";
  } else if (type === "error") {
    icon = "exclamation-circle";
    title = "Erro!";
  } else if (type === "warning") {
    icon = "exclamation-triangle";
    title = "Atenção!";
  }

  notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${title}</div>
                    <div>${message}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;

  notificationArea.appendChild(notification);

  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", function () {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-out forwards";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 4000);
}

function startAlarmCheck() {
  alarmCheckInterval = setInterval(checkAlarms, 10000);
  checkAlarms();
}

function checkAlarms() {
  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  if (activeAlarm) return;

  medications.forEach((med) => {
    if (med.time === currentTime && !med.taken) {
      triggerAlarm(med);
    }
  });
}

function triggerAlarm(medication) {
  activeAlarm = medication;

  addHistoryRecord({
    type: "alarm_triggered",
    medicationId: medication.id,
    medicationName: medication.name,
    time: medication.time,
    dosage: medication.dosage,
    timestamp: new Date().toISOString(),
  });

  primeAudio();

  alarmSound.play().catch((e) => {
    showNotification("Não foi possível tocar o som do alarme", "error");
  });

  showNotification(
    `Hora de tomar ${medication.name}! Dosagem: ${medication.dosage}`,
    "warning"
  );

  const medElement = document.getElementById(`med-${medication.id}`);
  if (medElement) {
    medElement.classList.add("alarm-active");
    medElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  Swal.fire({
    icon: "warning",
    title: "Hora do Medicamento!",
    html: `<strong>${medication.name}</strong><br>Dosagem: ${
      medication.dosage
    }<br>Horário: ${formatTime(medication.time)}`,
    showCancelButton: true,
    confirmButtonText: "Já Tomei",
    cancelButtonText: "Mais Tarde",
    confirmButtonColor: "#38a169",
    cancelButtonColor: "#718096",
  }).then((result) => {
    if (result.isConfirmed) {
      markMedicationAsTaken(medication.id);
    } else {
      stopAlarm();
      Swal.fire({
        icon: "info",
        title: "Lembrete Adiado",
        text: "O alarme será desativado",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });

  setTimeout(() => {
    if (activeAlarm && activeAlarm.id === medication.id) {
      stopAlarm();
      showNotification(
        `Alarme para ${medication.name} foi desativado após 5 minutos`,
        "info"
      );
    }
  }, 5 * 60 * 1000);
}

function stopAlarm() {
  try {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  } catch (e) {}

  if (activeAlarm) {
    const medElement = document.getElementById(`med-${activeAlarm.id}`);
    if (medElement) medElement.classList.remove("alarm-active");
  }
  activeAlarm = null;
}

function addHistoryRecord(record) {
  history.unshift(record);
  if (history.length > 100) {
    history = history.slice(0, 100);
  }
  saveHistory();
  loadHistory();
}

function saveHistory() {
  localStorage.setItem("medicationHistory", JSON.stringify(history));
}

function loadHistory() {
  historyContent.innerHTML = "";

  if (history.length === 0) {
    historyContent.innerHTML = `
                    <div class="empty-history">
                        <i class="fas fa-history"></i>
                        <h3>Nenhum histórico disponível</h3>
                        <p>As atividades serão registradas aqui automaticamente</p>
                    </div>
                `;
    return;
  }

  let historyHTML = `
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Ação</th>
                            <th>Detalhes</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

  history.forEach((record) => {
    let actionText = "";
    let details = "";
    let status = "";
    let statusClass = "";

    switch (record.type) {
      case "medication_added":
        actionText = "Medicamento Adicionado";
        details = `${record.medicationName} - ${record.dosage} às ${formatTime(
          record.time
        )}`;
        status = "Adicionado";
        statusClass = "status-tomado";
        break;
      case "medication_taken":
        actionText = "Medicamento Tomado";
        details = `${record.medicationName} - ${record.dosage}`;
        status = "Tomado";
        statusClass = "status-tomado";
        break;
      case "medication_removed":
        actionText = "Medicamento Removido";
        details = record.medicationName;
        status = "Removido";
        statusClass = "status-pendente";
        break;
      case "alarm_triggered":
        actionText = "Alarme Disparado";
        details = `${record.medicationName} - ${record.dosage} às ${formatTime(
          record.time
        )}`;
        status = "Alarme";
        statusClass = "status-alarme";
        break;
      case "all_medications_cleared":
        actionText = "Todos Removidos";
        details = `${record.count} medicamentos removidos`;
        status = "Limpeza";
        statusClass = "status-pendente";
        break;
    }

    historyHTML += `
                    <tr>
                        <td>${formatDateTime(record.timestamp)}</td>
                        <td>${actionText}</td>
                        <td>${details}</td>
                        <td><span class="status-badge ${statusClass}">${status}</span></td>
                    </tr>
                `;
  });

  historyHTML += `
                    </tbody>
                </table>
            `;

  historyContent.innerHTML = historyHTML;
}

if (medications.length === 0) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 2);
  const futureTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  medications = [
    {
      id: 1,
      name: "Pressão Arterial",
      dosage: "1 comprimido",
      time: futureTime,
      taken: false,
    },
    {
      id: 2,
      name: "Diabetes",
      dosage: "2 comprimidos",
      time: "13:00",
      taken: true,
    },
    {
      id: 3,
      name: "Vitaminas",
      dosage: "1 cápsula",
      time: "20:00",
      taken: false,
    },
  ];
  saveMedications();
  loadMedications();
}

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    checkAlarms();
  }
});
