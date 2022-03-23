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
        sx={{
          backgroundColor: '#C7E3EE !important',
          justifyContent: 'space-around',
          alignItems: 'left !important',
          position: 'fixed',
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
