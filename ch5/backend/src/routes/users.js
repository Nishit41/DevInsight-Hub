import { createUser, findUserByUsername } from "../services/user.js";
import bcrypt from 'bcrypt'

export const userRoutes = (app)=>{
    app.post('/api/v1/user/signup', async(req,res)=>{
        console.log({req,res})
        try{
            const user = await createUser(req.body)
            return res.status(201).json({
                username: user.username
            })
        }
        catch {
            return res.status(400).json({
                error: "failed to create the user, does the username already exists?"
            })
        }
    })
    
    app.post('/api/v1/user/login', async(req,res)=>{
        try{
            const { username, password } = req.body
            const user = await findUserByUsername(username)
            if(!user){
                return res.status(401).json({
                    error: "invalid username or password"
                })
            }
            const isValidPassword = await bcrypt.compare(password, user.password)
            if(!isValidPassword){
                return res.status(401).json({
                    error: "invalid username or password"
                })
            }
            return res.status(200).json({
                username: user.username
            })
        }
        catch {
            return res.status(400).json({
                error: "login failed"
            })
        }
    })
} 