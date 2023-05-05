function addRow() {
  var table = document.getElementById("courseTable");
  var newRow = table.insertRow(-1);
  newRow.className = "courseRow";

  newRow.innerHTML = `
    <td>
      <input type="text" class="courseCode" size="10" placeholder="Eg: AUN 101" />
    </td>
    <td>
      <select class="creditHours" onchange="calculateCGPA()">
        <option value="" disabled selected>--</option>
        <option value="4">4</option>
        <option value="3">3</option>
        <option value="2">2</option>
        <option value="1">1</option>
        <option value="0">0</option>
      </select>
    </td>
    <td>
      <select class="grade" onchange="calculateCGPA()">
        <option value="" disabled selected>--</option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="F">F</option>
        <option value="W">W</option>
        <option value="WP">WP</option>
        <option value="WF">WF</option>
      </select>
    </td>
    <td>
      <button class="deleteRowBtn" onclick="deleteRow(this)">
        <i class="fas fa-trash"></i>
      </button>
    </td>`;
}

function initializeTable() {
  for (var i = 0; i < 4; i++) {
    addRow();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeTable();
});


function deleteRow(btn) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);

  const courseTable = document.getElementById("courseTable");
  const courseRows = courseTable.getElementsByClassName("courseRow");

  if (courseRows.length > 0) {
    calculateCGPA();
  } else {
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("progressLabel").textContent = "";
    document.getElementById("totalCredits").textContent = "";
    document.getElementById("gpa").textContent = "";
    document.getElementById("cgpa").textContent = "";
  }
}

function getGradePoints(grade) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.3;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.3;
    case "C":
      return 2.0;
    case "D":
      return 1.0;
    case "F":
    case "W":
    case "WP":
    case "WF":
    default:
      return 0.0;
  }
}

function calculateCGPA() {
  document.getElementById("currentCGPA").addEventListener("input", calculateCGPA);
  document.getElementById("creditsEarned").addEventListener("input", calculateCGPA);

  const currentCGPA = parseFloat(document.getElementById("currentCGPA").value) || 0;
  const creditsEarned = parseInt(document.getElementById("creditsEarned").value) || 0;

  const table = document.getElementById("courseTable");
  const rows = table.getElementsByClassName("courseRow");

  let totalGradePoints = 0;
  let totalCreditHours = 0;

  for (let i = 0; i < rows.length; i++) {
    const creditHours = parseInt(rows[i].getElementsByClassName("creditHours")[0].value);
    const grade = rows[i].getElementsByClassName("grade")[0].value;

    if (creditHours && grade) {
      const gradePoints = getGradePoints(grade);

      if (gradePoints > 4.0) {
        // Invalid input: Do not update the display
        return;
      }

      totalGradePoints += gradePoints * creditHours;
      totalCreditHours += creditHours;
    }
  }

  let newGPA = 0;
  let cgpa = 0;

  if (totalCreditHours > 0) {
    newGPA = totalGradePoints / totalCreditHours;

    if (currentCGPA > 0 && creditsEarned > 0) {
      cgpa = ((currentCGPA * creditsEarned) + totalGradePoints) / (creditsEarned + totalCreditHours);

      if (cgpa > 4.0) {
        cgpa = 0.0;
      }
    }
  } else if (currentCGPA > 0 && creditsEarned > 0) {
    cgpa = currentCGPA;
  }

  if (isNaN(cgpa)) {
    cgpa = 0;
  }

  // Update the display
  document.getElementById("totalCredits").textContent = totalCreditHours;
  document.getElementById("gpa").textContent = newGPA.toFixed(2);
  document.getElementById("cgpa").textContent = cgpa.toFixed(2);

  // Update the progress bar and label
  updateProgressBar(newGPA);
}

function updateProgressBar(gpa) {
  const progressBar = document.getElementById("progressBar");
  const progressLabel = document.getElementById("progressLabel");
  const table = document.getElementById("courseTable");
  const rows = table.getElementsByClassName("courseRow");

  let hasValidInput = false;

  for (let i = 0; i < rows.length; i++) {
    const creditHours = rows[i].getElementsByClassName("creditHours")[0].value;
    const grade = rows[i].getElementsByClassName("grade")[0].value;

    if (creditHours && grade) {
      hasValidInput = true;
      break;
    }
  }

  if (!hasValidInput) {
    progressBar.style.width = '0%';
    progressLabel.textContent = "";
    return;
  }

  if (gpa >= 3.8 && gpa <= 4.0) {
    progressBar.style.width = ((gpa / 4) * 100) + '%';
    progressBar.className = 'progress-bar presidents-list';
    progressLabel.textContent = "President's List";
  } else if (gpa >= 3.5 && gpa < 3.8) {
    progressBar.style.width = ((gpa / 4) * 100) + '%';
    progressBar.className = 'progress-bar deans-list';
    progressLabel.textContent = "Dean's List";
  } else if (gpa >= 2.0 && gpa < 3.5) {
    progressBar.style.width = ((gpa / 4) * 100) + '%';
    progressBar.className = 'progress-bar good-standing';
    progressLabel.textContent = "Good Standing";
  } else if (gpa >= 0.0 && gpa < 2.0) {
    progressBar.style.width = ((gpa / 4) * 100) + '%';
    progressBar.className = 'progress-bar not-good-standing';
    progressLabel.textContent = "Not Good Standing - See Your Academic Advisor";
  } else {
    progressBar.style.width = '0%';
    progressLabel.textContent = "";
  }
}

function resetForm() {
  // Reset the form
  document.getElementById('currentCGPA').value = '';
  document.getElementById('creditsEarned').value = '';
  document.getElementById('totalCredits').innerHTML = '0';
  document.getElementById('gpa').innerHTML = '0';
  document.getElementById('cgpa').innerHTML = '0';
  document.getElementById('progressBar').style.width = '0';
  document.getElementById('progressLabel').innerHTML = '';

  // Remove all existing rows except the first one
  const courseTable = document.getElementById('courseTable');
  let rowCount = courseTable.rows.length;
  for (let i = rowCount - 1; i > 4; i--) {
    courseTable.deleteRow(i);
  }

  // Reset the values of the first four rows
  let courseRows = document.getElementsByClassName('courseRow');
  for (let i = 0; i < courseRows.length; i++) {
    let row = courseRows[i];
    row.getElementsByClassName('courseCode')[0].value = '';
    row.getElementsByClassName('creditHours')[0].value = '';
    row.getElementsByClassName('grade')[0].value = '';
  }

  // Add rows if there are less than four
  while (courseRows.length < 4) {
    addRow();
  }
}


function initializeValues() {
  document.getElementById('totalCredits').textContent = '0';
  document.getElementById('gpa').textContent = '0';
  document.getElementById('cgpa').textContent = '0';
}

// Call the function when the page loads
initializeValues();


function updateCopyrightYear() {
  const currentYear = new Date().getFullYear();
  const copyrightElement = document.getElementById("copyright");
  copyrightElement.innerHTML = "&copy; " + "Copyright " + currentYear + ' Developed by <a href="mailto:hassanhauda@gmail.com">Hassan Umar and Ahmad Lateef</a>. All rights reserved. ';
}

// Call the function to update the year when the page loads
updateCopyrightYear();


function startRotateIcon() {
  const resetIcon = document.getElementById("resetIcon");
  let rotation = 0;
  setInterval(() => {
    rotation += 5;
    resetIcon.style.transform = `rotate(${rotation}deg)`;
  }, 20);
}

// Call the startRotateIcon function to initiate the rotation
startRotateIcon();
