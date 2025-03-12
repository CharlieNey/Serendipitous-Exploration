/**
 * @file GraphContext.js
 * @description Loads and manages state variables facilitating creation of the graph and department recommendations. Allows other files to access these variables.
 * @authors Cathy, Kai, Willow, Zoey
 * @date 3/12/25
 */

import React, { createContext, useState, useEffect } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [nodes, setNodeList] = useState([]); // stores the list of courses fetched from the server, which act as the graph nodes
    const [links, setConnectionList] = useState([]); // stores the list of connections fetched from the server, which connect the graph links
    const [selectedNode, setSelectedNode] = useState("") // stores the node that is attempting to be selected
    const[connectedNodes, setConnectedNodes] = useState([]); // stores a list mapping a node to list of similar nodes
    const [minval, setMinval] = useState(0); // stores the minimum similarity for the course similarities
    const [departmentRecommendations, setDepartmentRecommendations] = useState([]) // stores a list mapping departments to their recommended departments
    const [clickedQueue, setClickedQueue] = useState([]) // stores the queue of nodes that have been clicked by the user

    /**
     * Saves the list mapping departments to a list of recommended departments in departmentRecommendations.
     * @returns {void}
     */
    const fetchDepartmentRecommendations = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/department-recommendations");
            const response_array = await response.json();
            
            const depRecs = [];
            for (let i in response_array) {
                depRecs.push({department : response_array[i]["department"], recommendations : response_array[i]["top_5_recommended"].split(",")}) // grabs what will be course names
            }
            setDepartmentRecommendations(depRecs)

        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    /**
     * Stores the list of course nodes as nodes or throws an error.
     * @returns {void}
    */
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

    /**
    * Returns the minimum similarity score from a list of links.
    * @param {list} links - a list of links
    * @return {int} min - the minimum similarity score contained in the input list of links.
    */
    function getMinVal(links) {
        var min = links[0].score
        for (var i in links) {
        if (min > links[i].score) {
            min = links[i].score
        }
        }
        return min
    }

    /**
    * Stores the list of course connections in links, the minimum similarity score within the linsk in min,
    * and the list mapping a node to list of similar nodes to connectedNodes.
    * @return {void}
    */
    const fetchNodesConnections = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/similarities");
            const response_links = await response.json()

            const links = []; 
            for (let i in response_links) { 
                links.push({source : response_links[i]["source"].split('-')[0], target : response_links[i]["target"].split('-')[0], score : response_links[i]["similarity_score"], desc1 : response_links[i]["desc1"], desc2 : response_links[i]["desc2"], word : response_links[i]["highlight_words"]})
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

            setConnectedNodes(connections)
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    /**
    * Initializes the data necessary to create the graph, scale its coloring, and determine its clicking behavior, and department recommendations.
    * @return {void}
    */
    useEffect(() => {
        fetchNodes();
        fetchNodesConnections();
        fetchDepartmentRecommendations();
    }, []);

    return (
        <GraphContext.Provider
            value={{
                selectedNode,
                nodes,
                links,
                connectedNodes,
                minval,
                departmentRecommendations,
                clickedQueue,
                setSelectedNode,
                fetchNodes,
                fetchNodesConnections,
                setClickedQueue,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};