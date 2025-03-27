//Interface for task CRUD functions 
export interface Tasks{
    id: number,
    user_id: number,
    title: string, 
    description: string, 
    due_date: Date, 
    status : boolean
}
// Methods for the taskManager
export interface TasksCrud{
    createTask(user_id: number, title:string , description:string, due_date:Date, status:boolean):Promise<string>,
    updateTask(id:number):Promise<string>,
    deleteTask(id:number):Promise<string>,

}