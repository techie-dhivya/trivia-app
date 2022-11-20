import "./styles.css";
import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function App() {
  // state handles

  const [quesOptions, setquesOptions] = React.useState(
    Array.from({ length: 6 }, (_, i) => (i + 1) * 5)
  );
  const [catOptions, setcatOptions] = React.useState([]);
  const [diffOptions, setdiffOptions] = React.useState([
    "easy",
    "medium",
    "hard"
  ]);

  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [displayquestion, setdisplayquestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [questions, setQuestions] = React.useState([]);
  const [showScore, setShowScore] = React.useState(false);
  const [text, setText] = React.useState("");

  // fetching trivia categories

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((json) => {
        var triviaCategories = json.trivia_categories;
        var categories = [];
        triviaCategories.forEach((key, value) => {
          let temp = {};
          temp.value = key.id;
          temp.label = key.name;
          categories.push(temp);
        });
        setcatOptions(categories);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  // fetching questions based on the chosen values

  const handleSubmit = (event) => {
    event.preventDefault();
    if (question != "" && category != "" && difficulty != "" && name != "") {
      fetch(
        "https://opentdb.com/api.php?amount=" +
          question.value +
          "&category=" +
          category.value +
          "&difficulty=" +
          difficulty.value +
          "&type=multiple",
        {
          method: "GET"
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setQuestions(json.results);
          setdisplayquestion(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Please fill all required fields");
    }
  };

  // check the answer is write or not

  const handleClick = (isCorrect) => {
    let scorevalue = score;
    if (isCorrect) {
      setScore(score + 1);
      scorevalue = score+1;
    }else{
      setScore(score - 1);
      scorevalue = score-1;
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      let cpercentage = (scorevalue/question.value) * 100;
      let ftext = ""
      if(cpercentage == 100){
        ftext = "WOW! You are a Genius "+name+"!!!"
      }else if(cpercentage > 80 && cpercentage < 100){
        ftext = "Great Job "+name+" !"
      }else if(cpercentage > 50 && cpercentage < 80){
        ftext = "You could do better "+name+"."
      }else{
        ftext = "Oh No! You need some groundwork "+name+"!"
      }
      setText(ftext)
      setShowScore(true);
    }
  };

  // reset again

  const handlePlayAgain = () => {
    setShowScore(false);
    setdisplayquestion(false);
    setName("")
    setQuestion("")
    setCategory("")
    setDifficulty("")
    setCurrentQuestion(0)
    setScore(0)
    setQuestions([])
  };

  return (
    <div className="app">
      {showScore ? (
        <>
          <section className="showScore-section">
            <p>Your score</p>
            <span> <b>{score}</b></span>
        
            <p className="result-phrase">{text}</p>
            <button className="play-again" onClick={handlePlayAgain}>Play Again</button>
          </section>
        </>
      ) : (
        <>
          {displayquestion ? (
            <>
              {" "}
              <section className="question-section">
                <h1>
                  Question {currentQuestion + 1}/{questions.length}
                </h1>
                <p>{questions[currentQuestion].question}</p>
              </section>
              <section className="answer-section">
                {questions[currentQuestion].incorrect_answers.map((item) => (
                  <button onClick={() => handleClick(false)}>{item}</button>
                ))}
                <button onClick={() => handleClick(true)}>
                  {questions[currentQuestion].correct_answer}
                </button>
              </section>
            </>
          ) : (
            <>
              <section className="question-section">
                <h1>Trivia Time</h1>
                <p></p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="Name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Dropdown
                    className="trivia-select"
                    options={quesOptions}
                    onChange={(option) => setQuestion(option)}
                    value={question}
                    placeholder="Choose number of questions"
                  />
                  <Dropdown
                    className="trivia-select"
                    options={catOptions}
                    onChange={(option) => setCategory(option)}
                    value={category}
                    placeholder="Choose category"
                  />
                  <Dropdown
                    className="trivia-select"
                    options={diffOptions}
                    onChange={(option) => setDifficulty(option)}
                    value={difficulty}
                    placeholder="Choose difficulty"
                  />
                  <input type="submit" value="Start Trivia" />
                </form>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
