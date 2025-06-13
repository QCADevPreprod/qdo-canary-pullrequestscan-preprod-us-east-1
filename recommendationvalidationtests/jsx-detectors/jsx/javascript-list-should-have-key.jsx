function Blog(props) {
    return (
      <ul>
        {props.posts.map((post) =>
        // ruleid: javascript-list-should-have-key
          <li> <!-- Noncompliant: When 'posts' are reordered, React will need to recreate the list DOM -->
            {post.title}
          </li>
        )}
      </ul>
    );
  }
  
  
  function Blog(props) {
    return (
      <ul>
        {props.posts.map((post) =>
        // ok: javascript-list-should-have-key
          <li key={post.id}> <!-- Compliant: id will always be the same even if 'posts' order changes -->
            {post.title}
          </li>
        )}
      </ul>
    );
  }