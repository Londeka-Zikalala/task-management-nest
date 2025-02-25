import { Request, Response, NextFunction } from "express";
import { Tasks } from "./ITasks"


//interface for the users CRUD function 
export interface Users{
    id: number
    username: string,
    password: string
}
// Methods for the userManagement class
export interface UsersCrud{
    userRegistration(username:string, password:string):Promise<string>,
    userLogin(username:string, password:string):Promise<Users | null>,
    viewUserTasks(id:number):Promise<Tasks[]>
}

//Methods for userManagementRoutes
export interface UsersRoutes{
    registerUser(req:Request,res:Response,next:NextFunction):Promise<void>;
    loginUser(req:Request,res:Response,next:NextFunction): Promise<void> ;
    viewTasksByUser(req:Request,res:Response,next:NextFunction): Promise<any>;
}