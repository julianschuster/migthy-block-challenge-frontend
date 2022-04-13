import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Uploader } from '../components/uploader';
import { Profile } from '../components/profile';
import { Post } from '../components/post';
import { Loader } from '../components/loader';
import { fuzzyMatch } from '../utils/fuzzyMatch';

const Home = ({ user: { username, _id } = { username: '', _id: '' } }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(true);
  const [currentItem, setCurrentItem] = useState(0);
  const [totalLoading, setTotalLoading] = useState(0);
  const [totalCount, setTotalCount] = useState(10000);

  const loadingData = async () => {
    if (isFetching) {
      const result = await fetch(`/api/posts?skip=${currentItem}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json());

      if (posts.length > 0) {
        setPosts((prev) => [...prev, ...result.data]);
        setTotalLoading((prev) => prev + result.data.length);
      } else {
        setPosts(result.data);
        setTotalLoading(result.data.length);
      }

      setTotalCount(result.total);
      setIsFetching(false);
    }
  };

  const scrollHandler = () => {
    if (document.documentElement.scrollHeight
      - (document.documentElement.scrollTop + window.innerHeight)
      <= 0 && totalLoading < totalCount && !isFetching) {
      setIsFetching(true);
      setCurrentItem((prev) => prev + 6);
      loadingData();
    }
  };

  useEffect(() => {
    loadingData();
    document.addEventListener('scroll', scrollHandler);

    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, [currentItem, isFetching]);

  const getPosts = async () => {
    const { data: basePosts } = await fetch(`/api/posts?skip=0&limit=${currentItem + 6}`).then((res) => res.json());
    setPosts(basePosts);
  };

  useEffect(() => {
    getPosts();
  }, [shouldUpdate]);

  useEffect(() => {
    if (!_id) router.push('/login');
  }, [_id]);

  return (
    <div className="container container-with-header">
      <div className="flex-align align-items-stretch uploader">
        <Uploader
          username={username}
          setShouldUpdate={setShouldUpdate}
          shouldUpdate={shouldUpdate}
        />
        <Profile username={username} setSearchQuery={setSearchQuery} />
        {posts.length > 0 ? posts
          .filter(
            ({ description }) => searchQuery.length < 3 || fuzzyMatch(searchQuery, description),
          )
          .map((post) => (
            <Post
              key={post._id.toString()}
              {...post}
              setShouldUpdate={setShouldUpdate}
              userId={_id}
            />
          )) : <h2 className="margin-top-10">There are no posts uploaded yet</h2>}
      </div>
      <div className="flex-align justify-content-end font-size-small margin-right-25 margin-top-10">
        showing
        {' '}
        {(currentItem + 6) < totalCount ? (currentItem + 6) : totalCount}
        {' '}
        of
        {' '}
        {totalCount}
        {' '}
        posts
      </div>
      {
        isFetching && <div className="flex-align justify-content-space-around margin-top-10"><Loader /></div>
      }
    </div>

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
