import {  useEffect, useState } from "react"
export default function ProjectTask(){
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
        <div style={{padding:"250px"}}>
            <h2>Project Tasks</h2>
            <div style={{marginBottom:"20px"}}>
                <label>
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
                    <div style={{marginBottom:"10px"}}>
                        <label>
                            Filter BY Owner:{" "}
                            <select value={ownerFilter} onChange={(e)=>setOwnerFilter(e.target.value)}>
                                <option value="">All</option>
                                {owners.map((o)=>(
                                    <option value={o._id} key={o._id}>{o.name}</option>
                                ))}
                            </select>
                        </label>
                        <label style={{marginLeft:"20px"}}>
                            Filter By Tag:{" "}
                            <select value={tagFilter} onChange={(e)=>setTagFilter(e.target.value)}>
                                <option value="">All</option>
                                {tags.map((t,index)=>(
                                    <option value={t} key={t+index}>{t}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    {/* task list */}
                    <h3>Task List</h3>
                    <ul>
                        {filteredTask.map(task=>(
                            <li key={task._id}>
                                {task.name} - <b>{task.owners.map(o=>o.name).join(", ")}</b> {" "} ({task.tags.join(", ")})
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}