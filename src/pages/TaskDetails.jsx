import { useNavigate,useParams } from "react-router-dom"
import { useState,useEffect } from "react"
export default function TaskDetails(){
    const {id}=useParams()
    const navigate = useNavigate()
    const [prevStatus,setPrevStatus]=useState(null)

    const [task,setTask]=useState(null)
    useEffect(()=>{
        fetch(`https://workasana-backend-seven.vercel.app/api/tasks/${id}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>setTask(data))
        .catch((err)=>console.error(err))
    },[id])

    useEffect(()=>{
        if(task && task.status !== "Completed"){
            setPrevStatus(task.status)
        }
    },[task])
    
    const handleToggleStatus = async()=>{
        //Toggle logic
        let newStatus;
        if(task.status === "Completed" && !prevStatus){
            console.warn("Previuos status is not available")
            return 
        }
        if(task.status === "Completed"){
            newStatus = prevStatus 
        }else{
            setPrevStatus(task.status)
            newStatus = "Completed"
        }
        try {
            const res = await fetch(`https://workasana-backend-seven.vercel.app/api/tasks/${id}/status`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({status:newStatus})
                }
            );
            if(!res.ok){
                throw new Error("Failed to update task status")
            }
            const updateTask = await res.json()

            setTask(updateTask)
        } catch (error) {
            console.error("Error updating status",error)
        }
    }

    //delete task btn
    const handleDeleteTask = async()=>{
        const confirmDelete = window.confirm("Are you sure you want to delete this task ?")
        if(!confirmDelete) return;
        try {
            const res = await fetch(`https://workasana-backend-seven.vercel.app/api/tasks/${id}`,
                {
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            if(!res.ok){
                throw new Error("Failed to delete task")
            }

            navigate("/dashboard")
        } catch (error) {
            console.error("Error Deleting task",error);
            alert("Error deleting task")
        }
    }
    if(!task) return <p className="p-4 text-center">Loading...</p>
    return(
        <div className="d-flex" style={{minHeight:"100vh"}}>
            {/* left-side */}
            <aside className="bg-light p-3 d-flex flex-column" style={{width:"250px"}}>
                <button className="btn btn-outline-primary w-100" onClick={()=>navigate("/dashboard")} style={{cursor:"pointer"}}>
                    Back to Dashboard
                </button>
            </aside>

            {/* right side */}
            <main className="flex-grow-1 p-4"> 
                <div className="border-bottom p-3 text-center">
                    <h3 className="m-0">{task.name}</h3>
                </div>

                <h5 className="mb-4 text-center mt-3">Task Details</h5>

                <div className="mb-3 d-flex justify-content-center">
                    <div style={{textAlign:"left"}}>
                    <p><strong>Project: </strong>{task.project?.name}</p>
                    <p ><strong>Team: </strong>{task.team?.name}</p>
                    <p ><strong>Owner: </strong>{task.owners?.length ? task.owners.map(o=>o.name).join(", ") : "-"}</p>
                    <p ><strong>Tags: </strong>{task.tags?.join(",") || "-"}</p>
                    <p ><strong>Times to Complete: </strong>{task.timeToComplete} Days</p>
                    <p className="mb-2">
                        <strong>Status: </strong>
                        <span className={`badge ${
                            task.status === "Completed" ? "bg-success" :"bg-info"
                        }`}> {task.status} </span>
                    </p>
                    </div>
                </div>

                <hr />

                {task.status !== "Completed" || prevStatus ? (
                    <div className="mt-4 d-flex justify-content-center">
                    <div style={{textAlign:"left"}} className="d-flex gap-3">
                    <button className={`btn ${
                            task.status === "Completed" ? "btn-warning" : "btn-success"
                        }`} 
                        onClick={handleToggleStatus}
                        disabled={task.status === "Completed" && !prevStatus}
                    >
                        {task.status === "Completed" ? `Mark as ${prevStatus || "Reopen Task"}`: "Mark as Completed"}
                    </button>

                    {/* delete button */}
                    <button className="btn btn-danger" onClick={handleDeleteTask}>
                        Delete Task
                    </button>
                    </div>
                </div>
                ):(
                   <div className="mt-4 d-flex justify-content-center">
                        <button className="btn btn-danger" onClick={handleDeleteTask}>
                            Delete Task
                        </button>
                   </div> 
                )}
            </main>
        </div>
    )
}