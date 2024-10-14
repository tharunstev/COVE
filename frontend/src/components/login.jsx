/* eslint-disable react/no-unescaped-entities */



// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import styled from 'styled-components';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setWhoUser } from '@/redux/slice';


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #f0f4f8; 
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px; 
`;

const FormWrapper = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: #ffffff; 
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; 
`;

const Heading = styled.h1`
  text-align: center;
  font-weight: 600;
  font-size: 1.25rem; 
  color: #333; 
`;

const SubHeading = styled.h2`
  font-size: 1.125rem;
  color: #555; 
  text-align: center;
`;

const StyledLabel = styled(Label)`
  font-size: 0.875rem; 
  color: #333; 
`;

const StyledInput = styled(Input)`
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  &:focus {
    border-color: #1e90ff; 
    box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2); 
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  background-color: #1e90ff; 
  color: #fff;
  &:hover {
    background-color: #0077ff; 
  }
  &:disabled {
    background-color: #b0bec5; 
    cursor: not-allowed;
  }
`;

const SwitchLink = styled.span`
  text-align: center;
  font-size: 0.875rem;
  color: #555;
`;

const SwitchLinkStyled = styled(Link)`
  color: #1e90ff; 
  &:hover {
    text-decoration: underline;
  }
`;

const SVGWrapper = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setWhoUser(res.data.user))
        navigate('/');
        toast.success(res.data.message);
        setInput({
          email: '',
          password: '',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Form onSubmit={signupHandler}>
            <Heading>Login</Heading>
            <SubHeading>Enter your email and password</SubHeading>
            <div>
              <StyledLabel htmlFor="email">E-mail</StyledLabel>
              <StyledInput
                id="email"
                type="email"
                name="email"
                value={input.email}
                onChange={inputHandler}
              />
            </div>
            <div>
              <StyledLabel htmlFor="password">Password</StyledLabel>
              <StyledInput
                id="password"
                type="password"
                name="password"
                value={input.password}
                onChange={inputHandler}
              />
            </div>
            {loading ? (
              <StyledButton type="button" disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Hold A sec
              </StyledButton>
            ) : (
              <StyledButton type="submit">Login</StyledButton>
            )}
            <SwitchLink>
              Don't have an account?{' '}
              <SwitchLinkStyled to="/signup">Signup</SwitchLinkStyled>
            </SwitchLink>
          </Form>
        </FormWrapper>
        <SVGWrapper>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 500 300" 
  width="500" 
  height="300" 
>
  
  <line
    x1="300" 
    y1="80"
    x2="220" 
    y2="80"
    stroke="#f2a497"
    strokeWidth="5" 
  />

 
  <text
    x="50%"
    y="150" 
    textAnchor="middle"
    fontFamily="Arial, sans-serif"
    fontSize="72" 
    fill="#333"
  >
    COVE
  </text>

 
  <text
    x="50%"
    y="200" 
    textAnchor="middle"
    fontFamily="Arial, sans-serif"
    fontSize="24" 
    fill="#777"
  >
    Cozy Up to Meaningful Connections
  </text>
</svg>


        </SVGWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default Login;


