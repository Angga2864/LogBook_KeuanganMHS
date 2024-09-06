document.addEventListener("DOMContentLoaded", function () {
  // Menampilkan waktu realtime
  function updateTime() {
    const currentTimeElement = document.getElementById("currentTime");
    const now = new Date();
    currentTimeElement.innerHTML = now.toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "medium",
    });
  }
  setInterval(updateTime, 1000);
  updateTime();

  const expenseForm = document.getElementById("expenseForm");
  const expenseTableBody = document.getElementById("expenseTableBody");
  const printReceiptButton = document.getElementById("printReceipt");

  // Ambil data pengeluaran dari Local Storage atau inisialisasi jika belum ada
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Memuat data dari Local Storage saat halaman dimuat
  loadExpenses();

  // Mengelola data pengeluaran
  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const expenseType = document.getElementById("expenseType").value;
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value); // Pastikan ini angka
    const expenseNote = document.getElementById("expenseNote").value;
    const timestamp = new Date().toLocaleString("id-ID");

    if (isNaN(expenseAmount)) {
      alert("Nominal uang yang dikeluarkan harus berupa angka.");
      return;
    }

    const expense = { timestamp, expenseType, expenseAmount, expenseNote };
    expenses.push(expense);

    // Simpan data ke Local Storage
    localStorage.setItem("expenses", JSON.stringify(expenses));

    addExpenseToTable(expense);
    expenseForm.reset();
  });

  // Fungsi untuk memuat data pengeluaran dari Local Storage dan memperbarui tabel
  function loadExpenses() {
    expenses.forEach((expense) => {
      addExpenseToTable(expense);
    });
  }

  // Fungsi untuk menambahkan pengeluaran ke tabel
  function addExpenseToTable(expense) {
    const row = document.createElement("tr");

    // Hitung total pengeluaran kumulatif hingga saat ini
    const cumulativeTotal = expenses.reduce((total, item) => total + item.expenseAmount, 0);

    row.innerHTML = `
        <td>${expense.timestamp}</td>
        <td>${expense.expenseType}</td>
        <td>Rp ${expense.expenseAmount.toLocaleString("id-ID")}</td>
        <td>${expense.expenseNote}</td>
        <td>Rp ${cumulativeTotal.toLocaleString("id-ID")}</td> <!-- Tambahkan kolom Total Pengeluaran -->
      `;
    expenseTableBody.appendChild(row);
  }

  // Fungsi untuk mengirim pesan WhatsApp dengan data tabel
  function sendWhatsAppMessage() {
    let message = "*Log Book Pengeluaran Bulanan Mahasiswa*%0A%0A"; // Menggunakan %0A untuk newline di WhatsApp

    expenses.forEach((expense, index) => {
      message += `*${index + 1}. ${expense.timestamp}*%0A`;
      message += `Jenis Pengeluaran: ${expense.expenseType}%0A`;
      message += `Nominal: Rp ${expense.expenseAmount.toLocaleString("id-ID")}%0A`;
      message += `Keterangan: ${expense.expenseNote}%0A%0A`;
    });

    // Buat link WhatsApp dengan pesan yang diformat
    const whatsappLink = `https://wa.me/?text=${message}`;

    // Buka link WhatsApp di jendela/tab baru
    window.open(whatsappLink, "_blank");
  }

  // Tambahkan event listener ke tombol cetak struk
  printReceiptButton.addEventListener("click", function () {
    sendWhatsAppMessage();
  });
});
