//Question 1
async function viewAllSubjects() {
    fetch('/api/question1/subjects', {
        method: 'GET'
    })
        .then(res => {
            res.json()
                .then(data => {
                    console.log(JSON.stringify(data));
                    const l = document.getElementById('list');

                    const item = document.createElement('li');
                    item.appendChild(document.createTextNode(JSON.stringify(data)));
                    l.appendChild(item);
                })
            if (res.ok) {
                alert("Successfully displayed!");
            }
            else if (!res.ok) {
                alert("Something went wrong check the console!")
            }
        })
}
//Question 2
async function viewCourseCodes() {
    var courses = document.getElementById('q2Subject');
    if (courses.value !== "") {
        fetch('/api/question2/' + courses.value, {
            method: 'GET'
        })
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            console.log("HI");
                            const l = document.getElementById('list');
                            const item = document.createElement('li');
                            item.appendChild(document.createTextNode(JSON.stringify(data)));
                            l.appendChild(item);
                            console.log(JSON.stringify(data));
                            alert("Successfully displayed!");

                        })


                }
                else if (!res.ok) {
                    alert("Something went wrong check the console!")
                }
            })

    } else {
        alert('Please Fill in Components');

    }
}
//Question 3
async function search() {
    var sub = document.getElementById('sub');
    var cc = document.getElementById('cc');
    var comp = document.getElementById('comp');

    if (sub.value !== "" && cc.value !== "" && comp.value !== "") {
        fetch('/api/question3/' + sub.value + '/' + cc.value + '/' + comp.value, {
            method: 'GET'
        })
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            console.log(JSON.stringify(data));
                            const l = document.getElementById('list');
                            const item = document.createElement('li');
                            item.appendChild(document.createTextNode(JSON.stringify(data)));
                            l.appendChild(item);
                            alert("Successfully displayed!");
                        })

                }
                else if (!res.ok) {
                    alert("Something went wrong check the console!")
                }
            })
    }
}
//Question 4
async function addSchedule() {
    var newSchedule = document.getElementById('add');

    if (newSchedule.value !== "") {
        fetch('/api/question4/new/' + newSchedule.value, {
            method: 'PUT'
        })
            .then(res => {
                if (res.ok) {
                    alert("Successfully added " + newSchedule.value + " to the schedule")
                }
                else if (!res.ok) {
                    alert("ERROR: " + res.status + " That does not exist!");
                }
            })
    }
}
//Question 5
async function addCourse() {

    var schedule = document.getElementById('q5Schedule');
    var subject = document.getElementById('q5Subject');
    var course = document.getElementById('q5Course');

    var pair = [{
        "subject": `${subject.value}`,
        "catalog_nbr": `${course.value}`
    }]

    if (schedule.value === "" || subject.value === "" || course.value === "") {
        alert('Please Fill in All Components');
    }
    else {
        fetch('/api/question5/newcourse/' + schedule.value, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(pair)
        })
            .then(res => {
                if (res.ok) {
                    alert("Successfully added " + subject.value + " and " + course.value + " to the schedule: " + schedule.value);
                }
                else if (!res.ok) {
                    alert("ERROR: " + res.status + " That does not exist!");
                }
            })
    }
}
//Question 6 get a specific schedule
async function viewSchedule() {
    var viewSchedule = document.getElementById('view');

    if (viewSchedule.value !== "") {
        fetch('/api/question6/courselist/' + viewSchedule.value, {
            method: 'GET'
        })
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            var s = JSON.stringify(data);
                            const l = document.getElementById('list');
                            const item = document.createElement('li');
                            item.appendChild(document.createTextNode(s));
                            l.appendChild(item);

                            alert("Successfully displayed " + viewSchedule.value);
                            console.log(s);
                        })
                }
                else if (!res.ok) {
                    alert("ERROR: " + res.status + " That schedule does not exist!")
                }
            })
    }
    else { alert('Please Fill in All Components'); }
}
//Question 7 delete one
async function deleteSchedule() {
    var deleteSchedule = document.getElementById('delete');
    fetch('/api/question7/deleteschedule/' + deleteSchedule.value, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert("Successfully deleted the schedule named: " + deleteSchedule.value);
            }

            else if (!res.ok) {
                alert("ERROR: " + res.status + " That schedule does not exist!");
            }
        })
}
//Question 8: View all
async function viewAll() {
    fetch('/api/question8/allschedules/list', {
        method: 'GET'
    })
        .then(res => {
            if (res.ok) {
                res.json()
                    .then(data => {
                        console.log(JSON.stringify(data));

                        const l = document.getElementById('list');
                        const item = document.createElement('li');
                        item.appendChild(document.createTextNode(JSON.stringify(data)));
                        l.appendChild(item);

                        alert("Successfully displayed!");
                    })

            }
            else if (!res.ok) {
                alert("Something went wrong check the console!")
            }
        })
}
//Question 9
async function deleteAll() {
    fetch('/api/question9/delete/all/schedules', {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert("Successfully deleted all schedules")
            }
            else if (!res.ok) {
                alert("Something went wrong check the console!")
            }
        })
}
