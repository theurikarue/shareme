import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { jwtDecode } from 'jwt-decode'; // Updated import
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../Client';

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    try {
      const decoded = jwtDecode(response.credential); // Correct function usage
      localStorage.setItem('user', JSON.stringify(decoded));

      const { name, sub, picture } = decoded;

      const doc = {
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture,
      };

      client.createIfNotExists(doc)
        .then(() => {
          navigate('/', { replace: true });
        })
        .catch((error) => {
          console.error('Sanity createIfNotExists error:', error);
        });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <div className='flex justify-start items-center flex-col h-screen'>
        <div className="relative w-full h-full">
          <video
            src={shareVideo}
            type='video/mp4'
            loop
            controls={false}
            muted
            autoPlay
            className='object-cover w-full h-full'
          />

          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
            <div className="p-5">
              <img src={logo} alt="logo" width='130px' />
            </div>
            <div className="shadow-2xl">
              <GoogleLogin
                onSuccess={(response) => responseGoogle(response)}
                onError={() => {
                  console.error('Login Failed');
                }}
                render={({ onClick, disabled }) => (
                  <button
                    type='button'
                    className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                    onClick={onClick}
                    disabled={disabled}
                  >
                    <FcGoogle className='mr-4' /> Sign in with Google
                  </button>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
