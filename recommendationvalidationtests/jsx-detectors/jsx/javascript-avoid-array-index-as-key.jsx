function Blog(props) {
  
  return (
    <ul>
      // ruleid: javascript-avoid-array-index-as-key
      {props.posts.map((post, index) =>
        <li key={index}>
          {post.title}
        </li>
      )}
    </ul>
  );
}

  function Blog(props) {
    return (
      <ul>
        // ok: javascript-avoid-array-index-as-key
        {props.posts.map((post) =>
          <li key={post.id}>
            {post.title}
          </li>
        )}
      </ul>
    );
  }
