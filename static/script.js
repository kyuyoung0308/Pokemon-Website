async function addSchedule() {
    var newSchedule = document.getElementById('add');
    if (newSchedule.value !== "") {
        //fetching the API to make a post request with a body in order to update the timetable json
        fetch('/api/question4/new/' + newSchedule.value, {
            method: 'PUT'
        })
            .then(res => {
                if (!res.ok) {
                    alert("That already exists!")
                }
            })
    }
}