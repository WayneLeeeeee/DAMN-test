// import * as React from 'react';
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import NativeSelect from '@mui/material/NativeSelect';
// import { useState,useRef,useEffect} from 'react';
// import Modal from './Modal';
// import AddIcon from '@mui/icons-material/Add';
// import CloseIcon from '@mui/icons-material/Close';
// import { Button } from '@mui/material';
// import { collection,addDoc,getDocs, } from 'firebase/firestore';
// import { db } from "../firebase";
// import BasicModal from './Modal';


// export default function NativeSelectDemo() {
//     const user = localStorage.getItem("userUid");
    
//     const [state , setState]= useState({
//         modal:false,
//     })
//     const [currentlist, setCurrentlist] = useState([]);
    
    
    
    
    
    
    
    
    
   
     
      
//   return (
//     <Box sx={{ width:'100%',heght:'24px',display:'flex',alignItems:'center'}}>
//       <FormControl sx={{width:'70%'}}>
//         <InputLabel variant="standard" htmlFor="uncontrolled-native"/>
//         <NativeSelect
//           defaultValue={30}
//           inputProps={{
//             name: 'name',
//             id: 'uncontrolled-native',
//           }}
//         >
//         {currentlist.map((list,)=>(<option key={list}
//             >
//                 {list.name}
//             </option>))}
//         </NativeSelect>
//       </FormControl>
//         <BasicModal/>
      
//     </Box>

    
//   );
// }