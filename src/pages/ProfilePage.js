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
import NativeSelectDemo from '../components/Select';
import StandardImageList from '../components/Content';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const ProfilePage = () => {
  const [users, setUsers] = useState([]);
  const [medalColor, setMedalColor] = useState('');
  const [hierarchy, setHierarchy] = useState('');
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

  // const progress = users[0].progress

  console.log(users[0]?.progress);

  const userUid = localStorage.getItem('userUid');
  useEffect(() => {
    hierarchy_f();
  }, [users]);
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

  function hierarchy_f() {
    var quo = parseInt(users[0]?.progress / 100);
    console.log(users[0]?.progress);
    console.log(quo);
    if (0 <= quo && quo < 1) {
      setHierarchy('銅牌廚師');
      setMedalColor('#b8860b');
    } else if (1 <= quo && quo < 3) {
      setHierarchy('銀牌廚師');
      setMedalColor('#c0c0c0');
    } else if (3 <= quo && quo < 5) {
      setHierarchy('金牌廚師');
      setMedalColor('#FFD700');
    } else if (5 <= quo && quo < 7) {
      setHierarchy('白金廚師');
      setMedalColor('#f0ffff');
    } else if (7 <= quo && quo < 9) {
      setHierarchy('鑽石廚師');
      setMedalColor('#00ced1');
    } else {
      setHierarchy('小當家');
      setMedalColor('#dc143c');
    }
  }

  function percent_f() {
    return users[0]?.progress % 100;
  }

  const percent = percent_f();
  console.log(percent);
  console.log(~~(users[0]?.progress / 100));
  console.log(hierarchy);

  return (
    <div className="ProfilePage">
      {users.map((testuser) => (
        <Card className="profile__card" sx={{ height: 400 }}>
          <div className="profile__progress">
            <Circle
              percent={percent}
              strokeWidth="6"
              strokeColor={`${medalColor}`}
            />
          </div>

          <Avatar className="profile__avatar" img src={profile} alt="Logo" />
          <Typography className="profile__name">Apple</Typography>
          <Button
            className="profile__button"
            sx={{ backgroundColor: `${medalColor} !important` }}
          >
            <Typography className="profile__buttonName">{hierarchy}</Typography>
          </Button>
        </Card>
      ))}

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
          icon={<BookmarkBorderIcon />}
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
        {/* <NativeSelectDemo/> */}
        <StandardImageList/>
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
