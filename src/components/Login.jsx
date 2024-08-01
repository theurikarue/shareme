import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';  // Correct import

// Log environment variables to confirm they are set correctly
console.log('REACT_APP_SANITY_PROJECT_ID:', process.env.REACT_APP_SANITY_PROJECT_ID);
console.log('REACT_APP_SANITY_TOKEN:', process.env.REACT_APP_SANITY_TOKEN);
console.log('REACT_APP_GOOGLE_API_TOKEN:', process.env.REACT_APP_GOOGLE_API_TOKEN);

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'shareme',
  apiVersion: '2024-08-01',
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (credentialResponse) => {
    console.log('Google Credential Response:', credentialResponse);

    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Decoded JWT:', decoded);

    localStorage.setItem('user', JSON.stringify(decoded));

    const { name, sub, picture } = decoded;
    console.log('User Info:', { name, sub, picture });

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc)
      .then(() => {
        console.log('User created or already exists in Sanity.');
        navigate('/', { replace: true });
      })
      .catch((error) => {
        console.error('Sanity createIfNotExists error:', error);
      });
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className="shadow-2xl">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log('Login Success:', credentialResponse);
                  responseGoogle(credentialResponse);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
                theme="filled_blue"
                shape="rectangular"
                locale="en"
                text="signin_with"
                size="large"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
