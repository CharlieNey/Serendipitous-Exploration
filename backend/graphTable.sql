DROP TABLE IF EXISTS Nodes;
DROP TABLE IF EXISTS Similarities;
DROP TABLE IF EXISTS Connections; -- For people with the old Connections table-- 

CREATE TABLE Similarities (
  source TEXT,
  target TEXT,
  similarity_score FLOAT,
  desc1 TEXT,
  desc2 TEXT, 
  keywords1 TEXT,
  keywords2 TEXT,
  highlight_words TEXT
);

\COPY Similarities (source, target, similarity_score, desc1, desc2, keywords1, keywords2, highlight_words) FROM 'data/graph_data/current_graph_data.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE Nodes (
    id TEXT
);

-- To get distinct nodes -- 
INSERT INTO 
    Nodes (id)
SELECT DISTINCT source FROM Similarities
ORDER BY source;
