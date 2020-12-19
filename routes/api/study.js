var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Study = require('../../entities/study');
var DTOFactory = require('../../dto/dtofactory');
/**
 * Get study by id
 * @route GET /api/study/{:id}
 * @param {String} id the id of a study
 * @group API/Study - All API operations about study
 * @returns {object} 200 - An array of studies info
 * @returns {String} 500  Error message
 */

router.get('/:id',function(req,res){
   if(!req.params.id){
      res.status(400);
      res.send("Invalid id of study");
  }
  Study.findStudyById(req.params.id)
  .then(rs => {
     if(!rs){
      res.status(200);
      res.json({});
     }
     else{
      res.status(200);
      res.json(rs);
     }
     
  })
  .catch(err =>{
      res.status(500);
      res.send("Error: " + err.message);
  });
});

/**
 * Get the list of currently available public studies
 * @route GET /api/study/
 * @group API/Study - All API operations about study
 * @returns {Array} 200 - An array of studies info
 * @returns {String} 500  Error message
 */
router.get('/',function(req,res){
   Study.find({
      $and:[
         {isConfirmed:true},
         { isPublic:true},
          {$or: [{earliestBeginOfDataGathering:{ $gte: Date.now().toString()}}, {latestBeginOfDataGathering: { $gte: Date.now().toString()}}]}
      ]
   })
   .then(rs=>{
      //res.status(200).json(rs);
      if(!rs){
         var emptyArray = new Array();
         res.status(200).json(emptyArray);
      }else{
         var studyDtos = new Array();
         parseToDtoList(rs,studyDtos)
         .then(rs =>{
            res.status(200).json(studyDtos);
         })
         .catch(err=>{
            res.status(500).send("Error when retreiving studies: "  + err.message);
         })
      }
      
      
   })
   .catch(err=>{
      res.status(500).send("Error when retreiving studies: "  + err.message);
      });
});

function parseToDtoList(listStudy, listDto){
   var listPromises = new Array();
   listStudy.forEach(function(element){
      listPromises.push(new Promise(function(resolve,reject){
         var studyDto = DTOFactory.toStudyDto(element._id,
            element.name,
            element.description,
            element.earliestBeginOfDataGathering,
            element.latestBeginOfDataGathering,
            element.minimumStudyDurationPerPerson,
            element.maximumStudyDurationPerPerson);
            listDto.push(studyDto);
            resolve();
      }));
   });
   return Promise.all(listPromises);
}
module.exports = router;