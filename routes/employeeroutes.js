var sequelize=require('../orm/connection');
const passport=require('passport')
var express=require("express")
var route = express.Router();
var model=require('../orm/model/skillmap')

route.get("/:employeeid",async function(request,response){
try{
   const employees = await empoyeemodel.employee.findOne({where:{employee_id:request.params.employeeid }})
   let result = employees.dataValues
   
   if(result!=null) 
      {
         response.json(
            {
               name:result.name
            }
         )
      }
      else
           response.status(401).send("Failed")
}
catch(e)
{
   console.log(e)
        response.status(500)
}

})



route.post("/manager/:name",async function(request,response){
//route.post("/manager/:name",passport.authenticate('jwt',{session:false}),async function(request,response){
   try{
      const employees = await model.skillmap.findAll({
         group: ['employee_id'],
         attributes: ['employee_id'],
         include: [{
            model: model.employee,
            attributes: ['name', 'experience','manager'],
            required: true,
            where:{manager:request.params.name,lockstatus:'not_requested'}
           }
           ,{
              model:model.skill,
              attributes: [[sequelize.fn('GROUP_CONCAT', sequelize.col('skill.name')), 'skills']],
              require:true
           }
         ]
      })
      let managers=[];
      employees.map(employee => {
         let manager={
            EmployeeId:employee.dataValues.employee_id,
            Name:employee.dataValues.employee.name,
            Skills:employee.dataValues.skill.dataValues.skills,
            Experience:employee.dataValues.employee.experience,
            Manager:employee.dataValues.employee.manager
         }
         managers.push(manager)
      });
      if(managers.length>0) 
      {
         response.json(managers)
      }
      else
         response.status(401).send("Failed")
   }
   catch(e)
   {
      console.log(e)
           response.status(500)
   }
   
   })

module.exports=  route