//Interface for task CRUD functions 
export interface Tasks{
    user_id: number,
    title: string, 
    description: string, 
    due_date: Date, 
    status : boolean
}
// Methods for the taskManager
export interface TasksCrud{
    createTask(user_id: number, title:string , description:string, due_date:Date, status:boolean):Promise<string>,
    updateTask(title:string):Promise<string>,
    deleteTask(title:string):Promise<string>,

}