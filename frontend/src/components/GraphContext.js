import React, { createContext, useState } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [nodes, setNodeList] = useState([]); // stores the list of courses fetched from the server, which act as the graph nodes
    const [links, setConnectionList] = useState([]); // stores the list of connections fetched from the server, which connect the graph nodes
    const [selectedNode, setSelectedNode] = useState("")
    const[connectedNodes, setConnectedNodes] = useState([]);

    const fetchNodes = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/nodes");
            const response_nodes = await response.json();
            
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

            const links = []; 
            for (let i in response_links) { 
                links.push({source : response_links[i]["source"], target : response_links[i]["target"], score : response_links[i]["similarity"]}) // grabs source and target
            }
            setConnectionList(links)
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    const fetchNodesConnections = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/connections");
            const response_links = await response.json()

            const links = []; 
            for (let i in response_links) { 
                links.push({source : response_links[i]["source"], target : response_links[i]["target"], score : response_links[i]["similarity"]}) // grabs source and target
            }

            var connections = {}
            for (var i in links) {
              var node1 = links[i].source
              var node2 = links[i].target
          
              if(node1 in connections) {
                if(!connections[node1].includes(node2)){ // if node2 is not in node1 
                    connections[node1].push(node2) // push node2 to node1
                }
              } else {
                connections[node1] = [node2] // if node1 is not in connections, make node2 the first in list
              }
          
              if(node2 in connections) {
                if(!connections[node2].includes(node1)){
                    connections[node2].push(node1)
                }
              } else {
                connections[node2] = [node1]
              }
            }

            setConnectedNodes(connections)
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
                connectedNodes,
                setSelectedNode,
                fetchNodes,
                fetchLinks,
                fetchNodesConnections,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};