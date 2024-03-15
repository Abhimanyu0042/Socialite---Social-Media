import React, { useEffect, useState } from "react";
import "./Profile.scss";
import dummyImg from "../../assets/user.png";
import Post from "../posts/Post";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser, getFeedData } from "../../redux/slices/feedSlice";

function Profile() {
  const navigate = useNavigate();
  const params = useParams();
  const userProfile = useSelector((state) => state.postsReducer.userProfile);
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const feedData = useSelector((state) => state.feedDataReducer.feedData);
  const dispatch = useDispatch();
  const [isMyProfile, setisMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );
    setIsFollowing(
      feedData?.followings?.find((item) => item._id === params.userId)
    );
    setisMyProfile(myProfile?._id === params.userId);
  }, [myProfile, params.userId, feedData]);

  function handleUserFollow(){
    dispatch(followAndUnfollowUser({
        userIdToFollow: params.userId
    }))
  }

  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img
              className="user-image"
              src={userProfile?.avatar?.url || dummyImg}
              alt="user-img"
            />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p className="bio">{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length || "0"} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length || "0"} Followings`}</h4>
            </div>
            {!isMyProfile && (
              <h5
              style={{marginTop:'10px'}}
                onClick={handleUserFollow}
                className={
                  isFollowing ? " follow-link hover-link" : "btn-primary"
                }
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </h5>
            )}
            {isMyProfile && (
              <button
                className="update-profile btn-secondary"
                onClick={() => {
                  navigate("/updateProfile");
                }}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
