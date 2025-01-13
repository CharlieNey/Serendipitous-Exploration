import React, { createContext, useState, useEffect, useContext } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [nodes1, setNodeList] = useState([]); // stores the list of courses fetched from the server
    const [links1, setConnectionList] = useState([]); // stores the list of courses fetched from the server
    const [isLoading, setIsLoading] = useState(true); // loading state (true while data is being fetched)

    const fetchNodes = async () => {
        try {
            // console.log("1")
            const response = await fetch("http://localhost:3001/api/nodes");
            const response_nodes = await response.json()
            // console.log("3")
            // console.log(response_nodes)
            setNodeList(response_nodes);
            console.log(nodes1)
            
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    const nodes = [
    {name: 'SOAN111'},
    {name: 'SOAN110'},
    {name: 'STAT120'},
    {name: 'CS201'},
    {name: 'CAMS254'},
    {name: 'CHEM123'},
    {name: 'CGSC130'},
    {name: 'ECON265'}
    ]

    const links = [
    {source: 0, target: 1},
    // {source: 0, target: 2},
    // {source: 0, target: 3},
    // {source: 6, target: 4},
    // {source: 3, target: 5},
    // {source: 3, target: 6},
    // {source: 6, target: 7}
    ]

    // /**
    //  * Fetches all nodes when the App.js component mounts.
    //  */
    // useEffect(() => {
    //     fetchNodes();
    // }, []);

    return (
        <GraphContext.Provider
            value={{
                searchTerm,
                setSearchTerm,
                nodes1,
                links1,
                isLoading,
                fetchNodes,
                nodes,
                links
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};