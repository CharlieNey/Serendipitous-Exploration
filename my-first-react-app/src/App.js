import logo from './carleton_logo.png';
import './App.css';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Data from './courses2.csv';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true
      }).data;
      setData(parsedData);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
    
      {data.length ? (
        <table className = "table">
          <thead>
            <tr>
              <th>Course Number</th>
              <th>Course Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody> 
            {data.map((row,index)=> (
              //table row element for each row
              <tr key= {index}>
                <td>{row.Course_Number}</td>
                <td>{row.Course_Title}</td>
                <td>{row.Description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
       {/* //conditional rendering expression; if greater than 0, render the content */}


      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>CS399: Serendipitous Exploration of the Carleton Curriculum </h1>
        <h3>Cathy Duan, Charlie Ney, Markus Gunadi, Kai Weiner, Zoey La, Willow Gu</h3>
      </header>
    </div>
  );
}

export default App;
