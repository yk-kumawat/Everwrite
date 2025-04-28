import * as React from 'react';
import { useState } from 'react';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import { useColorScheme } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import axios from "axios";
import { Link } from "react-router-dom";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import toast from 'react-hot-toast';

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <Button variant="soft">Change mode</Button>;
  }

  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(event, newMode) => {
        setMode(newMode);
      }}
      sx={{ width: 'max-content' }}
    >
      <Option value="system">System</Option>
      <Option value="light">Light</Option>
      <Option value="dark">Dark</Option>
    </Select>
  );
}

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    if(formData.email === '' || formData.password === '' || formData.username === ''){
      toast.error('All fields are required!');
      return;
    }
    console.log(formData);
    e.preventDefault();
    try {
        const response = await axios.post("http://127.0.0.1:8000/auth/signup", formData);
        console.log(response.data);  // Ensure response exists before accessing `.data`
        toast.success('Sign Up Successfull');
    } catch (error) {
        console.error("Error:", error); // Log the full error
        toast.error('User already exist');
        if (error.response) {
            console.error("Server Error Response:", error.response.data); 
        } else {
            console.error("Request failed, check server connection");
        }
    }
  };

  return (
    <main>
      <CssBaseline />
      <ModeToggle />
      <Sheet
        sx={{
          width: 350,
          mx: 'auto', // margin left & right
          my: 20, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Register to <span className='text-blue-400'>Everwrite</span></b>
          </Typography>
          <Typography level="body-sm">Sign up to create account.</Typography>
        </div>
        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <Input
            // html input attribute
            name="name"
            type="text"
            placeholder="Your Name"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            // html input attribute
            name="email"
            type="email"
            placeholder="johndoe@email.com"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            // html input attribute
            name="password"
            type="password"
            placeholder="Create Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </FormControl>
        <Button onClick={handleSubmit} sx={{ mt: 1 /* margin top */ }}>Sign Up</Button>
        <Typography
          endDecorator={<Link to="/" className='text-blue-400 hover:underline underline-offset-5'>Sign In</Link>}
          sx={{ fontSize: 'sm', alignSelf: 'center', }}
        >
          Already have an account?
        </Typography>
      </Sheet>
    </main>
  )
}

export default SignUp
