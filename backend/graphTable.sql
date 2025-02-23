DROP TABLE IF EXISTS Nodes;
DROP TABLE IF EXISTS Similarities;
DROP TABLE IF EXISTS Connections; -- For people with the old Connections table-- 

CREATE TABLE Similarities (
  source text,
  target text,
  similarity_score float,
  desc1 text,
  desc2 text, 
  similarity_word text,
  highlight_word text
);

\COPY similarities (source, target, similarity_score, desc1, desc2, similarity_word, highlight_word) FROM 'data/graph_data/current_graph_data.csv' DELIMITER  ',' CSV HEADER;

CREATE TABLE Nodes (
    id text
);

-- To get distinct nodes -- 
INSERT INTO 
    Nodes (id)
SELECT DISTINCT source FROM Similarities
ORDER BY source;