import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Modal } from '../components/modal';

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
}

const Post = ({
  likes, url, description, date, _id, userId, setShouldUpdate,
}) => {
  const likePost = async (postId, user) => {
    const { success } = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ userId: user }),
    }).then((res) => res.json());
    if (success) setShouldUpdate((s) => !s);
  };

  return (
    <div className="index-item image-border flex-align flex-direction-column post margin-right-15">
      <div className="post-image position-relative border-radius-small">
        <div className="image " />
        <span
          role="presentation"
          onClick={() => likePost(_id, userId)}
          className="likes border-radius-small position-absolute bottom-0 right-0 background-white padding-5 flex-align cursor-pointer"
        >
          {/*  <input type="checkbox" id={`like-post-${post}`} className="margin-right-5" /> */}

          {/* Sin like no lleva color-primary y en lugar de fill se usa line */}
          <i className={`post-like ri-heart-${likes.includes(userId) ? 'fill color-primary' : 'line'}`} />
          <span className="font-size-small">Like</span>
        </span>
      </div>
      <div className="flex-align justify-content-space-between width-100 margin-top-10 subtexts">
        <div className="timeago flex-align">
          <i className="ri-calendar-line margin-right-5" />
          {' '}
          {timeSince(new Date(date))}
          {' '}
          ago
        </div>
        <div className="timeago">
          {likes.length}
          {' '}
          like
          {likes.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="width-100 margin-top-10 description">
        {description}
      </div>
    </div>
  );
};

Post.propTypes = {
  _id: PropTypes.string,
  userId: PropTypes.string,
  description: PropTypes.string,
  setShouldUpdate: PropTypes.func,
  url: PropTypes.string,
  likes: PropTypes.arrayOf(PropTypes.string),
  date: PropTypes.string,
};

const Home = ({ user: { username, _id } = { username: '', _id: '' } }) => {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [photoPreview, setPhotoPreview] = useState();
  const [description, setDescription] = useState();
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const router = useRouter();

  const [dragging, setIsDragging] = useState(false);

  const inputImage = useRef();

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const dragLeave = (e) => {
    e.preventDefault();
    if (
      e.target.className.includes('uploader')
      && !e.relatedTarget.className.includes('message')
    ) {
      setIsDragging(false);
    }
  };

  const getPosts = async () => {
    const { data: basePosts } = await fetch('/api/posts').then((res) => res.json());
    setPosts(basePosts);
  };

  const logout = async () => {
    const { success } = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then((res) => res.json());
    if (success) router.push('/login');
  };

  useEffect(() => {
    getPosts();
  }, [shouldUpdate]);

  useEffect(() => {
    if (!_id) router.push('/login');
  }, [_id]);

  const uploadPhoto = async () => {
    setShowModal(true);
    const objectUrl = URL.createObjectURL(inputImage.current.files[0]);

    setPhotoPreview(objectUrl);
  };

  const fileDrop = (e) => {
    e.preventDefault();
    const {
      dataTransfer: { files: finalFile },
    } = e;
    inputImage.current.files = finalFile;
    uploadPhoto();
    setIsDragging(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setDescription('');
    inputImage.current.value = '';
  };

  const createPost = async (post) => {
    const { success } = await fetch('/api/posts', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ post }),
    }).then((res) => res.json());
    if (success) {
      setShouldUpdate((s) => !s);
      closeModal();
    }
  };

  return (
    <>
      <div className="container container-with-header">
        <div className="flex-align align-items-stretch uploader">
          <label
            className={`drag-n-drop padding-25 index-item color-primary margin-right-15 ${dragging ? 'dragging' : ''}`}
            htmlFor="photo-upload"
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDragOver={dragOver}
            onDrop={fileDrop}
          >
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              ref={inputImage}
              placeholder="Drag image here to post it"
              onChange={uploadPhoto}
              className="hidden"
            />
            <h3 className="message">
              <div className="flex-align">
                {
                  dragging ? (
                    <>
                      <i className="ri-arrow-up-line font-size-x-large margin-right-5" />
                      Drop here to post
                      <i className="ri-arrow-up-line font-size-x-large margin-left-5" />
                    </>
                  ) : (
                    <>
                      <i className="ri-add-line font-size-x-large margin-right-5" />
                      Select image or drag it here to post it
                    </>
                  )
                }

              </div>
            </h3>
          </label>
          <div className="user-info index-item width-100">
            <div className="flex-align margin-bottom-5 justify-content-space-between">
              <div className="flex-align">
                <div className="avatar">
                  <i className="ri-user-line" />
                </div>
                <div>{username}</div>
              </div>
              <button type="button" className="logout" onClick={logout}>
                <i className="ri-logout-box-r-line margin-right-5" />
                Logout
              </button>
            </div>

            <div className="search">
              <i className="ri-search-line" />
              <input type="text" className="searchbar input" placeholder="Search" />
            </div>
          </div>
          {posts.length > 0 ? posts.map((post) => (
            <Post
              key={post._id.toString()}
              {...post}
              setShouldUpdate={setShouldUpdate}
              userId={_id}
            />
          )) : <h2 className="margin-top-10">There are no posts uploaded yet</h2>}
        </div>
      </div>
      <Modal
        title="New post"
        show={showModal}
        onClose={closeModal}
      >
        <div className="flex-align justify-content-space-between">
          <img src={photoPreview} className="preview" alt="uploaded post preview" />
          <div className="flex-align flex-direction-column justify-content-space-between">
            <textarea
              className="textarea"
              onBlur={({ target: { value } }) => setDescription(value)}
              name="description"
              id="description"
              cols="30"
              rows="10"
            />
            <button
              type="button"
              className="signin"
              onClick={() => createPost({
                description, url: photoPreview, likes: [], date: new Date(),
              })}
            >
              Post
              <i className="ri-image-add-fill margin-left-5" />
            </button>
          </div>
        </div>
      </Modal>
    </>

  );
};

export const getServerSideProps = async (ctx) => {
  const { data: user } = await fetch(`http://localhost:3000/api/users/${ctx.req.cookies.userId}`).then((res) => res.json());

  return {
    props: {
      user: user || {},
    },
  };
};

Home.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    picture: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default Home;
