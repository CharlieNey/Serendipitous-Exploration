import React, { createContext, useState } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [nodes, setNodeList] = useState([]); // stores the list of courses fetched from the server, which act as the graph nodes
    const [links, setConnectionList] = useState([]); // stores the list of connections fetched from the server, which connect the graph nodes
    const [selectedNode, setSelectedNode] = useState("MUSC 204")

    const fetchNodes = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/nodes");
            const response_nodes = await response.json();
            // await setNodeList(response_nodes);
            
            const nodes = [];
            for (let i in response_nodes) {
                nodes.push({id : response_nodes[i]["id"]}) // grabs what will be course names
            }
            setNodeList(nodes)

        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/connections");
            const response_links = await response.json()
            // await setConnectionList(response_links);

            const links = []; 
            for (let i in response_links) { 
                links.push({source : response_links[i]["source"], target : response_links[i]["target"], score : response_links[i]["similarity"]}) // grabs source and target
            }
            setConnectionList(links)
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    return (
        <GraphContext.Provider
            value={{
                selectedNode,
                nodes,
                links,
                setSelectedNode,
                fetchNodes,
                fetchLinks
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};