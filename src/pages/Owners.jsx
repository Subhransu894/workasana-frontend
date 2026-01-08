import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Owners(){
    const [owners,setOwners]=useState([])
    const [showOwnerModal,setShowOwnerModal]=useState(false)
    const [ownerName,setOwnerName]=useState("")
    const [ownerEmail,setOwnerEmail]=useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        fetch("http://localhost:3000/api/owners",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>setOwners(data.owners || []))
        .catch((error)=>console.error(error))
    },[])

    const handleCreateOwner = async()=>{
        if(!ownerName.trim()) return alert("Owner name & email are required");
        try {
            const res = await fetch("http://localhost:3000/api/owners",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({name:ownerName,email:ownerEmail}),
            });
            if(!res.ok){
                throw new Error("Failed to create owner")
            }

            const {owner}=await res.json()
            //instant UI update
            setOwners((prev)=>[...prev,owner])

            //reset
            setOwnerName("")
            setOwnerEmail("")
            setShowOwnerModal(false)
        } catch (error) {
            console.error(error)
            alert("Error creating owwner")
        }
    }
    return(
        <div className="d-flex " style={{minHeight:"100vh"}}>
            <aside className="bg-light p-3" style={{width:"250px"}}>
                <button className="btn btn-outline-primary mb-3 w-100" onClick={()=>navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </aside>
            <main className="flex-grow-1 p-4">
                <h2 className="border-bottom text-center mb-3">Owners</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Owner list</h4>
                    <button className="btn btn-primary btn-sm" onClick={()=>setShowOwnerModal(true)}>
                        New Owner
                    </button>
                </div>

                <div className="row g-3">
                    {owners.map((o)=>(
                        <div className="col-md-6 col-lg-4" key={o._id}>
                            <div className="card">
                                <div className="card-body">
                                    <p className="m-0"><strong>Name:</strong>{o.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {showOwnerModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">New Owner</h5>
                                    <button 
                                        className="btn-close" type="button" onClick={()=>setShowOwnerModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <label className="form-label">Owner Name</label>
                                    <input type="text" className="form-control" placeholder="Enter Owner name" 
                                        value={ownerName} onChange={(e)=>setOwnerName(e.target.value)}
                                    />
                                    <label className="form-label">Owner Email</label>
                                    <input type="text" className="form-control" placeholder="Enter Owner Email" 
                                        value={ownerEmail} onChange={(e)=>setOwnerEmail(e.target.value)}
                                    />
                                </div>  
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleCreateOwner}>Save</button>
                                    <button className="btn btn-secondary" onClick={()=>setShowOwnerModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}