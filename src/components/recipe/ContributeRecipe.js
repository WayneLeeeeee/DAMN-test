import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

// import required modules
import { Parallax, Pagination, Navigation } from "swiper";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ContributeRecipe() {
  return (
    <div className="contributeRecipe">
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        speed={600}
        parallax={true}
        pagination={{
          clickable: true,
        }}
        preventClicks={false}
        preventClicksPropagation={false}
        navigation={true}
        modules={[Navigation, Parallax, Pagination]}
        className="contributeRecipe__swiper"
        // observer: true,
        //     observeParents: true,
        onSlideChange={() => console.log("slide change")}
      >
        <div
          slot="container-start"
          className="parallax-bg"
          style={{
            height: "100%",
            objectFit: "content",
            backgroundPosition: "top",
            backgroundImage:
              "url(https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
          }}
          data-swiper-parallax="-23%"
        ></div>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
            貢獻您的點子
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            提升經驗值！
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
            有什麼好處？
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            獎牌、名氣、＄＄？
          </div>
          {/* <div className="text" data-swiper-parallax="-100">
            <p>
              小當家致力於 食譜分享活動
            </p>
          </div> */}
        </SwiperSlide>
        <SwiperSlide className="contributeRecipe__swiperSlide">
          <div className="title" data-swiper-parallax="-300">
            開始貢獻！
          </div>
          {/* <div className="subtitle" data-swiper-parallax="-200">
            Subtitle
          </div> */}
          <Link to="recipe/admin/add">
            <Button className="contributeRecipe_btn" variant="contained">
              貢獻食譜
            </Button>
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
