const fs = require('fs');
const express = require('express');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const app = express();
const port = 3000;
const router = express.Router();

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
    var className=[];
    var result =[];
    //console.log(obj);

    for (var i = 0; i<obj.length; i++){
        result[i] = JSON.parse(`{"subject": "${obj[i].subject}","className": ""}`);
        result[i].className = obj[i].className;
        console.log (result[i]);
    }

    res.send(result);

/*const key = "subject";
const value= "86094"; 
const result = data.filter(d=>d[key]==value);

console.log(result);*/
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

router.get('/:subject_id', (req, res) => {
    const subjectId = req.params.subject_id
    const courseCodes = []
    var obj = JSON.parse(fs.readFileSync('Lab3-timetable-data.json', 'utf8'));

    obj.forEach((codes) => {
        if (codes.subject.toString().toLowerCase() === subjectId.toString().toLowerCase()) {
            courseCodes.push(`{"catalog_nbr": "${codes.catalog_nbr}"}`);
            //courseCodes.push(codes.catalog_nbr.toString())
        } 
        console.log(courseCodes);
    })
    if(courseCodes.length === 0){
        res.status(404).send(`The Subject ${subjectId} does not exist!`);
    }else{
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

    obj.forEach((timetable)=> {
        
        var subject = timetable.subject.toString();
        var courseCode = timetable.catalog_nbr.toString();

        if (subjectId==subject && course == courseCode && typeof component != "") {
            //res.send(entry.course_info)
            //array.push(timetable.course_info.toString())
        }

        else if (subjectId==subject && course == courseCode && component == "") {
            array.push(JSON.stringify(timetable.course_info))
            //res.send(JSON.stringify(timetable.course_info));

        }         
         
        else {
            res.status(404).send(`No courses were found with subject ${subjectId} and course ${course}`);
        }

    });
    console.log(array);
});

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

