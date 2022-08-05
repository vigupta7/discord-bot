/**
 * Created by orel- on 15/May/17.
 */
import React, { useState, useEffect } from 'react';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios"

function App() {

  const qs = (key) => {
    key = key.replace(/[*+?^$.[\]{}()|\\/]/g, '\\$&'); // escape RegEx meta chars
    const match = window.location.search.match(new RegExp(`[?&]${key}=([^&]+)(&|$)`));
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  };

  const [token, setToken] = useState(null);
  const [eKey, setEKey] = useState(null);
  const [double, setDouble] = useState(false);
  const [isVerified, setVerified] = useState(false);

  function showLoader()
  {
    //alert("here");
    document.getElementById('loadingImageAuth').style.display='flex';
    setTimeout(() => {
      window.location.href = "/api/discord/login";
    }, 1000);
    
  }

  function checkRecaptcha() {
    if (null !== token && null !== eKey) {
      setDouble(true)
      const temp = JSON.stringify({ "code": qs('token') })
      axios.post("/api/discord/levelUp", temp, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          if (response.data.status === 1) {
            setVerified(true)
          } else {
            alert("We hit a snag while upgrading your level on discord channel, Please try clearing your cookies and try again.")
          }
        })
        .catch(function (error) {
          alert("We hit a snag while upgrading your level on discord channel, Please try clearing your cookies and try again.")
        })
    } else {
      alert("Select Captcha")
    }
  }

  function handleVerificationSuccess(tokenValue, eKeyValue) {
    setToken(tokenValue)
    setEKey(eKeyValue)
  }

  return (

    <div className="containerInner">
      
      <div className="topLogosBox">
        <div className="leftLogo">
          <img src={'/static/images/white-logo.png'} />
        </div>
        <div className="rightBullLogo">
          <img src={'/static/images/bull-logo.png'} />
        </div>
      </div>

      {!qs('token') ?
        <div className="bottom_authorize_container" id="unauthorize">
          <a id="login" href="javascript:void(0)" className="authorizeBtn" onClick={showLoader}>AUTHORIZE
              <span className='loaderInner' id='loadingImageAuth'>
                <img src={'/static/images/loader.gif'} />
            </span>
          </a>
        </div>
        :
        <div className="bottom_verify_container" id="authorize">
          {!isVerified ?
            <div className="innerFlexContainer">

              <HCaptcha
                sitekey="88491b82-fa89-4782-ba40-d7d015b15ed3"
                onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
              />
              {
                double ?
                
                  <button type="button" className="verifyBtn relatedParent">
                    Loading...
                    <span className='loaderInner' id='loadingImageVerify'>
                      <img src={'/static/images/loader.gif'} />
                    </span>
                  </button> :
                  <input type="button" onClick={checkRecaptcha} value="VERIFY" className="verifyBtn" />
              }

            </div>
            :
            <div className="textInfoContainer" id="verifyTxt">
              <div className="textContainerInner">
              Please check discord, Now you must be granted access to server.
              </div>
            </div>
          }
        </div>
      }

    </div>


  )
}
export default App;
