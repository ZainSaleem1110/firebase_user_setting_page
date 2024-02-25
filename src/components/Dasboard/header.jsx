import React from 'react'
import Logo from '../../assets/images/LOGO.png'
import { useNavigate } from "react-router-dom";
import {signOut, auth} from '../../services/config'

function Header() {
    const navigate = useNavigate()

    const handleLogout = () => {
      signOut(auth).then(() => {
        localStorage.clear()
            navigate("/");
        }).catch((error) => {
        // An error happened.
        });
    }

  return (
    <div className="header">
        <img src={Logo} alt="logo" />
        <button style={{width:"100px"}} className="button" onClick={()=>{
            handleLogout()
        }}>Logout</button>
    </div>
  )
}

export default Header