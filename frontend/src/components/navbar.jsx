
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import styled from 'styled-components';
import { Heart, Home, LogOut, PlusSquare, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setWhoUser } from '@/redux/slice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';


const NavbarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e5e7eb;
z-index: 1000;
`;

const Nav = styled.nav`
    display: flex;
    // align-items: center;
    justify-content:flex-start;
    padding: 16px;
    max-width: 1024px; 
    margin: 0 auto;
    gap:10px
`;

const LogoContainer = styled.div`
    flex-shrink: 0;
`;

const Logo = styled.img`
    height: 52px; 
    width: auto;
`;

const SearchContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    margin: 0 16px; 
`;

const SearchInput = styled.input`
    border: 1px solid #d1d5db; 
    border-radius: 0.375rem; 
    padding: 8px 12px; 
    width: 100%;
    max-width: 384px; 
`;

const SearchIcon = styled(Search)`
    margin-left: -32px; 
    color: #6b7280; 
    &:hover {
        color: #111827; 
    }
        margin-top:15px;
`;

const NavItems = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;
    gap: 16px; 
`;

const NavItem = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    gap:16px;
    &:hover {
        color: #111827; 
    }
        span {
    display: none;
  }

  @media (min-width: 768px) {
    span {
      display: inline;
      margin-left: 8px;
      font-size: 0.875rem; 
      color: inherit; 
    }
  }
`;
    


const AvatarContainer = styled(Avatar)`
    width: 24px; 
    height: 24px; 
`;

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.who);
    const [open,setOpen]=useState(false);
    const dispatch=useDispatch();


    

    const LogoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setWhoUser(null))
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]))
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    const navHandler = (text) => {
        if (text == 'Logout') {
            LogoutHandler();
        }
        else if(text=='Create'){
           setOpen(true)
        
        
        }

    };

    return (
        <NavbarContainer>
            <Nav>
                
                <LogoContainer>
                    <Logo src="../Assets/logo.jpeg" alt="Logo" />
                </LogoContainer>

               
                <SearchContainer>
                    <SearchInput type="text" placeholder="Search" />
                    <SearchIcon />
                </SearchContainer>

               
                <NavItems>
                    <NavItem onClick={() => navHandler('Home')}>
                        <Home />
                        <span>Home</span>
                    </NavItem>
                    <NavItem onClick={() => navHandler('Notifications')}>
                        <Heart />
                        <span>Notifications</span>
                    </NavItem>
                    <NavItem onClick={() => navHandler('Create')}>
                        <PlusSquare />
                        <span>Create</span>
                    </NavItem>
                    <NavItem onClick={() => navHandler('Profile')}>
                        <AvatarContainer>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </AvatarContainer>
                        <span>Profile</span>
                    </NavItem>
                    <NavItem onClick={() => navHandler('Logout')}>
                        <LogOut/>
                        <span>Logout</span>
                    </NavItem>
                </NavItems>
            </Nav>
            <CreatePost open={open} setOpen={setOpen}/>
        </NavbarContainer>
    );
};

export default Navbar;
