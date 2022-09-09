const express = require('express');
const path = require('path')
const bodyparser = require('body-parser')
const mysql = require('mysql2')
const app = express();

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
const urlencoded = app.use(bodyparser.urlencoded({
    extended:false
}))
const bodyJson = app.use(bodyparser.json())
const connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"password"
})


connection.connect(function(err){
    if(err) throw err;
    else{
        console.log("dbconnected successfully");
    }
  
})
app.get('/',function(req,res){
    
    let sql = "SELECT * FROM todo_new.todo_list1 where completed ='true'";
   
    connection.query(sql,function(err,result,fields){
        if(err) throw err;
        else{
         let sql1 = "SELECT * FROM todo_new.todo_list1 where completed ='completed'";  
         connection.query(sql1,function(err,results){
            if(err) throw err;
            else{
                console.log("------->",result)
                console.log("------->",result.length)
                console.log("from complete api",results)
                console.log("from complete api",results.length)
                let message ="";
                res.render('index',{complete:results,result:result})
            }
        })
           
           
     
        }
    })
    
})

app.post('/',function(req,res){
  const todolist = req.body.addingtask;
  const completedValue ="true";
  if(todolist!="")
  {
 
  let sql = "INSERT INTO `todo_new`.`todo_list1`(`todo_list`,`completed`)VALUES(?,?);"
  connection.query(sql,[todolist,completedValue],function(err,result){
      if(err) throw err;
      else{
          console.log("from insert command",result);
          

      }
  }) 
}
res.redirect('/')
})


app.post('/remove',function(req,res){
  let checkout = req.body.check || req.body.completecheck
  
  console.log("-------->remove",checkout) 
  console.log("type of checks",typeof(checkout))
  if(typeof(checkout)!= "undefined"){
  if(typeof(checkout)!= "string")
  {
  for(let i =0;i<checkout.length;i++)
  {
      
      var sql = "DELETE FROM `todo_new`.`todo_list1` WHERE todo_list=?;"
      connection.query(sql,[checkout[i]],function(err,result){
          if(err) throw err;
          else{
              console.log("from delete command",result)
          }
      })
  }
}
else{
    sql = "DELETE FROM `todo_new`.`todo_list1` WHERE todo_list=?;"
      connection.query(sql,[checkout],function(err,result){
          if(err) throw err;
          else{
              console.log("from delete command",result)
          }
      })
}
  }else{
    res.send(`<h1>you have selected zero task to be deleted</h1> <br></br><button type="submit" value="submit" onclick="window.location= '/'" >click here to go back</button>`)
}
res.redirect('/')
})
app.post('/complete',function(req,res){
    let checkout = req.body.check
    console.log("-------->complete",typeof(checkout))
    let sql = "UPDATE `todo_new`.`todo_list1` SET `completed` = 'completed' WHERE todo_list = ?"
    if(typeof(checkout)!= "undefined"){
    if(typeof(checkout)!= "string" )
    {
    for(let i=0;i< checkout.length;i++)
    {
    connection.query(sql,[checkout[i]],function(err,result){
        if(err) throw err;
        else{
            console.log("from complete command",result)
        }
    })
}
}
else{
    connection.query(sql,[checkout],function(err,result){
        if(err) throw err;
        else{
            console.log("from complete command",result)
        }
    })
}
    }else{
        res.send(`<h1>you have selected zero task to-do ...plz create a task</h1> <br></br><button type="submit" value="submit" onclick="window.location= '/'" >click here to go back</button>`)
    }
res.redirect('/')

})

app.post('/movetodo',function(req,res){
    let checkout = req.body.completecheck
    console.log("------->movetodo",checkout)
    let sql = "UPDATE `todo_new`.`todo_list1` SET `completed` = 'true' WHERE todo_list = ?";
    if(typeof(checkout)!= "undefined"){
    if(typeof(checkout)!='string')
    {
    for(let i=0;i<checkout.length;i++){
    connection.query(sql,[checkout[i]],function(err,result){
        if(err) throw err;
        else{
            console.log("from movetodo api",result)
        }
    })
    }
}
else{
    connection.query(sql,[checkout],function(err,result){
        if(err) throw err;
        else{
            console.log("from movetodo api",result)
        }
    })
}
    }
    else{
        res.send(`<h1>you have selected zero task to move to to-do ...plz create a task</h1> <br></br><button type="submit" value="submit" onclick="window.location= '/'" >click here to go back</button>`)
    }
res.redirect('/')
})
app.listen(3000,(err)=>{
    if(err) throw err;
    else{
        console.log(`port listening to 3000`);
    }
})

