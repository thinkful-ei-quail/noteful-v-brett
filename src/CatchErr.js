import React from "react";

export default class CatchErr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="catchErr">
          <h2> Great, you broke it!</h2>
          <h3> Just kidding, it probably wasn't your fault</h3>
          <h3> ...or was it? -_-</h3>
        </div>
      );
    }
    return this.props.children;
  }
}
