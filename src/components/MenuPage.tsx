// Import navigation and state management libraries

import { useEffect, useState } from "react";
import { useBackground } from "../contexts/BackgroundContext";
import { useNavigate } from "react-router-dom";
import "../styles/MenuPage.css";


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { menuList } from "../SleepMusic";
import { Layout } from "./layout/Layout";


const MenuPage = () => {
  const history = useNavigate();
  const { selectBackground, handleUserInteraction } = useBackground();

  const handleSelectBackground = (background: string) => {
    selectBackground(background);
    handleUserInteraction();
    history("/main");
  };

  const [allMusic] = useState(menuList);
  const [favoriteMusic, setFavoriteMusic] = useState(new Set());

  // Load favorites from local storage when the component mounts
  useEffect(() => {
    const storedFavorites =
      JSON.parse(`${localStorage.getItem("favoriteMusic")}`) || [];
    setFavoriteMusic(new Set(storedFavorites));
  }, []);

  const toggleFavorite = (musicId: number) => {
    setFavoriteMusic((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(musicId)) {
        newFavorites.delete(musicId);
      } else {
        newFavorites.add(musicId);
      }
      // Update local storage
      localStorage.setItem(
        "favoriteMusic",
        JSON.stringify(Array.from(newFavorites))
      );
      return newFavorites;
    });
  };


  const favoriteMusicList = allMusic.filter((music) =>
    favoriteMusic.has(music.id)
  );


  return (
    <Layout title="Sleep Music">
      <div className="menu-page">
        <div className="relative z-10">
          <div>
            {favoriteMusicList.length > 0 && (
              <>
                <h3
                  className="subtitle"
                  style={{
                    fontSize: "1.3rem",
                    textAlign: "left",
                    fontWeight: "500",
                  }}
                >
                  Favorites
                </h3>
                <Swiper
                  navigation
                  modules={[Navigation]}
                  breakpoints={{
                    // when window width is >= 320px
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    // when window width is >= 480px
                    480: {
                      slidesPerView: 2,
                      spaceBetween: 30,
                    },
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 40,
                    },
                  }}
                >
                  {favoriteMusicList.map((item, index) => (
                    <SwiperSlide key={index + 1}>
                      <li
                        style={{
                          height: "15rem",
                        }}
                        className="music-list-audio "
                      >
                        <button
                          className="like-button"
                          onClick={() => toggleFavorite(item.id)}
                        >
                          {favoriteMusic.has(item.id) ? (
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 1024 1024"
                              height="2rem"
                              width="2rem"
                            >
                              <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z" />
                            </svg>
                          ) : (
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 1024 1024"
                              height="2em"
                              width="2em"
                            >
                              <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
                            </svg>
                          )}
                        </button>
                        <button
                          className="music-option"
                          onClick={() => handleSelectBackground(item.name)}
                        >
                          <div className="music-image">
                            <img
                              src={item.image}
                              alt={item.name}
                              width={"80%"}
                              height={"80%"}
                            />
                          </div>
                          <p>{item.description}</p>
                        </button>
                      </li>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
            {favoriteMusicList.length > 0 && (
              <div style={{ marginTop: "4rem" }}>
           
                <Swiper
                navigation
                modules={[Navigation]}
                  breakpoints={{
                    // when window width is >= 320px
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    // when window width is >= 480px
                    480: {
                      slidesPerView: 2,
                      spaceBetween: 30,
                    },
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 40,
                    },
                  }}
                >
                  {allMusic.map((item, index) => (
                    <SwiperSlide  key={index + 1}>
                      <li
                        style={{
                          height: "15rem",
                        }}
                        className="music-list-audio "
                      >
                        <button
                          className="like-button"
                          onClick={() => toggleFavorite(item.id)}
                        >
                          {favoriteMusic.has(item.id) ? (
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 1024 1024"
                              height="2rem"
                              width="2rem"
                            >
                              <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z" />
                            </svg>
                          ) : (
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 1024 1024"
                              height="2em"
                              width="2em"
                            >
                              <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
                            </svg>
                          )}
                        </button>
                        <button
                          className="music-option"
                          onClick={() => handleSelectBackground(item.name)}
                        >
                          <div className="music-image flex justify-center items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              width={"80%"}
                              height={"80%"}
                            />
                          </div>
                          <p>{item.description}</p>
                        </button>
                      </li>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {favoriteMusicList.length === 0 && (
           
             
                <ul className="pb-20 pt-7">
                  {allMusic.map((item) => (
                    <li key={item.id} className="music-list-audio h-64 mt-5">
                      <button
                        className="music-option"
                        onClick={() => handleSelectBackground(item.name)}
                      >
                        <div className="music-image flex justify-center items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            width={"80%"}
                            height={"80%"}
                          />
                        </div>
                        <p>{item.description}</p>
                      </button>
                    </li>
                  ))}
                </ul>
            
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MenuPage;
