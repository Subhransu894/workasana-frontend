import { useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
export default function Project(){
    const navigate = useNavigate()
    const [project,setProject]=useState([])
    const [search,setSearch]=useState("")

    const [showModal,setShowModal]=useState(false)
    const [projectName,setProjectName]=useState("")
    const [projectDesc,setProjectDesc]=useState("")

    useEffect(()=>{
        fetch("https://workasana-backend-seven.vercel.app/api/projects",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>setProject(data))
        .catch((err)=>console.error(err))
    },[])

     useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token){
            navigate("/")
        }
    },[])
    const filteredSearch = project.filter((p)=>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    )

    const handleCreateProject = async()=>{
        if(!projectName.trim() || !projectDesc.trim()){
            return alert("Project name and description are required")
        }
        try {
            const res = await fetch("https://workasana-backend-seven.vercel.app/api/projects",{
                method:"POST",
                headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},
                body:JSON.stringify({
                    name: projectName,
                    description: projectDesc,
                })
            });
            if(!res.ok){
                throw new Error("Failed to create Team")
            }
            const newProject = await res.json()
            //instant ui update
            setProject((prev)=>[...prev,newProject])

            setProjectName("")
            setProjectDesc("")
            setShowModal(false)
        } catch (error) {
            console.error(error);
            alert("Failed to create project")
        }
    }
    return(
        <div className="d-flex" style={{minHeight:"100vh"}}>
            {/* left-side */}
            <aside className="bg-light p-3 d-flex flex-column" style={{width:"250px"}}>
                <button className="btn btn-outline-primary" onClick={()=>navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </aside>
            {/* right-side */}
            <main className="flex-grow-1 p-4">
                {/* Header */}
                <div className="border-bottom pb-3 mb-4 text-center">
                    <h3 className="m-0">Projects </h3>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
                    <input type="text" className="form-control w-50" placeholder="search by project name and desc" value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={()=>setShowModal(true)}>
                        Add New Project
                    </button>
                </div>
                {/* project list */}
                 <div className="row g-3">
                    { filteredSearch.length === 0 ? ( 
                            <p className="text-center">No Projects Found</p>
                        ):(
                             filteredSearch.map((pro)=>(
                                <div className="col-sm-6 col-md-4" key={pro._id} 
                                    onClick={()=>navigate(`/project/${pro._id}`)}
                                    style={{cursor:"pointer"}}
                                >
                                    <div className="card" >
                                        <div className="card-body">
                                            <h5 className="card-title">{pro.name}</h5>
                                            <p className="card-text">{pro.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                }
                    </div>
            </main>
            {/* modal for project */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                {/* header */}
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Project</h5>
                                    <button className="btn-close" onClick={()=>setShowModal(false)}></button>
                                </div>
                                {/* body */}
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Project Name</label>
                                        <input type="text" className="form-control" value={projectName}
                                             onChange={(e)=>setProjectName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Project Description</label>
                                        <textarea className="form-control" rows="3" value={projectDesc} 
                                            onChange={(e)=>setProjectDesc(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                {/* footer */}
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleCreateProject}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}