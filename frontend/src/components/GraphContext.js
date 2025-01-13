import React, { createContext, useState, useEffect, useContext } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [nodes2, setNodeList] = useState([]); // stores the list of courses fetched from the server
    const [links2, setConnectionList] = useState([]); // stores the list of courses fetched from the server
    const [isLoading, setIsLoading] = useState(true); // loading state (true while data is being fetched)

    const fetchNodes = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/nodes");
            const response_nodes = await response.json();
            await setNodeList(response_nodes);
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/connections");
            const response_links = await response.json()
            await setConnectionList(response_links);
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    const nodes1 = [
    {name: 'Bat'},
    {name: 'Cat'},
    {name: 'Sat'},
    {name: 'Pat'},
    {name: 'Rat'},
    {name: 'sl;dfjal;jk'},
    ]


    // const nodes1 = [
    // {name: 'SOAN111'},
    // {name: 'SOAN110'},
    // {name: 'STAT120'},
    // {name: 'CS201'},
    // {name: 'CAMS254'},
    // {name: 'CHEM123'},
    // {name: 'CGSC130'},
    // {name: 'ECON265'}
    // ]

    const links1 = [
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
    //     console.log("Fetching")
    //     fetchNodes();
    //     fetchLinks();

    //     console.log("Fetched")
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
                fetchLinks,
                nodes2,
                links2
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};