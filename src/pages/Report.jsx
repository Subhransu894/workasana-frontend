import { useNavigate } from "react-router-dom"
import {Chart as ChartJs , CategoryScale, LinearScale,BarElement,ArcElement,Tooltip,Legend} from "chart.js"
import {Bar,Pie} from "react-chartjs-2"
import { useEffect, useState } from "react"
ChartJs.register(CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend)
export default function Report(){
    const navigate = useNavigate()
    const [report,setReport]=useState(null)
    useEffect(()=>{
        fetch("http://localhost:3000/api/reports/overview")
        .then((res)=>res.json())
        .then(data=>{
            console.log("Report Data",data);
            setReport(data)})
        .catch((err)=>console.error(err))
    },[])
    if(!report){
        return <p className="text-center">Loading...</p>
    }
    // Chart data
    const workDoneData={
        labels:["Completed"],
        datasets:[
            {
                label:"Task",
                data:[report.workDoneLastWeek],
                backgroundColor: ["#0ed","#0d6efd","#fd7e14"]
            }
        ]
    };
    const pendingWorkData = {
        labels:["Pending Days"],
        datasets:[
            {
                label:"Days",
                data:[report.pendingWorkDays],
                backgroundColor:["#dc3545","#6f42c1","#0dcaf0"]
            }
        ]
    };
    const taskByTeamData = {
        labels:report.taskClosedByTeam?.map(t=>t.team) ,
        datasets:[
            {
                label:"Tasks Closed",
                data:report.taskClosedByTeam?.map(t=>t.count) ,
                backgroundColor:["#0d6efd","#198754","#ffc107","#dc3545"]
            }
        ]
    };
    const taskByOwnerData = {
        labels: report.taskCloseByOwners.map(o=>o.owner),
        datasets:[
            {
                data:report.taskCloseByOwners.map(o=>o.count),
                backgroundColor:["#fd7e14","#0d6efd"]
            }
        ]
    }
    return(
        <div className="d-flex" style={{minHeight:"100vh"}}>
            {/* left-side */}
            <aside className="bg-light p-3" style={{width:"250px"}}>
                <button className="btn btn-outline-primary w-100" onClick={()=>navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </aside>

            {/* Right-side */}
            <main className="flex-grow-1 p-4">
                {/* Header */}
                <div className="border-bottom pb-3 mb-4 text-center">
                    <h3 className="mb-0">Report</h3>
                    <small>Report Overview</small>
                </div>
                <div className="row g-4">
                    {/* workdone */}
                    <div className="col-md-6">
                        <div className="card p-3 h-100">
                            <h6>Total Workdone Last Week</h6>
                            <Bar data={workDoneData} />
                        </div>
                    </div>
                    {/* pending days */}
                    <div className="col-md-6">
                        <div className="card p-3 h-100">
                            <h6>Total Days of work pending</h6>
                            <Pie data={pendingWorkData}/>
                        </div>
                    </div>
                    {/* task by team */}
                    <div className="col-md-6">
                        <div className="card p-3 h-100">
                            <h6>Task Closed By Team</h6>
                            <Bar data={taskByTeamData} />
                        </div>
                    </div>
                    {/* task by owner */}
                    <div className="col-md-6">
                        <div className="card p-3 h-100">
                            <h6>Task Closed By Owner</h6>
                            <Pie data={taskByOwnerData}  />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}