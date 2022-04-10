import React, { useEffect } from "react";
// import "./scss/all.css";
import BottomNav from "./components/BottomNav";
import RecipeHomePage from "./pages/recipe";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import ProfilePage from "./pages/ProfilePage";
import RecipeItemPage from "./pages/recipe/RecipeItemPage";
import Assistant from "./components/Assistant";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/recipe/AdminPage";
import NotFound from "./pages/NotFoundPage";
import AddNewRecipePage from "./pages/recipe/AddNewRecipePage";

import { HashRouter } from "react-router-dom";
import RecipeSearchPage from "./pages/recipe/RecipeSearchPage";
import SearchResultsPage from "./pages/recipe/SearchResultsPage";
import RecommendRecipe from "./pages/recipe/RecommendRecipe";

import FridgeHomePage from "../src/pages/frigde/";
import FridgePage from "../src/pages/frigde/FridgePage";
import AddIngredient from "./pages/frigde/AddIngredient";
import AddIngredient2 from "./pages/frigde/shoppingList/AddIngredient2";
import ShoppingListPage from "./pages/frigde/shoppingList/shoppingListPage";
import FinalSendIngredient from "./pages/frigde/shoppingList/FinalSendIngredient";

function App() {
  const [{ user }, dispatch] = useStateValue();
  // console.log(user);

  useEffect(() => {
    //console.clear();
    if (!user && localStorage.getItem("userUid")) {
      const userUid = localStorage.getItem("userUid");
      dispatch({
        type: actionTypes.SET_USER,
        user: userUid,
      });
    }
  }, []);

  return (
    <div className="app">
      <Router>
        <Routes>
          {!user ? (
            <Route path="/">
              <Route index element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Route>
          ) : (
            <>
              <Route path="/">
                <Route index element={<RecipeHomePage />} />
                <Route path="recipe/add" element={<AddNewRecipePage />} />
                <Route exact path="recipe/:id" element={<RecipeItemPage />} />
                <Route path="recipe/search" element={<RecipeSearchPage />} />
                <Route path="recipe/recommend" element={<RecommendRecipe />} />
              </Route>

              {/* fridge */}
              <Route path="/fridge">
                <Route index element={<FridgeHomePage />} />
                <Route path="fridgePage" element={<FridgePage />} />
                <Route path="shoppingListPage" element={<ShoppingListPage />} />
                <Route path="add" element={<AddIngredient />} />
                <Route path="add2" element={<AddIngredient2 />} />
                <Route
                  path="finalsendingredient"
                  element={<FinalSendIngredient />}
                />
              </Route>

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
        {/* 想用的，可以打開註解 */}
        <Assistant />
      </Router>
    </div>
  );
}

export default App;
