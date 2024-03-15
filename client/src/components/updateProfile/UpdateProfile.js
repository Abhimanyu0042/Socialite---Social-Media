import React, { useEffect, useState } from 'react';
import './UpdateProfile.scss';
import dummyImg from "../../assets/user.png";
import { useDispatch, useSelector } from 'react-redux';
import { updateMyProfile } from '../../redux/slices/appConfigSlice';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManagement';
import { axiosClient } from '../../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
function UpdateProfile() {
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const [name,setName] = useState("");
    const [bio,setBio] = useState("");
    const [userImg, setUserImg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setName(myProfile?.name || '');
        setBio(myProfile?.bio || '');
        setUserImg(myProfile?.avatar?.url);
    }, [myProfile]); 

    const dispatch = useDispatch();

    function handleImageChange(e){
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if(fileReader.readyState === fileReader.DONE){
                setUserImg(fileReader.result);
            }
            console.log('img data', fileReader.result);
        }
    }

    async function handleDeleteClicked(){
        try {
            await axiosClient.delete('/user/');
            removeItem(KEY_ACCESS_TOKEN);
            navigate('/login');

        } catch (e) {
            // console.log("This error comes when deleting account : ",e);
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        dispatch(updateMyProfile({
            name,
            bio,
            userImg
        }))
    }

  return (
    <div className='UpdateProfile'>
        <div className='container'>
            <div className='left-part'>
                <div className='input-user-img'>
                    <label htmlFor='inputImg' className='labelImg'>
                        <img src={userImg ? userImg : dummyImg} alt={name} />
                    </label>
                    <input className='inputImg' id='inputImg' type='file' accept='image/*' onChange={handleImageChange}/>
                </div>
            </div>
            <div className='right-part'>
                <form onSubmit={handleSubmit} >
                    <input value={name} type="text" placeholder='Your Name' onChange={(e) => setName(e.target.value)}/>
                    <input value={bio} type="text" placeholder='Your Bio' onChange={(e) => setBio(e.target.value)}/>

                    <input type="submit" onClick={handleSubmit} className='btn-primary' />
                </form>

                <button onClick={handleDeleteClicked} className='delete-account btn-primary'>Delete Account</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateProfile