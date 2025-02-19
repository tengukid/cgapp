import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './index.css';  // Make sure to import your CSS file

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  background-color: #335333;
  padding: 20px;
`;

const GridItem = styled.div`
  perspective: 1000px;
`;

const FlipInner = styled.div`
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;

const FlipFront = styled.div`
  backface-visibility: hidden;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 16px;
  background-color: #fff;
`;

const FlipBack = styled.div`
  backface-visibility: hidden;
  transform: rotateY(180deg);
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 16px;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const MovieImage = styled.img`
  width: 100%;
  height: auto;
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

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = (event) => {
    event.stopPropagation();
    setCount(count + 1);
  };

  const handleDecrement = (event) => {
    event.stopPropagation();
    setCount(count - 1);
  };

  return (
    <CounterContainer>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
      <p>Count: {count}</p>
    </CounterContainer>
  );
};

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [flipped, setFlipped] = useState({});

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

  const toggleFavorite = (character) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav._id === character._id)
        ? prevFavorites.filter((fav) => fav._id !== character._id)
        : [...prevFavorites, character]
    );
  };

  const handleFlip = (id) => {
    setFlipped((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SearchBar
        type="text"
        placeholder="Search characters..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <GridContainer>
        {filteredCharacters.map((character) => (
          <GridItem key={character._id} onClick={() => handleFlip(character._id)}>
            <FlipInner className="flip-inner" flipped={flipped[character._id]}>
              <FlipFront>
                <MovieImage src={character.imageUrl} alt={character.name} />
                <h3>{character.name}</h3>
                <button
                  onClick={() => toggleFavorite(character)}
                  className={`p-2 rounded ${favorites.some(fav => fav._id === character._id) ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}
                >
                  {favorites.some(fav => fav._id === character._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </FlipFront>
              <FlipBack>
                <h3>{character.name}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
              </FlipBack>
            </FlipInner>
            <Counter />
          </GridItem>
        ))}
      </GridContainer>
    </div>
  );
};

export default App;
