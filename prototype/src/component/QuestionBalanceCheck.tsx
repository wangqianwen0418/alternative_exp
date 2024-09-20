import React from "react";
import Button from "@mui/material/Button";
import { generateQuestionOrder } from "../util/questionBalance";

const CounterbalanceButton: React.FC = () => {
  const handleClick = () => {
    const questionOrder = generateQuestionOrder();
    console.log("Generated Question Order: ", questionOrder);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Generate Question Order
    </Button>
  );
};

export default CounterbalanceButton;
