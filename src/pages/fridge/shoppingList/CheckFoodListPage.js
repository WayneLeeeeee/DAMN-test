import { Button } from '@mui/material';
import React from 'react';
import ShoppingList from '../../../components/shoppingList/ShoppingList';
import SendFoodList from '../../../components/fridge/sendfoodList/SendFoodList';
import { useNavigate } from 'react-router-dom';
import CheckFoodListBar from '../../../components/fridge/checkfoodlist/CheckFoodListBar';

export default function CheckFoodList() {
  return (
    <div>
      <CheckFoodListBar />
      <ShoppingList />
    </div>
  );
}
