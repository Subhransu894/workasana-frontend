import { useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
export default function Team(){
    const navigate = useNavigate()
    const [teams,setTeams] = useState([])
    const [search,setSearch] = useState("")

    const [showModal,setShowModal]=useState(false)
    const [teamName,setTeamName] = useState("")
    const [teamDesc,setTeamDesc] = useState("")
    useEffect(()=>{
        fetch("https://workasana-backend-seven.vercel.app/api/teams",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>setTeams(data))
        .catch((err)=>console.error(err))
    },[])
    const filteredTeams = teams.filter((t)=>(
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    ))

    const handleCreateTeam = async()=>{
        if(!teamDesc.trim() || !teamName.trim()){
            return alert("Team Name and Description are required")
        }
        try {
            const res = await fetch("https://workasana-backend-seven.vercel.app/api/teams",{
                method:"POST",
                headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},
                body: JSON.stringify({
                    name: teamName,
                    description: teamDesc,
                })
            });
            if(!res.ok){
                throw new Error("Failed to create Team")
            }
            const newTeam = await res.json()
            //instant ui update
            setTeams((prev)=>[...prev,newTeam])

            setTeamName("")
            setTeamDesc("")
            setShowModal(false)
        } catch (error) {
            console.error(error)
            alert("Failed to create project")
        }
    }
    return(
        <div className="d-flex" style={{minHeight:"100vh"}}>
            {/* left side */}
            <aside className="bg-light p-3" style={{width:"250px"}}>
                <button className="btn btn-outline-primary w-100" onClick={()=>navigate("/dashboard")}>
                    Back to dashboard
                </button>
            </aside>
            {/* right */}
            <main className="flex-grow-1 p-4">
                <div className="border-bottom pb-3 mb-4 text-center">
                    <h3>Teams</h3>
                </div>
                <div className="d-flex justify-content-between mb-4 gap-3">
                    <input type="text" className="form-control w-50" placeholder="search team" value={search} 
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={()=>setShowModal(true)}>
                        Add New Team
                    </button>
                </div>
                {/* team - list */}
                <div className="row g-3">
                    {filteredTeams.length === 0 ? ( <p className="text-center">No teams found</p> )
                        :(
                            filteredTeams.map((t)=>(
                                <div className="col-sm-6 col-md-4" key={t._id}>
                                    <div className="card" style={{height:"150px",width:"100%",overflowY:"auto"}}>
                                        <div className="card-body">
                                            <h5 className="card-title">{t.name}</h5>
                                            <p className="card-text">{t.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </main>
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                {/* header */}
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Team</h5>
                                    <button className="btn-close" onClick={()=>setShowModal(false)}></button>
                                </div>
                                {/* body */}
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Team Name</label>
                                        <input type="text" className="form-control" value={teamName}
                                            onChange={(e)=>setTeamName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Team Description</label>
                                         <textarea className="form-control" rows="3" value={teamDesc} 
                                            onChange={(e)=>setTeamDesc(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                {/* footer */}
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleCreateTeam}>
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