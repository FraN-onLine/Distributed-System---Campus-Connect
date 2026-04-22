import * as motion from "motion/react-client";
import '../../src/Css/Landingpagecss/Features.css';

function CardBox(props , label) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
      className="card-container"
      style={{ cursor: "pointer" }} // optional styling to indicate interaction
    >
      <div className="image-container">
        <img src={props.imageSrc} alt="image.png" />
      </div>
      <p>{props.label}</p>
    </motion.div>
  );
}

export default CardBox;
