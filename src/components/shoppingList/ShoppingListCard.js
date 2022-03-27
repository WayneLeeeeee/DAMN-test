import { React, useState, useEffect } from 'react';
import { Button, Card, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useStateValue } from '../../StateProvider';
import { actionTypes } from '../../reducer';
import { update } from 'lodash';
import { useNavigate } from 'react-router-dom';

export default function ShoppingListCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [open, setOpen] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [selectedFridge, setSelectedFridge] = useState(null);
  const navigate = useNavigate();

  // console.log(recordId);

  const handleClickOpen = (id) => {
    setOpen(true);
    setRecordId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //刪除功能
  const deleteData = async function (id) {
    try {
      await deleteDoc(
        doc(db, 'users', '3HuEsCE9jUlCm68eBQf4', 'shoppingList', id)
      );
      setOpen(false);
      setDeleted(deleted + 1);
      //   console.log();
    } catch (error) {
      //   console.log(error);
    }
  };
  console.log(recordId);

  const [user, setUser] = useState([]);
  //   console.log(user);

  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        temp.push(doc.id);
      });
      //   console.log(temp);
      setUser([...temp]);
    }
    readData();
  }, [db, deleted]);
  //修改
  // const editData = async function (id) {
  //   await getDocs(
  //     collection(db, 'users', '3HuEsCE9jUlCm68eBQf4', 'shoppingList', id)
  //   );
  //   setRecordId(id);
  //   const temp = [];
  //   getDocs.forEach((doc) => {
  //     temp.push(doc.id);

  //   });
  // };

  return (
    <div
      className="foodCard"
      onClick={() => setIsSelected(isSelected ? false : true)}
    >
      <Grid className={isSelected ? 'box checked' : 'box'}>
        <Card className="chickenCard">
          <img src={props.item.imageURL} alt="" />
        </Card>

        <Card className="contextCard">
          <Typography className="foodName">{props.item.name}</Typography>

          <Typography className="detailCard">
            需要數量：{props.item.quantity}
            {props.item.unit}
          </Typography>
          <br />
          <Typography className="detailCard">{props.item.notes}</Typography>
        </Card>
        <Card className="delete-edit-card">
          <Button
            className="deleteButton"
            onClick={() => handleClickOpen(props.item.id)}
          >
            <CloseIcon />
          </Button>

          <Button className="editButton">
            {/* onClick={() => editData(props.item.id)} */}
            <CreateIcon />
          </Button>
        </Card>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'確定刪除？'}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            一經刪除將無法復原!!
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>否</Button>
          <Button onClick={() => deleteData(recordId)} autoFocus>
            是
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
