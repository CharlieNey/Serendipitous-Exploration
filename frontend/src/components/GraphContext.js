import React, { createContext, useState, useEffect } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [nodes, setNodeList] = useState([]); // stores the list of courses fetched from the server, which act as the graph nodes
    const [links, setConnectionList] = useState([]); // stores the list of connections fetched from the server, which connect the graph nodes
    const [selectedNode, setSelectedNode] = useState("")
    const[connectedNodes, setConnectedNodes] = useState([]);
    const [minval, setMinval] = useState(0);

    const fetchNodes = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/nodes");
            const response_nodes = await response.json();
            
            const nodes = [];
            for (let i in response_nodes) {
                nodes.push({id : response_nodes[i]["id"].split('-')[0]}) // grabs what will be course names
            }
            setNodeList(nodes)

        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    function getMinVal(links) {
        var min = links[0].score
        for (var i in links) {
        if (min > links[i].score) {
            min = links[i].score
        }
        }
        return min
    }

    const fetchNodesConnections = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/similarities");
            const response_links = await response.json()

            const links = []; 
            for (let i in response_links) { 
                links.push({source : response_links[i]["source"].split('-')[0], target : response_links[i]["target"].split('-')[0], score : response_links[i]["similarity_score"], desc1 : response_links[i]["desc1"], desc2 : response_links[i]["desc2"], word : response_links[i]["similarity_word"]})
            }
            
            setMinval(getMinVal(links))
            setConnectionList(links) // establishes the links between nodes

            var connections = {}
            for (var i in links) {
              var node1 = links[i].source.split('-')[0]
              var node2 = links[i].target.split('-')[0]
          
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

            setConnectedNodes(connections) // establishes a 'group' of similar courses necessary for hover and clicknode
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    useEffect(() => {
        fetchNodes();
        fetchNodesConnections();
    }, []);

    return (
        <GraphContext.Provider
            value={{
                selectedNode,
                nodes,
                links,
                connectedNodes,
                minval,
                setSelectedNode,
                fetchNodes,
                fetchNodesConnections,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};