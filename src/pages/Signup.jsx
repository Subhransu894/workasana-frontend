import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function Signup(){
    const navigate = useNavigate()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const handleRegister = async()=>{
        try {
            const res = await fetch("http://localhost:3000/api/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({name,email,password})
            });
            if(!res.ok){
                throw new Error("Register failed")
            }
            const data = await res.json()

            //save token
            localStorage.setItem("token",data.token);

            //reset or go to dashboard
            navigate("/dashboard")
        } catch (error) {
            alert("Error registering user")
        }
    }
    return(
        <>
            <main className="d-flex justify-content-center" style={{marginTop:"150px"}}>
                <div style={{width:"350px"}}>
                    <h3 className="text-center" style={{color:"blueviolet"}}>workasana</h3>
                    <h2 className="text-center">First Register here</h2>
                    <p className="text-center">Please enter your details</p>
                    <div className="mb-3">
                        <label htmlFor="namelField" className="form-label">Name </label>
                        <input type="text" placeholder="Enter your Name" id="namelField" className="form-control"
                            value={name} onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                      <div className="mb-3">
                        <label htmlFor="emailField" className="form-label">Email </label>
                        <input type="email" placeholder="Enter your email" id="emailField" className="form-control"
                            value={email} onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="passField" className="form-label">Password </label>
                        <input type="password" placeholder="Enter your password" id="passField" className="form-control" 
                            value={password} onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary w-100 mb-2" onClick={handleRegister}>Register</button>
                </div>
            </main>
        </>
    )
}