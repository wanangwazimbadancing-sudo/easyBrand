import axios from "axios"
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {

    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[message,setMessage]=useState("");
    const[loading,setLoading]=useState(false);


//------- messaging ------

const Handle_submit = async(e) =>{
e.preventDefault();
setLoading(true);

try {
const response = await axios.post("http://localhost:3000/api/contact",{name,email,message},{withCredentials:true});

if(response.data.success) {
  toast.success(response.data.message);
  setName("");
  setEmail("");
  setMessage("");
}
    
} catch (error) {
   if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors.map(err => err.message).join(", ");
      toast.error(errorMessages);
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.request && !error.response) {
      toast.error("Network error: Unable to reach the server. Please check your internet connection.");
    } else if (error.message === "Network Error") {
      toast.error("Network error: No internet connection detected.");
    } else {
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    }
} finally {
  setLoading(false);
}



}


// ----- handle name input

    const Handle_name = (e) =>{setName(e.target.value)}

  // ------ handle email input  

    const Handle_email = (e) =>{setEmail(e.target.value)}


     //----- handle message input
     
     
    const Handle_massage = (e) =>{setMessage(e.target.value)}




    return (
        <>

            
            <section className="bg-white px-4 py-16" id="contact">
                <div className="w-full mx-auto flex flex-col md:flex-row max-md:items-center justify-center gap-12 md:gap-16">
                    {/* Left Side */}
                    <div className="flex flex-col mt-10">
                        <p className="text-sm max-md:text-center font-medium text-zinc-500 uppercase mb-2">Get In Touch</p>
                        <h1 className="text-5xl/14 max-md:text-center font-bold text-zinc-900 max-w-2xs mb-4">Let's build something real.</h1>
                        <p className="text-base/5.5 text-zinc-400 max-md:text-center max-w-2xs">Let's talk about your ideas and turn them into reality.</p>
                        <div className="flex items-center max-md:justify-center gap-4 mt-7 cursor-pointer">
                       
                       <i class="fa-brands fa-tiktok text-[#3a3a59] text-[20px] " ></i>
                       <i class="fa-brands fa-whatsapp text-[teal] text-[20px]"></i>
                       <i class="fa-brands fa-slack text-[#4e375c] text-[20px]"></i>
                       
                       </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full max-w-sm border border-zinc-300 rounded-2xl p-8">
                        <h2 className="text-base font-medium text-zinc-800 mb-5.5">Send Message</h2>

                        <form className="flex flex-col gap-4" onSubmit={Handle_submit}>


                           {/*------------ name input --------------- */}

                            <div className="flex flex-col gap-2.5">
                                <label className="text-xs text-zinc-400">Name</label>
                                <input type="text" required value={name} onChange={Handle_name} placeholder="Enter your name" className="bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors" />
                            </div>





                         {/* ------------- email input  ----------------- */}

                            <div className="flex flex-col gap-2.5">
                                <label className="text-xs text-zinc-400">Email</label>
                                <input  type="email" required value={email} onChange={Handle_email} placeholder="Enter your email" className="bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-500 transition-colors" />
                            </div>




                         {/*----------------------- message input -------------------- */}

                            <div className="flex flex-col gap-2.5">
                                <label className="text-xs text-zinc-400">Message</label>
                                <textarea required value={message} onChange={Handle_massage} placeholder="Your message.." rows="4" className="bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-500  transition-colors resize-none"></textarea>
                            </div>
                            <button 
                              type="submit" 
                              disabled={loading}
                              className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-black/90 cursor-pointer'} text-white text-base py-3 rounded-lg transition-colors mt-1 flex items-center justify-center gap-2`}
                            >
                              {loading ? (
                                <>
                                  <div className="animate-spin">⟳</div>
                                  Sending...
                                </>
                              ) : (
                                'Send Message'
                              )}
                            </button>
                        </form>



                    </div>
                </div>
            </section>
            <Toaster position="top-right" />
        </>
    )
}


export default Profile;