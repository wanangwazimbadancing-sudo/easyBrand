import React from 'react'
import { Route, Routes } from 'react-router-dom'


//----------- authentication  ----------

import LogInPage from './components/LogIn'
import SignUp from './components/SignUp'
import HomePage from './HomePage'





const App = () => {


  return (

       
<div  className='w-full h-full bg-white overflow-y-auto overflow-x-hidden '>

<Routes>


                    <Route index element={<HomePage />} />
                    <Route path='/signup'  element={<SignUp />} />
                    <Route path='login' element={<LogInPage />} />


</Routes>
  
</div>





  )
}

export default App