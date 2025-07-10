const projectFieldsContainer = document.getElementById("projectFields");
const addProjectBtn = document.getElementById("addProjectBtn");
const certFieldsContainer = document.getElementById("certificationFields");
const addCertBtn = document.getElementById("addCertBtn");
const educationFieldsContainer = document.getElementById("educationFields");
const addEducationBtn = document.getElementById("addEducationBtn");
let projectCount = 0;
let certCount = 0;
let eduCount = 0;

addProjectBtn.addEventListener("click", () => {
  projectCount++;
  const wrapper = document.createElement("div");
  wrapper.classList.add("project-input");
  wrapper.innerHTML = `
    <input name="projectTitle${projectCount}" placeholder="Project ${projectCount} Title" required>
    <input name="projectDesc${projectCount}" placeholder="Project ${projectCount} Description" required>
    <input name="projectGit${projectCount}" placeholder="GitHub URL (optional)">
    <input type="file" accept="image/*" class="project-image">
    <img class="project-preview" width="200" style="display:none; margin-top:10px;">
  `;
  projectFieldsContainer.appendChild(wrapper);
});

addCertBtn.addEventListener("click", () => {
  certCount++;
  const wrapper = document.createElement("div");
  wrapper.classList.add("certification-input");
  wrapper.innerHTML = `
    <input name="certificationTitle${certCount}" placeholder="Certification ${certCount}" required>
    <input name="certificationLink${certCount}" placeholder="Certificate URL" required>
  `;
  certFieldsContainer.appendChild(wrapper);
});

addEducationBtn.addEventListener("click", () => {
  eduCount++;
  const div = document.createElement("div");
  div.classList.add("education-input");
  div.innerHTML = `
    <input name="eduInstitute${eduCount}" placeholder="Institute Name" required>
    <input name="eduDegree${eduCount}" placeholder="Branch" required>
    <input name="eduScore${eduCount}" placeholder="CGPA / Percentage" required>
  `;
  educationFieldsContainer.appendChild(div);
});

document.getElementById("profilePic").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById("profilePreview");
      img.src = e.target.result;
      img.style.display = "block";
      document.getElementById("finalProfilePic").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("aboutPic").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("finalAboutPic").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("portfolioForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const projects = [];
  const projectInputs = document.querySelectorAll(".project-input");

  let imagesLoaded = 0;
  const total = projectInputs.length;

  projectInputs.forEach((proj) => {
    const title = proj.querySelector(`input[name^="projectTitle"]`).value;
    const desc = proj.querySelector(`input[name^="projectDesc"]`).value;
    const github = proj.querySelector(`input[name^="projectGit"]`)?.value || '';
    const imageInput = proj.querySelector(".project-image");
    const imgFile = imageInput.files[0];

    if (imgFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        projects.push({ title, desc, github, imgSrc: e.target.result });
        imagesLoaded++;
        if (imagesLoaded === total) displayPortfolio(form, projects);
      };
      reader.readAsDataURL(imgFile);
    } else {
      projects.push({ title, desc, github, imgSrc: '' });
      imagesLoaded++;
      if (imagesLoaded === total) displayPortfolio(form, projects);
    }
  });
});

function displayPortfolio(form, projects) {
  const certifications = [];
  const certInputs = document.querySelectorAll(".certification-input");
  certInputs.forEach(cert => {
    certifications.push({
      title: cert.querySelector("input[name^='certificationTitle']").value,
      link: cert.querySelector("input[name^='certificationLink']").value
    });
  });

  const education = [];
  const eduInputs = document.querySelectorAll(".education-input");
  eduInputs.forEach(edu => {
    education.push({
      institute: edu.querySelector("input[name^='eduInstitute']").value,
      degree: edu.querySelector("input[name^='eduDegree']").value,
      score: edu.querySelector("input[name^='eduScore']").value
    });
  });

  const data = {
    name: form.name.value,
    role: form.role.value,
    about: form.about.value,
    skills: form.skills.value.split(','),
    email: form.email.value,
    github: form.github.value,
    linkedin: form.linkedin.value,
    projects,
    certifications,
    education
  };

  document.getElementById('displayName').textContent = data.name;
  document.getElementById('displayRole').textContent = data.role;
  document.getElementById('displayAbout').textContent = data.about;
  document.getElementById('footerName').textContent = data.name;

  const skillsList = document.getElementById('displaySkills');
  skillsList.innerHTML = '';
  data.skills.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = skill.trim();
    skillsList.appendChild(li);
  });

  const eduContainer = document.getElementById("educationContainer");
  eduContainer.innerHTML = '';
  data.education.forEach(edu => {
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${edu.degree}</strong><br>${edu.institute}<br>${edu.score}</p>`;
    eduContainer.appendChild(div);
  });

  const projectsContainer = document.getElementById('projectsContainer');
  projectsContainer.innerHTML = '';
  data.projects.forEach(project => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${project.title}</h3><p>${project.desc}</p>`;
    if (project.github) {
      div.innerHTML += `<a href="${project.github}" target="_blank" class="view-btn">View Project</a>`;
    }
    if (project.imgSrc) {
      div.innerHTML += `<img src="${project.imgSrc}" width="300">`;
    }
    projectsContainer.appendChild(div);
  });

  const certContainer = document.getElementById("certificationsContainer");
  certContainer.innerHTML = '';
  data.certifications.forEach(cert => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${cert.title}</h3>`;
    div.innerHTML += `<a href="${cert.link}" target="_blank" class="view-btn">View Certificate</a>`;
    certContainer.appendChild(div);
  });

  document.getElementById('displayEmail').textContent = data.email;
  document.getElementById('displayGitHub').href = data.github;
  document.getElementById('displayLinkedIn').href = data.linkedin;

  document.getElementById('portfolio').style.display = 'block';
  document.getElementById('form-section').style.display = 'none';
}
