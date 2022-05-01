// import  React,{useEffect,useState} from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Checkbox from '@mui/material/Checkbox';
// import Avatar from '@mui/material/Avatar';
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { db } from "../firebase";


// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// export default function BasicModal() {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [checked, setChecked] = React.useState([1]);
//   const handleToggle = (value) => () => {
//     const currentIndex = checked.indexOf(value);
//     const newChecked = [...checked];

//     if (currentIndex === -1) {
//       newChecked.push(value);
//     } else {
//       newChecked.splice(currentIndex, 1);
//     }

//     setChecked(newChecked);
//   };

//   const user = localStorage.getItem("userUid");
//     const [ingredient2, setIngredient2] = useState([]);
//     const [useid,setUseid]=useState('');
//     useEffect(() => {
//         async function readData() {
//           const querySnapshot = await getDocs(
//             collection(db, "users", `${user}`, "isLikedrecipes")
//           );
//           const temp = [];
//       querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//         temp.push({ id: doc.id, ...doc.data() });
//       });
//       console.log(temp);
//       setIngredient2([...temp]);
//     }

//     readData();
//   }, [db]);
  
//   console.log("id => ",useid)

//   return (
//     <div>
//       <Button onClick={handleOpen}>新增資料夾</Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//         <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
//       {ingredient2?.map((item,index,value) => {
//         return (
//           <ListItem
//             key={index}
//             secondaryAction={
//               <Checkbox
//                 edge="end"
//                 onChange={handleToggle(value)}
//                 checked={checked.indexOf(value) !== -1}
//                 // inputProps={{ 'aria-labelledby':  }}
//               />
//             }
//             disablePadding
//           >
//             <ListItemButton>
//               <ListItemAvatar >
//                 <Avatar
//                   alt={item.recipe}
//                   src={item.image}
//                 />
//               </ListItemAvatar>
//             <ListItemText>{item.recipe}</ListItemText>
//             </ListItemButton>
//           </ListItem>
           
//         );
//       })}
//     </List>
//     <div className='submit'>
//     <Button>送出</Button>
//     </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// }
