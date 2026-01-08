import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
export default function Login(){
    const navigate = useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const handleLogin = async()=>{
        try {
            const res = await fetch("https://workasana-backend-seven.vercel.app/api/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({email,password})
            })
            if(!res.ok){
                throw new Error("Log in failed")
            }
            const data = await res.json()
            
            //store token
            localStorage.setItem("token",data.token)

            //redirect
            navigate("/dashboard")
        } catch (error) {
            alert("Invalid email or password")
        }
    }
    return(
        <>
            <main className="d-flex justify-content-center" style={{marginTop:"150px"}}>
                <div style={{width:"350px"}}>
                    <h3 className="text-center" style={{color:"blueviolet"}}>workasana</h3>
                    <h2 className="text-center">Log in to your account</h2>
                    <p className="text-center">Please enter your details</p>
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
                    <button className="btn btn-primary w-100 mb-2" onClick={handleLogin}>Sign in</button>
                    <button className="btn btn-outline-secondary w-100" onClick={()=>navigate("/signup")}>Sign Up</button>
                </div>
            </main>
        </>
    )
}