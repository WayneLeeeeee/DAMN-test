import React, { useEffect, useState } from 'react';
import Tabs from './Tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Box, ThemeProvider } from '@mui/system';
import { Paper } from '@mui/material';
import theme from '../../function/theme';
import ImageIcon from '@mui/icons-material/Image';
import ImageStepper from '../../components/ImageStepper';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  increment,
} from 'firebase/firestore';

function RecipeItem({ propsData }) {
  const [data, setData] = useState(null);
  const [iscompleted, setIscompleted] = useState(false);
  let params = useParams();
  let navigate = useNavigate();
  const handleGoBackToHomePage = () => navigate('/');

  // fetch recipe detail data from fireStore
  const fetchData = async () => {
    const docRef = doc(db, 'recipes', params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      setData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  const handleComplete = () => {
    setIscompleted(true);
  };

  useEffect(() => {
    if (params.id) {
      // 如果有路徑帶 uid 就 fetchData
      fetchData();
      setData(null);
      return;
    } else {
      // 如果有 props 就設定 data 為傳入資料
      setData(propsData);
    }
  }, []);

  // const Rating = async () => {
  //   const docRef = collection(db, 'recipes');
  //   const temp = [];
  //   const docSnap = await getDocs(docRef);
  //   docSnap.forEach((doc) => {
  //     temp.push({ rating: doc.data().rating });
  //   });
  //   console.log(temp);
  // };
  // Rating();

  const [rating, setRating] = useState([]);
  console.log(rating);

  // useEffect(() => {
  //   async function Rating() {
  //     const querySnapshot = await getDocs(collection(db, 'recipes'));
  //     const temp = [];
  //     querySnapshot.forEach((doc) => {
  //       temp.push({ rating: doc.data().rating });
  //     });
  //     console.log(temp);
  //     setRating([...temp]);
  //   }
  //   console.log(rating);
  //   Rating();
  // }, [db]);

  const userUid = localStorage.getItem('userUid');
  const update = async function () {
    const db = getFirestore();
    try {
      await updateDoc(doc(db, 'users', `${userUid}`), {
        progress: increment(5),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="recipeItem__title">
        <ArrowBackIosIcon
          sx={{ color: '#ffffff' }}
          onClick={handleGoBackToHomePage}
        />
        <h3>{data?.name}</h3>
        <DinnerDiningIcon sx={{ paddingLeft: '10px', fontSize: '32px' }} />
      </div>
      <Paper
        elevation={3}
        className="recipeItem__container"
        sx={{ color: 'text.normal' }}
      >
        <div className="recipeItem__wrap">
          {data?.thumbnail?.url && <ImageStepper data={data} />}
          {/* <div className="recipeItem__box">
            <h4>{data?.name ? data?.name : "沒有食譜名稱"}</h4>
          </div> */}
        </div>
        {/* 食材 或 步驟 選項 */}
        <Tabs data={data} />
      </Paper>
      {iscompleted ? (
        <div className="recipeItem__checkIcon">
          <CheckCircleIcon sx={{ color: 'green' }} />
          <h4>已完成</h4>
        </div>
      ) : (
        <div className="recipeItem__checkIcon">
          <CheckCircleOutlineIcon
            sx={{ color: 'red' }}
            onClick={() => {
              if (data?.rating == 0.5) {
                update();
              } else if (data?.rating == 1) {
                update();
                update();
              } else if (data?.rating == 1.5) {
                update();
                update();
                update();
              } else if (data?.rating == 2) {
                update();
                update();
                update();
                update();
              } else if (data?.rating == 2.5) {
                update();
                update();
                update();
                update();
                update();
              } else if (data?.rating == 3) {
                update();
                update();
                update();
                update();
                update();
                update();
              } else if (data?.rating == 3.5) {
                update();
                update();
                update();
                update();
                update();
                update();
                update();
              } else if (data?.rating == 4) {
                update();
                update();
                update();
                update();
                update();
                update();
                update();
                update();
              } else if (data?.rating == 4.5) {
                update();
                update();
                update();
                update();
                update();
                update();
                update();
                update();
                update();
              } else if (data?.rating == 5) {
                update();
                update();
                update();
                update();
                update();
                update();
                update();
                update();
                update();
                update();
              }
              handleComplete();
            }}
          />
          <h4>未完成</h4>
        </div>
      )}
    </ThemeProvider>
  );
}

export default RecipeItem;
