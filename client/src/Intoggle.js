function toggleHtmlClass(className) {
  const bodyTag = document.querySelector("body");
  bodyTag.classList.toggle(className);
}
function opensidebar() {
  const bodyTag = document.querySelector("body");

  console.log(bodyTag, "bodyTag");
  console.log(
    bodyTag.classList.contains("enlarge-menu"),
    "bodyTag.classList.contains(enlarge-menu)"
  );
  // console.log(bodyTag, "bodyTag");
  if (bodyTag.classList.contains("enlarge-menu")) {
    bodyTag.classList.remove("enlarge-menu");
  }
}
function closesidebar() {
  const bodyTag = document.querySelector("body");
  bodyTag.classList.add("enlarge-menu");
}
function closemodalCreateAdmin() {
  const myButton = document.getElementById("createAdminModalbtnclose");
  myButton.click();
}

function closemodalConsultantAdmin() {
  const myButton = document.getElementById("createConsultantModalbtnclose");
  myButton.click();
}

function closeappointmentmodal() {
  const myButton = document.getElementById("appointmentclosebtn");
  myButton.click();
}

function closemodalcategoryedit() {
  const myButton = document.getElementById("editcategorybtnclose");
  myButton.click();
}

function closemodalEditConsultant() {
  const myButton = document.getElementById("editConsultantModalbtnclose");
  myButton.click();
}
function closemodalEditDoctor() {
  const myButton = document.getElementById("editdoctorModalbtnclose");
  myButton.click();
}
function closemodalEditPatient() {
  const myButton = document.getElementById("editpatientmodalbtnclose");
  myButton.click();
}

function closemodalEditAdmin() {
  const myButton = document.getElementById("editAdminModalbtnclose");
  myButton.click();
}

function closepasswordform() {
  const myButton = document.getElementById("changepasswordclosebtn");
  myButton.click();
}

function openprofilepicmodal() {
  const myButton = document.getElementById("openprofilepicmodal");
  myButton.click();
}

function closepicmodal() {
  const myButton = document.getElementById("closepicmodal");
  myButton.click();
}
// closepicmodal

export {
  toggleHtmlClass,
  opensidebar,
  closesidebar,
  closemodalCreateAdmin,
  closemodalEditAdmin,
  closemodalConsultantAdmin,
  closemodalEditConsultant,
  closemodalcategoryedit,
  closemodalEditDoctor,
  closemodalEditPatient,
  closepasswordform,
  openprofilepicmodal,
  closepicmodal,
  closeappointmentmodal,
};
