export default function Interpretation({ isSubmitted, setIsSubmitted }: props) {
    const [userInput, setUserInput] = useState("");
    const [parsedData, setParsedData] = useState({
      feature: "",
      relation: "",
      prediction: "",
      condition: "",
    });
  
    const parseInput = (input: string) => {
      const doc = nlp(input);
  
      const features = {
        "age": ["age", "years"],
        "sex": ["sex", "gender"],
        "bmi": ["bmi", "body mass index"],
        "bp": ["bp", "blood pressure"],
        "s1": ["s1"],
        "s2": ["s2"],
        "s3": ["s3"],
        "s4": ["s4"],
        "s5": ["s5"],
        "s6": ["s6"]
      };
  
      const predictions = {
        "diabetes risk": ["diabetes risk", "risk of diabetes"],
        "diabetes progression": ["diabetes progression", "progression of diabetes"]
      };
  
  
  
  
  
      const feature = doc.match('#Noun').first().text(); // Example heuristic
      const relation = doc.match('#Adjective+ #Noun+').text(); // Example heuristic
      const prediction = doc.match('diabetes risk').text(); // Example heuristic
      const condition = doc.match('when [#Noun #Comparative #Value]').text(); // Example heuristic
      setParsedData({ feature, relation, prediction, condition });
      console.log("feature: ", feature);
      console.log("relation: ", relation);
      console.log("prediction: ", prediction);
      console.log("condition: ", condition)
    
    
    
    
    
    };


    