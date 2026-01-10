import {  useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
export default function ProjectTask(){

    const navigate = useNavigate()

    const [projects,setProjects]=useState([])
    const [selectProjectId,setSelectProjectId]=useState("")
    const [tasks,setTasks]=useState([])
    const [ownerFilter,setOwnerFilter]=useState("")
    const [tagFilter,setTagFilter]=useState("")
    const [owners,setOwners]=useState([])
    const [tags,setTags]=useState([])
    //fetch all rpoject
    useEffect(()=>{
        fetch("https://workasana-backend-seven.vercel.app/api/projects",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>setProjects(data))
        .catch((err)=>console.error(err))
    },[]);
    //fetch task when a project is selected
    useEffect(()=>{
        if(!selectProjectId) return;
        fetch(`https://workasana-backend-seven.vercel.app/api/tasks?projectId=${selectProjectId}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setTasks(data);
            setOwnerFilter("")
            setTagFilter("")

            const uniqueOwners = Array.from(new Map(
                    data
                    .flatMap(task=>task.owners || [])
                    .map(owner=>[owner._id,owner])
                ).values()
            )
            setOwners(uniqueOwners)

            const uniqueTags = [...new Set(data.flatMap(task=>task.tags))]
            setTags(uniqueTags)
        })
        .catch((err)=>console.error(err))
    },[selectProjectId])
    const filteredTask = tasks.filter((task)=>{
        if(ownerFilter && !task.owners.some(o=>o._id === ownerFilter)) return false;
        if(tagFilter && !task.tags.includes(tagFilter)) return false;
        return true;
    })
    return(
        <div style={{display:"flex",minHeight:"100vh"}}>
            {/* left side */}
            <div style={{width:"250px",background:"lightgray",color:"black",padding:"20px"}}>
                <h3>Menu</h3>
                <button className="btn btn-outline-primary" style={{cursor:"pointer"}}
                    onClick={()=>navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>

            {/* right side */}
            <div style={{flex:"1",padding:"40px",background:"#f9fafb"}}>
                <div style={{maxWidth:"900px",margin:"0 auto",background:"#fff",padding:"30px",borderRadius:"8px"}}>
                    <h2 style={{marginBottom:"25px",fontWeight:"700"}}>Project Tasks</h2>
                    <div style={{marginBottom:"25px"}}>
                        <label style={{display:"block",marginBottom:"8px", fontWeight:"600"}}>
                            Select Project:{" "}
                            <select value={selectProjectId} onChange={(e)=>setSelectProjectId(e.target.value)}>
                                <option value="">---select---</option>
                                {Array.isArray(projects) && projects.map((project)=>(
                                    <option value={project._id} key={project._id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    {selectProjectId && (
                        <>
                            {/* filters */}
                            <div style={{display:"flex",gap:"20px",marginBottom:"30px"}}>
                                <div style={{flex:"1"}}>
                                    <label style={{display:"block",marginBottom:"6px",fontWeight:"600"}}>
                                        Filter By Owner:
                                    </label>
                                        <select value={ownerFilter} onChange={(e)=>setOwnerFilter(e.target.value)}
                                            style={{width:"100%",padding:"10px",border:"1px solid #ccc",borderRadius:"6px"}}
                                        >
                                            <option value="">All</option>
                                            {owners.map((o)=>(
                                                <option value={o._id} key={o._id}>{o.name}</option>
                                            ))}
                                        </select>
                                </div>   
                                <div style={{flex:"1"}}>
                                    <label style={{display:"block",marginBottom:"6px",fontWeight:"600"}}>
                                        Filter By Tag:
                                    </label>
                                        <select value={tagFilter} onChange={(e)=>setTagFilter(e.target.value)}
                                            style={{width:"100%",padding:"10px",border:"1px solid #ccc",borderRadius:"6px"}}
                                        >
                                            <option value="">All</option>
                                            {tags.map((t,index)=>(
                                                <option value={t} key={t+index}>{t}</option>
                                            ))}
                                        </select>
                                </div>    
                            </div>
                                {/* task list */}
                                <h3 style={{marginBottom:"15px",fontWeight:"600"}}>Task List</h3>
                                <ul style={{paddingLeft:"18px"}}>
                                    {filteredTask.map(task=>(
                                        <li key={task._id}
                                            style={{marginBottom:"12px",padding:"10px",background:"#f4f6f8",borderRadius:"6px"}}
                                        >
                                            <b>{task.name}</b> <br />
                                            <span style={{fontSize:"14px",color:"#555"}}>
                                                {task.owners.map(o=>o.name).join(", ")}
                                            </span> <br />
                                            <span style={{fontSize:"13px",color:"#777"}}>
                                               Tags: ({task.tags.join(", ")})
                                            </span> 
                                        </li>
                                    ))}
                                </ul>
                            
                        </>
                    )}
                </div>
            </div>
        </div>
        
    )
}