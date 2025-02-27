import React, { useEffect } from "react";

import './AboutUs.css'; // Import the CSS file

const About = ({ setShowNavbar }) => {
    useEffect(() => {
        setShowNavbar(true);
    }, []);

    return (
        // <div>
        //     <h3>Background/About the Project</h3>
            // <p>
            // Carleton College provides students with extensive tools like Workday and the Academic Course Catalog for students to filter and search for classes. These search tools function well and are what all students use to search for classes currently. However, Carleton lacks tools that emphasize exploration and browsing. It is therefore our aim to build a tool that highlights the liberal arts experience. Our tool will function in tandem to the existing tools, to help students consider more unique classes, before they solidify their schedule and register using Workday. 
            // </p>
        //     <p>
        //     Our main inspiration for this project comes from the research paper, The Bohemian Bookshelf: Supporting Serendipitous Book Discoveries through Information Visualization (Thudt, 2012). Researchers, Alice Thudt, Uta Hinrichs and Sheelagh Carpendale, created 5 visualizations of book collections aimed at encouraging “serendipitous discoveries” through highlighting different patterns and connections between books. We hope to emulate their success through encouraging students at Carleton College to have their own “serendipitous discoveries” when exploring courses to register for future terms. We seek to create our own tool to highlight unique connections between Carleton’s courses and use NLP tools on course descriptions.
        //     </p>

        //     <h3>The Model</h3>
        //     <p>
        //     Before applying our model, we had to filter out the course descriptions that were not relevant to our project. This includes all P.E. courses, courses that are only 1-2 credits, and courses that were missing data. Using this data, we implemented Gensim's Doc2Vec (Paragraph Vector) model to capture the semantic meaning of each course description in a multidimensional space. Unlike traditional bag-of-words models, which disregard word order and relationships, our Document Vectorizer enriches each representation with contextual and structural information, learning fixed-length vectors that encode both word frequencies and their sequences. By simultaneously training individual word vectors and a document vector, the model better captures overall meaning. With our courses vectorized, we used cosine similarity to compare them, calculating the cosine of the angle between vectors to measure their semantic closeness and to give us accurate course recommendations that we could finally use in creating the graph’s connections.
        //     </p>

        //     <h3>Our Web-App</h3>
        //     <p>
        //     The core feature of our project is a force-directed graph in which every node represents a unique course. With our Doc2Vec model, each node in the graph has a range of 3 to 8 connections to other nodes, depending on the quantity of strong connections a course has with other courses. Moreover, if there is a line between two courses, it means that their descriptions are similar, according to the model that we used. Our graph is navigable through hovers, clicks, and zooms and is connected to a search bar. Our web-app also has a calendar component such that a course that is saved by the user then populates in our built-in calendar to allow users to better visualize a potential schedule. We plan to implement more serendipitous-promoting features. 
        //     </p>

        //     <h3>Languages and Libraries</h3>
        //     <p>
        //     We used React.js, D3.js, CSS, and postgreSQL to create our web-app. 
        //     </p>
    <div class="container">
        <div class="left-section">
            <div class="about">
                <h3 class="background">Background</h3>
                <p class="p-about"> Carleton College provides students with extensive tools like Workday and the Academic Course Catalog for students to filter and search for classes. These search tools function well and are what all students use to search for classes currently. However, Carleton lacks tools that emphasize exploration and browsing. It is therefore our aim to build a tool that highlights the liberal arts experience. Our tool will function in tandem to the existing tools, to help students consider more unique classes, before they solidify their schedule and register using Workday. </p>
                <p class="p-about"> Our main inspiration for this project comes from the research paper, The Bohemian Bookshelf: Supporting Serendipitous Book Discoveries through Information Visualization (Thudt, 2012). Researchers, Alice Thudt, Uta Hinrichs and Sheelagh Carpendale, created 5 visualizations of book collections aimed at encouraging “serendipitous discoveries” through highlighting different patterns and connections between books. We hope to emulate their success through encouraging students at Carleton College to have their own “serendipitous discoveries” when exploring courses to register for future terms. We seek to create our own tool to highlight unique connections between Carleton’s courses and use NLP tools on course descriptions. </p>
            </div>
            <div class="about">
                <h3 class="our-data">Our Data</h3>
                <p class="p-about">Our data includes 6 credit courses offered in the Spring 2025 term at Carleton College (excluding seminar and capstone courses). It includes only one section for each class, so if you’re curious if a course offers additional sections, please check Carleton’s Course Catalog. </p>
            </div>
            <div class="about">
                <h3 class="the-model">The Model</h3>
                <p class="p-about">Before applying our model, we had to filter out the course descriptions that were not relevant to our project. This includes all P.E. courses, courses that are only 1-2 credits, and courses that were missing data. Using this data, we implemented Gensim's Doc2Vec (Paragraph Vector) model to capture the semantic meaning of each course description in a multidimensional space. Unlike traditional bag-of-words models, which disregard word order and relationships, our Document Vectorizer enriches each representation with contextual and structural information, learning fixed-length vectors that encode both word frequencies and their sequences. By simultaneously training individual word vectors and a document vector, the model better captures overall meaning. With our courses vectorized, we used cosine similarity to compare them, calculating the cosine of the angle between vectors to measure their semantic closeness and to give us accurate course recommendations that we could finally use in creating the graph’s connections. </p>
            </div>
            <div class="about">
                <h3 class="our-web-app">Our Web-App</h3>
                <p class="p-about">The core feature of our project is a force-directed graph in which every node represents a unique course. With our Doc2Vec model, each node in the graph has a range of 3 to 8 connections to other nodes, depending on the quantity of strong connections a course has with other courses. Moreover, if there is a line between two courses, it means that their descriptions are similar, according to the model that we used. Our graph is navigable through hovers, clicks, and zooms and is connected to a search bar. Our web-app also has a calendar component such that a course that is saved by the user then populates in our built-in calendar to allow users to better visualize a potential schedule. We plan to implement more serendipitous-promoting features.  </p>
            </div>
            <div class="about">
                <h3 class="languages-libraries" >Languages and Libraries</h3>
                <p class="p-about">We used React.js, D3.js, CSS, and postgreSQL to create our web-app.</p>
            </div>
        </div>
        <div class="right-section">
            <h3 class="team">meet the team!</h3>
            <div class="team-grid">
                <div class="team-member">
                    <h4>Zoey La, '25</h4>
                    <p>Computer Science Major, Math Minor</p>
                </div>
                <div class="team-member">
                    <h4>Markus Gunadi, '25</h4>
                    <p> Computer Science and Cinema and Media Studies Major</p>
                </div>
                <div class="team-member">
                    <h4>Kai Weiner, '25</h4>
                    <p> Computer Science Major</p>
                </div>
                <div class="team-member">
                    <h4>Willow Gu, '25</h4>
                    <p> Computer Science and Cognitive Science Major</p>
                </div>
                <div class="team-member">
                    <h4>Cathy Duan, '25</h4>
                    <p> Computer Science Major</p>
                </div>
                <div class="team-member">
                    <h4>Charlie Ney, '25</h4>
                    <p> Computer Science Major</p>
                </div>
            </div>
            <h3 class="team">FAQ</h3>
            <div class="team-member">
                <h3 class="languages-libraries" >How do we decide if a course is similar?</h3>
                <p class="p-about">Once our course descriptions are vectorized as is described in "The Model" section, we are able to use cosine similarity to calculate the distance between each course. In other words, we can calculate relative distances, which hopefully indicate semantic/structural similarity in descriptions. If a pair of courses are similar enough to pass a threshold that we set, we will draw a line between each of their nodes on our graph. </p>
            </div>
            <div class="team-member">
                <h3 class="languages-libraries" >What do the words on the lines mean? </h3>
                <p class="p-about">Each course connection includes two words, each representing the most similar term from the other course’s description. These words are identified using a Word2Vec model, which, like the Doc2Vec model underlying our graph, captures semantic relationships. However, Word2Vec is specifically designed for individual words rather than entire documents. This feature provides a simplified representation of how our Doc2Vec model functions, making its behavior easier to interpret. Additionally, upon hovering over the words on a line, if one of the words is in the description currently opened, that word will be highlighted. </p>
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
