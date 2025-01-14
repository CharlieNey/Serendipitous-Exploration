DROP TABLE IF EXISTS Nodes;
DROP TABLE IF EXISTS Connections;
CREATE TABLE Nodes (
    id text
);
CREATE TABLE Connections (
  source text,
  target text
);

INSERT INTO
    Nodes (id)
VALUES
    ('Bat'),
    ('Rat'),
    ('Cat'),
    ('Mat'),
    ('Sat'),
    ('Pat'),
    ('George');

INSERT INTO
    Connections (source, target)
VALUES 
    ('Bat', 'Rat'),
    ('Sat', 'Pat'),
    ('Pat', 'Cat');