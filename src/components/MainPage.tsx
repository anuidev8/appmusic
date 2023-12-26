import { useEffect, useState, useRef, useMemo } from "react";
import { useBackground } from "../contexts/BackgroundContext";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/MainPage.css";
import { AudioControlModal } from "./Modal";
import TimerModal from "./TimerModal";
import { menuList } from "./MenuPage";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";

const soundEffectListMap = [
  {
    name: "Rain",
    imageUrl:
      "https://res.cloudinary.com/dnmjmjdsj/image/upload/v1702508479/audios/icons/1_ntd34p.png",
    src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1702247988/audios/rain_oj61ra.mp3",
  },
  {
    name: "Crickets",
    imageUrl:
      "https://res.cloudinary.com/dnmjmjdsj/image/upload/v1702509247/audios/icons/8_cslz5j.png",
    src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1702248061/audios/crickets_kk9pv5.mp3",
  },
  {
    name: "Fire",
    imageUrl:
      "https://res.cloudinary.com/dnmjmjdsj/image/upload/v1702509295/audios/icons/4_kolblb.png",
    src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1702660090/audios/sounds/campfireinthegarden_ydrgyj.mp3",
  },
  {
  
    name: "bellAudio",
    imageUrl: "https://res.cloudinary.com/dnmjmjdsj/image/upload/v1702539357/audios/icons/7_rgwsr8.png",
    src:"https://res.cloudinary.com/dnmjmjdsj/video/upload/v1702660121/audios/sounds/best-hypnotic-wind-chimes-long-nice-loop_eplorz.mp3"
},
{
  name: "thunderAudio",
  imageUrl: "https://res.cloudinary.com/dnmjmjdsj/image/upload/v1702539337/audios/icons/3_a1etkv.png",
  src:'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1702540826/audios/icons/thunder-25689_r1bdzg.mp3'
},

];

const MainPage = () => {
  const history = useNavigate();
  const {
    selectedBackground,
    selectBackground,
    hasInteracted,
    activeSoundEffects,
    setActiveSoundEffects,
    handleUserInteraction,
  } = useBackground();

  const soundEffectRefs = useRef(new Map());
  const [backgroundMusic, setBackgroundMusic] = useState<Howl | null>(); // State for the Howl instance
  const soundEffectList = useMemo(
    () => soundEffectListMap.map((item) => item.name),
    []
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [isMusicLoading, setIsMusicLoading] = useState<boolean>(true);
  const [initialSlideIndex, setInitialSlideIndex] = useState<null | number>(
    null
  ); // State to store initial slide index
  //LOAD FAVORITE
  // ... existing component return JSX
  const backgrounds = useMemo(() => {
    return menuList.map((item) => item.name);
  }, []); // Add more backgrounds as needed
  const [favoriteMusic, setFavoriteMusic] = useState(new Set()); // Set of favorite music IDs
  const getAudioSource = (background: string) => {
    const findAudioName =
      menuList.find((item) => item.name === background)?.audio ?? "";

    return findAudioName;
  };

  useEffect(() => {
    if (hasInteracted) {
      

      const musicSrc = getAudioSource(selectedBackground);
      const music = new Howl({
        src: [musicSrc],
        autoplay: true, // Play automatically
        loop: true, // Loop the music
        onload: () => setIsMusicLoading(false),
        onloaderror: () => setIsMusicLoading(false),
      });

      setBackgroundMusic(music);
      setIsPlaying(true);

      // Cleanup function to stop the music when the component unmounts or the source changes
      return () => {
        music.stop();
      }; 
    }
  }, [selectedBackground, hasInteracted]);

  const toggleAudioModal = () => {
    setShowAudioModal(!showAudioModal);
  };
  useEffect(() => {
    // Find the index of the selected background

    const index = backgrounds.findIndex(
      (bg) => bg === localStorage.getItem("selectedBackground")
    );

    // Update the initial slide index
    if (index !== -1) {
      setInitialSlideIndex(index);
    }
  }, [selectedBackground, backgrounds]);

  useEffect(() => {
    // Initialize soundEffectRefs with Howl instances and play if active
    soundEffectListMap.forEach((effect) => {
      const sound = new Howl({
        src: [effect.src],
        loop: true,
        autoplay: activeSoundEffects.has(effect.name), // Automatically play if effect is active
      });

      soundEffectRefs.current.set(effect.name, sound);
    });

    // Cleanup: stop all sounds when the component unmounts
     return () => {
      soundEffectRefs.current.forEach((sound) => {
        sound.stop();
      });
    }; 
  }, [activeSoundEffects]);

  // ... other existing useEffect hooks and functions

  const togglePlay = () => {
    setIsPlaying(!isPlaying);

    if (isPlaying) {
      // Pause background music
      if (backgroundMusic) {
        backgroundMusic.pause();
      }

      // Pause all active sound effects
      soundEffectRefs.current.forEach((sound, effect) => {
        if (activeSoundEffects.has(effect)) {
          sound.pause();
        }
      });
    } else {
      // Play background music
      if (backgroundMusic) {
        backgroundMusic.play();
      }

      // Play all active sound effects
      soundEffectRefs.current.forEach((sound, effect) => {
        if (activeSoundEffects.has(effect)) {
          sound.play();
        }
      });
    }
  };

  const handleSelectSoundEffect = (effect: string) => {
    const updatedEffects = new Set(activeSoundEffects);
    if (updatedEffects.has(effect)) {
      updatedEffects.delete(effect);
      soundEffectRefs.current.get(effect).pause();
    } else {
      updatedEffects.add(effect);
      soundEffectRefs.current.get(effect).play();
    }
    setActiveSoundEffects(updatedEffects);
  };

  // ... other existing functions like handleSlideChange, toggleAudioModal, etc.

  const onNavigate = () => {
    history("/favorite");
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    const newBackground = backgrounds[swiper.activeIndex];

    selectBackground(newBackground);
    handleUserInteraction();
  };

  const [showTimerModal, setShowTimerModal] = useState(false);

  const toggleTimerModal = () => {
    setShowTimerModal(!showTimerModal);
  };

  // Toggle music as favorite
  const toggleFavorite = (musicId: number) => {
    setFavoriteMusic((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(musicId)) {
        newFavorites.delete(musicId);
      } else {
        newFavorites.add(musicId);
      }
      localStorage.setItem(
        "favoriteMusic",
        JSON.stringify(Array.from(newFavorites))
      );
      return newFavorites;
    });
  };

  const isActiveEffect = (effect: string) => {
    return activeSoundEffects.has(effect);
  };

  /* const getSoundEffectSource = (effect: string) => {
        const findAudioName =
          soundEffectListMap.find((item) => item.name === effect)?.src ?? "";
    
        return findAudioName;
      }; */

  // Timer logic
  const handleTimerEnd = () => {
    // Logic for when the timer ends
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
    soundEffectRefs && soundEffectRefs.current.forEach(
      (ref) => ref.current && ref.current.pause()
    );
    setIsPlaying(false);
  };    

  return (
    <div
      className="main-page"
      style={{
        width: "100%",
      }}
    >
      {/*   <button style={{position:'relative',zIndex:100}} onClick={toggleView}>
        {showFavoritesOnly ? 'Show All Music' : 'Show Favorites'}
      </button> */}
      <div style={{ position: "relative" }} className="main-page-backgrounds">
        {/*  <figure className={`wheel ${isPlaying && 'wheel-active'}`}>
          <img
            src="https://res.cloudinary.com/dnmjmjdsj/image/upload/v1702595691/audios/wheel_wufwat.png"
            width="210"
            height="210"
          />
        </figure>  */}
        {initialSlideIndex !== null && (
          <Swiper
            style={{
              height: "100vh",
            }}
            initialSlide={initialSlideIndex}
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
            navigation
            modules={[Navigation]}
            onSlideChange={handleSlideChange}
          >
            {menuList.map((background, index) => (
              <SwiperSlide
                style={{
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={index + 1}
              >
                <div>
                  {isMusicLoading && (
                    <div className="spinner"></div>
                  )}
                </div>
                    {
                      !isMusicLoading && <figure className="music-list-cover">
                      <img src={background.image} alt={background.name} />
                    </figure>
                    }
                
                <div
                  style={{
                    position: "relative",
                    zIndex: 100,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    marginTop: "7rem",
                  }}
                >
                  {background.name}
                </div>
                <button
                  className="like-button like-button-main"
                  onClick={() =>
                    toggleFavorite(
                      menuList.find((item) => item.name === background.name)
                        ?.id ?? 0
                    )
                  }
                >
                  {favoriteMusic.has(
                    menuList.find((item) => item.name === background.name)
                      ?.id ?? 0
                  ) ? (
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 1024 1024"
                      height="1.5rem"
                      width="1.5rem"
                    >
                      <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z" />
                    </svg>
                  ) : (
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 1024 1024"
                      height="1.5em"
                      width="1.5em"
                    >
                      <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
                    </svg>
                  )}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/*  <audio ref={audioRef} onLoadedData={onAudioLoad} /> */}
      </div>

      <div
        style={{
          position: "absolute",
          top: "60%",
          zIndex: 100,
          display: "flex",
          width: "100%",
          justifyContent: "center",
          color: "white",
        }}
      >
        
         <Swiper
          navigation
          modules={[Navigation]}
      spaceBetween={10}
      slidesPerView={4}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
     
   
    
     {soundEffectList.map((effect, index) => (
        <SwiperSlide>
          <div
            className={`  sound-effects ${
              isActiveEffect(effect) ? "active" : ""
            }`}
            key={index}
            onClick={() => handleSelectSoundEffect(effect)}
          >
            <figure>
              <img
                width={80}
                height={80}
                src={
                  soundEffectListMap.find((item) => item.name === effect)
                    ?.imageUrl ??
                  "https://res.cloudinary.com/dnmjmjdsj/image/upload/v1702508479/audios/icons/1_ntd34p.png"
                }
              />
            </figure>
            <div>{effect}</div>
          </div>
          </SwiperSlide>
        ))} 
        </Swiper>
      </div>

      <button className="control setting" onClick={toggleAudioModal}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 1024 1024"
          height="2.2rem"
          width="2.2rem"
        >
          <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM340 683v77c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-77c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198V264c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v221c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8s0 .1.1.1a36.18 36.18 0 0 1 5.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8 0 0 0 .1-.1.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7zM620 539v221c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V539c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198v-77c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v77c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8v.1a36.18 36.18 0 0 1 5.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8v.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7z" />
        </svg>
      </button>
      {showAudioModal && backgroundMusic && (
        <AudioControlModal
          onClose={toggleAudioModal}
          backgroundMusic={backgroundMusic}
          soundEffectRefs={soundEffectRefs.current}
          activeSoundEffects={activeSoundEffects}
        />
      )}

      <button className="control timer" onClick={toggleTimerModal}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 24 24"
          height="2.2em"
          width="2.2em"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M17.618 5.968l1.453-1.453 1.414 1.414-1.453 1.453a9 9 0 1 1-1.414-1.414zM12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM11 8h2v6h-2V8zM8 1h8v2H8V1z" />
          </g>
        </svg>
      </button>

      <button onClick={onNavigate} className="control likes">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 1024 1024"
          height="1.5rem"
          width="1.5rem"
        >
          <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
      </button>
      <TimerModal
       
        onShow={showTimerModal}
        onClose={toggleTimerModal}
        onTimerEnd={handleTimerEnd}
      /> 

      <button disabled={isMusicLoading} style={{
        opacity:isMusicLoading ? '.2' : '1'
      }} className="control play" onClick={togglePlay}>
        {" "}
        {!isPlaying ? (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 16 16"
            height="2rem"
            width="2rem"
          >
            <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z" />
          </svg>
        ) : (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 24 24"
            height="2rem"
            width="2rem"
          >
            <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z" />
            <path d="M9 9H15V15H9z" />
          </svg>
        )}{" "}
      </button>
    </div>
  );
};

export default MainPage;
