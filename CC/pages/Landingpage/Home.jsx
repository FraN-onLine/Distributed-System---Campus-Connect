import { useState, useRef, useEffect } from 'react';
import { animate, stagger } from 'motion';
import { splitText } from 'motion-plus';

import blurryLogo from '../../src/assets/ccislogo.svg';
import brandingLogo from '../../src/assets/ccis logo 1.svg';
import blurryTriangleYellow from '../../src/assets/blurryTriangle.svg';
import blurryTriangleBlue from '../../src/assets/blurryBlueTriangle.svg';
import Signup from '../Landingpage/Signup';
import Login from '../Landingpage/Login';
import Menu from '../../src/assets/menu.svg';
import Exit from '../../src/assets/exit.svg';

import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { MdContacts } from "react-icons/md";
import { IoLogInOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";

import '../../src/Css/Landingpagecss/Home.css';

function Home() {
  const [email, setEmail] = useState('');
  const [signupModal, signupState] = useState(false);
  const [loginModal, loginState] = useState(false);

  const headlineRef = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!headlineRef.current) return;

      headlineRef.current.style.visibility = 'visible';

      const { words } = splitText(headlineRef.current);

      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: 'spring',
          duration: 2,
          bounce: 0,
          delay: stagger(0.05),
        }
      );
    });
  }, []);

  return (
    <>
      <header>
        <div className="header-branding-div" id="HomeSection">
          <input type="checkbox" id="sidebar-active" />
          <label htmlFor="sidebar-active" className="open-sidebar-button">
            <img src={Menu} alt="" />
          </label>

          <div className="links-container">
            <label htmlFor="sidebar-active" className="close-sidebar-button">
              <img src={Exit} alt="" />
            </label>

            <a href="#HomeSection"><IoHomeOutline size={'15px'} /> Home</a>
            <a href="#FeaturesSection"><MdOutlineFeaturedPlayList size={'15px'} /> Features</a>
            <a href="#AboutSection"><IoIosInformationCircle size={'15px'} /> About</a>
            <a href="#ContactSection"><MdContacts /> Contact</a>
            <a onClick={() => signupState(true)}><MdOutlinePersonOutline size={'15px'} /> Sign up</a>
            <a onClick={() => loginState(true)}><IoLogInOutline size={'15px'} /> Login</a>
          </div>

          <img src={brandingLogo} alt="ccis.logo" className="header-logo" />
          <h1><span className="design-1">C</span>CIS <span className="design-1">C</span>ONNECT</h1>
        </div>

        <nav>
          <ul>
            <li><a href="#HomeSection">Home</a></li>
            <li><a href="#FeaturesSection">Features</a></li>
            <li><a href="#AboutSection">About</a></li>
            <li><a href="#ContactSection">Contact</a></li>
            <li><a onClick={() => signupState(true)}>Sign up</a></li>
            <li><a onClick={() => loginState(true)}>Login</a></li>
          </ul>
        </nav>
      </header>

      <div className="content">
        <div className="homeSection">
          <div className="homesection-upper">
            <div className="home-left">
              <h2 ref={headlineRef} style={{ visibility: "hidden" }}>
                Connecting CCIS Minds, One Click at a Time
              </h2>
            </div>
            <div className="home-right">
              <img src={brandingLogo} alt="ccislogo" className="ccis-logo" />
            </div>
          </div>

          <div className="homesection-lower">
            <div className="homesection-email-div">
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className='submitButton' onClick={() => signupState(true)}>Submit</button>
            </div>
          </div>

          <img src={blurryTriangleYellow} alt="ccislogo" className="bt-1" />
          <img src={blurryTriangleBlue} alt="ccislogo" className="bt-2" />
          <img src={blurryTriangleBlue} alt="ccislogo" className="bt-3" />
        </div>
      </div>

      {signupModal && <Signup email={email} closeSignup={signupState} signupShow={signupState} loginShow={loginState} />}
      {loginModal && <Login closeLogin={loginState} showlogin={loginState} showsignup={signupState} />}

    </>
  );
}

export default Home;
