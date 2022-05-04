import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

function CardList({ data }) {
  console.log(data);

  let navigate = useNavigate();

  return (
    <div className="recipeCardlist">
      <Card sx={{ maxWidth: 500 }}>
        <CardContent className="block"></CardContent>
        {data?.map((recipe) => (
          <CardActionArea
            className="area"
            key={recipe.objectID}
            onClick={() => {
              navigate(`/recipe/${recipe.objectID}`);
            }}
          >
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
              <div className="icontext">
                <Typography variant="h6">
                  <ThumbUpIcon color="primary" className="icon" />
                  {recipe.likes}
                </Typography>
                <Typography variant="h6">
                  <StarIcon sx={{ color: "gold", paddingRight: "5px" }} />
                  {recipe.rating}
                </Typography>
                <Typography variant="h6">
                  <AccessTimeIcon color="primary" className="icon" />
                  {recipe.cookTime} min
                </Typography>
              </div>
            </CardContent>
          </CardActionArea>
        ))}
      </Card>
    </div>
  );
}

export default CardList;
