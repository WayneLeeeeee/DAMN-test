import React, { useState } from 'react';
import { Input } from '@mui/material';
import { Button } from '@mui/material';
//firebase
import { db, storage } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function AddShoppingListPage() {
  //購物清單結構
  const [shoppingList, setShoppingList] = useState({
    name: '',
    quantity: 0,
    unit: '',
    notes: '',
    startDate: 0,
    endDate: 0,
    ingredientTags: '',
    isFrozen: false,
    imageURL: '',
  });

  //set to shoppingList
  const handleClick = function (e) {
    setShoppingList({ ...shoppingList, [e.target.name]: e.target.value });
  };

  //uplode image
  const upload = async function (e) {
    const imageRef = ref(storage, e.target.files[0].name);
    await uploadBytes(imageRef, e.target.files[0]);
    const url = await getDownloadURL(imageRef);
    setShoppingList({ ...shoppingList, imageURL: url });
  };

  //add to firebase
  async function addData() {
    const docRef = await addDoc(
      collection(db, 'users', '3HuEsCE9jUlCm68eBQf4', 'shoppingList'),
      {
        name: shoppingList.name,
        quantity: shoppingList.quantity,
        unit: shoppingList.unit,
        notes: shoppingList.notes,
        startDate: shoppingList.startDate,
        endDate: shoppingList.endDate,
        isFrozen: shoppingList.isFrozen,
        ingredientTags: shoppingList.ingredientTags,
        imageURL: shoppingList.imageURL,
      }
    );
  }

  return (
    <div>
      <Input type="file" accept="image/x-png,image/jpeg" onChange={upload} />
      食物名稱:
      <Input
        type="text"
        name="name"
        value={shoppingList.name}
        onChange={handleClick}
      />
      <br />
      數量:
      <Input
        type="number"
        name="quantity"
        value={shoppingList.quantity}
        onChange={handleClick}
      />
      <br />
      單位:
      <Input
        type="text"
        name="unit"
        value={shoppingList.unit}
        onChange={handleClick}
      />
      <br />
      備註:
      <Input
        type="text"
        name="notes"
        value={shoppingList.notes}
        onChange={handleClick}
      />
      <br />
      <Button variant="contained" onClick={addData}>
        新增
      </Button>
    </div>
  );
}
