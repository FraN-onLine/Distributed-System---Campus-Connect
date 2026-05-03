import Ccislogo from '../../src/assets/ccislogo.svg'
import '../../src/Css/Mainpage/Chatsection/Sidebar.css'
import { FaMessage, FaUpload} from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PHP_BASE_URL } from '../../src/config/api';


function Sidebar(){
     const useNav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
    
        const handleLogout = async () => {
          try {
            const response = await fetch(`${PHP_BASE_URL}/logout.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
            }
            });
            if (response.ok) {
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            localStorage.removeItem('currentroom');
            // Notify other tabs
            localStorage.setItem('logout', Date.now());
            setIsOpen(false);
            useNav('/');
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
        };

    useEffect(() => {
      const onStorage = (e) => {
        if (e.key === 'logout') {
          window.location.href = '/';
        }
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }, []);

    return(
    <>
      <button
        className="sidebar-fab"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div
        className={`sidebar-overlay${isOpen ? ' show' : ''}`}
        onClick={() => setIsOpen(false)}
      />

     {/*Aside start*/ }
      <aside className={`app-sidebar${isOpen ? ' open' : ''}`}>
        <div className="nav-header-logo">
          <img src={Ccislogo} alt="ccislogo" />
        </div>
       
         <div className="list-container">

    
         <ul className="nav-list">
              <li className="nav-item" onClick={() => { useNav('/Mainpage'); setIsOpen(false); }}>
               <a href="Mainpage" className="nav-link">
                  <FaMessage className='nav-icon'/> 
                  
               </a>

               <div className='tooltip' ><p>Message</p></div>
             </li>


          <li className="nav-item" onClick={() => { useNav('/Upload'); setIsOpen(false); }}>
               <a href="#" className="nav-link">
                  <FaUpload className='nav-icon'/>
               </a>
               <div className='tooltip'><p>Upload</p></div>
             </li>



              <li className="nav-item" onClick={handleLogout}>
               <a href="#" className="nav-link">
                  <CiLogout className='nav-icon'/>
               </a>
               <div className='tooltip'><p>Logout</p></div>
             </li>

             {/* <li className="nav-item">
               <a href="#" className="nav-link">
                  <CiLogout className='nav-icon'/>
               </a>
               <div className='tooltip'><p>Logout</p></div>
             </li> */}

         </ul>

         </div>
      </aside> 
        {/*Aside end*/ }
    </>
    );
}

export default Sidebar