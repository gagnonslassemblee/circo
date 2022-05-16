import {useState, useEffect} from 'react'


const Toast = ({message, visible = true, success = false}) => {
  const [_visible, setVisibility] = useState(visible);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisibility(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible])

  if (!_visible) {
    return null
  }

  return (
    <div className="top right ui toast-container">
      <div className="toast-box transition visible">
        <div className={`${success ? 'pink' : 'green'} ui toast`} >
          <div className="content">
            <div>{message}</div>
          </div>
        </div>
      </div>
    </div >
  )
};


export default Toast
