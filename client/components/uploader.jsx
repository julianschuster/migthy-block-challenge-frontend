import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Modal } from './modal';

const Uploader = ({ setShouldUpdate, shouldUpdate }) => {
  const [dragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState();

  const inputImage = useRef();

  const [showModal, setShowModal] = useState(false);

  const [photoPreview, setPhotoPreview] = useState();

  const uploadPhoto = async () => {
    setShowModal(true);
    const objectUrl = URL.createObjectURL(inputImage.current.files[0]);

    setPhotoPreview(objectUrl);
  };

  const closeModal = () => {
    setShowModal(false);
    setDescription('');
    inputImage.current.value = '';
  };

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

  const fileDrop = (e) => {
    e.preventDefault();
    const {
      dataTransfer: { files: finalFile },
    } = e;
    inputImage.current.files = finalFile;
    uploadPhoto();
    setIsDragging(false);
  };

  const createPost = async (post) => {
    const formData = new FormData();

    const blob = await fetch(post.url).then((r) => r.blob());

    // Update the formData object
    formData.append(
      'newPost',
      blob,
    );

    formData.append('description', post.description);

    const { success } = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
      body: formData,
    }).then((res) => res.json());
    if (success) {
      setShouldUpdate((s) => !s);
      closeModal();
    }
  };

  return (
    <>
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
              key={shouldUpdate}
              onBlur={({ target: { value } }) => setDescription(value)}
              name="description"
              id="description"
              placeholder="Insert description (optional)"
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

export { Uploader };

Uploader.propTypes = {
  setShouldUpdate: PropTypes.func,
  shouldUpdate: PropTypes.bool,
};
