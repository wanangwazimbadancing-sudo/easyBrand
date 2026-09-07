import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const nav = useNavigate();

const[isAuthenticated,setIsAuthenticated]= useState("");
const[message,setMessage]= useState("");
const[modal,setModal]= useState(false);


const fetch_data = async() => {
try {
      const res = await axios.get('http://localhost:3000/me',{withCredentials:true});

  
    setIsAuthenticated(true);
    setMessage(`${res.data.message} ${res.data.user.username}`);
    
  } catch (error) {
    setMessage(error);
    setIsAuthenticated(false);
  }

}

useEffect(()=>{fetch_data()},[]);


const logging_out = async() =>{
   try {
const res = await axios.get('http://localhost:3000/logout',{withCredentials:true})
    setIsAuthenticated(false);
    alert('logged out sucessfully')
    setMessage("something went wrong");
    nav("/login");
    setModal(false)
   } catch (error) {
    setMessage(error);
   }

}


  return (
    <div>
<h1>HomePage</h1>



{isAuthenticated && <button onClick={()=>{setModal(!modal)}} >log out</button>}

{modal && 
<>

<div onClick={()=>{setModal(!modal)}} className='fixed z-1 top-0 left-0 w-[100vw] h-[100dvh] flex justify-center items-center gap-5 bg-[#00000077]'>



</div>


<div className=' fixed top-[30%] left-[40%] transform-[-50%,-50%] z-111 w-[300px] h-[200px] bg-white flex justify-center items-center gap-10 rounded-md'>
      <button className='bg-slate-100 w-[90px] rounded-md p-3 '  onClick={()=>{setModal(!modal)}} >cancel</button>
    <button className='bg-[#f1f] w-[90px] rounded-md p-3 text-white ' onClick={logging_out}>confirm</button>
</div>

</> }

{message}
    </div>
  )
}

export default HomePage