
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Box,
    Stack,
    TextField,
    MenuItem,
    Unstable_Grid2 as Grid,
    SvgIcon,
    Typography,
    Link
  } from '@mui/material';
  import { RouterLink } from 'src/components/router-link';
  import { paths } from 'src/paths';
  import React, { useState, useEffect, useCallback, useMemo  } from 'react';
  import { primaryColor } from 'src/primaryColor'; 
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
  import { apiUrl } from 'src/config';
  
  
  const customerType = [
     
    {
      label: 'Distributor',
      value: 'Distributor'
    },
    {
      label: 'Retailer',
      value: 'Retailer'
    },
    {
      label: 'Manufacturer',
      value: 'Manufacturer'
    },
    {
      label: 'Customer',
      value: 'Customer'
    }
  ];
  
  const Password = () => {
    //image carousel state handeling
    const [currentImage, setCurrentImage] = useState(0);


    //form state handling
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registeredData, setRegisteredData]  = useState("");

    const [step, setStep] = useState(1);
    const [touched, setTouched] = useState(false);
  
  
    //updating form state
    const handleInputChange = (event) => {
      const { name, value } = event.target;
    
      switch (name) {

        case 'Email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
            break;
        case 'confirmpassword':
          setConfirmPassword(value);
            break;
        default:
          break;
      }
    };
  
    //check if email field is open
    const handleBlur = () => {
      setTouched(true);
    };
  
    //add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasError = touched && !emailRegex.test(email);
  
    //handle next and back button
   const handleNext = async (e) => {
     e.preventDefault();

     const response = await fetch(apiUrl + `getUserByUsername/${email}`);

     if (response.ok) {
       const data = await response.json();
       if (data.loggedIUser.length === 0) {
         alert("No user found with the provided email");
       } else {
         const firstUser = data.loggedIUser[0];
         setRegisteredData(firstUser);
         console.log(data);
         setStep(step + 1);
       }
     } else {
       alert("Failed to fetch user data. Please try again.");
     }
   };
  
    const handleBack = (e) => {
      e.preventDefault()
      setStep(step - 1);
    };
  
  

    //fetches API token
    
    const images = [
      '/assets/logos/logo.png',
      '/assets/logos/logo1.png',
      '/assets/logos/logo2.png',
      '/assets/logos/logo3.png',
      '/assets/logos/logo4.png', 
      '/assets/logos/logo5.png', 
      '/assets/logos/logo6.png', 
      '/assets/logos/logo7.png', 
      '/assets/logos/logo8.png', 
      '/assets/logos/logo9.png',
      '/assets/logos/logo10.png',  
    ];
  
  //handles image carousel
    const handleImageChange = useCallback(() => {
      setCurrentImage(currentImage => (currentImage + 1) % images.length);
    }, [images.length]);
    
    useEffect(() => {
      const intervalId = setInterval(handleImageChange, 3000);
      return () => clearInterval(intervalId);
    }, [handleImageChange]);
  
    const notify = (type, message) => {
      toast[type](message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    };

    const handleToHome = async (event) => {
      event.preventDefault();
    
      if (password === confirmPassword) {
        if ( password) {
          try {
            const response = await fetch( apiUrl + 'addUser', {
              method: 'POST',
              headers: {
  
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: registeredData.id,
                password: password,
        
                companyName: registeredData.companyName,
                userName : registeredData.emailId,
                firstName: registeredData.firstName,
                lastName: registeredData.lastName,
                emailId: registeredData.emailId,
                mobile: registeredData.mobile,
                address: registeredData.address,
                city: registeredData.city,
                state:registeredData.state,
                country: registeredData.country,
                type: registeredData.type,
                isactive: registeredData.isactive,
                gstNumber: registeredData.gstNumber,
                pandcard: registeredData.pandcard,
                createdDate: registeredData.createdDate,
                pincode:registeredData.pincode,
                unpdatedDate:new Date()
              })
            });
            
            if (response.ok) {
              // Redirect to home page upon successful submission
          
             response.json().then(data => {
              console.log(data);
              notify(
                "success",
                "You have successfully changed Password. Please Log In."
              );
              //localStorage.setItem('notification', true);
              //window.location.href = paths.index;
             
    });
            } else {
              notify(
                "error",
                "Failed to submit the form. Please try again later."
              );
            }
          } catch (error) {
            notify(
              "error",
              "An error occurred while submitting the form. Please try again later."
            );
            
          }
        } else {
          notify(
            "error",
            "Please input all fields before submitting."
          );
  
        }
      } else {
        notify("error", "Your password does not match, please re-verify.");
      }
    };
  

  
    const renderFormStep = () => {
      switch (step) {
        case 1:
          return (
          <>
    
       
     
       
       <div>
      <Link
        color="text.primary"
        component={RouterLink}
        href={paths.index}
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
        underline="none"
      >
        <SvgIcon sx={{ mr: 1, width: 38, height: 38,  transition: 'color 0.5s','&:hover': { color: `${primaryColor}` }}}>
          <ArrowCircleLeftOutlinedIcon/>
        </SvgIcon>
        <Typography variant="subtitle2">
          Back To <span style={{color: `${primaryColor}` , fontWeight: 600}}>Log In</span> 
        </Typography>
      </Link>
    </div>
            <Box sx={{ mb: 1 }}>
              <Stack
                alignItems="center"
                component={RouterLink}
                direction="column"
                display="flex"
             
                spacing={1}
                sx={{ textDecoration: 'none' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                 <img
                alt=""
                src="/assets/icons/icon.png" 
                style={{ width: 'auto', height: 40 }}
              />
                </Box>
                
                <Box
                  sx={{
                    color: primaryColor,
                    fontFamily: '\'Plus Jakarta Sans\', sans-serif',
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '0.3px',
                    lineHeight: 1,
                    '& span': {
                      color: 'primary.main'
                    }
                  }}
                >
                  TechMaadhyam
                </Box>
              </Stack>
            </Box>
       
          <div style={{minWidth: "100%", marginBottom: '1rem' }}>
       
      <form>
      <Grid container justifyContent="center" alignItems="center">
        <Card sx={{width: 500, mt: 4}} >

          <CardHeader titleTypographyProps={{variant:'h5' }} title="Forgot Your Password?" subheader=
            "Need Assistance? Get in touch with us." />
          <CardHeader   titleTypographyProps={{variant:'subtitle2' }} subheader="
            Please Provide Your Registered Email Address and Proceed to the Next Step." />

          <CardContent sx={{ pt: 0 }}>
            <Grid
              container
              spacing={3}
            >
              
              
              <Grid
                xs={12}
                md={12}
              >
                <TextField
                      fullWidth
                      label="Email Address"
                      name="Email"
                      value={email}
                      onChange={handleInputChange}
                      helperText={hasError && "Please enter a valid email."}
                      onBlur={handleBlur}
                      error={hasError}
          
                    >
                    </TextField>
              </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}
                  display="flex"
                  justifyContent="flex-end"
                  >
               {step < 2 && (
                  <Button
                    color="primary"
                    variant="contained"
                    align="right"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
   
          </CardContent>     
          <Divider/>
        </Card>
        </Grid>
      </form>
      </div>
     
      
          </>
          );
        case 2:
          return (
            <>
    
       
     
       
            <div>
           <Link
             color="text.primary"
             component={RouterLink}
             href={paths.index}
             sx={{
               alignItems: 'center',
               display: 'inline-flex',
             }}
             underline="none"
           >
             <SvgIcon sx={{ mr: 1, width: 38, height: 38,  transition: 'color 0.5s','&:hover': { color: `${primaryColor}` }}}>
               <ArrowCircleLeftOutlinedIcon/>
             </SvgIcon>
             <Typography variant="subtitle2">
               Back To <span style={{color: `${primaryColor}` , fontWeight: 600}}>Log In</span> 
             </Typography>
           </Link>
         </div>
                 <Box sx={{ mb: 1 }}>
                   <Stack
                     alignItems="center"
                     component={RouterLink}
                     direction="column"
                     display="flex"
                  
                     spacing={1}
                     sx={{ textDecoration: 'none' }}
                   >
                     <Box
                       sx={{
                         display: 'flex',
                       }}
                     >
                      <img
                     alt=""
                     src="/assets/icons/icon.png" 
                     style={{ width: 'auto', height: 40 }}
                   />
                     </Box>
                     
                     <Box
                       sx={{
                         color: primaryColor,
                         fontFamily: '\'Plus Jakarta Sans\', sans-serif',
                         fontSize: 22,
                         fontWeight: 800,
                         letterSpacing: '0.3px',
                         lineHeight: 1,
                         '& span': {
                           color: 'primary.main'
                         }
                       }}
                     >
                       TechMaadhyam
                     </Box>
                   </Stack>
                 </Box>
            
               <div style={{minWidth: "100%", marginBottom: '1rem' }}>
  
           <form>
           <Grid container justifyContent="center" alignItems="center">
             <Card sx={{width: 500, mt: 4}}>
             <CardHeader titleTypographyProps={{variant:'h5' }} title="Forgot Your Password?" subheader=
                "Need Assistance? Get in touch with us."  />
               <CardHeader titleTypographyProps={{variant:'subtitle2' }}title="Create a New Password" />
               <CardContent sx={{ pt: 0 }}>
                 <Grid
                   container
                   spacing={3}
                 >
                   {/* <Grid
                     xs={12}
                     md={12}
                   >
                     <TextField
                           fullWidth
                           label="Enter OTP sent to your email"
                           name="otp"
                           type= 'number'
                  
                         >
                         </TextField>
                   </Grid> */}
                   
                   <Grid
                     xs={12}
                     md={12}
                   >
                     <TextField
                           fullWidth
                           label="New Password"
                           name="password"
                           type='password'
                           value={password}
                           onChange={handleInputChange}
                         >
                         </TextField>
                   </Grid>
                   <Grid
                     xs={12}
                     md={12}
                   >
                     <TextField
                           fullWidth
                           label="Confirm New Password"
                           name="confirmpassword"
                           type='password'
                           value={confirmPassword}
                           onChange={handleInputChange}
                         >
                         </TextField>
                   </Grid>
                   
                   </Grid>
                   
                   <Grid
           xs={12}
           md={6}
               >
                   
                 </Grid>
                 {step > 1 && <Button
                           color="primary"
                           variant="contained"
                           align="right"
                           sx={{mt:2}}
                           onClick={handleBack}
                           >
                           Back
                           </Button>}
                           
               </CardContent>     
         
               <Box sx={{ mt: 0 , mr: 2, mb: 2 }}
                       display="flex"
                       justifyContent="flex-end"
                       >
                           <Button
                           color="primary"
                           variant="contained"
                           align="right"
                           onClick={handleToHome}
     
                           type="submit"
                           >
                           Save
                           </Button>
                           <ToastContainer
                            position="top-right"
                            autoClose={2000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"/>
                   </Box>

             </Card>
             </Grid>
           </form>
      
                 
           </div>
          
           
               </>
          );
        default:
          return null;
      }
    };
  
  
    return (
     <>
      <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
    
        flexDirection: {
          xs: 'column-reverse',
          md: 'row'
        }
      }}
      >   
        <Box
    sx={{
      alignItems: 'center',
      backgroundColor: 'neutral.800',
      backgroundImage: 'url("/assets/gradient-bg.svg")',
      backgroundPosition: 'top center',
      backgroundRepeat: 'no-repeat',
      color: 'common.white',
      display: 'flex',
      flex: {
        xs: '0 0 auto',
        md: '1 1 auto'
      },
      justifyContent: 'center',
      p: {
        xs: 4,
        md: 8
      },
      position: 'sticky', 
      top: 0, 
  
   
    }}
        >
          <Box maxWidth="md">
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={4}
              sx={{
                color: 'text.primary',
                '& > *': {
                  color: 'neutral.400',
                  flex: '0 0 auto'
                }
              }}
            >
              <img
                alt=""
                src={images[currentImage]}
                style={{width: 450 , height: 'auto'}}
              />
            </Stack>
          </Box>
  
  
        </Box>
        <Box
           sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flex: {
              xs: '1 1 auto',
              md: '0 0 auto'
            },
            flexDirection: 'column',
            maxWidth: '100%',
            p: {
              xs: 4,
              md: 3
            },
            width: {
              md: 750
            },
            overflowY: 'hidden' 
          }}
        >
        {renderFormStep()}
        </Box>
  
      </Box>
    </>
    );
  
  };
  
  export default Password;
