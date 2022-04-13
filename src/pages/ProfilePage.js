import React from 'react';
import BottomNav from '../components/BottomNav';
import { useState, useEffect } from 'react';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseConfig } from '../../src/firebase';
import { useStateValue } from '../../src/StateProvider';
import { actionTypes } from '../../src/reducer';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  Button,
  CardActionArea,
  CardActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import profile from '../images/profile.jpg';
import { margin } from '@mui/system';
import { Padding } from '@material-ui/icons';
import { Line, Circle } from 'rc-progress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import { db, auth } from '../firebase';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

const ProfilePage = () => {
  const [{ user, isSTTFromMicOpen }, dispatch] = useStateValue();
  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  }
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  // const [value, setValue] = React.useState(0);
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>
    );
  }

  const handleSubmit = async function () {
    try {
      const auth = getAuth();
      await signOut(auth);
      setMessage('');
      dispatch({
        type: actionTypes.SET_USER,
        user: null,
      });
      localStorage.removeItem('userUid');
      navigate('/');
      console.log('已登出');
    } catch (error) {
      setMessage('' + error);
    }
  };

  console.log(user);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
    },
  ];

  const handleIsSTTFromMicOpen = () => {
    if (isSTTFromMicOpen) {
      dispatch({
        type: actionTypes.SET_IS_STT_FROM_MIC_OPEN,
        isSTTFromMicOpen: false,
      });
    } else {
      dispatch({
        type: actionTypes.SET_IS_STT_FROM_MIC_OPEN,
        isSTTFromMicOpen: true,
      });
    }
  };

  const [users, setUsers] = useState([]);

  console.log(users);

  const userUid = localStorage.getItem('userUid');
  useEffect(() => {
    async function readData() {
      const docRef = doc(db, 'users', `${userUid}`);
      const docSnap = await getDoc(docRef);
      const temp = [];

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        temp.push({ ...docSnap.data() });
        console.log(temp);
        setUsers([...temp]);
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }
    readData();
  }, [db]);
  const percent = users.map((number) => number);

  console.log(percent[0]);

  return (
    <div className="ProfilePage">
      <Card className="profile__card" sx={{ height: 400 }}>
        {users.map((testuser) => (
          <div className="profile__progress">
            <Circle
              percent={testuser.progress}
              strokeWidth="6"
              strokeColor="#FFD700"
            />
          </div>
        ))}
        <Avatar className="profile__avatar" img src={profile} alt="Logo" />
        <Typography className="profile__name">Apple</Typography>
        <Button className="profile__button">
          <Typography className="profile__buttonName">金牌廚師</Typography>
        </Button>
      </Card>

      <Tabs
        className="profile__tabs"
        value={value}
        onChange={handleChange}
        aria-label="icon tabs example"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          className="profile__tab1"
          icon={<FavoriteIcon />}
          aria-label="favorite"
        />
        <Tab
          className="profile__tab2"
          icon={<SettingsIcon />}
          aria-label="settings"
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Divider />
        <ImageList
          className="profile__imagelist"
          cols={3}
          rowHeight={140}
          gap={0}
          sx={{ height: 400 }}
        >
          {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Divider />
        <div className="profile__tabpanel">
          <Container sx={{ height: 320 }}>
            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 'bold',
                marginTop: 3,
              }}
            >
              姓名
            </Typography>
            <Divider />
            <Typography
              className="profile__typography"
              sx={{ fontSize: 18, marginTop: 1 }}
            >
              Apple
              <Button>
                <EditIcon fontSize="small" sx={{ marginLeft: 30.5 }}></EditIcon>
              </Button>
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 'bold',
                marginTop: 2,
              }}
            >
              電子郵件
            </Typography>
            <Divider />
            <Typography
              className="profile__typography"
              sx={{ fontSize: 18, marginTop: 1 }}
            >
              apple@gmail.com
              <Button>
                <EditIcon fontSize="small" sx={{ marginLeft: 17.8 }}></EditIcon>
              </Button>
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 'bold',
                marginTop: 3,
              }}
            >
              重設密碼
            </Typography>
            <Divider />
            <Typography
              className="profile__typography"
              sx={{ fontSize: 18, marginTop: 1 }}
            >
              **********
              <Button>
                <EditIcon
                  fontSize="small"
                  sx={{ marginLeft: 27, marginTop: -1 }}
                ></EditIcon>
              </Button>
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 'bold',
                marginTop: 3,
              }}
            >
              編輯圖片
            </Typography>
            <Divider />
            <Typography
              className="profile__typography"
              sx={{ fontSize: 18, marginTop: 1 }}
            >
              選擇圖片
              <Button>
                <EditIcon
                  fontSize="small"
                  sx={{ marginLeft: 26.5, marginTop: -1 }}
                ></EditIcon>
              </Button>
            </Typography>
            {/* 關閉小當家按鈕 */}
            <FormControlLabel
              control={
                <Switch
                  checked={isSTTFromMicOpen}
                  onChange={handleIsSTTFromMicOpen}
                />
              }
              label="關閉小當家"
            />
            <form>
              <Button
                className="profile__logout"
                variant="contained"
                onClick={handleSubmit}
                color="inherit"
              >
                登出
              </Button>
              {message}
            </form>
          </Container>
        </div>
      </TabPanel>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
