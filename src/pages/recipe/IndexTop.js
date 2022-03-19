import React, { useState, useEffect } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import Ticker from "react-ticker";
import { Button } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import algolia from "../../algolia";
import { Search } from "semantic-ui-react";
import useSearch from "../../hooks/useSearch";
function IndexTop() {
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
          // description:hit.category,
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


  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="recipeIndexTop">
      <div className="recipeIndexTop__slogan">
        <VolumeUpIcon />

        <Ticker mode="smooth">
          {() => (
            <>
              <h4>開啟智能語音讓你更快速解決問題 </h4>
            </>
          )}
        </Ticker>
      </div>
      <div className="recipeIndexTop__title">
        <h4>你今天想要煮什麼？</h4>
        <NotificationsIcon />
      </div>
      <div className="recipeIndexTop__search">
        <Search
          value={query}
          onSearchChange={(e) => setQuery(e.target.value)}
          results={recipeResults}
          noResultsMessage="找不到相關食譜"
          onResultSelect={onResultSelect}
        />
        {/* <input onChange={
            (e)=> setQuery(e.target.value)
          }/> */}
        <Button onClick={onResultSelect}>
          <SearchIcon />
        </Button>
      </div>
    </div>
  );
}

export default IndexTop;
