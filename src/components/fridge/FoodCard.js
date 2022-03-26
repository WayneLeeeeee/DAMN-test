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

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useStateValue } from '../../StateProvider';
import { actionTypes } from '../../reducer';

import moment from 'moment';

function FoodCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [recordId, setRecordId, setRecordId2] = useState('');
  const [selectedFridge, setSelectedFridge] = useState(null);

  console.log(recordId);

  const handleClickOpen = (id) => {
    setOpen(true);
    setRecordId(id);
  };

  const handleClickOpen2 = (id) => {
    setOpen2(true);
    setRecordId2(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //刪除功能
  const deleteData = async function (id) {
    try {
      await deleteDoc(db, 'users', '3HuEsCE9jUlCm68eBQf4', 'fridge', id);
      setOpen(false);
      setDeleted(deleted + 1);
      //   console.log();
    } catch (error) {
      //   console.log(error)
    }
  };

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

  //修改功能 點筆 -> 先抓到資料庫裡的id -> 跳出表單-> 是-> 跳到修改表單 ->儲存變更
  const modifyData = async function () {};

  return (
    <div className="foodCard">
      <Grid className="box">
        <Card className="chickenCard">
          <img src={props.food.imageURL} alt="" />
        </Card>

        <Card className="contextCard">
          <Typography className="foodName">{props.food.name}</Typography>

          <Typography className="detailCard">
            數量：{props.food.quantity}
            {props.food.unit}
            <br />
            {props.food.isFrozen}
            <br />
            到期日：{props.food.endDate}
            <br />
          </Typography>

          <Typography className="expiredTime">距離到期日：剩3日</Typography>
        </Card>
        <Card className="delete-edit-card">
          <Button
            className="deleteButton"
            onClick={() => handleClickOpen(props.food.id)}
          >
            <CloseIcon />
          </Button>

          <Button className="editButton" onClick={() => handleClickOpen2()}>
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
export default FoodCard;
