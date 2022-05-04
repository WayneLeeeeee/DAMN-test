import React, { useState, useEffect } from "react";
import { AppBar, InputBase, Toolbar } from "@material-ui/core";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { height } from "@mui/system";
import { Button } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import algolia from "../../algolia";
import { Search } from "semantic-ui-react";
import useSearch from "../../hooks/useSearch";

function SearchBar() {
  const handleClick = () => {};

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [recipeResults, setRecipeResults] = useState([]);
  const [query, setQuery] = useState("");
  const results = useSearch("recipes", query);
  console.log(results);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("query");
  console.log(q);

  function onSearchChange(e, { value }) {
    setInputValue(value);

    algolia.search(value).then((result) => {
      const searchResults = result.hits.map((hit) => {
        return {
          title: hit.name,
          //   description:hit.category,
          id: hit.objectID,
        };
      });
      // setResults(searchResults);
    });
  }

  function onResultSelect(e, { result }) {
    console.log(query);
    //setSearchParams(query);
    navigate(`/recipe/search/?query=${query}`);
  }

  useEffect(() => {
    const newResults = results.map((item) => ({
      title: item.name,
      id: item.objectID,
    }));

    setRecipeResults(newResults);
  }, [results]);
  console.log("recipeResults: ", recipeResults);

  return (
    <div className="recipeSearchBar">
      <Link to="/">
        <ArrowBackIosIcon sx={{ color: "white" }} />
      </Link>
      <Search
        placeholder={q}
        value={query}
        onSearchChange={(e) => setQuery(e.target.value)}
        results={recipeResults}
        noResultsMessage="找不到相關食譜"
        onResultSelect={onResultSelect}
      />
      <SearchIcon onClick={onResultSelect} sx={{ color: "white" }} />
    </div>
  );
}

export default SearchBar;
