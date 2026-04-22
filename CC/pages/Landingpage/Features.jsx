import '../../src/Css/Landingpagecss/Features.css';
import CardBox from './cardBox';  {/*importing the cardBox component*/}
import brandingIcon from '../../src/assets/ccislogo.svg'
import Chatfeature from '../../src/assets/Features_images/ChatFeature.png'
import Chatfeature2 from '../../src/assets/Features_images/Createroom&Chatlist.png'
import Chatfeature3 from '../../src/assets/Features_images/uploadFiles.png'
import Chatfeature4 from '../../src/assets/Features_images/Add_document.png'
import Chatfeature5 from '../../src/assets/Features_images/search.png'
import Chatfeature6 from '../../src/assets/Features_images/Contacts.png'
import backgroundTriangle from '../../src/assets/triangleBackground.svg'

function Features(){
     {/*this will return the feature component*/}
   return(
    <>
       <div className="featuresSection" id='FeaturesSection'>
            <div className="featuresHeader">
                <h2><span className='design-1'>E</span>xplore the Features of CCIS Connect</h2>
            </div>
            
            <div className="feature-summary-card">
                 <CardBox imageSrc={Chatfeature} label="Chat Feature"/>
                 <CardBox imageSrc={Chatfeature2} label="Create Room & Chat List"/>
                 <CardBox imageSrc={Chatfeature3} label="Upload Files"/>
                 <CardBox imageSrc={Chatfeature4} label="Add Document"/>
                 <CardBox imageSrc={Chatfeature5} label="Search"/>
                 <CardBox imageSrc={Chatfeature6} label="Contacts"/>
            </div>

            <div className="floating-ccis">
                <h2><span className='design-1'>C</span></h2>
                <h2>C</h2>
                <h2>I</h2>
                <h2>S</h2>
            </div>

            <img src={backgroundTriangle} alt="none" className='triangle-background-1'/>
   

       </div>

     
       
    </>
   );
}
export default Features;