import React from "react";
import { useSearchParams } from "react-router-dom";
import FridgeBar from "../../../components/fridge/FoodBar";
import ResultCard from "../../../components/fridge/ResultCard";
import useSearch from "../../../hooks/useSearch";

const FridgeSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = localStorage.getItem("userUid");
  const q = searchParams.get("query");
  console.log(q);
  const results = useSearch("fridge", q, `${user}`);
  console.log(results[0]?.fridge);

  return (
    <div>
      <FridgeBar />
      <ResultCard data={results[0]?.fridge} />
    </div>
  );
};

export default FridgeSearchPage;
