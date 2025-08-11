function zkontrolujHeslo() {
  const vstup = document.getElementById("heslo").value.trim().toLowerCase();
  const chybova = document.getElementById("chybova-zprava");

  if (vstup === "alohomora") {
    window.location.href = "ukol.html";
  } else {
    chybova.textContent = "Špatné kouzlo. Zkus to znovu!";
  }
}
