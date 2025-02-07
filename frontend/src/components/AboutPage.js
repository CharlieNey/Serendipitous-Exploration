import React, { useEffect } from "react";

const About = ({ setShowNavbar }) => {
    useEffect(() => {
        setShowNavbar(true);
    }, []);

    return(
        <div>
            <h3> What is this project? (haha def change this zoey)</h3>
            <h6> stuff about our project: description of project as whole, more details regarding NLP, then details about frontend</h6>
            <h3> A little about us:</h3>
            <h6> photo, name, hometown, funfact...,  </h6>
        </div>
    )
};

export default About;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
