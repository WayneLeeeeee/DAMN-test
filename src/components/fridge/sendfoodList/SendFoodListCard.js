import React from 'react';
import { Card, Input, Typography } from '@mui/material';
import BuyDatePicker from './BuyDatePicker';
import WeightText from './WeightText';
import EndatePicker from './EndDatePicker';
import UnitSelecter from './UnitSelecter';
import FoodKindSelecter from './FoodKindSelecter';
import { display, height, width } from '@mui/system';
import { actionTypes } from '../../../reducer';
import { useStateValue } from '../../../StateProvider';

export default function SendFoodListCard(props) {
  const [{ checkedList }, dispatch] = useStateValue();

  const handleCheckListChange = function (e) {
    let oldList = [...checkedList];
    oldList[props.index] = {
      ...oldList[props.index],
      [e.target.name]: e.target.value,
    };
    dispatch({
      type: actionTypes.SET_CHECKEDLIST,
      checkedList: [...oldList],
    });
  };

  return (
    <div>
      <div className="maincard">
        <Typography className="ingredientname">{props.item.name}</Typography>
        <FoodKindSelecter className="foodkindselecter" index={props.index} />
        <div className="selector">
          <BuyDatePicker index={props.index} />
          <EndatePicker index={props.index} />
        </div>
        <div className="input">
          <Input
            className="quantity"
            name="quantity"
            placeholder={props.item.quantity}
            onChange={handleCheckListChange}
          />
          <Typography>{props.item.unit}</Typography>
        </div>
      </div>
    </div>
  );
}
