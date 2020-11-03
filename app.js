const fs = require('fs');
const express = require('express');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const app = express();
const port = 3000;
const router = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//setup serving front end code
app.use('/', express.static('static'));


app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
})

//install the router at /api/parts
app.use('/api', router)

//Question 1
router.get('/question1/subjects', (req, res) => {

    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));

    var className = [];
    var result = [];

    for (var i = 0; i < obj.length; i++) {
        result[i] = JSON.parse(`{"subject": "${obj[i].subject}","className": ""}`);
        result[i].className = obj[i].className;
        console.log(result[i]);
    }

    res.send(result);

});

//Question 2
router.get('/question2/:subjectId', (req, res) => {
    const subjectId = req.params.subjectId
    const courseCodes = []
    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));

    obj.forEach((codes) => {
        if (codes.subject.toString().toLowerCase() === subjectId.toString().toLowerCase()) {
            courseCodes.push(`{"catalog_nbr": "${codes.catalog_nbr}"}`);
        }
        console.log(courseCodes);
    })
    if (courseCodes.length === 0) {
        res.status(404).send(`The Subject ${subjectId} does not exist!`);
    } else {
        res.send(courseCodes);
    }
});

//Question 3

router.get('/question3/:subjectId/:course/:component?', (req, res) => {

    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));

    var array = [];
    var subjectId = req.params.subjectId;
    var course = req.params.course;
    var component = req.params.component;

    obj.forEach((timetable) => {
        var subject = timetable.subject;
        var courseCode = timetable.catalog_nbr;
        var info = timetable;

        if (subjectId === subject && course === courseCode && typeof component === "undefined") {
            array.push(info);
        }
        else if (subjectId === subject && course === courseCode && typeof component !== "undefined") {
            array.push(info);
        }
    })
    res.send(array);
})

//Question 4
router.put('/question4/new/:schedule', (req, res) => {

    const s = req.params.schedule;

    var exist = false;

    var sche = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));

    sche.forEach((element) => {
        if (element.scheduleName === s) {
            exist = true;
        }
    });

    if (exist) {
        res.status(403).send("The specified timetable already exists");
    } else {
        var newSche = JSON.parse(`{"scheduleName": "", "courses":[]}`);
        newSche.scheduleName = s;
        sche.push(newSche);
        var jsonString = JSON.stringify(sche)

        fs.writeFileSync('schedule.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
        res.send(sche);
    }
    

});

//Question 5 Save a list of subject code, course code pairs under a given schedule name. 
//Return an error if the schedule name does not exist. Replace existing subject-code + course-code pairs 
//with new values and create new pairs if it doesn’t exist.
router.put('/question5/newcourse/:schedule', (req, res) => {

    const keyPairs = req.body;
    const s = req.params.schedule;

    var exist = false;

    var sche = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));

    sche.forEach((element) => {
        if (element.scheduleName === s) {
            exist = true;
        }
    });

    if (!exist) {
        res.status(403).send("The specified timetable does not exist exist");
    } else {

        sche.forEach((element) => {
            if (element.scheduleName === s) {
                element.courses = keyPairs;
            }
        })

        var jsonString = JSON.stringify(sche)

        fs.writeFileSync('schedule.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    }

    res.send(sche);

});

//Question 6 Get the list of subject code, course code pairs for a given schedule.
router.get('/question6/courselist/:schedule', (req, res) => {
    console.log("HIO");
    var schedule = req.params.schedule;
    var sche = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
    var err = true;

    sche.forEach((s) => {
        console.log("HELLO");
        if (schedule === s.scheduleName) {
            res.send(s.courses);
            err = false;
        }
    });
    if (err) {
        res.status(403).send("The specified schedule does not exist");
    }
});

//Question 7 Delete a schedule with a given name. Return an error if the given schedule doesn’t exist
router.delete('/question7/deleteschedule/:schedule', (req, res) => {
    const s = req.params.schedule;
    var exist = false;

    var sche = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));

    sche.forEach((element) => {
        if (element.scheduleName === s) {
            exist = true;
        }
    });

    if (!exist) {
        res.status(403).send("The specified timetable does not exist exist");
    } else {
        for (var i = 0; i < sche.length; i++) {
            if (s == sche[i].scheduleName) {
                sche.splice(i, 1);
            }
        }
        var jsonString = JSON.stringify(sche)

        fs.writeFileSync('schedule.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    }
    res.send(sche);

});

//Question 8 Get a list of schedule names and the number of courses that are saved in each schedule.
router.get('/question8/allschedules/list', (req, res) => {

    var sche = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
    var lists = [];
    sche.forEach((element) => {
        var pair = JSON.parse(`{"scheduleName": "${element.scheduleName}", "numCourses": "${element.courses.length}"}`);

        lists.push(pair);
    });
    res.send(lists);

});
//Question 9 Delete all schedules.
router.delete('/question9/delete/all/schedules', (req, res) => {

    var sche = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
    sche.splice(0, sche.length);

    var jsonString = JSON.stringify(sche)
    fs.writeFileSync('schedule.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
    res.send(sche);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

