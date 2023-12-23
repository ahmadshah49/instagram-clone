"use client"
import Lottie from 'react-lottie-player'
import authPage from '../../public/assets/animations/authenticationPageAnimation.json'
import loader from '../../public/assets/animations/loader.json'
import useForm from '../hooks/useForm'
import { FaFacebookSquare } from "react-icons/fa";
import { useContext, useMemo, useState } from 'react';
import Image from 'next/image';
import { GlobalContext, GlobalContextDispatch } from '../state/context/globalContextProvider';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from '../lib/db';
import { authError } from '../utils/authError/authError'
import toast from 'react-hot-toast'
import { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp } from "firebase/firestore";
import fetchCurrentUser from '../utils/fetchCurrentUser/fetchCurrentUser'
export default function Authentication() {
  const [isLogin, setIsLogin] = useState(false)
  const { isAuthenticated, isLoading, isOnboarded, user } = useContext(GlobalContext)
  const dispatch = useContext(GlobalContextDispatch)
  const {fetchUser}=fetchCurrentUser()

  const { form, onChangeHandler, resetFormData } = useForm({
    email: '',
    password: '',
  });
  const { form: onboardingForm, onChangeHandler: onboardingChangeHandler } = useForm({
    username: '',
    fullname: '',
  });

  const authenticate = async () => {
    if (isLogin) {
      const [data, signinError] = await authError(signInWithEmailAndPassword(auth, form.email, form.password))
      return signinError
    } else {
      const [data, loginError] = await authError(createUserWithEmailAndPassword(auth, form.email, form.password))
      return loginError

    }
  };

  const setUserData = async () => {
    try {
      const userCollection = collection(db, 'users');
      const userQurey = query(
        userCollection,
        where('username', '==', onboardingForm.username)

      )
      const usersSnapshot = await getDocs(userQurey);

      if (usersSnapshot.docs.length > 0) {
        toast.error("username already Exists")
        return;
      }
      await setDoc(doc(db, 'users', auth.currentUser.email), {
        fullname: onboardingForm.fullname,
        username: onboardingForm.username,
        email: auth.currentUser.email,
        id: auth.currentUser.uid,
        createdAt: serverTimestamp(),

      });
      toast.success("Welcome to Instagram")
      dispatch({
        type: 'SET_IS_ONBOARDED',
        payload: {
          isOnboarded: true
        }
      });
    } catch (error) {
      toast.error(error)
    }
  }




  const onSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch({
      type: "SET_LOADING",
      payload: {
        isLoading: false
      }
    })
    let error = null
    error = await authenticate()
    // await fetchUser()
    const userData=await fetchUser()
    if (userData) {
      dispatch({
        type: "SET_USER",
        payload: {
          user: userData
        }
      })
      dispatch({
        type: "SET_IS_ONBOARDED",
        payload: {
          isOnboarded: true 
        }
      })
    }

    dispatch({
      type: "SET_LOADING",
      payload: {
        isLoading: false
      }
    });
    if (error) toast.error("Email Are Already in use")
    if (!error) toast.success(`You have succesfully ${isLogin ? "Logged in" : "Signed up"}`)
    resetFormData()
  }
  const isDisabled = useMemo(() => {
    return !Object.values(form).every((val) => !!val);
  }, [form]);
  const onboardingSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch({
      type: "SET_LOADING",
      payload: {
        isLoading: true
      }
    })
    await setUserData()

    dispatch({
      type: "SET_LOADING",
      payload: {
        isLoading: false
      }
    })
  }
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <div className='flex h-4/5 w-4/5'>
        <div className='w-full  '>
          <Lottie
            loop
            animationData={authPage}
            play
            className='w-full h-full'

          />
        </div>
        <div className='w-3/5 flex flex-col justify-center rounded-sm space-y-4 text-center   '>

          <div className=' relative rounded-sm border text-center border-[#DBDBDB]  '>
            {
              isLoading && <div className=' absolute flex  items-center justify-center bg-black bg-opacity-20 w-full h-full z-10'>
                <Lottie
                  loop
                  animationData={loader}
                  play
                  className='w-40 '

                />

              </div>
            }
            {!isAuthenticated && <form onSubmit={onSubmitHandler} className=' flex flex-col px-10'>
              <div className='mt-10 mx-auto my-6 text-4xl font-bold '><Image
                src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaoAAAB2CAMAAACu2ickAAAAkFBMVEX///8mJiYAAAAjIyMgICAYGBgaGhoSEhIdHR0ODg4XFxcRERELCwv6+vrz8/Pr6+vQ0NDHx8fj4+Ps7Oz19fUrKyvd3d01NTW+vr42NjaioqKKioqzs7N/f39jY2M/Pz9GRkaamppPT09kZGSQkJB2dnZZWVnW1ta2trapqalubm6Dg4N6enpFRUVVVVWdnZ3OPFG0AAAZaElEQVR4nO1d2XrqMA4mscke9rVQtrIUWtr3f7tJ7NiSbAd6ZubktP3QHRAcx7+sXU6rVUOn57U33b3N6n7/G9Q/bo6L2aDJW/586h2zgHkeC9Jo32nqpgM/YjxIk+nnsKlb/njqHsLIq4iF415Dt32N1S29Rd7QPX84zeaJh4iPGxJJT6HmD3/bzC1/OG0T7hHKnpq58QI4pP3czC1/NOWXmFGkvGTfzK0PQeO3/MnU2UkpxIPmoXrRCtILP5u55Q+mzlpCFM377cahOoLgTc/N3PLnUr6RSAWbUStpHKoNQBUvm7nlz6WVxCfaFLayp1VWsmjm7nNQklmjrvcPpIV0bPi02/oXUI0BKr8pX+6H0rlyQcN++Yk1DlWEoJo0c8sfSqdqH4Vv4iPXC9duCKoMjE7/EQi8QflO2spsKiNwAUD11swMfIAqfkB1g7ZVWMevjK9/ClX0gKqeBqGEhu+qL1CUp3GomNdt5pY/kl6q8ITfr75oBKrR/nJ533+ez+fZbBYDVNMHVLXU89UiqW/SJqDa+0EUJGGaxlkGSBU03nxc3hfn5azXG3RHf+3+P5E+qkgBRHSyBqAazs3QsN5XnEdBu0DQF3R55K8UqU3lpXpNmoCqn7mBsujhZ2lS+YfgoL9qAqq3dg00D6jqqKvyr2Fff9cEVMfIjYxJLHqYGRU9VTYE86DmBaAK/hpUH7wGG4Oi1UNXScpVpogf4UsE1V/Lnr/7QUlRFHFuGhgMkf/IiVQ0UHZyiKoomoBqsHgr6LJarY6b9RjjFECwxBuPL39rAiZ9+827VLCEKPfQBFSEnqFGgG36vYmmQTNlgfn5+fhxeP3eaL1Xi8RwGdnfgKr/uXj7XNbUgCKootWNQTqzp8Xb9vwHGa3Jcvu2+Hy9HVec8SyIeOBfv1yiWgz7vPicNYktqKor3DZ3QzV7+VgsT65R+ovjatt3/aLoKfPDpB3GvrvG5R1BVS/xZjs/S5N2Evv+4ktRjNE28eOwnYSZP36tv+zVryRu+DVpO9oGxbBBOezqJtcMD8fDuUcEw+nteNzbS7VcXfZ3st9dFTPAVkXutAA7fsCTOJ4/maz3Oo6TKAqzde1qTOa6as13XoSgQu4dpeHKB6MxDMrHHazC8eZwrnO8ZuNUaz3mH8sl6x3Xu2L1yG4YaN3IvK9E9Wc81MNG2Xs5Vv9yPT4vLdhe4ihIw3DzqYftpwmPkpQv6I0+sihK4uTg3AgVTZQjipnZDVVXRjV46JHVHuriQR5/uBetn8IaRy+uK1AZYPDunmlvimreilXNzq3RLmRlpXu0cj7iPiT+QHs9aZ2ywt4M0vZ0j1j9BQb+SrHAPiMGa7jrtE5JwKMgTuZnKhGnVcYiVomd0VxOiSURrsuqqiVY0P6ol00ThQp2oEa3oCrBQgN0N6hyOgpdBU69Nno2vnHpAwyV25PrR4YfxuLzsCosYEHiEB6LzPABoungrEvjp5qtByFc4t+U4nJYn47qBfNc2WY8PpKnm6oZpNW6bKHeO4Z67xEMGYW1afeTuqrthqrtgMrz4dLhjsSHmG+bId01XmQ3VBcIXbirOQaJFdxlbKmXItpZ/9jaMcZgtdWzzbS7toQ8ghdX2zPvTl73z4ulLQ8/7WGTy1kjQL1AXdxTiYoOqvZhbS0KziixwOI6rCYuqDpOqAYuqI6kG8Fz6aL3EP/uthowVK6NqQQHITbW7hjfmP/om8wvLoNoPlQbonJ5Nu62RsNJYblPsywJkswzS/ZnoSMfEKz1lyn5AzOgOuOlgP1DeJkFNQprouaJTb2vQ7VAHCnJsrVPBCkvdPZ5IKicFzyTQZgV3uAfxh9GU+b6B3wJUKF7s+nzZRP5caBuwHyKVZewDLs1bEmRARWZlM659yhXZTXhGW0BYm7vwIa8DVXPZl22NpzWBd13mdPGwiXrjt4TvEVYwqe7aZsGey0GITyUROPNOqCR/FTvfqQnC5Y2VCIbE3l9QA9T2FfrjWcI5owIFW1ayo1A8z46k/tM7KXamn1nCHCIoALJqWWll6o/qw3OgemZ2ZG1I88euD0XBJWjZD1HZdJRui0j7afdTbE6QNjyTFjGp3eSag61IfJkSQZMCTY0+uim4bV0gEezMWEaWhpsQHWgNqwnLxoxinZtzb5ieuwC34NKWYCLaubR9RUmMKc5i8mYTKQm+bSC53WUrD8BN0Y7tWkPGCvTGUOLAt18e4wVQDW5meMka4/YLlXiJieahlr7FKqcyiAF1atx/6zOPT1VF+Ld0IVnSm5ApViXe52RFtemAOwR+Vfn3yKo7JJ1lNpnHkQpdoidDWdsgnY5Kiu8IK5G2bkD1aaUUrSr0KYK4YZdjMAtqJYUEwUV3Wu3HAYle9Dc3VBpu5615RfvUvqzYNIa6E1sGuNUPvs1aUIMlTVT9Igx+rGHoaI+whvwh4+Qn6B/oMcd7dTlPCopCGCfMIbsMciG8g0KbO0RN/rEfNMgiPmtqH6toOrKpUOWSS1UyjTAHpRTAAJUgfisXMek2LAT/XB8R6NzZFfFdW2+qL3KDhjAClFNhx6d1msPwdIKXtwjER3UrUaKjquCXp6fYTpsDnphAI8S460/RNuKCPgcoHorA3PyJurLCirJiGw6V9eG9RGTdzkDNtWTGjgtQIAqEp8r1hVl7ifgtyONrQyQgRrYjqpaQwSV6VZMQO1G5LdXtPmJM4a2YZv8A1kQCV4Q2TTOxsNWnpfT7+kBsGkJreX8gzwk4oAMQzUiUMlZRas3lctgYhAp1eLzSi1BUA9VZywvCrU+/xJUXblnudBNPT0py2wG3ufr2mAohso0PJ70bKIj+WEAFgt1xuCWEfW3kAVBoJLLBVIURBq2nMF+oI4ujnekePYd7R+Uyyh0EvMGM2UdsJF+CLbuapMluhGz7ckcAFRsuqHSThTj5cetnJ8UBX39bFY0YqaXp12fh0CFFlYjCPCsYRzmYJARZwxt5JTaKF34BW+3oYw2gD4HzkHSCJkPMVW5JxTBrIVqKNzldK8XhPFSq8u9Fm5H2iFht8LrSxkbjxUHDZy6CqBi5TSuYui2NOlmWjbYjtOLmjDzarHCUBkuNCgeK0UBtlOMfRGwZMyi6hzug6Hqi+dlY31LbXJi12OpV8UU8jlsb46nOMRQCUzKCWl/npdjyw2dDTsqOMW8m8V0/XaAV2nyBahm4pOq/JppEWDnMLrw4I5grqRdPVQgW63oEcgp4otAhaEhMXEQCUfansUfQN9hzYuG1RNJTOto7eYmBNVC3rrMPOh1LDMjcnEKH6arobpzqotM26kUxsRprGtuEKaL5Ia0mjRoeEeGHwUpw7WbZRBUsQEVMLPllMFPNY6qFaSCGA6SVLnct+BIIJmNgthXPazlpGqBSde5q1mpvehI+TdEOr+cgtzQhejVDH0PquI/Oz/0K+F1D6qx1oYsNxfNbnPMcWiJu4ORKHKUGFCB32pFXCAEiY3nDiik2BT7EJBEUEnPFuU8YVsiFkCxBss71JKYSlyAKtmLmIQQOTroVW5sMaFyQbUaZdP7mejTflFN/wtQSWxixbVgx9o5jDMNUsYHR8IKoGJRp+4ny+OCSB9yaFsnGMtiUBCZAfwkFxqNDhoNAQrBGi8xq180B9BYDThiwV7IP3EPbZ6URqh4ulKgalvIjMzdphqo1JKXUImnYXrOW7BuTTku7Q+Utkg2tokDGw8X+QoCld02F94NVV/rTTuN+alZCnojOyJVwa9wFRgyaOVBKrK1CdX2HlR8VaoiNi+/1TnfYtJSOJX+yX8J1cnpW2KoJmLpQb0utMiw1INwO6PjFAXHx1aYD4UHaNah1dUg2z1ykGrHsQcQxnadGvjAANVSjALh29ZQcwce4JzeGFZNhJPyNBTeEEPKxRyp+RWehGArgSAIwPmflD66odJsVThgkjtDPa/3WoUiDF+WdnpTlMGzAkwgctiUQgU+C9+Ze2Sgf2sjqJCQs4LDCCqNu/Bs+RzdEsxEZCNBWYRtOWkY6T4eGClyGYjRSY/CTRSSUwiivwbVlNGVuNS5qTJRUuq00xpFkM3+NpByJlTIubb6DJAuQGoM2MYu0wCdqqGStkmIOKzvjFUAB1i2OoKKREAnFKoq6JcrUAoBJNikLTTY/K9AtZYXoNgMhHIMQ3ZS5gEkyw6uCKuYrDvKBLI5DfeCx2ZXZYCrjqGCNKWdUN7aUAkLk6/RXWdOHwA4wE7TggC8BVXFOTpRWnwu1aR0vf9LqHp3oNosxOMhRQwCzEg3iRq7Kucz3KGpx3jhn1B+aU2hQm6V5VwDwhGCCkwUO0sJWyOqFkTaYxkW26CVcDwSBIedpt1+CSqV+lKKOTqICyQLggv8R2YFhgo2O9pV1kJsaqAS0qWtUMmPuOQOSSeUzjChAu1iqwjwq/CuqptLSTriwBRUIj/AN3iPA5441gebNbag0sY6hepEoYqrmyjQ+VFYFVIODf9nqJDtbSSW1ckxgqC6ii5PKYvxQRQrNHkQlbgSgl0pVEibW7WcYD9jqCAAbmcpwVflUiUOxBA+mTSENFDDZF4bNcbD3oJKx8WUh83WT4JPhLHRURz2Z4dB1EBFykhoXHbuhkp4vzEW7R+o6EELZVzUZO4qYHG71xXkJoYK5mKlvnO9fRVUIpMd0fAr4Ol9ESrta1ArlUKlNSd4YReuvbTRTkP1J6fhYKhgnZcUKsKyYydUndIsjQijdVAhnQogdnGljGlWvNGkNyHw5txQWbuqc9VOmoRKFilmNAwCUI1xZfsNAahvSY11qqu07wcyvfxb5aXp0rH7MUBMGCowoihU1C/nTqiEoR7S9erBcXK88vq3uLrLNNbBSLDNCtD02K9a1+uqARwhL3WVWP/EGPgdInroGW+YFZAEueFXlZW7kqgmUXJLbXg2/pMTBb4CFXUvAxdUom7IXAdcoiL3QhlcQaXcNFqBgqSWQzsCGHG04oYFiEpMBVTCE2CBoRx0tJbsKmSsmz4ASprURStKxnTMwoMtrVjhTr7KoD6AgjiIQkU5NnF9XxrqwEuKUCZWSpJLsTJXcIE5gQosBzuegxP2CCpQKpYDBDaKgGokwpOZeRUEX/HkF/UuMPh+VNYQAQiRe1KNpjeRZgWSsJ+93QbODRXuV/AYIxAgqLRdJ5KPmV0qinJG5T5ZhsUDLmENab4K9cjxD6NTsYeKzhDjHOqjFag8vTTu9uUSY/dQksNPbt0MLAGK1NKekWpsmAyGSpep6UFwxdLEzzY3+zMRVEiGnPGNjSgPCED9h06pM+wODbMcqCyDS89IJpDaihE2402HY+/cy9jNNeIbQ/ApShREJMVR7wumLp7LjSgwyAkqRHCBIF5JbEbpwbQ5S7R9Qqs1LEJJkBjiRAQqIy0FtoLehqJ5w6oUa2EJyI+tfB0V2nuEZALJSpGdnNZXw+MSIpCZZoYf6eASqk25x1K7RwgKRfD0ocUB1waWhMNiDM8RqWBijuLTVbQLoqeNVWGxVNlNqFAZDIKYQGVgYJd5ic2fuDoQwRqIDq1dIN87gqqBkMjMSZeLYdBNcA4MiTooxjD3IfbfopGwmUHZowGcHlQHcZMRUEExmBgt7ISYD6iYA7d+aNaG5DDI10KoUPAtug+VaVKDL1NxSafMT7G2S85qD6LMjYalshjhaBDO+H/GZUW8fliqI/ZohXCHMdIQ1GHK1xh4IeVZ27HtobeQyI5pnb+G+wuwTEBGDDXs8ErqP3TVHuRQ2FrsNKsJipIbKsw8po8DK13pBxGmdb+HoAMXixyWuAUwPNIEZSV8BFlHvsOCh+w4hjYH4lkqpmd46TyBW+qszNZrT3rZ617pcMKbBz8yEQk4CIHMWi9UX+vCN1TmXCi7m8d4EKgQl2CoTC9wZXgWoj9G1YsP6Hv5wA8VJIO5yN6FaE6BN5ujLgJixpJmTRbpx8uRhuCk8pqelSYybkczBSYIfGCUkEDteJRnLnhYJIlnRP7hobByAztEx2Ug9FIIqztHxyGzAtlHGCrTbEI2dTpr5XvfgwjJK/fb+E1vTzTqISvnujC4Nvc/U2EvgHzB/fsyQgA+sEbxFUPIkTzq0zi3Vx8YgOoMJOqwgsGCVRqveh/qTZDTHkC2RioDGorZVSOogxh605bKrrbbqroEQQWKGdXms7HBjTjhNF0cZXGv3HllozPLdlB1ciWPoIrN4MFU7f5raUsXGhx0EjaFRVME17YUmE2kMw01guRTcl/xp5rzV8BGhZj0EPcfI9UoC5i5ihCCJbOkjW8kz4KEEDQqDNVzqsYroRWS23F2yALj2DJShnZhOm7nl+1JiYwDVZ1XkaeE+IEwd6z2NyrRlzbgZ8l65T5CnSA689U6i33rqbcuVMVA1Qqhjk0oWl8ZHWcFl9S+KfBdh5a42q0LouiA10UfXfugOgq1M07DZYYsXjpLarQkrZh8WPCqWXNtEvgfOKa1dEYGq39Y6xBVeSeFDPOv5255TBJ55EB7PuhIB8a3k9edKPEWJaGo2VCZAZ+CZeM9xLurlFMpM/gGxakqZ2z0IlaHo9PsEue5NIJOUEpdTbC0FzlKgHoSwtFFTJN3O2ozV5Dkx0LPTuugGupDVzDTa+VWTbp87vTOe9cgWkGMYLBbrETQiHBQebdKeQxAbvDU9/2MNnF7wDN7ZMEmfiyuk8w7QecD+pdTqzO7iqkEhfDQrVRMHLrUK2/nT1DzMMueBq3BUyLgzvbgffL5DX4F7khEWOYcFwz+gRxyFm4Hre5TJDD1z8iEFfHpTpnvDs/o0GvqjuvzT8g5Rlo1sPA86IuUeXin0ALEGbY/kAnkW09pnkSrLEcSbjApxCmD4ZSZv6fPxoMVFGRZJo9sEu9vyrWGZtl6tS7P6imkJG7J98LiH/Kq7Bl0PctuLQLisCC4vE9j+UhH/GpDPWxaivqB3ihBslqlUSlHUHKcNCqUvFAtJumqRAGRMItFfubeebSvYAEhNwH6KLXeA6KQMH0mzLNldgFlF+IhG13NIEOFNLGIyz4kvIHEmRMikHwyz1cSS7rKoWvHdSoTImRps0js6pJvBmPHoTSJ3C+In+TZF/ETLsU3/KN84YdBFIT08JyLuVrZveQ9KtlBl0LXv9ULY2ZyoVZh5jvWTA5iHZ1FD5bworm2Grtz6/joSNnhH8Yh4PLer/bhJ9nLCEdKbjWcFfRkDJAIU63PLaziSvHnH3Sd2x+kvMc6se20Paye99RbyDf0Yfy7r51EtVJY0mlx7HLL0KEQwRjXuqbOQ7oL891qee2s8L4K5ugxBnP6DCzW1n+HGCr6VOKlTxeV+/vyWTRUrogSXQSiVsMPKS/7Ht3gHE5K6mzISRrrLj081HG2iq0suzsSjK85bw+Rdmhpr8BE7RDXeSX6RAEWHwmr9I9BYpyJxCJ//ukID47eYq1KAAtBw2MMK8cSvkcHolz0uX+szbXEns2Ro8mzq2CfJ/CZ7578N5vqAXh6UVr1dAQIi2E3iCvzC0w/3ZWLsASZclfrSOpcYsXaPLuPFATpjaDEk9+OGGPcd8n5wS4OOA+y6dlkltPbZhyHERdncfMoDKerZY1On13D8kIe8jcTytlG/hSFydxIjb5u0qD8JR5f0A+d/ThLyn8EMdudxXD7mrZtN3UW8zjhxQ3TDQ5mvq7b5XlZxaPyaliY4y5Io+IfMVsIaPPFtLy0eOok/ep5u7NjVPwnSJP1V04tV9knSyf1ny/r+XTnlqD58rBbH2ZOEAa97WU3H4+n0+tx379le/W2q+t0s3VE/vPe52Uzv662PatBK58drtPrxTy+rztbHNfz3WFZAfiGBOwXoCq2ef/t4+NlT89PLSayfN7NNxfXOb6np8v6+vKkJzKcvW+m8/nH2x+cjHw6Hz4On72vnM6rMzNfOHPyj2jU+aenY79gsyX5Pz/bvyHl67qy7T+X8g8SJwl/BVSqte9XveKmOzZO3fsVUFUGbdzQO9EboUl1bB8UFvyGd3pXx6GGt9OPP4v6TLJfsGG/CSqZ4go/vvzShe9Ps+qY0/RdNzT/CqhKB5jFL7/oBV+zygVPD1AIkf4CqEZrzgK+/d4vnfkjeq2C3uklRy+WvJ0I/xHUGWfR5TfZfufqRRjhS976XVC1eudf9WbyT3WKqAiN936TAPxldK6wiWQzl4bqV5gVv4pU3RCv2rb6D6i+KSlkuDqnTxvrvyMG+HtIncfPdAOqruW5lwV+UKPUUafmQ4mWrpB7vBj6W5F6LUECyXJVNsL4L3Icfz6pGlaO2qxU2Qgcf/2gf0/6WD9X96mj6OpB/4xUlTk5REFV+LhfE/igf0IjVW+Ee691HWD8cKu+DykDgrQY6oPnb73N4UENkypCJidtq5eosemX3tb9oCZInfhDq1pVCPBOh+2DmiR1EkFMkh2qwid1vHvzQf+I1P6hvRSqMfChqr4RVYFa8aoZTerkHl77zrMHNU/VrqKgqOOd7rVtPqhJGrigqhxg++S7B/1LqgTgGH2l+vW+2EDzoIao6r3HL2KvDvhkjwTI96IqiYg6LPtV/O9+2+aDmqUqr6jP3pmpN7U6Wj0f9E/pJI+7YNG2Oxp1e6sqfJvsHknFb0dVrSYLp7vdNFPvf989on/fkM5B1anDVd84Dy+PPfUtqbcL8YkGLJz/hvLnX0qzXZiKLnTGw3j89NhS35kGy8tu7Hnrl88fXKT5H86wmWyr2x6eAAAAAElFTkSuQmCC"}
                width={100}
                height={100}
                alt='instagram_logo'
                className='w-auto h-auto'
              /></div>
              <input type="email" name='email' id='email' placeholder='Phone number,username,or email' onChange={onChangeHandler} value={form.email} className='py-3 bg-gray-100 my-2 px-2 outline-none border rounded-sm focus:border-[#aaaaaa]' />

              <input type="password" name='password' id='password' placeholder='password' onChange={onChangeHandler} value={form.password} className='py-3 bg-gray-100 px-2 outline-none border mb-8 my-2 rounded-sm focus:border-[#aaaaaa]' />
              <button type='submit' className='bg-[#57bcfe] hover:bg-[#0095F6] text-white py-2 px-8 rounded-md font-semibold active:scale-95 transform transition disabled:bg-[#99d6ff] disabled:scale-100' disabled={isDisabled}>{isLogin ? "log in" : "sign up"}</button>
            </form>}
            {isAuthenticated && !isOnboarded && <form onSubmit={onboardingSubmitHandler} className=' flex flex-col px-10'>
              <div className='mt-10 mx-auto my-6 text-4xl font-bold '><Image
                src={"data:image/png;base64,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"}
                width={100}
                height={100}
                alt='instagram_logo'
                className='w-auto h-auto'
              /></div>
              <input type="username" name='username' id='username'
                placeholder='username'
                onChange={onboardingChangeHandler}
                value={onboardingForm.username}
                className='py-3 bg-gray-100 my-2 px-2 outline-none border rounded-sm focus:border-[#aaaaaa]' />
              <input type="fullname" name='fullname' id='fullname'
                placeholder='fullname'
                onChange={onboardingChangeHandler}
                value={onboardingForm.fullname}
                className='py-3 bg-gray-100 px-2 outline-none border mb-8 my-2 rounded-sm focus:border-[#aaaaaa]' />
              <button type='submit' className='bg-[#57bcfe] hover:bg-[#0095F6] text-white py-2 px-8 rounded-md font-semibold active:scale-95 transform transition disabled:bg-[#99d6ff] disabled:scale-100'
                disabled={!onboardingForm.fullname || !onboardingForm.username}>submit</button>
            </form>}
            <div className='flex px-4 items-center  my-8 justify-center'>
              <div className='h-[1px] w-full bg-[#DBDBDB]' />
              <div className='mx-4 text-xs font-normal text-[#868585]'>OR</div>
              <div className='h-[1px] w-full bg-[#DBDBDB]' />
            </div>
            <div className='mt-14 flex items-center justify-center pb-6'>
              <FaFacebookSquare className='text-[#385185]' size={20} />
              <div className='mx-4 text-[#385185] font-semibold text-sm '>{isLogin ? "Log in with Facebook" : "Sign up with Facebook"}</div>
            </div>
            {
              isLogin && <div className='my-4 text-xs text-[#385185]'>
                Forgot password?
              </div>
            }
          </div>
          <div className='py-4 rounded-sm border text-center border-[#DBDBDB] px-10 '>
            {isLogin ? "Don't have an account" : "Already have an account"}
            <button onClick={() => setIsLogin((prev) => (!prev))} className='text-[#0095F6] px-2 cursor-pointer font-semibold text-base'>
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-sm'>Get the app.</h1>
            <div className='flex gap-4 py-2'>
              <Image
                src={"data:image/png;base64,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"}
                width={100}
                height={100}
              />
              <Image
                src={"data:image/png;base64,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"}
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
