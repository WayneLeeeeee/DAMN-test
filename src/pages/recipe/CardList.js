import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlatwareIcon from "@mui/icons-material/Flatware";
import noodle1 from "../../images/noodle1.jpg";
import noodle2 from "../../images/noodle2.jpg";
import noodle3 from "../../images/noodle3.jpg";
import noodle4 from "../../images/noodle4.jpg";

function CardList({ data }) {
  console.log(data)
  return (
    <div className="recipeCardlist">
      <Card sx={{ maxWidth: 500 }}>
        <CardContent className="block"></CardContent>
        {data?.map((recipe) => (
          <CardActionArea className="area" key={recipe.objectID}>
            <img src={recipe.thumbnail?.url} alt="" className="img" />
            <CardContent className="content">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="words"
              >
                {recipe.name}
              </Typography>
              <Typography variant="h6">
                <ThumbUpIcon color="primary" className="icon" />
                30k
              </Typography>
              <Typography variant="h6">
                <FlatwareIcon color="error" className="icon" />
                medium
              </Typography>
              <Typography variant="h6">
                <AccessTimeIcon color="primary" className="icon" />
                20min
              </Typography>
            </CardContent>
          </CardActionArea>
        ))}
      </Card>
    </div>
  );
}

export default CardList;
