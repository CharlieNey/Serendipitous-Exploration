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
-- \COPY similarities (id, target, similarity)FROM '//Users/cathy/Desktop/carleton/senior_year/comps/Serendipitous-Exploration/backend/data/graph_data/charlie_graph.csv'DELIMITER  ',' CSV HEADER;
CREATE TABLE Nodes (
    id text
);
CREATE TABLE Connections (
  source text,
  target text
);


INSERT INTO 
    Nodes (id)
SELECT DISTINCT id FROM similarities
ORDER BY id;

INSERT INTO 
    Connections (source, target)
SELECT id, target FROM similarities;
