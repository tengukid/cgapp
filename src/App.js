import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  background-color: #32CD32; /* Set your desired background color here */
  padding: 20px; /* Optional padding */
`;

const GridItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 16px;
  background-color: #fff;
`;

const MovieImage = styled.img`
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ddd;
`;

const SearchBar = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const ListGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-bottom: 20px;
`;

const ListGridItem = styled.li`
  list-style: none;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  background-color: #fff;
`;

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('https://api.disneyapi.dev/character');
        const data = await response.json();
        setCharacters(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    getData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SearchBar
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <FilteredCharacterList characters={filteredCharacters} />
      <GridContainer>
        {filteredCharacters.map((character) => (
          <GridItem key={character._id}>
            <MovieImage src={character.imageUrl} alt={character.name} />
            <h3>{character.name}</h3>
            <p>{character.tvShows.join(', ')}</p>
          </GridItem>
        ))}
      </GridContainer>
    </div>
  );
};

const FilteredCharacterList = ({ characters }) => {
  return (
    <ListGridContainer>
      {characters.map((character) => (
        <ListGridItem key={character._id}>{character.name}</ListGridItem>
      ))}
    </ListGridContainer>
  );
};

export default App;
