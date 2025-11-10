import { useEffect, useState } from "react"
import Post from "../Post"
import { BASE_URL } from "../Utils/base_Url";
export default function IndexPage(){
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return(
    <>
    {posts.length > 0 && posts.map(posts => (
      <Post {...posts} key={Math.random()}/>
    ))}
    </>
  )
}