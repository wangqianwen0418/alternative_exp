import React from "react";
import Button from "@mui/material/Button";
import { generateQuestionOrder } from "../util/RNDM-questionBalance";

const CounterbalanceButton: React.FC = () => {
  const handleClick = () => {
    const questionOrder = generateQuestionOrder(
      // "d42ccc56-b330-427b-9b4f-d99b0a626b5b" // test uuid
      "d46741cf-57b6-43a1-a661-119204bb7a00" // test uuid
    );
    // console.log("Generated Question Order: ", questionOrder[0]);
    // console.log("Generated Question Indexes: ", questionOrder[1]);
    console.log("Generated Question Indexes: ", questionOrder);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Generate Question Order
    </Button>
  );
};

export default CounterbalanceButton;
