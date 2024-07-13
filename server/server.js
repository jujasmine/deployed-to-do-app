// setting up the server!
const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

// get all todos
app.get('/todos/:userEmail', async (req,res) => {
    // console.log(req)
    const { userEmail } = req.params

    try {   
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
        res.json(todos.rows)
    } catch(err) {
        console.error(err)
    }
})

// create a new todo
app.post('/todos', async(req,res) => {
    const {user_email, title, progress, date} = req.body
    // console.log(user_email, title, progress, date)
    const id = uuidv4()
    try {
        const newToDo = await pool.query('INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)', 
            [id, user_email, title, progress, date])
        res.json(newToDo)
    } catch (err) {
        console.log(err)
    }
})

// edit a new todo
app.put('/todos/:id', async(req,res) => {
    const {id} = req.params
    const {user_email, title, progress, date} = req.body
    try {
        const editToDo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;', 
            [user_email, title, progress, date, id])
        res.json(editToDo)
    } catch (err) {
        console.error(err)
    }
})

// delete a new todo
app.delete('/todos/:id', async(req,res) => {
    const {id} = req.params

    try {
        const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
        res.json(deleteToDo)
    } catch (err) {
        console.error(err)
    }
})

// sign up: a post endpoint  
app.post('/signup', async(req,res) => {
    const { email , password } = req.body
    console.log("THIS IS THE EMAIL AND PASSWORD", email, password)
    // console.log(email,password)

    // password hashing: turning  a password into a short string of letters/numbers using an encryption algorithm
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)
     
    try{
        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1, $2)`, 
            [email, hashedPassword])
            
        // generating a json web token for the new user
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

        // json response is being returned to the client
        res.json({email, token})

    }catch(err){
        console.error(err)
        if(err) {
            res.json({detail: err.detail})
        }
    }
})

// login
app.post('/login', async(req,res) => {
    const { email,password } = req.body
    try{
        // due to the primary key, the email can only be unique and a single value in the array 
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        if  (!users.rows.length) return res.json({detail : 'User does not exist! '})
        
        // returns true or false if the password matches the stored hashed_password
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

        if (success) {
            // response returns the logged in email and the new token
            res.json({ 'email' : users.rows[0].email, token })
        }  else {
            res.json({detail: "Login failed"})
        }
    }catch(err){
        console.error(err)
    }
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))