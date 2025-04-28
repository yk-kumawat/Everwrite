import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
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


const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.email === '' || formData.password === ''){
          toast.error('All fields are required!');
          return;
        }
        console.log(formData);
        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/signin", formData);
            console.log(response.data);
            login(response.data.token);
            toast.success('Login Successfull');
            localStorage.setItem("userEmail", formData.email);
            navigate("/dashboard");
        } catch (error) {
          toast.error('Login Failed!');
        }
    };
  
  return (
    <main>
      <CssBaseline />
      <ModeToggle />
      <Sheet
        sx={{
          width: 350,
          mx: 'auto',
          my: 25,
          py: 3,
          px: 2,
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
            <b>Login to <span className='text-blue-400'>Everwrite</span></b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>
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
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </FormControl>
        <Button onClick={handleSubmit} sx={{ mt: 1 /* margin top */ }}>Sign In</Button>
        <Typography
          endDecorator={<Link to="/sign-up" className='text-blue-400 hover:underline underline-offset-5'>Sign Up</Link>}
          sx={{ fontSize: 'sm', alignSelf: 'center' }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  )
}

export default SignIn
