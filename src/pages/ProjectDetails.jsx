import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
export default function ProjectDetails(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [project,setProject]=useState(null)

    useEffect(()=>{
        fetch(`https://workasana-backend-seven.vercel.app/api/projects/${id}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>setProject(data))
        .catch((err)=>console.error(err))
    })

    const handleProjectDelete = async()=>{
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if(!confirmDelete) return;
        try {
            const res = await fetch(`https://workasana-backend-seven.vercel.app/api/projects/${id}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            if(!res.ok){
                throw new Error("Failed to delete project")
            }
            navigate("/dashboard")
        } catch (error) {
            console.error(error)
            alert("Error deleting project")
        }
    }
    if(!project) return <p className="mt-3 text-center">Loading...</p>
    return(
        <div className="d-flex " style={{minHeight:"100vh"}}>
            <aside className="bg-light p-3" style={{width:"250px"}}> 
                <button className="btn btn-outline-primary" onClick={()=>navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </aside>
            {/* main page */}
            <main className="flex-grow-1 p-4">
                {/* heading */}
                <div className="border-bottom mb-4 p-4">
                    <h3 className="m-0 text-center">{project.name}</h3>
                </div>
                {/* project card */}
                <div className="d-flex justify-content-center">
                    <div className="card mb-4" style={{maxWidth:"600px",width:"100%"}}>
                        <div className="card-body">
                            <h5 className="card-title">Project Details</h5>
                            <p><strong>Name:</strong>{project.name}</p>
                            <p><strong>Description:</strong>{project.description || "-"}</p>
                            <p><strong>Created At:</strong>{""}
                                {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
                {/* delete button */}
                <div className="d-flex justify-content-center">
                    <button className="btn btn-danger" onClick={handleProjectDelete}>
                        Delete Project
                    </button>
                </div>
            </main>
        </div>
    )
}