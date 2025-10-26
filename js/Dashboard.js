// pages transitions
window.addEventListener("load", () => {
  document.body.classList.add("fade-in");
});

document.querySelectorAll("a").forEach((link) => {
  if (link.getAttribute("href") && !link.getAttribute("href").startsWith("#")) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let allCoursesData = getCoursesFromStorage();
  let currentUserRole = "";
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("aside");
  const closeBtn = document.getElementById("close-sidebar");
  const studentListBody = document.getElementById("student-list-body");
  const coursesListBody = document.getElementById("courses-list-body");
  const myCoursesBody = document.getElementById("my-courses-list-body");
  const paymentsListBody = document.getElementById("payments-list-body");
  const paginationContainer = document.querySelector(".pagination");
  const addNewStudentBtn = document.getElementById("addNewStudentBtn");
  const addNewPaymentBtnRef = document.getElementById("addNewPaymentBtn");
  const addNewCourseBtn = document.getElementById("addNewCourseBtn");
  const courseNavLinks = document.querySelectorAll(".courses-nav .nav-link");
  const navLinks = document.querySelectorAll(".sidebar-list .nav-link");
  const contentSections = document.querySelectorAll("main section");
  const updatePhotoOverlay = document.getElementById("update-photo-overlay");
  const hiddenFileInput = document.getElementById("hidden-file-input");
  const userImageEl = document.getElementById("dashboard-user-image");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const editProfileImageInput = document.getElementById(
    "edit-profile-image-input"
  );
  const goToNotificationsLink = document.getElementById(
    "goToNotificationsLink"
  );
  const backToSettingsBtn = document.getElementById("backToSettingsBtn");
  const settingsSection = document.getElementById("settings-section");
  const notificationSettingsSection = document.getElementById(
    "notification-settings-section"
  );
  const accountSettingsLink = document.getElementById("accountSettingsLink");
  const backToSettingsBtnFromAccount = document.getElementById(
    "backToSettingsBtn-From-Account"
  );
  const cancelAccountChangesBtn = document.getElementById(
    "cancelAccountChangesBtn"
  );
  const accountSettingsSection = document.getElementById(
    "account-settings-section"
  );
  const saveAccountChangesBtn = document.getElementById(
    "saveAccountChangesBtn"
  );

  function getUsersFromStorage() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }
  function getPaymentsFromStorage() {
    return JSON.parse(localStorage.getItem("payments")) || [];
  }
  function getCoursesFromStorage() {
    return JSON.parse(localStorage.getItem("courses")) || [];
  }
  function saveCoursesToStorage(coursesArray) {
    localStorage.setItem("courses", JSON.stringify(coursesArray));
  }
  function getCurrentUser() {
    const loggedInEmail = JSON.parse(
      localStorage.getItem("loggedInUser") ||
        sessionStorage.getItem("loggedInUser")
    );
    if (!loggedInEmail) return null;
    return getUsersFromStorage().find((user) => user.email === loggedInEmail);
  }
  function saveUsersToStorage(usersArray) {
    localStorage.setItem("users", JSON.stringify(usersArray));
  }
  function savePaymentsToStorage(paymentsArray) {
    localStorage.setItem("payments", JSON.stringify(paymentsArray));
  }

  //sidebar menu
  if (menuToggle && sidebar) {
    function openSidebar() {
      sidebar.classList.add("sidebar-visible");
      menuToggle.classList.remove("fa-bars");
      menuToggle.classList.add("fa-xmark");
    }
    function closeSidebar() {
      sidebar.classList.remove("sidebar-visible");
      menuToggle.classList.add("fa-bars");
      menuToggle.classList.remove("fa-xmark");
    }
    menuToggle.addEventListener("click", () => {
      sidebar.classList.contains("sidebar-visible")
        ? closeSidebar()
        : openSidebar();
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", closeSidebar);
    }
  }

  //User Data
  function populateUserData() {
    // get user email from storage
    let loggedInEmail = JSON.parse(
      localStorage.getItem("loggedInUser") ||
        sessionStorage.getItem("loggedInUser")
    );
    let allUsers = getUsersFromStorage();
    // redirect if not logged in
    if (!loggedInEmail) {
      window.location.href = "index.html";
      return;
    }
    // find user data
    let currentUser = allUsers.find((user) => user.email === loggedInEmail);
    if (currentUser) {
      userImageEl.src = currentUser.profilePicture;

      // update name , image , role text
      document.getElementById(
        "dashboard-username"
      ).textContent = `${currentUser.firstName} ${currentUser.lastName}`;
      document.getElementById("dashboard-role").textContent = currentUser.role;
      const settingsImageEl = document.getElementById("settings-user-image");
      const settingsUsernameEl = document.getElementById("settings-username");
      const settingsRoleEl = document.getElementById("settings-role");

      if (settingsImageEl) settingsImageEl.src = currentUser.profilePicture;
      if (settingsUsernameEl)
        settingsUsernameEl.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
      if (settingsRoleEl) settingsRoleEl.textContent = currentUser.role;

      // store role for permission checks
      if (currentUser.role) {
        currentUserRole = currentUser.role.toLowerCase();
      } else {
        console.error("User found but role is missing:", currentUser);
        currentUserRole = "";
      }

      // show my courses link only for students
      let myCoursesLink = document.getElementById("my-courses-link");
      if (myCoursesLink && currentUserRole === "student") {
        myCoursesLink.classList.remove("hidden");
      }
      // hide Add New Student button if user is not a teacher
      if (addNewStudentBtn && currentUserRole !== "teacher") {
        addNewStudentBtn.classList.add("hidden");
      }
      if (addNewCourseBtn && currentUserRole !== "teacher") {
        addNewCourseBtn.classList.add("hidden");
      } else if (addNewCourseBtn) {
        addNewCourseBtn.classList.remove("hidden");
      }
    } else {
      // if user data not found and clear login
      localStorage.removeItem("loggedInUser");
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    }
  }

  //student list display
  function displayStudents() {
    let allUsers = getUsersFromStorage();
    let students = allUsers.filter(
      (user) => user.role && user.role.toLowerCase() === "student"
    );
    // Clear list
    studentListBody.innerHTML = "";
    // show message if no students
    if (students.length === 0) {
      studentListBody.innerHTML = `<p class="text-center gray-color mt-5">No students found.</p>`;
      return;
    }
    // build HTML
    students.forEach((student) => {
      let admissionDate = new Date()
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
      // mask info if viewer is not a teacher
      let displayEmail =
        currentUserRole === "teacher" ? student.email : "***********";
      let displayPhone =
        currentUserRole === "teacher" ? student.phone : "***********";
      // show icons only for teachers
      let actionIconsHTML = "";
      if (currentUserRole === "teacher") {
        actionIconsHTML = `<i class="fa-solid fa-pen-to-square text-main-color cursor-pointer me-3" data-email="${student.email}"></i><i class="fa-solid fa-trash text-danger cursor-pointer" data-email="${student.email}"></i>`;
      }
      // create student row
      let studentHTML = `
        <div class="student-row row align-items-center mb-3 py-3 rounded-3 shadow-sm montserrat-med fs-14 mx-2 mt-2">
          <div class="col-12 col-lg-3 d-flex align-items-center mb-2 mb-lg-0"><img src="${student.profilePicture}" class="avatar me-3" alt="Student Avatar" /><span class="fw-bold">${student.firstName} ${student.lastName}</span></div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0">${displayEmail}</div>
          <div class="col-12 col-lg-2 mb-2 mb-lg-0">${displayPhone}</div>
          <div class="col-9 col-lg-2 mb-2 mb-lg-0 ps-lg-4">${admissionDate}</div>
          <div class="col-3 col-lg-2 text-end">${actionIconsHTML}</div>
        </div>`;
      studentListBody.innerHTML += studentHTML;
    });
  }

  //course list display
  //displays courses with category filtering
  function displayCourses(category, currentPage = 1) {
    const itemsPerPage = 6;
    coursesListBody.innerHTML = "";

    const filteredCourses =
      category === "all"
        ? allCoursesData
        : allCoursesData.filter(
            (course) => course.category.toLowerCase() === category.toLowerCase()
          );

    if (filteredCourses.length === 0) {
      coursesListBody.innerHTML = `<div class="col-12"><p class="text-center p-5">No courses found in this category.</p></div>`;
      setupPagination(0, 1);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    paginatedCourses.forEach((course) => {
      const courseCardHTML = `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100 course-card shadow-sm border-0">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title montserrat-bold">${course.title}</h5>
              
              <div class="card-text text-muted small mb-2 d-flex justify-content-between">
                  <span>
                      <i class="fa-regular fa-clock me-2"></i>${course.duration} Hours
                  </span>
                  <span>
                      <i class="fa-solid fa-book-open me-2"></i>${course.lessons} Lessons
                  </span>
              </div>

           <div class="d-flex align-items-center">
           <p class="card-text m-0 montserrat-bold">Instructor:<h6 class="text-muted montserrat-semiBold m-0 ps-1">${course.instructor}</h6></p>
            </div> 
            <p class="card-text mt-2">${course.description}</p>
              
              <button class="btn btn-sm bg-main-color text-white mt-auto add-course-btn" data-title="${course.title}">
                Add to My Courses
              </button>
            </div>
          </div>
        </div> `;
      coursesListBody.innerHTML += courseCardHTML;
    });

    setupPagination(filteredCourses.length, currentPage);
  }

  // my courses display
  // Displays courses added by the current student
  function displayMyCourses() {
    let currentUser = getCurrentUser();
    // clear list
    myCoursesBody.innerHTML = "";
    // show message if no courses added
    if (
      !currentUser ||
      !currentUser.courses ||
      currentUser.courses.length === 0
    ) {
      myCoursesBody.innerHTML = `<p class="text-center gray-color mt-5">You haven't added any courses yet.</p>`;
      return;
    }
    //HTML card for each course
    currentUser.courses.forEach((course) => {
      let courseCardHTML = `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm"><div class="card-body d-flex flex-column">
            <h5 class="card-title montserrat-bold">${course.title}</h5><p class="card-text">${course.description}</p><p class="card-text mt-auto"><small class="text-muted montserrat-med fs-14 text-capitalize"><span class="text-black">Instructor:</span> ${course.instructor}</small></p>
          </div></div>
        </div>`;
      myCoursesBody.innerHTML += courseCardHTML;
    });
  }

  // display payments
  function displayPayments() {
    paymentsListBody.innerHTML = "";
    //read localStorage
    let allPayments = getPaymentsFromStorage();
    if (allPayments.length === 0) {
      paymentsListBody.innerHTML =
        '<p class="text-center p-5 gray-color mt-5">No payment data found.</p>';
      return;
    }
    //payment record from localStorage data
    allPayments.forEach((payment) => {
      const courseName = payment.course || "Not Available";

      let paymentRowHTML = `
        <div class="payment-card row align-items-center mb-3 py-3 rounded-3 shadow-sm montserrat-med fs-14 mx-2 mt-2">
            
            <div class="col-12 col-lg-2 mb-2 mb-lg-0"> <span class="d-lg-none fw-bold">Name: </span>
                <span>${payment.name}</span>
            </div>

            <div class="col-12 col-lg-2 mb-2 mb-lg-0"> 
                <span class="d-lg-none fw-bold">Course: </span>
                <span>${courseName}</span>
            </div>

            <div class="col-12 col-lg-2 mb-2 mb-lg-0">
                <span class="d-lg-none fw-bold">Order: </span>
                <span>${payment.bill}</span>
            </div>

            <div class="col-12 col-lg-2 mb-2 mb-lg-0">
                <span class="d-lg-none fw-bold">Amount Paid: </span>
                <span>${payment.paid.toLocaleString()} Egp</span>
            </div>

            <div class="col-12 col-lg-2 mb-2 mb-lg-0">
                <span class="d-lg-none fw-bold">Balance: </span>
                <span>${payment.balance.toLocaleString()} Egp</span>
            </div>

            <div class="col-12 col-lg-1 mb-2 mb-lg-0"> <span class="d-lg-none fw-bold">Date: </span>
                <span>${payment.date}</span>
            </div>

            <div class="col-12 col-lg-1 text-end">
                <i class="fa-solid fa-pen-to-square text-main-color cursor-pointer edit-payment-btn" data-bill="${
                  payment.bill
                }"></i>
            </div>

        </div>
      `;
      paymentsListBody.innerHTML += paymentRowHTML;
    });
  }

  // dynamically creates pagination buttons
  function setupPagination(totalItems, currentPage) {
    let itemsPerPage = 5;
    // clear
    paginationContainer.innerHTML = "";
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i++) {
      let pageItem = document.createElement("li");
      pageItem.className = "page-item";
      if (i === currentPage) pageItem.classList.add("active");
      let pageLink = document.createElement("a");
      pageLink.className = "page-link";
      pageLink.href = "#";
      pageLink.innerText = i;
      pageLink.setAttribute("data-page", i);
      pageItem.appendChild(pageLink);
      paginationContainer.appendChild(pageItem);
    }
  }

  // update dashboard counts
  // calc and displays stats on dashboard cards
  function updateDashboardCards() {
    // get Data
    let allUsers = getUsersFromStorage();
    let allPayments = getPaymentsFromStorage();

    //calculate Totals
    let totalStudents = allUsers.filter(
      (user) => user.role && user.role.toLowerCase() === "student"
    ).length;
    let totalCourses = allCoursesData.length;
    let totalPayments = allPayments.reduce(
      (sum, payment) => sum + payment.paid,
      0
    );
    let totalAdminUsers = allUsers.filter(
      // changed variable name
      (user) => user.role && user.role.toLowerCase() === "teacher"
    ).length;

    let studentsCountEl = document.getElementById("students-count");
    let courseCountEl = document.getElementById("course-count");
    let paymentsTotalEl = document.getElementById("payments-total");
    let usersCountEl = document.getElementById("users-count");

    //update HTML
    if (studentsCountEl) studentsCountEl.textContent = totalStudents;
    if (courseCountEl) courseCountEl.textContent = totalCourses;
    if (paymentsTotalEl)
      paymentsTotalEl.innerHTML = `${totalPayments.toLocaleString()} <span class="inr">Egp </span>`;
    if (usersCountEl) usersCountEl.textContent = totalAdminUsers;
  }

  // add new student btn
  if (addNewStudentBtn) {
    addNewStudentBtn.addEventListener("click", function () {
      // check permission
      if (currentUserRole === "teacher") {
        Swal.fire({
          title: "Add New Student",
          html: `<input id="swal-firstName" class="swal2-input" placeholder="First Name"><input id="swal-lastName" class="swal2-input" placeholder="Last Name"><input id="swal-email" class="swal2-input" placeholder="Email" type="email"><input id="swal-phone" class="swal2-input" placeholder="Phone" type="tel"><input id="swal-password" class="swal2-input" placeholder="Password" type="password">`,
          confirmButtonText: "Add Student",
          confirmButtonColor: "#FEAF00",
          focusConfirm: false,
          preConfirm: () => {
            let firstName = document.getElementById("swal-firstName").value;
            let email = document.getElementById("swal-email").value;
            let password = document.getElementById("swal-password").value;
            if (!firstName || !email || !password) {
              Swal.showValidationMessage("Please fill out all required fields");
              return false;
            }
            return {
              firstName,
              lastName: document.getElementById("swal-lastName").value,
              email,
              phone: document.getElementById("swal-phone").value,
              password,
            };
          },
        }).then((result) => {
          // if form submitted and validated
          if (result.isConfirmed) {
            let newStudentData = result.value;
            let allUsers = getUsersFromStorage(); // Use helper
            // check for duplicate email
            if (allUsers.find((user) => user.email === newStudentData.email)) {
              Swal.fire("Error!", "This email is already registered.", "error");
              return;
            }
            // create student object, add to array, save, refresh list
            let newStudent = {
              ...newStudentData,
              role: "student",
              profilePicture: "imgs/default-avatar.png", // Use correct default image path
            };
            allUsers.push(newStudent);
            saveUsersToStorage(allUsers); // Use helper
            displayStudents();
            Swal.fire("Added!", "New student has been added.", "success");
          }
        });
      } else {
        // show permission error if not teacher
        Swal.fire({
          icon: "error",
          title: "Permission Denied",
          text: "Only teachers are allowed to add new students.",
          confirmButtonColor: "#FEAF00",
        });
      }
    });
  }

  //Update/Delete Student
  if (studentListBody) {
    // use event delegation
    studentListBody.addEventListener("click", function (event) {
      let email = event.target.getAttribute("data-email");
      if (!email) return; // ignore clicks not on icons

      // delete action
      if (event.target.classList.contains("fa-trash")) {
        // show confirmation
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FEAF00",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            // filter out user, save, refresh list
            let allUsers = getUsersFromStorage(); // Use helper
            let updatedUsers = allUsers.filter((user) => user.email !== email);
            saveUsersToStorage(updatedUsers); // Use helper
            displayStudents();
            Swal.fire("Deleted!", "The student has been deleted.", "success");
          }
        });
      }

      // update action
      if (event.target.classList.contains("fa-pen-to-square")) {
        let allUsers = getUsersFromStorage(); // Use helper
        let studentToUpdate = allUsers.find((user) => user.email === email);
        // if student found, show update form
        if (studentToUpdate) {
          Swal.fire({
            title: "Update Student Information",
            html: `<input id="swal-firstName" class="swal2-input" placeholder="First Name" value="${studentToUpdate.firstName}"><input id="swal-lastName" class="swal2-input" placeholder="Last Name" value="${studentToUpdate.lastName}"><input id="swal-phone" class="swal2-input" placeholder="Phone" value="${studentToUpdate.phone}">`,
            confirmButtonText: "Save Changes",
            confirmButtonColor: "#FEAF00",
            focusConfirm: false,
            preConfirm: () => ({
              // get updated data
              firstName: document.getElementById("swal-firstName").value,
              lastName: document.getElementById("swal-lastName").value,
              phone: document.getElementById("swal-phone").value,
            }),
          }).then((result) => {
            // if saved, update user data, save, refresh list
            if (result.isConfirmed) {
              let updatedData = result.value;
              let userIndex = allUsers.findIndex(
                (user) => user.email === email
              );
              if (userIndex !== -1) {
                allUsers[userIndex].firstName = updatedData.firstName;
                allUsers[userIndex].lastName = updatedData.lastName;
                allUsers[userIndex].phone = updatedData.phone;
              }
              saveUsersToStorage(allUsers); // Use helper
              displayStudents();
              Swal.fire(
                "Updated!",
                "Student information has been updated.",
                "success"
              );
            }
          });
        }
      }
    });
  }
  //Add Course to my courses
  if (coursesListBody) {
    // use event delegation
    coursesListBody.addEventListener("click", function (event) {
      if (event.target.classList.contains("add-course-btn")) {
        const courseTitle = event.target.getAttribute("data-title");

        if (currentUserRole === "teacher") {
          Swal.fire({
            icon: "error",
            title: "Permission Denied",
            text: "Teachers cannot enroll in courses.",
            confirmButtonColor: "#FEAF00",
          });
          return;
        }

        const currentUser = getCurrentUser();
        let allUsers = getUsersFromStorage();
        let userIndex = allUsers.findIndex(
          (u) => u.email === currentUser.email
        );

        if (userIndex !== -1) {
          if (!allUsers[userIndex].courses) {
            allUsers[userIndex].courses = [];
          }
          const courseToAdd = allCoursesData.find(
            (c) => c.title === courseTitle
          );
          const courseExists = allUsers[userIndex].courses.some(
            (c) => c.title === courseTitle
          );

          if (courseExists) {
            Swal.fire(
              "Already Added!",
              "You have already added this course.",
              "info"
            );
          } else if (courseToAdd) {
            allUsers[userIndex].courses.push(courseToAdd);
            saveUsersToStorage(allUsers);
            Swal.fire(
              "Success!",
              `${courseTitle} has been added to your courses.`,
              "success"
            );
          }
        } else {
          Swal.fire("Error", "Could not find the current user.", "error");
        }
      }
    });
  }
  // add New Payment Btn
  if (addNewPaymentBtnRef) {
    addNewPaymentBtnRef.addEventListener("click", function () {
      // check permission
      if (currentUserRole === "teacher") {
        let courseOptionsHTML =
          '<option value="" disabled selected>Select Course</option>';
        allCoursesData.forEach((course) => {
          courseOptionsHTML += `<option value="${course.title}">${course.title}</option>`;
        });
        Swal.fire({
          title: "Add New Payment Record",
          // updated form
          html: `
            <input id="swal-studentEmail" class="swal2-input" placeholder="Student Email" type="email">
            <input id="swal-studentName" class="swal2-input" placeholder="Student Name" type="text">
            <select id="swal-course" class="swal2-select">${courseOptionsHTML}</select>
            <input id="swal-totalAmount" class="swal2-input" placeholder="Total Course Fee" type="number" value="9000">
            <input id="swal-amountPaid" class="swal2-input" placeholder="Amount Paid" type="number">
            <input id="swal-date" class="swal2-input" type="date">
          `,
          confirmButtonText: "Add Payment",
          confirmButtonColor: "#FEAF00",
          focusConfirm: false,
          preConfirm: () => {
            // Get values
            let studentEmail =
              document.getElementById("swal-studentEmail").value;
            let studentName = document.getElementById("swal-studentName").value;
            let course = document.getElementById("swal-course").value;
            let amountPaid = parseFloat(
              document.getElementById("swal-amountPaid").value
            );
            let totalAmount = parseFloat(
              document.getElementById("swal-totalAmount").value
            );
            let dateInput = document.getElementById("swal-date").value;
            // email Validation
            let allUsers = getUsersFromStorage();
            let studentExists = allUsers.some(
              (user) =>
                user &&
                user.email === studentEmail &&
                user.role &&
                user.role.toLowerCase() === "student"
            );
            if (!studentExists) {
              Swal.showValidationMessage(
                `Student with email "${studentEmail}" not found.`
              );
              return false;
            }
            if (
              !studentEmail ||
              !studentName ||
              !course ||
              isNaN(amountPaid) ||
              isNaN(totalAmount) ||
              !dateInput
            ) {
              Swal.showValidationMessage(
                "Please fill out all fields correctly."
              );
              return false;
            }
            // generate Random order Number
            let billNumber = Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase();
            // calculate balance
            let balanceAmount = totalAmount - amountPaid;
            // format date
            let dateObj = new Date(dateInput);
            let formattedDate = dateObj
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-");
            return {
              name: studentName,
              email: studentEmail,
              course: course,
              bill: billNumber,
              paid: amountPaid,
              balance: balanceAmount,
              date: formattedDate,
            };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            let newPaymentData = result.value;
            // save to localStorage
            let allPayments = getPaymentsFromStorage();
            allPayments.push(newPaymentData);
            savePaymentsToStorage(allPayments);
            displayPayments();
            Swal.fire("Success!", "New payment record added.", "success");
          }
        });
      } else {
        //error
        Swal.fire({
          icon: "error",
          title: "Permission Denied",
          text: "Only teachers can add new payment.",
          confirmButtonColor: "#FEAF00",
        });
      }
    });
  }
  // Update Payment
  if (paymentsListBody) {
    paymentsListBody.addEventListener("click", function (event) {
      if (event.target.classList.contains("edit-payment-btn")) {
        const billNumber = event.target.getAttribute("data-bill");
        if (!billNumber) return;

        let allPayments = getPaymentsFromStorage();
        let paymentToUpdate = allPayments.find((p) => p.bill === billNumber);

        if (paymentToUpdate) {
          let currentTotalAmount =
            paymentToUpdate.paid + paymentToUpdate.balance;

          let allCourses = getCoursesFromStorage();
          let courseOptionsHTML =
            '<option value="" disabled>Select Course</option>';
          allCourses.forEach((course) => {
            const isSelected =
              course.title === paymentToUpdate.course ? "selected" : "";
            courseOptionsHTML += `<option value="${course.title}" ${isSelected}>${course.title}</option>`;
          });

          Swal.fire({
            title: "Update Payment Record",
            html: `
              <input id="swal-studentName" class="swal2-input" placeholder="Student Name" value="${paymentToUpdate.name}">
              
              <select id="swal-course" class="swal2-select">${courseOptionsHTML}</select>
              
              <input id="swal-totalAmount" class="swal2-input" placeholder="Total Course Fee" type="number" value="${currentTotalAmount}">
              <input id="swal-amountPaid" class="swal2-input" placeholder="Amount Paid" type="number" value="${paymentToUpdate.paid}">
              <p class="swal2-note text-muted small mt-2">Order Number: ${paymentToUpdate.bill} (Cannot be changed)</p>
            `,
            confirmButtonText: "Save Changes",
            confirmButtonColor: "#FEAF00",
            focusConfirm: false,
            preConfirm: () => {
              // get new data
              const newName = document.getElementById("swal-studentName").value;
              const newCourse = document.getElementById("swal-course").value;
              const newTotalAmount = parseFloat(
                document.getElementById("swal-totalAmount").value
              );
              const newAmountPaid = parseFloat(
                document.getElementById("swal-amountPaid").value
              );

              if (
                !newName ||
                !newCourse ||
                isNaN(newTotalAmount) ||
                isNaN(newAmountPaid)
              ) {
                Swal.showValidationMessage(
                  "Please fill out all fields correctly."
                );
                return false;
              }

              // calc new balance
              const newBalance = newTotalAmount - newAmountPaid;

              return {
                name: newName,
                course: newCourse,
                paid: newAmountPaid,
                balance: newBalance,
              };
            },
          }).then((result) => {
            //if update done
            if (result.isConfirmed) {
              let updatedData = result.value;

              // update arr
              let paymentIndex = allPayments.findIndex(
                (p) => p.bill === billNumber
              );
              if (paymentIndex !== -1) {
                allPayments[paymentIndex].name = updatedData.name;
                allPayments[paymentIndex].course = updatedData.course;
                allPayments[paymentIndex].paid = updatedData.paid;
                allPayments[paymentIndex].balance = updatedData.balance;
              }

              savePaymentsToStorage(allPayments);
              displayPayments();

              updateDashboardCards();

              Swal.fire(
                "Updated!",
                "Payment record has been updated.",
                "success"
              );
            }
          });
        }
      }
    });
  }
  // add New Course Btn
  if (addNewCourseBtn) {
    addNewCourseBtn.addEventListener("click", function () {
      if (currentUserRole === "teacher") {
        const categories = [
          "Design",
          "Programming",
          "Data Analysis",
          "Frontend Development",
          "Letter Writing",
          "Information Technology",
        ];

        let categoryOptionsHTML =
          '<option value="" disabled selected>Select Category</option>';
        categories.forEach((category) => {
          categoryOptionsHTML += `<option value="${category}">${category}</option>`;
        });

        Swal.fire({
          title: "Add New Course",
          html:
            '<input id="swal-title" class="swal2-input" placeholder="Course Title">' +
            '<input id="swal-duration" class="swal2-input" placeholder="Duration (e.g., 2hrs 30mins)">' +
            '<input id="swal-lessons" class="swal2-input" placeholder="Number of Lessons" type="number">' +
            '<input id="swal-description" class="swal2-input" placeholder="Description">' +
            '<input id="swal-instructor" class="swal2-input" placeholder="Instructor Name">' +
            `<select id="swal-category" class="swal2-select">${categoryOptionsHTML}</select>`,

          confirmButtonText: "Add Course",
          confirmButtonColor: "#FEAF00",
          focusConfirm: false,
          preConfirm: () => {
            const title = document.getElementById("swal-title").value;
            const duration = document.getElementById("swal-duration").value;
            const lessons = parseInt(
              document.getElementById("swal-lessons").value
            );
            const description =
              document.getElementById("swal-description").value;
            const instructor = document.getElementById("swal-instructor").value;
            const category = document.getElementById("swal-category").value;

            if (
              !title ||
              !duration ||
              !lessons ||
              !description ||
              !category ||
              !instructor
            ) {
              Swal.showValidationMessage("Please fill out all fields");
              return false;
            }

            return {
              title,
              duration,
              lessons,
              description,
              instructor,
              category,
            };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            let newCourse = result.value;

            allCoursesData.push(newCourse);

            saveCoursesToStorage(allCoursesData);

            displayCourses("all", 1);

            updateDashboardCards();

            Swal.fire("Added!", "New course has been added.", "success");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Permission Denied",
          text: "Only teachers are allowed to add new courses.",
          confirmButtonColor: "#FEAF00",
        });
      }
    });
  }
  // course category navigation clicks
  courseNavLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      courseNavLinks.forEach((navLink) => navLink.classList.remove("active"));
      this.classList.add("active");
      document.getElementById("courses-heading").textContent = this.textContent;
      displayCourses(this.getAttribute("data-category"), 1); // display category page 1 *
    });
  });

  //pagination clicks
  if (paginationContainer) {
    paginationContainer.addEventListener("click", function (event) {
      event.preventDefault();
      // check if a page link was clicked
      if (event.target.classList.contains("page-link")) {
        let page = parseInt(event.target.getAttribute("data-page"));
        // get current active category
        let activeCategoryLink = document.querySelector(
          ".courses-nav .nav-link.active"
        );
        let category = activeCategoryLink.getAttribute("data-category");
        // display courses for clicked page and current category
        if (page) {
          displayCourses(category, page);
        }
      }
    });
  }

  // sidebar navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      // get data target section ID
      let targetId = this.getAttribute("data-target");
      let targetSection = document.getElementById(targetId);
      // update active link style
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      this.classList.add("active");
      // hide all sections
      contentSections.forEach((section) => section.classList.add("hidden"));
      // Show section and call
      if (targetSection) {
        targetSection.classList.remove("hidden");
        if (targetId === "students-section") displayStudents();
        if (targetId === "course-section") displayCourses("all", 1); // Reset to page 1
        if (targetId === "my-courses-section") displayMyCourses();
        if (targetId === "payment-section") displayPayments();
      }
    });
  });
  // go to noti settings
  if (goToNotificationsLink && settingsSection && notificationSettingsSection) {
    goToNotificationsLink.addEventListener("click", (e) => {
      e.preventDefault();
      settingsSection.classList.add("hidden");
      notificationSettingsSection.classList.remove("hidden");
    });
  }

  // go back to main settings
  if (backToSettingsBtn && settingsSection && notificationSettingsSection) {
    backToSettingsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      notificationSettingsSection.classList.add("hidden");
      settingsSection.classList.remove("hidden");
    });
  }

  // go to acc settings
  if (accountSettingsLink && settingsSection && accountSettingsSection) {
    accountSettingsLink.addEventListener("click", (e) => {
      e.preventDefault();

      const currentUser = getCurrentUser();
      if (currentUser) {
        document.getElementById("account-settings-image").src =
          currentUser.profilePicture;
        document.getElementById(
          "account-settings-username"
        ).textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById("account-settings-email-display").textContent =
          currentUser.email;
        document.getElementById(
          "account-fullname"
        ).value = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById("account-email").value = currentUser.email;
        document.getElementById("account-password").value = "";
      }

      settingsSection.classList.add("hidden");
      accountSettingsSection.classList.remove("hidden");
    });
  }
  if (backToSettingsBtnFromAccount) {
    backToSettingsBtnFromAccount.addEventListener("click", (e) => {
      e.preventDefault();
      if (settingsSection && accountSettingsSection) {
        accountSettingsSection.classList.add("hidden");
        settingsSection.classList.remove("hidden");
      }
    });
  }
  if (cancelAccountChangesBtn) {
    cancelAccountChangesBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (settingsSection && accountSettingsSection) {
        accountSettingsSection.classList.add("hidden");
        settingsSection.classList.remove("hidden");
      }
    });
  }

  // save Account settings
  if (saveAccountChangesBtn) {
    saveAccountChangesBtn.addEventListener("click", async () => {
      //get new values from the form
      const newFullName = document.getElementById("account-fullname").value;
      const newEmail = document.getElementById("account-email").value.trim();
      const newPassword = document.getElementById("account-password").value;
      //ask for current password
      const { value: currentPassword } = await Swal.fire({
        title: "Confirm Changes",
        input: "password",
        inputLabel: "Please enter your current password to save changes",
        inputPlaceholder: "Enter your current password",
        inputAttributes: { autocapitalize: "off", autocorrect: "off" },
        confirmButtonText: "Confirm",
        confirmButtonColor: "#FEAF00",
        showCancelButton: true,
      });
      if (currentPassword) {
        //verify password
        const currentUser = getCurrentUser();
        if (currentUser.password !== currentPassword) {
          Swal.fire(
            "Error",
            "Incorrect password. Changes were not saved.",
            "error"
          );
          return;
        }
        //password correct
        let allUsers = getUsersFromStorage();
        const userIndex = allUsers.findIndex(
          (user) => user.email === currentUser.email
        );
        if (userIndex === -1) {
          Swal.fire("Error", "Could not find user data.", "error");
          return;
        }

        //check if new email is taken
        const emailChanged = newEmail !== currentUser.email;
        if (
          emailChanged &&
          allUsers.some(
            (user, index) => index !== userIndex && user.email === newEmail
          )
        ) {
          Swal.fire(
            "Error",
            "The new email address is already in use.",
            "error"
          );
          return;
        }

        //update user data
        const [newFirstName, ...newLastNameParts] = newFullName.split(" ");
        allUsers[userIndex].firstName = newFirstName;
        allUsers[userIndex].lastName = newLastNameParts.join(" ") || "";
        allUsers[userIndex].email = newEmail;
        if (newPassword) {
          allUsers[userIndex].password = newPassword;
        }
        // save
        saveUsersToStorage(allUsers);

        //update login key if email changed
        if (emailChanged) {
          if (localStorage.getItem("loggedInUser")) {
            localStorage.setItem("loggedInUser", JSON.stringify(newEmail));
          }
          if (sessionStorage.getItem("loggedInUser")) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(newEmail));
          }
        }

        Swal.fire("Success!", "Account settings updated.", "success");
        populateUserData();
        // go back to main settings page
        if (settingsSection && accountSettingsSection) {
          accountSettingsSection.classList.add("hidden");
          settingsSection.classList.remove("hidden");
        }
      }
    });
  }

  // photo update
  if (updatePhotoOverlay && hiddenFileInput && userImageEl) {
    updatePhotoOverlay.addEventListener("click", () => {
      hiddenFileInput.click();
    });
    hiddenFileInput.addEventListener("change", function (event) {
      let file = event.target.files[0];
      if (!file) return;
      let reader = new FileReader();
      reader.onload = () => {
        let newProfilePictureBase64 = reader.result;
        let loggedInEmail = JSON.parse(
          localStorage.getItem("loggedInUser") ||
            sessionStorage.getItem("loggedInUser")
        );
        let allUsers = getUsersFromStorage();
        let userIndex = allUsers.findIndex(
          (user) => user.email === loggedInEmail
        );
        if (userIndex !== -1) {
          allUsers[userIndex].profilePicture = newProfilePictureBase64;
          saveUsersToStorage(allUsers);
          userImageEl.src = newProfilePictureBase64;
          // also update settings page image if visible
          const settingsImageEl = document.getElementById(
            "settings-user-image"
          );
          if (settingsImageEl) settingsImageEl.src = newProfilePictureBase64;
          Swal.fire(
            "Success!",
            "Your profile picture has been updated.",
            "success"
          );
        } else {
          Swal.fire("Error", "Could not find user data to update.", "error");
        }
      };
      reader.onerror = () => {
        Swal.fire("Error", "Failed to read the selected image file.", "error");
      };
      reader.readAsDataURL(file);
    });
  }

  // edit Profile btn
  if (editProfileBtn && editProfileImageInput) {
    editProfileBtn.addEventListener("click", async () => {
      let currentUser = getCurrentUser();
      if (!currentUser) {
        Swal.fire("Error", "User data not found.", "error");
        return;
      }
      let currentProfilePicture = currentUser.profilePicture;
      let newProfilePictureBase64 = currentProfilePicture;

      const { value: formValues } = await Swal.fire({
        title: "Edit Profile",
        html: `
          <div class="d-flex flex-column align-items-center mb-3">
            <img id="swal-profile-img-preview" src="${currentProfilePicture}" class="img-sidebar img-fluid object-fit-cover rounded-circle mb-2" style="width: 128px; height: 128px;" alt="Profile Preview">
            <button type="button" id="changeProfilePicBtn" class="btn btn-sm btn-outline-secondary mt-2">Change Photo</button>
          </div>
          <input id="swal-first-name" class="swal2-input" placeholder="First Name" value="${currentUser.firstName}">
          <input id="swal-last-name" class="swal2-input" placeholder="Last Name" value="${currentUser.lastName}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Save Changes",
        confirmButtonColor: "#FEAF00",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const firstName = document.getElementById("swal-first-name").value;
          const lastName = document.getElementById("swal-last-name").value;
          if (!firstName || !lastName) {
            Swal.showValidationMessage(
              "Please enter both first and last name."
            );
            return false;
          }
          return {
            firstName,
            lastName,
            profilePicture: newProfilePictureBase64,
          };
        },
        didOpen: () => {
          const changePicBtn = document.getElementById("changeProfilePicBtn");
          const imgPreview = document.getElementById(
            "swal-profile-img-preview"
          );
          changePicBtn.addEventListener("click", () => {
            editProfileImageInput.click();
          });
          editProfileImageInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                newProfilePictureBase64 = e.target.result;
                imgPreview.src = newProfilePictureBase64;
              };
              reader.readAsDataURL(file);
            }
          };
        },
        willClose: () => {
          editProfileImageInput.value = "";
        },
      });

      if (formValues) {
        let allUsers = getUsersFromStorage();
        const userIndex = allUsers.findIndex(
          (user) => user.email === currentUser.email
        );
        if (userIndex !== -1) {
          allUsers[userIndex].firstName = formValues.firstName;
          allUsers[userIndex].lastName = formValues.lastName;
          allUsers[userIndex].profilePicture = formValues.profilePicture;
          saveUsersToStorage(allUsers);
          Swal.fire("Success!", "Your profile has been updated.", "success");
          populateUserData();
        } else {
          Swal.fire("Error", "Could not find user data to update.", "error");
        }
      }
    });
  }
  populateUserData();
  updateDashboardCards();
});
