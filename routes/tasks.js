var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

//database
var db = mongojs('mongodb://umerumer:umerumer@ds053196.mlab.com:53196/mytasklist_umer', ['tasks']);

//This is for all tasks
router.get('/tasks', function(req, res, next){
    db.tasks.find(function(err, tasks){
        if(err){
            res.send(err);
        }
        res.json(tasks);
    });
});


//This is for one tasks
router.get('/task/:id', function(req, res, next){
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});


//Add a task into the list
router.post('/task', function(req, res, next){
    var task = req.body;
    if(!task.title || !(task.isDone + '')){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    }else{
        db.tasks.save(task, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);

        });
    }
    
});


//This is for delete task from list
router.delete('/task/:id', function(req, res, next){
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});


//This is for update 
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    var updTask = {};

    if(task.isDone){
        updTask.isDone = task.isDone;
    }

    if(task.title){
        updTask.title = task.title;
    }

    if(!updTask){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    }else{
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {} , function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
    }
        
    
});





module.exports = router;