import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useStateValue } from '../../StateProvider';
import { actionTypes } from '../../reducer';
import moment from 'moment';
import Rating from '@mui/material/Rating';

function ModifiedRecipePage() {
  const [deleted, setDeleted] = useState(0);
  //刪除提醒
  const [open, setOpen] = React.useState(false);
  //修改提醒
  const [open2, setOpen2] = React.useState(false);
  const [recordId, setRecordId] = React.useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [{ isUpdated }, dispatch] = useStateValue();

  console.log(isUpdated);
  console.log(recordId);

  const handleSwitchUpdate = () => {
    setOpen2(false);
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: true,
    });
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: selectedRecipe,
    });
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setRecordId(id);
  };

  const handleClickOpen2 = (data) => {
    setOpen2(true);
    setSelectedRecipe(data);
  };

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  };

  //刪除
  const deleteData = async function (id) {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      console.log(id);
      setOpen(false);
      setDeleted(deleted + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const [recipes, setRecipes] = useState([]);
  console.log(recipes);

  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
        temp.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(temp);
      setRecipes([...temp]);
    }
    console.log(recipes);
    readData();
  }, [db, deleted]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>名稱</TableCell>
              <TableCell>作者</TableCell>
              <TableCell>創造/更新時間</TableCell>
              <TableCell>難度星等</TableCell>
              <TableCell>修改</TableCell>
              <TableCell>刪除</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {recipe.name}
                </TableCell>
                <TableCell>{recipe.authorId}</TableCell>
                <TableCell>
                  {moment(recipe.createdAt.seconds * 1000).format('YYYY/MM/DD')}
                </TableCell>
                <TableCell>
                  <Rating
                    name="read-only"
                    value={recipe.rating}
                    precision={0.5}
                    readOnly
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleClickOpen2(recipe)}>
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleClickOpen(recipe?.id)}>
                    <CloseIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
          <Dialog
            open={open2}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'確定修改？'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                將跳轉至修改頁面
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>否</Button>
              <Button onClick={handleSwitchUpdate} autoFocus>
                是
              </Button>
            </DialogActions>
          </Dialog>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ModifiedRecipePage;
