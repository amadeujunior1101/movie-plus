import { ChangeEvent, FC, useState } from 'react';

interface ISearch {
  onSearch: (search: string) => void;
}

const SearchBar: FC<ISearch> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-3 pl-10 rounded-full focus:outline-none focus:ring focus:border-blue-500 text-lg"
          placeholder="Digite algo..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 rounded-full pl-7 pr-7 px-4 pl cursor-pointer absolute inset-y-0 right-0"
          onClick={handleSearch}
        >
          <span className="text-white">Buscar</span>
        </button>
      </div>
    </div>
  );
};

export { SearchBar };
