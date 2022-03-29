import React from 'react';
import ShoppingList from '../../../components/shoppingList/ShoppingList';
import ShoppingListBar from '../../../components/shoppingList/ShoppingListBar';
import { Fab } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export default function ShoppingListPage() {
  
  const navigate = useNavigate();
  const goToCheckfoodListPage = function () {
    navigate('/fridge/checkfoodlist');
  };

  return (
    <div>
      <ShoppingListBar />

      <Fab
        className="insertCircle"
        sx={{
          padding: '10px !important',
          borderRadius: ' 50% !important',
          backgroundColor: '#C7E3EE !important',
          justifyContent: 'center',
          alignItems: 'center !important',
          position: 'fixed !important',
          bottom: '7%',
          right: '10%',
        }}
      >
        <Button
          className="insertButton"
          sx={{ textAlign: 'right !important' }}
          onClick={goToCheckfoodListPage}
        >
          <AddCircleIcon
            sx={{
              color: 'white !important',
            }}
          />
        </Button>
      </Fab>

      <ShoppingList isButtonDisable={true} />
    </div>
  );
}
