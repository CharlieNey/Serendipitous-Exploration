DROP TABLE IF EXISTS Nodes;
DROP TABLE IF EXISTS Connections;
DROP TABLE IF EXISTS Similarities; 

-- We do not do anything with the similarity at this point --
CREATE TABLE Similarities ( 
    id text, 
    target text, 
    similarity float
);

-- TO FILL IN SIMILARITIES TABLE DATA: 
\COPY similarities (id, target, similarity)FROM 'data/graph_data/charlie_graph.csv'DELIMITER  ',' CSV HEADER;
CREATE TABLE Nodes (
    id text
);
CREATE TABLE Connections (
  source text,
  target text,
  similarity float
);


INSERT INTO 
    Nodes (id)
SELECT DISTINCT id FROM similarities
ORDER BY id;

INSERT INTO 
    Connections (source, target, similarity)
SELECT id, target, similarity FROM similarities;
