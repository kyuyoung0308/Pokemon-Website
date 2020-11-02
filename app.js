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
router.get('/subjects', (req, res) => {

    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));
    //var subjects=[];
    var className = [];
    var result = [];
    //console.log(obj);

    for (var i = 0; i < obj.length; i++) {
        result[i] = JSON.parse(`{"subject": "${obj[i].subject}","className": ""}`);
        result[i].className = obj[i].className;
        console.log(result[i]);
    }

    res.send(result);

});

//Question 2
/*app.get('/:subjectId', (req, res) => {
    const subjectId = req.params.subject_id
    var courseCodes = []
    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));

    for(var i = 0; i<obj.length; i++){
        if(obj[i].subject === subjectId){
            courseCodes[i].catalog_nbr = obj[i].catalog_nbr;
        }
        console.log (courseCodes)
    }
    
res.send(courseCodes);
})*/

router.get('/:subjectId', (req, res) => {
    const subjectId = req.params.subjectId
    const courseCodes = []
    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));

    obj.forEach((codes) => {
        if (codes.subject.toString().toLowerCase() === subjectId.toString().toLowerCase()) {
            courseCodes.push(`{"catalog_nbr": "${codes.catalog_nbr}"}`);
            //courseCodes.push(codes.catalog_nbr.toString())
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

router.get('/:subjectId/:course/:component?', (req, res) => {

    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));

    const array = []
    var subjectId = req.params.subjectId
    var course = req.params.course
    var component = req.params.component

    obj.forEach((timetable) => {
        var subject = timetable.subject;
        var courseCode = timetable.catalog_nbr;
        var info = JSON.stringify(timetable.course_info);

        if (subjectId === subject && course === courseCode && typeof component === "undefined") {
            var result = JSON.stringify(timetable.course_info);
            console.log(result);
            res.send(result);
        }
        else if (subjectId === subject && course === courseCode && typeof component !== "undefined") {
            var comp = info.ssr_component;

            if (component === detail) {
                var result2 = JSON.stringify(detail);
                console.log(result2);
            }
        }
        console.log(info.length);

    })
})

//Question 4
app.put('/new/:schedule', (req, res) => {

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
    }
    res.send(sche);

});

//Question 5 Save a list of subject code, course code pairs under a given schedule name. 
//Return an error if the schedule name does not exist. Replace existing subject-code + course-code pairs 
//with new values and create new pairs if it doesn’t exist.
router.put('/newcourse/:schedule', (req, res) => {

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
app.get('/courselist/:schedule', (req, res) => {
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
router.delete('/deleteschedule/:schedule', (req, res) => {
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
            if (schedule === s.scheduleName) {
                sche.splice(i, 1);
                res.send(sche);
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

//Question 9 Delete all schedules.

//const key = "subject";
//const value = "86094";
//var result = obj.filter(d => d[subjectId] == course);

/*obj.forEach((timetable)=> {
    
    var subject = timetable.subject;
    var courseCode = timetable.catalog_nbr;

    if (subjectId==subject && course == courseCode) {
        //res.send(entry.course_info)
        //array.push(timetable.course_info.toString())
        //array.push(JSON.parse(timetable.course_info))
        //res.send(JSON.stringify(timetable.course_info));
        console.log(array);
    }       
     
    else {
        res.status(404).send(`No courses were found with subject ${subjectId} and course ${course}`);
    }

});
console.log(array);*/


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
/*const parts = [
    {id: 100, name: 'belt', color: 'brown', stock:0},
    {id: 101, name: 'clip', color: 'red', stock:0},
    {id: 102, name: 'hat', color: 'blue', stock:0}
];



//setup middleware to do logging
app.use((req, res, next) => {//for all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); //keep going
});

//parse data in body as JSON
router.use(express.json());

router.route('/')//all the routes to the base prefix
    //get a list of parts
    .get((req,res)=>{
        res.send(parts);
    });

//get detail for parts
router.get('/:part_id', (req,res) =>{
    const id = req.params.part_id;
    const part = parts.find(p => p.id === parseInt(id));
    if (part){
        res.send(part);
    }else{
        res.status(404).send(`part ${id} was not found`);
    }
});

//create/replace part data for a given id
router.put('/:id', (req, res)=>{
    const newpart = req.body;
    console.log("part: ", newpart);
    //add new id field
    newpart.id = parseInt(req.params.id);

    //replace the part with the new one
    const part = parts.findIndex(p => p.id === newpart.id);
    if (part < 0){//not found
        console.log('creating new part');
        parts.push(req.body);
    }else{
        console.log('modifying part', req.params.id);
        parts[part] = req.body;
    }
      res.send(newpart);
});

//update stock level
router.post('/:id', (req, res)=>{
    const newpart = req.body;
    console.log("part: ", newpart);
    //find the part
    const part = parts.findIndex(p => p.id === parseInt(req.params.id));

    if (part < 0){//not found
        res.status(404).send(`part ${req.params.id} not found`);
    }else{
        console.log('changing stock for ', req.params.id);
        parts[part].stock += parseInt(req.body.stock);// stock properet must exist
        res.send(req.body);
    }
});

*/

