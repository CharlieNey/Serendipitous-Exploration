import React, { useEffect } from "react";

import './AboutUs.css'; // Import the CSS file

const About = ({ setShowNavbar }) => {
    useEffect(() => {
        setShowNavbar(true);
    }, []);

    return (
        <div>
            <h3>Background/About the Project</h3>
            <p>
            Carleton College provides students with extensive tools like Workday and the Academic Course Catalog for students to filter and search for classes. These search tools function well and are what all students use to search for classes currently. However, Carleton lacks tools that emphasize exploration and browsing. It is therefore our aim to build a tool that highlights the liberal arts experience. Our tool will function in tandem to the existing tools, to help students consider more unique classes, before they solidify their schedule and register using Workday. 
            </p>
            <p>
            Our main inspiration for this project comes from the research paper, The Bohemian Bookshelf: Supporting Serendipitous Book Discoveries through Information Visualization (Thudt, 2012). Researchers, Alice Thudt, Uta Hinrichs and Sheelagh Carpendale, created 5 visualizations of book collections aimed at encouraging “serendipitous discoveries” through highlighting different patterns and connections between books. We hope to emulate their success through encouraging students at Carleton College to have their own “serendipitous discoveries” when exploring courses to register for future terms. We seek to create our own tool to highlight unique connections between Carleton’s courses and use NLP tools on course descriptions.
            </p>

            <h3>The Model</h3>
            <p>
            Before applying our model, we had to filter out the course descriptions that were not relevant to our project. This includes all P.E. courses, courses that are only 1-2 credits, and courses that were missing data. Using this data, we implemented Gensim's Doc2Vec (Paragraph Vector) model to capture the semantic meaning of each course description in a multidimensional space. Unlike traditional bag-of-words models, which disregard word order and relationships, our Document Vectorizer enriches each representation with contextual and structural information, learning fixed-length vectors that encode both word frequencies and their sequences. By simultaneously training individual word vectors and a document vector, the model better captures overall meaning. With our courses vectorized, we used cosine similarity to compare them, calculating the cosine of the angle between vectors to measure their semantic closeness and to give us accurate course recommendations that we could finally use in creating the graph’s connections.
            </p>

            <h3>Our Web-App</h3>
            <p>
            The core feature of our project is a force-directed graph in which every node represents a unique course. With our Doc2Vec model, each node in the graph has a range of 3 to 8 connections to other nodes, depending on the quantity of strong connections a course has with other courses. Moreover, if there is a line between two courses, it means that their descriptions are similar, according to the model that we used. Our graph is navigable through hovers, clicks, and zooms and is connected to a search bar. Our web-app also has a calendar component such that a course that is saved by the user then populates in our built-in calendar to allow users to better visualize a potential schedule. We plan to implement more serendipitous-promoting features. 
            </p>

            <h3>Languages and Libraries</h3>
            <p>
            We used React.js, D3.js, CSS, and postgreSQL to create our web-app. 
            </p>

            <h3>Meet the Team</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
                <div style={{ textAlign: "center" }}>
                    <img
                        src="https://via.placeholder.com/150" // Replace with actual photo URL
                        alt="Team Member 1"
                        style={{ width: "100%", borderRadius: "50%" }}
                    />
                    <h4>Zoey La</h4>
                    <p>Fun Fact: [Fun Fact]</p>
                </div>

                <div style={{ textAlign: "center" }}>
                    <img
                        src="images/markus.png" 
                        alt="Team Member 2"
                        style={{ width: "100%", borderRadius: "50%" }}
                    />
                    <h4>Markus Gunadi</h4>
                    <p>Fun Fact: [Fun Fact]</p>
                </div>

                <div style={{ textAlign: "center" }}>
                    <img
                        src="https://via.placeholder.com/150" // Replace with actual photo URL
                        alt="Team Member 3"
                        style={{ width: "100%", borderRadius: "50%" }}
                    />
                    <h4>Kai Weiner</h4>
                    <p>Fun Fact: [Fun Fact]</p>
                </div>

                <div style={{ textAlign: "center" }}>
                    <img
                        src="https://via.placeholder.com/150" // Replace with actual photo URL
                        alt="Team Member 4"
                        style={{ width: "100%", borderRadius: "50%" }}
                    />
                    <h4>Willow Gu</h4>
                    <p>Fun Fact: [Fun Fact]</p>
                </div>

                <div style={{ textAlign: "center" }}>
                    <img
                        src="https://via.placeholder.com/150" 
                        alt="Team Member 5"
                        style={{ width: "100%", borderRadius: "50%" }}
                    />
                    <h4>Cathy Duan</h4>
                    <p>Fun Fact: [Fun Fact]</p>
                </div>

                <div style={{ textAlign: "center" }}>
                    <img
                        src="https://via.placeholder.com/150" 
                        alt="Team Member 6"
                        style={{ width: "100%", borderRadius: "50%" }}
                    />
                    <h4>Charlie Ney</h4>
                    <p>Fun Fact: [Fun Fact]</p>
                </div>
            </div>
        </div>
    );
};

export default About;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
