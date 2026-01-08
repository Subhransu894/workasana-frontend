import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
export default function Dashboard(){
    const [projects,setProjects]=useState([])
    const [tasks,setTasks]=useState([])
    const [teams,setTeams]=useState([])
    const [owners,setOwners]=useState([])
    const [projectSort,setProjectSort]=useState("")
    const [taskFilter,setTaskFilter]=useState("")

    const [showProjModal,setShowProjModal]=useState(false)
    const [projectName,setProjectName]=useState("")
    const [projectDescription,setProjectDescription]=useState("")

    const [showTaskModal,setShowTaskModal] = useState(false)
    const [taskName,setTaskName] = useState("")
    const [selectedProject,setSelectedProject]=useState("")
    const [selectedTeam,setSelectedTeam] = useState("")
    const [selectedOwners,setSelectedOwners]=useState([])
    const [status,setStatus]=useState("To Do")
    const [tags,setTags] = useState("")
    const [timeToComplete,setTimeToComplete] = useState("")
    const [dueDate,setDueDate] = useState("")

    const [searchQuery,setSearchQuery] = useState("")

    const navigate = useNavigate()

    const sortedProject = [...projects].sort((a,b)=>{
        if(projectSort === "name-asc"){
            return a.name.localeCompare(b.name)
        }
        if(projectSort === "name-desc"){
            return b.name.localeCompare(a.name)
        }
        if(projectSort === "newest"){
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
        if(projectSort === "oldest"){
            return new Date(a.createdAt) - new Date(b.createdAt)
        }
        return 0;
    })
    const searchedProjects = sortedProject.filter((p)=>(
        p?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ))

    const filteredTasks = taskFilter ? tasks.filter((t)=> t.status === taskFilter) : tasks;
    const searchedTasks = filteredTasks.filter((t)=>(
        t.name.toLowerCase().includes(searchQuery.toLowerCase())||
        t.tags?.some(tag=> tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ))
    //fetch project
    useEffect(()=>{
        fetch("https://workasana-backend-seven.vercel.app/api/projects",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>{
            if(!res.ok) throw new Error("Failed to fetch projects");
            return res.json()
        })
        .then((data)=>setProjects(data))
        .catch((err)=>console.error(err))
    },[])
    //fetch task
    useEffect(()=>{
        fetch("https://workasana-backend-seven.vercel.app/api/tasks",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>{
            if(!res.ok) throw new Error("Failed to fetch tasks");
                return res.json()
        })
        .then((data)=>setTasks(data))
        .catch((err)=>console.error(err))
    },[])
    //fetch team
    useEffect(()=>{
        fetch("https://workasana-backend-seven.vercel.app/api/teams",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>{
            if(!res.ok) throw new Error("Failed to fetch teams");
            return res.json();
        })
        .then((data)=>setTeams(data))
        .catch((err)=>console.error(err))
    },[])
    //fetch owners
    useEffect(()=>{
        fetch("https://workasana-backend-seven.vercel.app/api/owners",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>{
            if(!res.ok) throw new Error("Failed to fetch teams");
            return res.json();
        })
        .then((data)=>setOwners(data.owners || []))
        .catch((err)=>console.error(err))
    },[])
    //auth token
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token){
            navigate("/dashboard")
        }
    },[])
    const handleCreateProject = async()=>{
        if(!projectName.trim())return alert("Project name is required");
        try {
            const res = await fetch("https://workasana-backend-seven.vercel.app/api/projects",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
                body:JSON.stringify({
                    name: projectName,
                    description: projectDescription,
                })
            });
            if(!res.ok) throw new Error("Failed to create Project");
            const {project} = await res.json()
            
            //update UI instantly
            // setProjects((prev)=>[...prev,project])
            const updatedProjects = await fetch("https://workasana-backend-seven.vercel.app/api/projects",{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(res=>res.json());
            setProjects(updatedProjects)

            //reset / close modal
            setProjectName("")
            setProjectDescription("")
            setShowProjModal(false)
        } catch (error) {
            console.error(error)
            alert("Error creating project")
        }
    }

    const handleCreateTask = async()=>{
        if(!taskName.trim()) return alert("Task name required");
        if(!selectedProject) return alert("Select a project");
        if(!selectedTeam) return alert("Select a Team");

        try {
            const res = await fetch("https://workasana-backend-seven.vercel.app/api/tasks",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name:taskName,
                    project:selectedProject,
                    team:selectedTeam,
                    owners: selectedOwners,
                    status,
                    tags:tags.split(",").map((t)=>t.trim()),
                    dueDate,
                    timeToComplete,
                })
            });

            if(!res.ok) throw new Error("Failed to create task");
            
            const {task} = await res.json()
            setTasks((prev)=>[...prev,task])

            setShowTaskModal(false)
            setTaskName("")
            setSelectedProject("")
            setSelectedTeam("")
            setSelectedOwners([])
            setStatus("To Do")
            setTags("")
            setDueDate("")
            setTimeToComplete("")
        } catch (error) {
            console.error(error)
            alert("Error creating task")
        }
    }
    return(
        <div className="d-flex" style={{minHeight:"100vh"}}>
            {/* side bar */}
            <aside className="bg-light text-gray p-3" style={{width:"250px"}}>
                <h4 className="mb-4" style={{color:"blueviolet"}}>workasana</h4>
                <ul className="nav flex-column gap-2 mb-3">
                    <li className="nav-item d-flex align-items-center gap-2" 
                        onClick={()=>navigate("/dashboard")} style={{cursor:"pointer"}}
                    >
                        <i className="bi bi-speedometer2"></i>
                        <span>Dashboard</span>
                    </li>
                    <li className="nav-item d-flex align-items-center gap-2" 
                        onClick={()=>navigate("/project")} style={{cursor:"pointer"}}
                    >
                        <i className="bi bi-kanban"></i>
                        <span>Project</span>
                    </li>
                    <li className="nav-item d-flex align-items-center gap-2"
                        onClick={()=>navigate("/team")} style={{cursor:"pointer"}}
                    >
                        <i className="bi bi-people-fill"></i>
                        <span>Team</span>
                    </li>
                    <li className="nav-item d-flex align-items-center gap-2"
                        onClick={()=>navigate("/report")} style={{cursor:"pointer"}}
                    >
                        <i className="bi bi-bar-chart"></i>
                        <span>Report</span>
                    </li>
                    <li className="nav-item d-flex align-items-center gap-2"
                        onClick={()=>navigate("/owners")} style={{cursor:"pointer"}}
                    >
                        <i className="bi bi-person-plus"></i>
                        <span>Owners</span>
                    </li>
                    <li className="nav-item d-flex align-items-center gap-2">
                        <i className="bi bi-gear"></i>
                        <span>Setting</span>
                    </li>
                    <button className="btn btn-outline-danger w-100" 
                        onClick={()=>{
                            localStorage.removeItem("token");
                            navigate("/")
                        }}
                    >
                        Logout
                    </button>
                </ul>
            </aside>
            {/* main content*/}
            <main className="flex-grow-1 p-4 bg-white">
                <div className="input-group mb-4">
                    <input type="search" className="form-control" placeholder="Search" value={searchQuery} 
                        onChange={(e)=>setSearchQuery(e.target.value)}
                    />
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
                {/* project-section */}
                <section className="mb-5">
                    <div className="d-flex align-items-center mb-3 gap-3">
                        <h4 className="mb-0">Project</h4>
                        <select className="form-select form-select-sm w-auto" value={projectSort}
                             onChange={(e)=>setProjectSort(e.target.value)}
                        >
                            <option value="">Sort</option>
                            <option value="name-asc">Name (A - Z)</option>
                            <option value="name-desc">Name (Z - A)</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                        <div className="ms-auto">
                            <button className="btn btn-sm btn-primary" onClick={()=>setShowProjModal(true)}>New Project</button>
                        </div>
                    </div>
                    {/* project list in card form*/}
                    <div className="row g-3">
                        {searchedProjects.map((p)=>(
                            <div className="col-md-6 col-lg-4 " key={p._id} onClick={()=>navigate(`/project/${p._id}`)}
                                style={{cursor:"pointer"}}
                            >
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">{p.name}</h6>
                                        <p className="card-text">{p.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Task-section */}
                <section className="mb-5">
                    <div className="d-flex align-items-center mb-3 gap-3">
                        <h4 className="mb-0">My Task</h4>
                        <select className="form-select form-select-sm w-auto" value={taskFilter}
                            onChange={(e)=>setTaskFilter(e.target.value)}
                        >
                            <option value="">Filter</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="To Do">To Do</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                        <div className="ms-auto">
                            <button className="btn btn-sm btn-primary" onClick={()=>setShowTaskModal(true)}>New Task</button>
                        </div>
                    </div>
                    {/* Task -list in card form */}
                    <div className="row g-3">
                        {searchedTasks.map((t)=>{
                            
                            return(
                                <div className="col-md-6 col-lg-4" key={t._id} onClick={()=>navigate(`/task/${t._id}`)} 
                                    style={{cursor:"pointer"}}
                                >
                                <div className="card">
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <span>{t.name}</span>
                                        <span className={`
                                                badge rounded-pill px-3 py-2  ${
                                                    t.status === "Completed" ? "bg-success" : t.status === "In Progress" ?
                                                    "bg-warning text-dark" : t.status === "Blocked" ? "bg-danger" : "bg-secondary"
                                                }
                                            `}
                                        >
                                            {t.status || "To Do"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </section>
            </main>
            {/* Modal phase for project */}
            {showProjModal  && (
                <>
                    {/* backdrop */}
                    <div className="modal-backdrop fade show "></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">New Project</h5>
                                    <button 
                                        type="button" className="btn-close" onClick={()=>setShowProjModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Project Name</label>
                                        <input type="text" className="form-control" value={projectName} 
                                            onChange={(e)=>setProjectName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Project Description</label>
                                        <input type="text" className="form-control" value={projectDescription}
                                            onChange={(e)=>setProjectDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleCreateProject}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary" onClick={()=>setShowProjModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* Modal phase for task */}
            {showTaskModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Create New Task</h5>
                                    <button className="btn-close" onClick={()=>setShowTaskModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row gap-3">
                                        <div className="col-12">
                                            <label className="form-label">Task Name</label>
                                            <input type="text" className="form-control" value={taskName} 
                                                onChange={(e)=>setTaskName(e.target.value)} 
                                                placeholder="Enter task name"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Project</label>
                                            <select className="form-control" value={selectedProject} 
                                                onChange={(e)=>setSelectedProject(e.target.value)}
                                            >
                                                <option value="">Select Project</option>
                                                {projects.map((p)=>(
                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Team</label>
                                            <select className="form-control" value={selectedTeam} 
                                                onChange={(e)=>setSelectedTeam(e.target.value)}
                                            >
                                                <option value="">Select Team</option>
                                                {teams.map((t)=>(
                                                    <option value={t._id} key={t._id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Owners</label>
                                            <div className="border p-2 rounded" style={{minHeight:"150px",overflowY:"auto"}}>
                                                {owners.map(o=>(
                                                    <div key={o._id} className="form-check">
                                                        <input 
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            value={o._id} id={`owner-${o._id}`}
                                                            checked={selectedOwners.includes(o._id)}
                                                            onChange={(e)=>{
                                                                const value =e.target.value;
                                                                if(selectedOwners.includes(value)){
                                                                    setSelectedOwners(prev=>prev.filter(id=>id !== value))
                                                                }else{
                                                                    setSelectedOwners(prev=>[...prev,value])
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`owner-${o._id}`} className="form-check-label">
                                                            {o.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                         <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select className="form-control"
                                                value={status}
                                                onChange={(e)=>setStatus(e.target.value)}
                                            >
                                                <option value="To Do">To Do</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Blocked">Blocked</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Tags</label>
                                            <input type="text" className="form-control" placeholder="UI , BUG , API" 
                                                value={tags} onChange={(e)=>setTags(e.target.value)}
                                            />
                                        </div> 
                                        <div className="col-md-6">
                                            <label className="form-label">Due Date</label>
                                            <input type="date" className="form-control"
                                                value={dueDate} onChange={(e)=>setDueDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Estimated Time</label>
                                            <input type="number" className="form-control" 
                                                value={timeToComplete} onChange={(e)=>setTimeToComplete(e.target.value)}
                                                placeholder="Enter time in Days"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleCreateTask}>Save Task</button>
                                    <button className="btn btn-secondary" onClick={()=>setShowTaskModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}