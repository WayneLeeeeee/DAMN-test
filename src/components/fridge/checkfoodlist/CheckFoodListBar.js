import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Button, ButtonGroup, Toolbar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import ShoppingList from '../../shoppingList/ShoppingList';

export default function CheckFoodListBar(props) {
  const navigate = useNavigate();
  const goToShoppingList = function () {
    navigate('/fridge/shoppinglist');
  };
  const goToSendCheckedList = function () {
    navigate('/fridge/sendfoodlist');
  };

  return (
    <div className="fridgeBar">
      <AppBar className="top_bar" position="sticky" sx={{ boxShadow: 'none' }}>
        <div className="LeftButton">
          <Button onClick={goToShoppingList}>
            <ArrowBackIosNewIcon />
          </Button>
          <Button
            className="NextStepButton"
            onClick={goToSendCheckedList}
            isButtonDisable={false}
            sx={{
              position: 'absolute',
              right: '10%',
            }}
          >
            下一步
          </Button>
        </div>
      </AppBar>
    </div>
  );
}
