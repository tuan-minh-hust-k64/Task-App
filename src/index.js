const express = require('express');
const db = require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const auth = require('./middleware/Auth');
//connect to database
db.Connect();
//setup port
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);




app.listen(port,()=>{
    console.log('listening on port: ' + port);
})



