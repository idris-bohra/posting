import { useEffect, useState } from 'react';
import './App.css';
import {LoginSocialFacebook} from 'reactjs-social-login'
import {FacebookLoginButton} from 'react-social-login-buttons'
import axios from 'axios';

function App() {

  const [shortaccess, setshortaccess] = useState(null);
  const [longaccess, setlongaccess] = useState(null);
  const [userid, setuserid] = useState(null);
  const [username, setusername] = useState(null);
  const [file, setfile] = useState(null);
  const [url, seturl] = useState(null);

  const App_secret = "40f694e5ce03df5da9aafd4894fcd8ce";
  const Appid = "696423145190343";

  // window.FB.login(function(response){
  //   // handle the response 
  //   console.log(response)
  // });

  // setTimeout(() => {
  //   window.FB.logout(function(response){
  //     // handle the response 
  //     console.log("logged out" , response)
  //   });
  // }, 10000);

  useEffect(() => {

    axios.get(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${Appid}&client_secret=${App_secret}&fb_exchange_token=${shortaccess}`).then((data)=>{

      console.log("long user access token  = ", data)
      setlongaccess(data.data.access_token)

    }).catch((error)=>{

      console.log("error_long_access_token", error)
      
    })

  }, [shortaccess])

  useEffect(() => {

    axios.get(`https://graph.facebook.com/me?access_token=${longaccess}`).then((data)=>{
      console.log("user id me  = ", data)
      setuserid(data.data.id);
      setusername(data.data.name);
    }).catch((error)=>{
      console.log("user id error me", error)
    })

  }, [longaccess])

  useEffect(() => {

    axios.get(`https://graph.facebook.com/${userid}?fields=id,name,email,picture&access_token=${longaccess}`).then((data)=>{
      console.log("various user fields  = ", data)
      setuserid(data.data.id);
      setusername(data.data.name);
    }).catch((error)=>{
      console.log("various user fields error", error)
    })

  }, [userid])




  const handelInputs = async (e)=>{

    console.log(e.target.files[0]);
    console.log(e.target.result);

    setfile(e.target.files[0])

    if(e.target.files[0])
    {
      const url = await convertbase64();
      seturl(url);
      console.log(url);
    }
}


const convertbase64 = ()=>{

  console.log("convertbase64 is called")

  return new Promise((resolve, reject)=>{
    const reader  = new FileReader();

    reader.readAsDataURL(file)

    reader.onload = ()=>{
      resolve(reader.result);
    }

    reader.onerror = (err)=>{
      reject(err)
    }

  })
}

useEffect(() => {
  
  var data = new FormData();
  data.append('access_token', longaccess);
  data.append('source', url);
  data.append('message', "this is my messege spread love and faith");

  console.log(data)
  console.log(longaccess)

  axios.get(`https://graph.facebook.com/${userid}/accounts?access_token=${longaccess}`).then((data)=>{
    console.log(data);
  }).catch((err)=>{
    console.log(err);
  })

  window.FB.api(
    "/me/photos",
    "POST",
    {
        "url": `${url}`
    },
    function (response) {
      if (response && !response.error) {
        /* handle the result */
        console.log(response)
      }
    }
    );
 
}, [url])



  
  

  return (
    <>
    <h1>idris bohra </h1>


    <LoginSocialFacebook
    appId='696423145190343'
    onResolve={(data)=>{
      console.log("data = ", data);
      setshortaccess(data.data.accessToken);
    }}
    onReject={(error)=>{
      console.log(error)
    }}
    ><div style={{width:"200px"}}><FacebookLoginButton/></div></LoginSocialFacebook>

    <input type="file" src="" onChange={handelInputs} alt=""/>

    </>
  );
}

export default App;
