import React from 'react';
import { useParams } from 'react-router-dom';

function withParams(Component) {
  return (props) => {
    const params = useParams(); // Hook from react-router-dom to get route parameters
    return <Component {...props} params={params} />; // Renders the Component with params passed as props
  };
}

export default withParams;
