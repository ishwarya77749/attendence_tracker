// Student Database (Sample Data)
const students = {
    "105": {
        name: "Bashitha",
        present: [22, 20, 25, 24, 21, 23],
        total: [26, 26, 28, 28, 26, 26]
    },

    "103": {
        name: "ishu",
        present: [18, 19, 20, 22, 21, 20],
        total: [26, 26, 28, 28, 26, 26]
    }
};


// =========================
// LOGIN FUNCTION
// =========================
async function login() {

    const regno = document
        .getElementById("regno")
        .value
        .trim();

    console.log("Register Number:", regno);

    if (regno === "") {
        alert("Please enter register number");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/students/${regno}`
        );

        const data = await response.json();

        console.log("Data received:", data);

        if (!response.ok) {
            alert(data.message || "Student not found");
            return;
        }

        // Save student information
        localStorage.setItem("regno", regno);
        localStorage.setItem("student", JSON.stringify(data));

        // Open dashboard
        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Login Error:", error);

        alert("Cannot connect to server");
    }
}


// =========================
// LOGOUT FUNCTION
// =========================
function logout() {

    localStorage.removeItem("regno");
    localStorage.removeItem("student");

    window.location.href = "index.html";
}


// =========================
// DASHBOARD LOAD
// =========================
if (window.location.pathname.includes("dashboard.html")) {

    const reg = localStorage.getItem("regno");

    console.log("Register Number from localStorage:", reg);

    if (!reg) {

        window.location.href = "index.html";

    } else {

        fetch(`http://localhost:5000/students/${reg}`)

            .then(response => {

                if (!response.ok) {
                    throw new Error("Student not found");
                }

                return response.json();
            })

            .then(student => {

                console.log(
                    "Student data from MongoDB:",
                    student
                );


                // =========================
                // STUDENT DETAILS
                // =========================

                document.getElementById("studentName").innerHTML =
                    student.name || "";

                document.getElementById("studentReg").innerHTML =
                    student.registerNumber || "";


                // =========================
                // ATTENDANCE DATA
                // =========================

                let present = student.present;
                let total = student.total;


                // Convert strings to arrays if necessary
                if (typeof present === "string") {
                    present = JSON.parse(present);
                }

                if (typeof total === "string") {
                    total = JSON.parse(total);
                }


                console.log("Present:", present);
                console.log("Total:", total);


                // =========================
                // CALCULATE TOTALS
                // =========================

                let totalPresent = present.reduce(
                    (a, b) => a + Number(b),
                    0
                );

                let totalClasses = total.reduce(
                    (a, b) => a + Number(b),
                    0
                );


                // =========================
                // PERCENTAGE
                // =========================

                let percentage =
                    ((totalPresent / totalClasses) * 100)
                    .toFixed(2);


                // =========================
                // DISPLAY ATTENDANCE
                // =========================

                document.getElementById("totalClasses").innerHTML =
                    totalClasses;

                document.getElementById("attendedClasses").innerHTML =
                    totalPresent;

                document.getElementById("percentage").innerHTML =
                    percentage + "%";


                // =========================
                // STATUS
                // =========================

                let status =
                    Number(percentage) >= 75
                        ? "Eligible (Above 75%)"
                        : "Not Eligible (Below 75%)";

                document.getElementById("status").innerHTML =
                    status;


                // =========================
                // CHART
                // =========================

                const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun"
                ];


                const chartElement =
                    document.getElementById("attendanceChart");


                if (chartElement && typeof Chart !== "undefined") {

                    new Chart(chartElement, {

                        type: "bar",

                        data: {

                            labels: months,

                            datasets: [

                                {
                                    label: "Classes Attended",
                                    data: present
                                },

                                {
                                    label: "Total Classes",
                                    data: total
                                }

                            ]
                        }

                    });

                } else {

                    console.log(
                        "Chart.js or attendanceChart not found"
                    );
                }

            })

            .catch(error => {

                console.error(
                    "Dashboard Error:",
                    error
                );

                alert("Cannot load student data");
            });
    }
}