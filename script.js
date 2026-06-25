window.onload = function(){

    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 1500);

};
let subjects = [];
let chart;

// Page Navigation
function showPage(pageNumber){

    document.querySelectorAll(".page").forEach(page => {

        page.style.opacity = "0";
        page.style.transform = "translateY(20px)";

        setTimeout(() => {
            page.classList.remove("active");
        }, 200);

    });

    let nextPage = document.getElementById("page" + pageNumber);

    setTimeout(() => {
        nextPage.classList.add("active");
        nextPage.style.opacity = "1";
        nextPage.style.transform = "translateY(0)";
    }, 250);

}


// Add Subject
function addSubject(){

    let subject =
        document.getElementById("subject").value;

    let examDate =
        document.getElementById("examDate").value;

    let chapters =
        parseInt(
            document.getElementById("chapters").value
        );

    let difficulty =
        document.getElementById("difficulty").value;

    if(
        subject === "" ||
        examDate === "" ||
        isNaN(chapters)
    ){
        alert("Please fill all fields.");
        return;
    }

    subjects.push({
        subject,
        examDate,
        chapters,
        difficulty
    });

    let row = `
        <tr>
            <td>${subject}</td>
            <td>${examDate}</td>
            <td>${chapters}</td>
        </tr>
    `;

    document
        .getElementById("subjectTable")
        .innerHTML += row;

    // Clear inputs

    document.getElementById("subject").value = "";
    document.getElementById("examDate").value = "";
    document.getElementById("chapters").value = "";

}


// Generate Study Plan
function generatePlan(){

    if(subjects.length === 0){
        alert("Add at least one subject.");
        return;
    }

    let resultHTML = "";

    let totalHours = 0;

    let nearestExam = "";
    let nearestDays = 9999;

    let chartLabels = [];
    let chartData = [];

    let today = new Date();

    subjects.forEach(item => {

        let exam =
            new Date(item.examDate);

        let diff =
            exam - today;

        let daysLeft =
            Math.ceil(
                diff /
                (1000 * 60 * 60 * 24)
            );

        if(daysLeft < 1){
            daysLeft = 1;
        }

        let chaptersPerDay =
            (
                item.chapters /
                daysLeft
            ).toFixed(2);

        let hours;

        if(item.difficulty === "Hard")
            hours = 3;

        else if(item.difficulty === "Medium")
            hours = 1.5;

        else
            hours = 1;

        totalHours += hours;

        let priority;

        if(daysLeft < 7)
            priority = "🔴 High";

        else if(daysLeft <= 14)
            priority = "🟠 Medium";

        else
            priority = "🟢 Low";

        if(daysLeft < nearestDays){
            nearestDays = daysLeft;
            nearestExam = item.subject;
        }

        resultHTML += `
            <tr>
                <td>${item.subject}</td>
                <td>${daysLeft}</td>
                <td>${chaptersPerDay}</td>
                <td>${hours}</td>
                <td>${priority}</td>
            </tr>
        `;

        chartLabels.push(item.subject);
        chartData.push(daysLeft);

    });

    document
        .getElementById("resultTable")
        .innerHTML = resultHTML;

    let workload;

    if(totalHours <= 3)
        workload = "✅ Light Workload";

    else if(totalHours <= 6)
        workload = "⚠ Moderate Workload";

    else
        workload = "🔥 Heavy Workload";

    document
        .getElementById("summary")
        .innerHTML = `

        <h3>📚 Study Summary</h3>

        <p>
        Subjects Added:
        <strong>${subjects.length}</strong>
        </p>

        <p>
        Nearest Exam:
        <strong>${nearestExam}</strong>
        </p>

        <p>
        Days Remaining:
        <strong>${nearestDays}</strong>
        </p>

        <p>
        Total Daily Study Time:
        <strong>${totalHours} Hours</strong>
        </p>

        <p>
        ${workload}
        </p>
        `;

    // Chart

    if(chart){
        chart.destroy();
    }

    chart = new Chart(

        document.getElementById("studyChart"),

        {
            type: "bar",

            data: {

                labels: chartLabels,

                datasets: [

                    {
                        label:
                        "Days Remaining",

                        data: chartData
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        labels: {
                            color: "white"
                        }

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            color: "white"
                        }

                    },

                    x: {

                        ticks: {
                            color: "white"
                        }

                    }

                }

            }

        }

    );

    showPage(3);

}