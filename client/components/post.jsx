import PropTypes from 'prop-types';
import timeSince from '../utils/timeSince';

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

export { Post };
