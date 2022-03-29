import React from "react";
import { useState, useEffect } from "react";
import { AppBar, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import meat from "../../images/icons8-meat-30.png";
import leaf from "../../images/icons8-spinach-30.png";
import fish from "../../images/icons8-roach-30.png";
import milk from "../../images/icons8-milk-carton-30.png";
import beans from "../../images/icons8-peanuts-30.png";
import apple from "../../images/icons8-plum-30.png";
import SortButton from "./SortButton";
import { Search } from "semantic-ui-react";
import useSearch from "../../hooks/useSearch";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

export default function FridgeBar() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [fridgeResults, setFridgeResults] = useState([]);
  const [query, setQuery] = useState("");
  const results = useSearch("fridge", query, "3HuEsCE9jUlCm68eBQf4");
  console.log(results);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("query");
  console.log(query);

  function onSearchChange(e, { value }) {
    console.log("val: ", value);
    setQuery(value);
    console.log(results.fridge);
    const newResults = results?.fridge;
    console.log(newResults);
    // algolia.search(value).then((result) =>{
    //     const searchResults = result.hits.map(hit =>{
    //       return{
    //         title:hit.name,
    //         // description:hit.category,
    //         id:hit.objectID,

    //       };
    //     });
    //     // setResults(searchResults);
    //     setFridgeResults(newResults)
    //   });
    //setFridgeResults(newResults)
  }
  function onResultSelect(e, { result }) {
    setSearchParams(query);
    navigate(`/fridge/search/?query=${query}`);
  }
  useEffect(() => {
    const newResults = results[0]?.fridge?.map((ingredient) => ({
      ...ingredient,
      title: ingredient.name,
    }));

    console.log(newResults);
    setFridgeResults(newResults);
  }, [results]);
  console.log("fridgeResults: ", fridgeResults);

  const goToFridgePage = function () {
    navigate("/fridge");
  };

  return (
    <div className="fridgeBar">
      <div className="top__bar" position="sticky">
        <ArrowBackIosNewIcon onClick={goToFridgePage} />

        {/* <input value={query} onChange={(e)=> setQuery(e.target.value)}/>  */}
        <Search
          value={query}
          onSearchChange={(e) => setQuery(e.target.value)}
          results={fridgeResults}
          noResultsMessage="找不到相關食材"
          onResultSelect={onResultSelect}
        />
        <SearchIcon onClick={onResultSelect} />
      </div>
    </div>
  );
}
