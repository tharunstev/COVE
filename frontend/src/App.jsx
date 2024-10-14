
import { Toaster } from 'sonner'
import './App.css'
import Signup from './components/signup'
import { createBrowserRouter ,RouterProvider } from 'react-router-dom'
import Login from './components/login'
import Mainlayout from './components/mainlayout'
import Home from './components/home'
import Profile from './components/profile'

const browserRouter=createBrowserRouter([
  {
    path:"/",
    element:<Mainlayout/>,
    children: [{path:"/",
      element:<Home/>},
    {
      path:"/profile",
      element:<Profile/>
    }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  }
])
function App() {
  

  return (
    <>
      <RouterProvider router={browserRouter}/>
      <Toaster/>
    </>
  )
}

export default App
